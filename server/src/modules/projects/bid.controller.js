import prisma from "../../config/database.js";

export const createBid = async (req, res) => {
  try {
    const { projectId, amount, proposal, milestones } = req.body;
    const freelancerId = req.user.id;

    if (!projectId || !amount || !proposal) {
      return res.status(400).json({ message: "All Fields Required" });
    }

    const existingBid = await prisma.bid.findFirst({
      where: {
        projectId,
        freelancerId
      }
    });

    if (existingBid) {
      return res.status(400).json({ message: "You have already submitted a proposal for this project." });
    }

    const result = await prisma.$transaction(async (tx) => {
      const bid = await tx.bid.create({
        data: {
          projectId,
          freelancerId,
          amount: parseFloat(amount),
          proposal
        }
      });

      const duration = 14;
      const formattedMilestones = Array.isArray(milestones) && milestones.length > 0
        ? milestones.map(m => ({ title: m.title || "Project Milestone", amount: parseFloat(m.amount) || 0 }))
        : [{ title: "Project Milestone", amount: parseFloat(amount) }];

      await tx.proposal.create({
        data: {
          projectId,
          freelancerId,
          amount: parseFloat(amount),
          duration,
          coverLetter: proposal,
          status: 'PENDING',
          milestones: formattedMilestones
        }
      });

      return bid;
    });

    res.status(201).json({ message: "Bid Submitted Successfully", bid: result });
  }
  catch (error) {
    console.error("Error creating bid & proposal:", error);
    return res.status(500).json({ message: "Database Error" });
  }
}

export const getProjectBids = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (userRole !== "ADMIN" && project.clientId !== userId) {
      return res.status(403).json({ message: "Access denied. Only the project owner or administrator can view bids." });
    }

    const bids = await prisma.bid.findMany({
      where: { projectId },
      include: {
        freelancer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.status(200).json(bids);
  }
  catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
