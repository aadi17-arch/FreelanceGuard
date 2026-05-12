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
