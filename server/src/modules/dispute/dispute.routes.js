import express from "express";
import { raiseDispute, addEvidence, getDisputeDetails, listDisputes } from "./dispute.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();
router.get("/", authMiddleware, listDisputes);
router.post("/", authMiddleware, raiseDispute);
router.post("/evidence/:disputeId", authMiddleware, upload.single('evidence'), addEvidence);
router.get("/:id", authMiddleware, getDisputeDetails);
export default router;
