import prisma from "../../config/database.js";

export const createProposal = async (req, res) => {
  try {
    const { projectId, amount, duration, coverLetter, milestones } = req.body;
    const freelancerId = req.user.id;

    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({ message: "Only freelancers can submit proposals" });
    }
    const existing = await prisma.proposal.findUnique({
      where: {
        projectId_freelancerId: { projectId, freelancerId }
      }
    });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted a proposal for this project" });
    }
    const totalMilestonePrice = milestones.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    if (totalMilestonePrice !== amount) {
      return res.status(403).json({ message: "Milestones amount must be same after adding." });
    }
    const newProposal = await prisma.proposal.create({
      data: {
        projectId,
        freelancerId,
        amount: parseFloat(amount),
        duration: parseInt(duration),
        coverLetter,
        milestones
      }
    });

    res.status(201).json({
      message: "Proposal Submitted Successfully",
      proposal: newProposal
    });
  }
  catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export const getProposals = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: "Only clients can view the project proposals" });
    }
    const proposals = await prisma.proposal.findMany({
      where: {
        project: {
          clientId: req.user.id
        }
      },
      include: {
        project: true,
        freelancer: true
      }
    });
    res.status(200).json({ proposals });
  }
  catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export const getMyProposals = async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: { freelancerId: req.user.id },
      include: { project: true }
    });
    res.status(200).json({ proposals });
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const acceptProposals = async (req, res) => {
  try {
    const { proposalId } = req.params;
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: "Only a client can hire" });

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { project: true }
    });

    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (proposal.project.clientId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (proposal.project.status !== 'OPEN') {
      return res.status(400).json({ message: "This project is no longer open for hiring" });
    }

    await prisma.$transaction(async (tx) => {
      const client = await tx.user.update({
        where: { id: req.user.id },
        data: {
          walletBalance: { decrement: proposal.amount },
          heldAmount: { increment: proposal.amount }
        }
      });

      if (client.walletBalance < 0) {
        throw new Error("Insufficient funds in your wallet");
      }

      const contract = await tx.contract.create({
        data: {
          projectId: proposal.projectId,
          freelancerId: proposal.freelancerId,
          totalAmount: proposal.amount,
          heldAmount: proposal.amount,
          status: 'ACTIVE'
        }
      });

      let milestoneList = [];
      try {
        if (proposal.milestones) {
          if (Array.isArray(proposal.milestones)) {
            milestoneList = proposal.milestones;
          } else if (typeof proposal.milestones === "string") {
            milestoneList = JSON.parse(proposal.milestones);
          } else if (typeof proposal.milestones === "object") {
            milestoneList = Object.values(proposal.milestones);
          }
        }
      } catch (err) {
      }

      if (milestoneList.length > 0) {
        for (const m of milestoneList) {
          await tx.milestone.create({
            data: {
              contractId: contract.id,
              title: m.title || "Project Milestone",
              description: m.description || "Escrow milestone secured in vault.",
              amount: parseFloat(m.amount) || 0,
              dueDate: new Date(Date.now() + (parseInt(proposal.duration) || 14) * 24 * 60 * 60 * 1000),
              status: 'PENDING'
            }
          });
        }
      } else {
        await tx.milestone.create({
          data: {
            contractId: contract.id,
            title: "Project Milestone",
            description: "Escrow milestone secured in vault.",
            amount: proposal.amount,
            dueDate: new Date(Date.now() + (parseInt(proposal.duration) || 14) * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        });
      }

      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: 'ACCEPTED' }
      });

      await tx.project.update({
        where: { id: proposal.projectId },
        data: { status: 'IN_PROGRESS' }
      });
    });

    res.status(200).json({ message: "Funds secured in escrow. Freelancer hired!" });
  }
  catch (error) {
    res.status(400).json({ message: error.message || "Failed to finalize hiring" });
  }
}
