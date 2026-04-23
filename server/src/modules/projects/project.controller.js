import prisma from "../../config/database.js";
// create->project
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const clientId = req.user.id;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }
    const project = await prisma.project.create({
      data: {
        title,
        description,
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
  const userId = req.user.id;
  const totalEscrow = await prisma.escrow.aggregate({
    _sum: { amount: true },
    where: {
      OR: [{ clientId: userId }, { freelancerId: userId }],
      status: 'SECURED'
    }
  });
  const activeProjectCount = await prisma.project.count({
    where: {
      OR: [{ clientId: userId }, { freelancerId: userId }],
      status: 'IN_PROGRESS'
    }
  });
  const breakdown = await prisma.escrow.findMany({
    where: { OR: [{ clientId: userId }, { freelancerId: userId }] },
    include: { project: true },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json(
    {
      "totalEscrow": totalEscrow._sum.amount,
      "activeProjects": activeProjectCount,
      "releasedThisMonth": 8250,
      "breakdown": breakdown
    }
  )
}
