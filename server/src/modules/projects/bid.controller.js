import prisma from "../../config/database.js";

export const createBid = async (req, res) => {
  try {
    const { projectId, amount, proposal } = req.body;
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
