import express from "express";
import { createProposal, getProposals, getMyProposals, acceptProposals } from "./proposal.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
const router = express.Router();
router.post("/submit", authMiddleware, createProposal);
router.get("/client-proposals", authMiddleware, getProposals);
router.get("/my-proposals", authMiddleware, getMyProposals);
router.post("/accept/:proposalId", authMiddleware, acceptProposals);
export default router;
