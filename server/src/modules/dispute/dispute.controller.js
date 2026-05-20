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
    const whereClause = req.user.role === "ADMIN"
      ? {}
      : {
        OR: [
          { raisedById: userId },
          { milestone: { contract: { project: { clientId: userId } } } },
          { milestone: { contract: { freelancerId: userId } } }
        ]
      };

    const disputes = await prisma.dispute.findMany({
      where: whereClause,
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
    const clientId = dispute.milestone.contract.project.clientId;
    const freelancerId = dispute.milestone.contract.freelancerId;
    if (req.user.role !== "ADMIN" && req.user.id !== clientId && req.user.id !== freelancerId) {
      return res.status(403).json({ error: "Access denied. Unauthorized to view this dispute." });
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
    const userRole = req.user.role;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        milestone: {
          include: {
            contract: {
              include: { project: true }
            }
          }
        }
      }
    });

    if (!dispute) {
      return res.status(404).json({ message: "Dispute not found" });
    }

    const clientId = dispute.milestone.contract.project.clientId;
    const freelancerId = dispute.milestone.contract.freelancerId;
    if (userRole !== "ADMIN" && userId !== clientId && userId !== freelancerId) {
      return res.status(403).json({ message: "Access denied. Cannot upload evidence to this dispute." });
    }

    const evidence = await prisma.evidence.create({
      data: {
        disputeId: id,
        uploadedById: userId,
        fileName: fileName || req.file.originalname,
        fileUrl: req.file.path.replace(/\\/g, '/')
      }
    });

    res.status(201).json(evidence);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const clearDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, action } = req.body;
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        milestone: {
          include: {
            contract: {
              include: {
                project : true
              }
            }
          }
        }
      }

    });
    if (!dispute) {
      return res.status(400).json({ message: "Dispute not found." });
    }
    if (dispute.status === "RESOLVED") return res.status(400).json({ message: "Dipsuted already resolved." });
    const milestone = dispute.milestone;
    const contract = milestone.contract;
    const milestoneAmount = milestone.amount;
    const clientId = contract.project.clientId;
    const freelancerId = contract.freelancerId;

    const updatedDispute = await prisma.$transaction(async (tx) => {
      const updated = await tx.dispute.update({
        where: { id },
        data: {
          status: "RESOLVED",
          resolution: resolution || "Admin final decison"
        }
      });
      await tx.milestone.update({
        where: { id: dispute.milestoneId },
        data: {
          status: "RESOLVED"
        }
      });
      if (action === 'RELEASED') {
        await tx.user.update({
          where: { id: clientId },
          data: {
            heldAmount: {
              decrement: milestoneAmount
            }
          }
        });
        await tx.user.update({
          where: { id: freelancerId },
          data: {
            walletBalance: {
              increment: milestoneAmount
            }
          }
        });
        await tx.contract.update({
          where: { id: milestone.contractId },
          data: {
            heldAmount: {
              decrement: milestoneAmount
            }
          }
        });
        await tx.payment.create({
          data: {
            contractId: milestone.contractId,
            milestoneId: milestone.id,
            amount: milestoneAmount,
            type: "RELEASE"
          }
        });
      }
      else {
        await tx.user.update({
          where: { id: clientId },
          data: {
            heldAmount: {
              decrement: milestoneAmount
            }
          }
        });
        await tx.user.update({
          where: { id: clientId },
          data: {
            walletBalance: {
              increment: milestoneAmount
            }
          }
        });
        await tx.contract.update({
          where: { id: milestone.contractId },
          data: {
            heldAmount: {
              decrement: milestoneAmount
            }
          }
        });
        await tx.payment.create({
          data: {
            contractId: milestone.contractId,
            milestoneId: milestone.id,
            amount: milestoneAmount,
            type: 'REFUND'
          }
        });
      }

      const listofMilestone = await tx.milestone.findMany({
        where: { contractId: milestone.contractId }
      });
      const notFinishedMilestones = listofMilestone.filter(
        m => m.id !== dispute.milestoneId &&
             m.status !== "APPROVED" &&
             m.status !== "RELEASED" &&
             m.status !== "RESOLVED"
      );

      if (notFinishedMilestones.length === 0) {
        await tx.contract.update({
          where: { id: milestone.contractId },
          data: { status: "COMPLETED" }
        });
        await tx.project.update({
          where: { id: contract.projectId },
          data: { status: "COMPLETED" }
        });
      }

      return updated;
    });
    return res.status(200).json({message:"Case Resolved",dispute:updatedDispute});

  } catch (e) {
    return res.status(500).json({message:"Server error"});
  }
}
