import express from "express";
import { depositToEscrow, getUserContracts, releaseFunds, addFundsToWallet, withdrawFundsFromWallet, submitMilestoneWork, approveAndReleaseMilestoneAmount, raiseMilestoneDispute } from "./escrow.controller.js";
import authMiddleware from "../auth/auth.middleware.js";


const router = express.Router();
router.get("/", authMiddleware, getUserContracts);
router.post("/release/:contractId", authMiddleware, releaseFunds);
router.post("/deposit/:contractId", authMiddleware, depositToEscrow);
router.post("/add-funds", authMiddleware, addFundsToWallet);
router.post("/withdraw", authMiddleware, withdrawFundsFromWallet);
router.post("/milestone/submit/:milestoneId",authMiddleware,submitMilestoneWork);
router.post("/milestone/release/:milestoneId", authMiddleware, approveAndReleaseMilestoneAmount);
router.post("/milestone/release/:milestoneId",authMiddleware,raiseMilestoneDispute);

export default router;
