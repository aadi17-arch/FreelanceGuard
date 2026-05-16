import express from "express";
import { submitMilestone } from "./milestone.controller.js";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
const router = express.Router();
router.post("/submit/:milestoneId", authMiddleware,roleMiddleware(["FREELANCER"]), submitMilestone);
export default router;
