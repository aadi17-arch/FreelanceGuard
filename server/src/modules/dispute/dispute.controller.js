import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const raiseDispute = async (req, res) => {
  try {
    const { milestoneId, reason } = req.body;
    const raisedById = req.user.id;

    if (!milestoneId || !reason) {
      return res.status(400).json({ message: "Reason and Target ID are required" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Resolve Target (Check if ID is a Contract or Milestone)
      let targetMilestoneId = milestoneId;
      
      const milestone = await tx.milestone.findUnique({ where: { id: milestoneId } });
      
      if (!milestone) {
        // ID might be a Contract ID, let's find the first milestone
        let firstMilestone = await tx.milestone.findFirst({
          where: { contractId: milestoneId }
        });
        
        // LEGACY SUPPORT: If no milestone exists for this contract, create a fallback one
        if (!firstMilestone) {
          const contract = await tx.contract.findUnique({ where: { id: milestoneId } });
          if (!contract) {
            throw new Error("Invalid target: Neither a milestone nor a contract ID.");
          }

          firstMilestone = await tx.milestone.create({
            data: {
              contractId: contract.id,
              title: "Full Project Allocation",
              description: "Automatic fallback milestone for legacy projects.",
              amount: contract.totalAmount,
              dueDate: new Date(),
              status: 'PENDING'
            }
          });
        }
        targetMilestoneId = firstMilestone.id;
      } else if (milestone.status === "COMPLETED") {
        throw new Error("Cannot dispute a completed milestone");
      }

      // 2. Create Dispute Record
      const dispute = await tx.dispute.create({
        data: {
          milestoneId: targetMilestoneId,
          raisedById,
          reason,
          status: 'OPEN'
        }
      });

      // 3. Freeze the Milestone
      const updatedMilestone = await tx.milestone.update({
        where: { id: targetMilestoneId },
        data: { status: 'DISPUTED' }
      });

      // 4. Update Contract Status to DISPUTED
      await tx.contract.update({
        where: { id: updatedMilestone.contractId },
        data: { status: 'DISPUTED' }
      });

      return dispute;
    });

    res.status(201).json({
      message: "Freeze Protocol Initiated. Capital locked in vault.",
      dispute: result
    });
  } catch (error) {
    console.error("Dispute error:", error);
    res.status(500).json({ message: error.message || "Failed to initiate freeze protocol" });
  }
};
export const addEvidence = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { fileName } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    console.log("--- EVIDENCE UPLOAD DEBUG ---");
    console.log("DisputeID:", disputeId);
    console.log("UserID:", req.user?.id);
    console.log("File:", fileUrl);

    if (!fileUrl) {
      return res.status(400).json({ message: "No file uploaded. Please attach a JPG or PNG." });
    }

    if (!disputeId) {
      return res.status(400).json({ message: "Missing Dispute ID. Operation aborted." });
    }

    const evidence = await prisma.evidence.create({
      data: {
        disputeId,
        uploadedById: req.user.id,
        fileUrl,
        fileName: fileName || "Evidence File"
      },
      include: {
        uploadedBy: true
      }
    });

    console.log("Evidence logged successfully:", evidence.id);
    res.status(201).json(evidence);
  } catch (error) {
    console.error("CRITICAL UPLOAD ERROR:", error);
    res.status(500).json({ 
      message: `Vault logging failed | D: ${disputeId} | U: ${req.user?.id}`, 
      error: error.message 
    });
  }
};
export const getDisputeDetails = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`--- FETCHING DISPUTE: ${id} ---`);
    
    const dispute = await prisma.dispute.findUnique({
      where: { id: id },
      include: {
        evidence: {
          include: {
            uploadedBy: true
          }
        },
        milestone: {
          include: {
            contract: {
              include: {
                project: true
              }
            }
          }
        },
        raisedBy: true
      }
    });

    if (!dispute) {
      console.log(`[ERROR] Dispute NOT FOUND for ID: ${id}`);
      return res.status(404).json({ message: "Dispute not found in vault" });
    }

    console.log(`[SUCCESS] Dispute found. Milestone Amount: ${dispute.milestone?.amount}`);
    res.status(200).json(dispute);

  } catch (error) {
    console.error("[CRITICAL] Dispute Fetch Error:", error);
    res.status(500).json({ 
      message: "Server Protocol Failure", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export const listDisputes = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("--- DISPUTE LIST AUDIT ---");
    console.log("Searching for User ID:", userId);

    const disputes = await prisma.dispute.findMany({
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
        raisedBy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`TOTAL DISPUTES IN DB: ${disputes.length}`);
    
    // Manual filtering for extra safety during debug
    const userDisputes = disputes.filter(d => 
      d.raisedById === userId || 
      d.milestone?.contract?.freelancerId === userId ||
      d.milestone?.contract?.project?.clientId === userId
    );

    console.log(`MATCHED FOR USER ${userId}: ${userDisputes.length}`);
    res.status(200).json(userDisputes);
  } catch (error) {
    console.error("List disputes error:", error);
    res.status(500).json({ message: "Failed to fetch disputes", error: error.message });
  }
}
