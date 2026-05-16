import express from "express";
import { raiseDispute, uploadEvidence, getDisputeDetails, getDisputes ,clearDispute} from "./dispute.controller.js";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();
router.get("/", authMiddleware, getDisputes);
router.post("/", authMiddleware,roleMiddleware(["CLIENT","FREELANCER"]), raiseDispute);
router.post("/evidence/:id", authMiddleware, upload.single('evidence'), uploadEvidence);
router.get("/:id", authMiddleware, getDisputeDetails);
router.put("/resolve/:id",authMiddleware,roleMiddleware(["ADMIN"]),clearDispute);
export default router;
