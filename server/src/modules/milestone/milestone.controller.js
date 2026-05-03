import prisma from "../../config/database.js";
export const submitMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { submissionNote } = req.body;
    const userId = req.user.id;
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: true }
    });
    if (!milestone) {
      return res.status(404).json({ message: "Milestone doesn't exist" });
    }
    if (milestone.contract.freelancerId !== userId) {
      return res.status(403).json({ message: "Only the assigned freelancer can submit work!" });
    }
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'SUBMITTED',
        submissionNote: submissionNote
      }
    });
    return res.status(200).json({ message: "Work submitted for review." })


  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
export const approveMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user.id;
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: { include: { project: true } } }
    });
    if (!milestone || milestone.status !== 'SUBMITTED') {
      return res.status(404).json({ message: "Milestone doesn't exist OR Submitted" });
    }
    if (milestone.contract.project.clientId !== userId) {
      return res.status(403).json({ message: "Only the assigned freelancer can submit work!" });
    }
    const result = await prisma.$transaction(async (tx) => {
      await tx.milestone.update({
        where: { id: milestoneId },
        data: { status: 'APPROVED' }
      });

      await tx.contract.update({
        where: { id: milestone.contractId },
        data: {
          heldAmount: {
            decrement: milestone.amount
          }
        }
      });
      await tx.user.update({
        where: { id: milestone.contract.freelancerId },
        data: {
          walletBalance: {
            increment: milestone.amount
          }
        }

      });
      await tx.payment.create({
        data: {
          amount: milestone.amount,
          type: 'RELEASE',
          contractId: milestone.contractId,
          milestoneId: milestone.id
        }
      });

    });
    res.status(200).json({ success: true, amountReleased: milestone.amount });


  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
