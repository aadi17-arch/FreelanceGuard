import express from "express";
import { approveMilestone, submitMilestone } from "./milestone.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
const router = express.Router();
router.post("/submit/:milestoneId", authMiddleware, submitMilestone);
router.post("/approve/:milestoneId", authMiddleware, approveMilestone);
export default router;
