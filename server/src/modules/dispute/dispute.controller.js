import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const raiseDispute = async (req, res) => {
  try {
    const { milestoneId, reason } = req.body;
    const milestone = await prisma.milestone.findUnique({
      where: {
        id: milestoneId
      }
    });
    if (!milestone || milestone.status === "COMPLETED") {
      return res.status(400).json({ message: "Already Completed" });
    }
    const newDispute = await prisma.$transaction(async (tx) => {
      const disputeRecord = await tx.dispute.create({
        data: {
          milestoneId,
          reason,
          raisedById: req.user.id
        }
      });
      await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: "DISPUTED"
        }
      });
      return disputeRecord;
    });

    res.status(201).json(newDispute);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const addEvidence = async (req, res) => {
  try {
    const { disputeId, fileName } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    if (!fileUrl) {

      return res.status(400).json({ message: "No file uploaded" });
    }
    const evidence = await prisma.evidence.create({
      data: {
        disputeId,
        uploadedById: req.user.id,
        fileUrl,
        fileName: fileName || "Evidence File"
      }
    });
    res.status(201).json(evidence);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const getDisputeDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const dispute = await prisma.dispute.findUnique({
      where: { id: id },
      include: {
        evidence: true,
        milestone: true,
        raisedBy: true
      }

    });
    if (!dispute) {
      return res.status(400).json({ message: "Dispute not found" });
    }
    res.status(200).json(dispute);

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
