import prisma from "../../config/database.js";

export const createSession = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    const session = await prisma.liveChatSession.create({
      data: {
        userId,
        messages: {
          create: { senderId: userId, content },
        },
      },
      include: {
        messages: {
          include: {
            sender: { select: { id: true, role: true, name: true } },
          },
        },
      },
    });

    res.status(201).json({ session });
  } catch (e) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await prisma.liveChatSession.findMany({
      where: { userId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { sender: { select: { id: true, role: true, name: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(sessions);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminSessions = async (req, res) => {
  try {
    const sessions = await prisma.liveChatSession.findMany({
      include: {
        user: { select: { name: true, email: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { sender: { select: { id: true, role: true, name: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(sessions);
  } catch (e) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await prisma.liveChatSession.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            sender: { select: { id: true, role: true, name: true } },
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Chat session not found." });
    }

    if (session.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized Access." });
    }

    res.status(200).json(session);
  } catch (e) {
    res.status(500).json({ message: "Server error." });
  }
};

export const reply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const session = await prisma.liveChatSession.findUnique({
      where: { id },
    });
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }
    if (session.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "No permission to reply" });
    }

    const message = await prisma.liveChatMessage.create({
      data: { sessionId: id, senderId: userId, content },
      include: { sender: { select: { id: true, role: true, name: true } } },
    });

    await prisma.liveChatSession.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    res.status(200).json(message);
  } catch (e) {
    res.status(500).json({ message: "Server error." });
  }
};

export const closeSession = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.liveChatSession.update({
      where: { id },
      data: { status: "CLOSED" },
    });
    res.status(200).json({ message: "Chat closed successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
