import express from "express";
import { raiseDispute, uploadEvidence, getDisputeDetails, getDisputes } from "./dispute.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();
router.get("/", authMiddleware, getDisputes);
router.post("/", authMiddleware, raiseDispute);
router.post("/evidence/:id", authMiddleware, upload.single('evidence'), uploadEvidence);
router.get("/:id", authMiddleware, getDisputeDetails);
export default router;
