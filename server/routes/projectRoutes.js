import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProject, getAllProjects, getMyProject } from "../controllers/projectController.js"

const router = express.Router();
router.post("/create", authMiddleware, createProject);
router.get("/all", getAllProjects);
router.get("/userProjectList", authMiddleware, getMyProject);

export default router;
