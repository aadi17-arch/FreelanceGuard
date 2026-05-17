import prisma from "../../config/database.js";

export const getUserContracts = async (req, res) => {
  try {
    const { id, role } = req.user;

    let filter = {};
    if (role == "CLIENT") {
      filter = {
        project: { clientId: id }
      };
    } else {
      filter = { freelancerId: id };
    }
    const contracts = await prisma.contract.findMany({
      where: filter,
      include: {
        project: {
          include: {
            client: { select: { name: true } }
          }
        },
        freelancer: true,
        milestones: {
          include: {
            disputes: true
          }
        }
      }
    });
    res.status(200).json(contracts);
  }
  catch (error) {
    res.status(500).json({ message: "Server Error fetching contracts" })
  }
}

export const releaseFunds = async (req, res) => {
  try {
    const { contractId } = req.params;
    const id = req.user.id;
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { project: true }
    });
    if (!contract) {
      return res.status(404).json({ message: "No Contract Found" });
    }
    if (id !== contract.project.clientId) {
      return res.status(403).json({ message: "Invalid Access" });
    }
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: contract.project.clientId },
        data: {
          heldAmount: {
            decrement: contract.totalAmount
          }
        }
      });
      await tx.user.update({
        where: { id: contract.freelancerId },
        data: {
          walletBalance: {
            increment: contract.totalAmount
          }
        }
      });
      await tx.contract.update({
        where: { id: contractId },
        data: {
          heldAmount: {
            decrement: contract.totalAmount
          }, status: "COMPLETED"
        }
      });
      await tx.project.update({
        where: { id: contract.projectId },
        data: {
          status: "COMPLETED"
        }
      });
      await tx.payment.create({
        data: {
          contractId: contract.id,
          amount: contract.totalAmount,
          type: "RELEASE"
        }
      });
      return { message: "Success" };
    });
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const depositToEscrow = async (req, res) => {
  try {
    const { contractId } = req.params;
    const id = req.user.id;
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: {
          include: {
            client: true
          }
        }
      }
    });
    if (!contract) {
      return res.status(404).json({ message: "No Contract found" });
    }
    if (contract.status !== "PENDING") {
      return res.status(400).json({ message: "Project has already started or is already paid." });
    }
    const client = contract.project.client;
    if (client.id !== id) {
      return res.status(403).json({ message: "Invalid Access" });
    }

    if (client.walletBalance < contract.totalAmount) {
      return res.status(400).json({ message: "Insufficient Funds" });
    }
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: client.id },
        data: {
          walletBalance: {
            decrement: contract.totalAmount
          },
          heldAmount: {
            increment: contract.totalAmount
          }
        }
      });
      await tx.contract.update({
        where: { id: contract.id },
        data: {
          heldAmount: {
            increment: contract.totalAmount
          },
          status: "ACTIVE"
        }
      });
      await tx.project.update({
        where: { id: contract.project.id },
        data: {
          status: "IN_PROGRESS"
        }
      });
      await tx.payment.create({
        data: {
          contractId: contract.id,
          amount: contract.totalAmount,
          type: "DEPOSIT"
        }
      });
      return { message: "SUCCESS" };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const addFundsToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: {
          increment: parseFloat(amount)
        }
      }
    });
    res.status(200).json({
      message: "Funds added successfully",
      walletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const withdrawFundsFromWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (currentUser.walletBalance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: {
          decrement: parseFloat(amount)
        }
      }
    });
    res.status(200).json({
      message: "Withdrawal completed successfully",
      walletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const submitMilestoneWork = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user.id;

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId },
      include:{ contract: true}
    });
    if (!milestone) {
      return res.status(404).json({message:"Milestone not found."});
    }
    if (milestone.contract.freelancerId !== userId) {
      return res.status(403).json({message:"Only the selected freelancer can submit work."});
    }
    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status:'SUBMITTED'
      }
    });
    res.status(200).json({ message: "Milestone completed successfully.", milestone, updated });
  } catch (error) {
    return res.status(500).json({message:"Server Error"});
  }
}

export const approveAndReleaseMilestoneAmount = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const clientId = req.user.id;

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include:{contract:{include:{project:true}}}
    });

    if (!milestone) {
      return res.status(404).json({message:"Milestone not found."});
    }
    if (milestone.contract.project.clientId !== clientId) {
      return res.status(403).json({message:"Unauthorized only project owner can release the escrow"});
    }
    if (milestone.status === "APPROVED") {
      return res.status(400).json({ message: "Funds for this milestone have already been released" });
    }
    const freelancerId = milestone.contract.freelancerId;
    const milestoneAmount = milestone.amount;
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: clientId },
        data: {
          heldAmount: {
            decrement:milestoneAmount
          }
        }
      });
      await tx.user.update({
        where: { id: freelancerId },
        data: {
          walletBalance: {
            increment:milestoneAmount
          }
        }
      });
      await tx.contract.update({
        where: { id: milestone.contractId },
        data: {
          heldAmount: {
            decrement:milestoneAmount
          }
        }
      });
      const updatedMilestone = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status:"APPROVED"
        }
      });
      const listofMilestone = await tx.milestone.findMany({
        where: {contractId:milestone.contractId},
      });
      const notApprovedMilestone = listofMilestone.filter(
        m=>m.id !==milestoneId &&m.status!=="APPROVED"&&m.status!=="RELEASED"
      );
      if (notApprovedMilestone.length === 0) {
        await tx.contract.update({
          where:{id:milestone.contractId},
          data:{status:"COMPLETED"}
        });
        await tx.project.update({
          where:{id:milestone.contract.projectId},
          data:{status:"COMPLETED"}
        });
      }
      await tx.payment.create({
        data: {
          contractId: milestone.contractId,
          milestoneId: milestone.id,
          amount: milestoneAmount,
          type:"RELEASE"
        }
      });
      return (updatedMilestone)
    });
     res.status(200).json({ message: "Escrow funds released successfully!", milestone: result });
  } catch (error) {
    return res.status(500).json({message:"Server Error"});
  }
}

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.payment.findMany({
      where: {
        contract: {
          OR: [
            { freelancerId: userId },
            { project: { clientId: userId } }
          ]
        }
      },
      include: {
        contract: {
          include: {
            project: {
              select: {
                title: true
              }
            }
          }
        },
        milestone: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
