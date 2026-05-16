import express from "express";
import { depositToEscrow, getUserContracts, releaseFunds, addFundsToWallet, withdrawFundsFromWallet, submitMilestoneWork, approveAndReleaseMilestoneAmount, getUserTransactions } from "./escrow.controller.js";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
import kycmiddleware from "../kyc/kyc.middleware.js";


const router = express.Router();
router.get("/", authMiddleware, getUserContracts);
router.get("/transactions", authMiddleware, getUserTransactions);
router.post("/release/:contractId", authMiddleware,roleMiddleware(["CLIENT"]), releaseFunds);
router.post("/deposit/:contractId", authMiddleware,roleMiddleware(["CLIENT"]), depositToEscrow);
router.post("/add-funds", authMiddleware, kycmiddleware,roleMiddleware(["CLIENT","FREELANCER"]), addFundsToWallet);
router.post("/withdraw", authMiddleware, kycmiddleware, withdrawFundsFromWallet);
router.post("/milestone/submit/:milestoneId",authMiddleware,roleMiddleware(["FREELANCER"]),submitMilestoneWork);
router.post("/milestone/release/:milestoneId", authMiddleware,roleMiddleware(["CLIENT"]), approveAndReleaseMilestoneAmount);

export default router;
