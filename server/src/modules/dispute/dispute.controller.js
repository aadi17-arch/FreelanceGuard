import prisma from "../../config/database.js";

export const raiseDispute = async (req, res) => {
  try {
    const { milestoneId, reason } = req.body;
    const userId = req.user.id;

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        contract: true
      }
    });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    const dispute = await prisma.dispute.create({
      data: {
        milestoneId,
        raisedById: userId,
        reason,
        status: "OPEN"
      }
    });

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "DISPUTED" }
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDisputes = async (req, res) => {
  try {
    const userId = req.user.id;

    const disputes = await prisma.dispute.findMany({
      where: {
        OR: [
          { raisedById: userId },
          { milestone: { contract: { project: { clientId: userId } } } },
          { milestone: { contract: { freelancerId: userId } } }
        ]
      },
      include: {
        milestone: {
          include: {
            contract: {
              include: {
                project: {
                  include: {
                    client: { select: { name: true } }
                  }
                },
                freelancer: { select: { name: true } }
              }
            }
          }
        },
        raisedBy: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ disputes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDisputeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ error: "Invalid Dispute ID provided" });
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: id },
      include: {
        milestone: {
          include: {
            contract: {
              include: {
                project: true
              }
            }
          }
        },
        evidence: {
          include: {
            uploadedBy: {
              select: { name: true }
            }
          }
        },
        raisedBy: {
          select: { name: true }
        }
      }
    });

    if (!dispute) {
      return res.status(404).json({ error: "Case not found in vault archive" });
    }

    res.json(dispute);
  } catch (error) {
    res.status(500).json({
      error: "Vault synchronization failure"
    });
  }
};

export const uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const evidence = await prisma.evidence.create({
      data: {
        disputeId: id,
        uploadedById: userId,
        fileName: fileName || req.file.originalname,
        fileUrl: req.file.path
      }
    });

    res.status(201).json(evidence);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const clearDispute = async (req, res) => {
  try{const { id } = req.params;
  const { resolution, currentStatus } = req.body;
  const dispute=await prisma.dispute.update({
    where:{id:id},
    data: {
      status: "RESOLVED",
      resolution:resolution||"Admin final decision."
    },
    include:{milestone:true}
  });
  await prisma.milestone.update({
    where: { id: dispute.milestoneId },
    data:{status:"RESOLVED"}
  });
    res.status(200).json({message:"Case resolved and achieved",dispute});
  }
  catch (e) {
    return res.status(500).json({message:"Server error"});
  }
}
