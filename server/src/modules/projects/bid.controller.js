import prisma from "../../config/database.js";

export const createBid = async (req, res) => {
  try {
    const { projectId, amount, proposal } = req.body;
    const freelancerId = req.user.id;
    if (!projectId || !amount || !proposal) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    const bid = await prisma.bid.create({
      data: {
        projectId,
        freelancerId,
        amount: parseFloat(amount),
        proposal
      }
    });
    res.status(201).json({ message: "Bid Submitted Successfully", bid });


  }
  catch (error) {
    return res.status(500).json({ message: "Database Error" });
  }
}
export const getProjectBids = async (req, res) => {
  try {
    const { projectId } = req.params;
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
}
export const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user.id;

    if (!bidId) {
      return res.status(400).json({ message: "bidId is required" });
    }

    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        project: true
      }
    });

    if (!bid) {
      return res.status(404).json({ error: "bid not found" });
    }

    if (bid.project.clientId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (bid.status !== "PENDING") {
      return res.status(400).json({ message: "bid already accepted or processed" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Get Client to verify balance
      const client = await tx.user.findUnique({
        where: { id: bid.project.clientId },
      });

      if (!client) throw new Error("Client not found");
      if (client.walletBalance < bid.amount) {
        throw new Error("Insufficient balance");
      }

      // 2. Move funds to Escrow (Held)
      await tx.user.update({
        where: { id: client.id },
        data: {
          walletBalance: { decrement: bid.amount },
          heldAmount: { increment: bid.amount },
        },
      });

      // 3. Update Bid Status
      const updatedBid = await tx.bid.update({
        where: { id: bidId },
        data: { status: "ACCEPTED" },
      });

      // 4. Reject other bids
      await tx.bid.updateMany({
        where: {
          projectId: bid.projectId,
          NOT: { id: bidId },
        },
        data: { status: "REJECTED" },
      });

      // 5. Set Project to In Progress
      await tx.project.update({
        where: { id: bid.projectId },
        data: { status: "IN_PROGRESS" },
      });

      // 6. Generate Contract
      const contract = await tx.contract.create({
        data: {
          projectId: bid.projectId,
          freelancerId: bid.freelancerId,
          totalAmount: bid.amount,
          heldAmount: bid.amount,
          status: "ACTIVE",
        },
      });

      return { updatedBid, contract };
    });

    return res.status(200).json({
      message: "Bid accepted and escrow secured",
      data: result,
    });

  } catch (error) {
    console.error("Accept Bid Error:", error);
    res.status(500).json({ message: error.message || "Server Error during transaction" });
  }
};
