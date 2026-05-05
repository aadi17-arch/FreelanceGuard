import express from "express";
import { depositToEscrow, getUserContracts, releaseFunds, addFundsToWallet, withdrawFundsFromWallet } from "./escrow.controller.js";
import authMiddleware from "../auth/auth.middleware.js";


const router = express.Router();
router.get("/", authMiddleware, getUserContracts);
router.post("/release/:contractId", authMiddleware, releaseFunds);
router.post("/deposit/:contractId", authMiddleware, depositToEscrow);
router.post("/add-funds", authMiddleware, addFundsToWallet);
router.post("/withdraw", authMiddleware, withdrawFundsFromWallet);

export default router;
