import express from "express";
import { depositToEscrow, getUserContracts, releaseFunds, addFundsToWallet, withdrawFundsFromWallet, submitMilestoneWork, approveAndReleaseMilestoneAmount, getUserTransactions } from "./escrow.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import kycmiddleware from "../kyc/kyc.middleware.js";


const router = express.Router();
router.get("/", authMiddleware, getUserContracts);
router.get("/transactions", authMiddleware, getUserTransactions);
router.post("/release/:contractId", authMiddleware, releaseFunds);
router.post("/deposit/:contractId", authMiddleware, depositToEscrow);
router.post("/add-funds", authMiddleware,kycmiddleware, addFundsToWallet);
router.post("/withdraw", authMiddleware,kycmiddleware, withdrawFundsFromWallet);
router.post("/milestone/submit/:milestoneId",authMiddleware,submitMilestoneWork);
router.post("/milestone/release/:milestoneId", authMiddleware, approveAndReleaseMilestoneAmount);

export default router;
