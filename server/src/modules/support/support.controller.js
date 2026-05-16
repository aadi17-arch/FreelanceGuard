
import prisma from "../../config/database.js";

export const createTicket = async (req, res) => {
  try {
    const { subject, category,content } = req.body;
    const userId = req.user.id;
    const supportTicket = await prisma.supportTicket.create({
      data: {
        userId: userId,
        subject: subject,
        category: category || 'GENERAL',
        messages: {
          create: {
            senderId: userId,
            content: content
          }
        }
      },
      include:{messages:true}
    });
    res.status(201).json({ message: "Ticker created Successfully", supportTicket });
  } catch(e) {
    return res.status(500).json({message:"Server error."})
  }
}
export const getUserTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const supportTicket = await prisma.supportTicket.findUnique({
      where: { id: id },
      include: {
          messages: true
        }
    });
    if (!supportTicket) {
      return res.status(404).json({message:"Ticket not found."})
    }


    if (supportTicket.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({message:"Unauthorized Access."})
    }
    res.status(200).json(supportTicket);
  } catch (e) {
    return res.status(500).json({message:"Server error."});
  }
}
export const replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const supportTicket = await prisma.supportTicket.findUnique({
      where: {
        id:id
      }

    });
    if (!supportTicket) {
      return res.status(404).json({message:"Ticket not found"});
    }
    if (supportTicket.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You don't have permission to reply to this ticket" });
    }
    const message = await prisma.supportMessage.create({
      data: {
        ticketId: id,
        senderId: userId,
        content: content
      }
    });
    await prisma.supportTicket.update({
      where: {
        id:id
      },
      data:{updatedAt:new Date()}
    });
    res.status(200).json(message);

  }
  catch (e) {
    return res.status(500).json({message:"Server error."});
  }
}
export const getAllTickets = async (req, res) => {
  try {
    const allTickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    res.status(200).json(allTickets);
  }
  catch (e) {
    return res.status(500).json({ message: "Server error." })
  }
}
export const resolveTicket = async(req, res) => {
  try {
    const { id } = req.params;
    await prisma.supportTicket.update({
      where: { id: id },
      data: {
        status:"CLOSED"
      }
    });
    res.status(200).json({message:"Ticket closed successfully"});
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}

export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: userId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });
    res.status(200).json(tickets);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}
