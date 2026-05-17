import prisma from "../../config/database.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, budget, category } = req.body;
    const clientId = req.user.id;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }
    const project = await prisma.project.create({
      data: {
        title,
        description,
        category: category || "Development",
        budget: parseFloat(budget) || 0,
        clientId
      }
    });
    res.status(201).json({
      message: "Project Created",
      project
    });
  }
  catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

export const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'OPEN' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.status(200).json(projects);
  }
  catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

export const getMyProject = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { clientId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  }
  catch (error) {
    return res.status(500).json({ message: "Error Fetching Your Projects" });
  }
}

export const getProjectStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeProjectCount = await prisma.contract.count({
      where: {
        OR: [{ freelancerId: userId }, { project: { clientId: userId } }],
        status: 'ACTIVE'
      }
    });

    const pendingMilestoneCount = await prisma.milestone.count({
      where: {
        contract: {
          OR: [{ freelancerId: userId }, { project: { clientId: userId } }]
        },
        status: {
          in: ['PENDING', 'IN_PROGRESS', 'SUBMITTED']
        }
      }
    });

    const openDisputeCount = await prisma.dispute.count({
      where: {
        milestone: {
          contract: {
            OR: [{ freelancerId: userId }, { project: { clientId: userId } }]
          }
        },
        status: 'OPEN'
      }
    });

     const breakdown = await prisma.contract.findMany({
      where: {
        OR: [
          { freelancerId: userId },
          { project: { clientId: userId } }
        ]
      },
      include: { project: true },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      activeProjects: activeProjectCount,
      openDisputes: openDisputeCount,
      pendingMilestones: pendingMilestoneCount,
      breakdown: breakdown
    });
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bids: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        contracts: {
          where: {
            status: 'ACTIVE'
          },
          select: {
            id: true,
            freelancerId: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

export const hireFreelancer = async (req, res) => {
  try {
    const { projectId, freelancerId, bidAmount, milestone } = req.body;
    const clientId = req.user.id;

    if (!projectId || !freelancerId || !bidAmount) {
      return res.status(400).json({ message: "Missing hiring parameters" });
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    if (!project || project.clientId !== clientId) {
      return res.status(400).json({ message: "Unauthorized action" });
    }
    const proposal = await prisma.proposal.findUnique({
      where: {
        projectId_freelancerId: { projectId, freelancerId }
      }
    });

    const result = await prisma.$transaction(async (tx) => {
      const client=await tx.user.update({
        where: { id: clientId },
        data: {

            walletBalance: {
              decrement: parseFloat(bidAmount)
            },
            heldAmount: {
              increment:parseFloat(bidAmount)
            }

        }
      });
      if (client.walletBalance < 0) {
        throw new Error("Insufficient Balance");
      }
      const contract = await tx.contract.create({
        data: {
          projectId,
          freelancerId,
          totalAmount: parseFloat(bidAmount),
          heldAmount: parseFloat(bidAmount),
          status: 'ACTIVE'
        }
      });

      const allMilestones = await Promise.all(
        proposal.milestones.map((m) =>
          tx.milestone.create({
            data: {
              contractId: contract.id,
              title: m.title,
              description: "Full project allocation secured in vault.",
              amount: parseFloat(m.amount),
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              status: 'PENDING'
            }
          })
        )
      );

      await tx.bid.updateMany({
        where: { projectId, freelancerId },
        data: { status: 'ACCEPTED' }
      });

      await tx.bid.updateMany({
        where: {
          projectId,
          NOT: { freelancerId }
        },
        data: { status: 'REJECTED' }
      });
      await tx.project.update({
        where: { id: projectId },
        data: { status: 'IN_PROGRESS' }
      });
      return { contract, milestone };
    });

    res.status(200).json({
      message: "Freelancer hired and capital secured in vault",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to finalize hiring protocol. Please check if the project is still open." });
  }
};
