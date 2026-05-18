import prisma from "../../config/database.js";

export const getChatHistory = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.id;
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { project: true }
    });
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    if (contract.freelancerId !== userId && contract.project.clientId !== userId) {
      return res.status(403).json({ message: "Access denied." });
    }
    const messageList = await prisma.chatMessage.findMany({
      where: { contractId: contractId },
      include: {
        sender: {
          select: { id: true, name: true, role: true }
        }
      },
      orderBy: { createdAt: "asc" }

    });
    return res.status(200).json(messageList);

  } catch (e) {
    return res.status(500).json({message:"Failed to fetch messages"});
  }
}
export const sendNewMessage = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { project: true }
    });
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    if (contract.freelancerId !== userId && contract.project.clientId !== userId) {
      return res.status(403).json({ message: "Access denied." });
    }
    const newMessage = await prisma.chatMessage.create({
      data: {
        contractId,
        senderId: userId,
        text: text.trim()
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true }
        }
      }

    });
    return res.status(201).json(newMessage);
  }
  catch (e) {
    return res.status(500).json({ message: "Failed to send message." });
  }


}
