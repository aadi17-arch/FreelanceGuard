import prisma from "../../config/database.js";
import fs from "fs";
import path from "path";

// Diagnostic Logging Helper
const logDebug = (msg) => {
  const logPath = "C:/Users/ADI/Desktop/FreelanceUp/freelanceguard/server/dispute_debug.log";
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
};

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

    // Update milestone status to DISPUTED
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "DISPUTED" }
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getDisputes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    logDebug(`--- FETCH REQUEST ---`);
    logDebug(`USER_ID: ${userId} | ROLE: ${userRole}`);

    const allDisputesCount = await prisma.dispute.count();
    logDebug(`DB TOTAL DISPUTES: ${allDisputesCount}`);

    // Simplified Filter for Maximum Reliability
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

    logDebug(`MATCHES FOUND: ${disputes.length}`);
    
    res.json({
      disputes,
      diagnostics: {
        userId,
        userRole,
        dbTotal: allDisputesCount,
        matchCount: disputes.length
      }
    });
  } catch (error) {
    logDebug(`CRITICAL ERROR: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
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
      error: "Vault synchronization failure",
      details: error.message 
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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
