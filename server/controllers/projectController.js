import prisma from "../config/db.js";
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
