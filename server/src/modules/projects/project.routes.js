import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import { createProject, getAllProjects, getMyProject, getProjectStats, getProjectById, hireFreelancer } from "./project.controller.js"

const router = express.Router();
router.post("/create", authMiddleware, createProject);
router.get("/", getAllProjects);
router.get("/all", getAllProjects); // Keep for backward compatibility

router.get("/userProjectList", authMiddleware, getMyProject);
router.get("/stats", authMiddleware, getProjectStats);
router.post("/hire", authMiddleware, hireFreelancer);
router.get("/:id", getProjectById);

export default router;
