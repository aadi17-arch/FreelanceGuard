import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import { createProject, getAllProjects, getMyProject, getProjectStats } from "./project.controller.js"

const router = express.Router();
router.post("/create", authMiddleware, createProject);
router.get("/all", getAllProjects);
router.get("/userProjectList", authMiddleware, getMyProject);
router.get("/stats", authMiddleware, getProjectStats);

export default router;
