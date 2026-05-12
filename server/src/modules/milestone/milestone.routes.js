import express from "express";
import { submitMilestone } from "./milestone.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
const router = express.Router();
router.post("/submit/:milestoneId", authMiddleware, submitMilestone);
export default router;
