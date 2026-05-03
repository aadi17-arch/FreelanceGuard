import prisma from "../../config/database.js";
// create->project
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
//get->projects
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
// get->displays use specific project list
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
    const totalEscrow = await prisma.contract.aggregate({
      _sum: { heldAmount: true },
      where: {
        OR: [
          { freelancerId: userId },
          { project: { clientId: userId } }
        ],
        status: 'ACTIVE'
      }
    });
    const activeProjectCount = await prisma.contract.count({
      where: {
        OR: [{ freelancerId: userId }, { project: { clientId: userId } }],

        status: 'ACTIVE'
      }
    });
    const breakdown = await prisma.contract.findMany({
      where: {
        OR: [{ freelancerId: userId },
        { project: { clientId: userId } }
        ]
      },
      include: { project: true },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const releasedstats = await prisma.payment.aggregate({
      _sum: {
        amount: true

      },
      where: {
        type: 'RELEASE',
        createdAt: { gte: monthStart },
        contract: { OR: [{ freelancerId: userId }, { project: { clientId: userId } }] }
      }

    });
    res.status(200).json(
      {
        "totalEscrow": totalEscrow._sum.heldAmount,
        "activeProjects": activeProjectCount,
        "releasedThisMonth": releasedstats._sum.amount || 0,
        "breakdown": breakdown
      }
    )
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

// get->single project by ID
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
    console.error("Error fetching project:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
// Hire a freelancer and initiate contract/escrow
export const hireFreelancer = async (req, res) => {
  try {
    const { projectId, freelancerId, bidAmount } = req.body;
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

    const result = await prisma.$transaction(async (tx) => {


      // 2. Initialize Contract (The Escrow Vault)
      const contract = await tx.contract.create({
        data: {
          projectId,
          freelancerId,
          totalAmount: parseFloat(bidAmount),
          heldAmount: 0,
          status: 'PENDING'
        }
      });


      // 3. Create Initial Milestone (Required for Disputes/Payments)
      const milestone = await tx.milestone.create({
        data: {
          contractId: contract.id,
          title: "Initial Project Phase",
          description: "Full project allocation secured in vault.",
          amount: parseFloat(bidAmount),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
          status: 'PENDING'
        }
      });

      // 4. Update Bid Status
      await tx.bid.updateMany({
        where: { projectId, freelancerId },
        data: { status: 'ACCEPTED' }
      });

      // 5. Reject other bids
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
    console.error("Hiring error:", error);
    res.status(500).json({ message: "Failed to finalize hiring protocol. Please check if the project is still open." });
  }
};
