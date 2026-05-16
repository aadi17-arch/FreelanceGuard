import express from "express";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
import { createProject, getAllProjects, getMyProject, getProjectStats, getProjectById, hireFreelancer } from "./project.controller.js"
import kycmiddleware from "../kyc/kyc.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware(["CLIENT"]), kycmiddleware, createProject);

router.get("/", getAllProjects);
router.get("/all", getAllProjects);

router.get("/userProjectList", authMiddleware, getMyProject);
router.get("/stats", authMiddleware, getProjectStats);

router.post("/hire", authMiddleware, roleMiddleware(["CLIENT"]), kycmiddleware, hireFreelancer);

router.get("/:id", getProjectById);

export default router;
