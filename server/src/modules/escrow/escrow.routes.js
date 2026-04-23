import express from "express";
import { getUserContracts, releaseFunds } from "./escrow.controller.js";
import authMiddleware from "../auth/auth.middleware.js";


const router = express.Router();
router.get("/", authMiddleware, getUserContracts);
router.post("/release/:contractId", authMiddleware, releaseFunds);

export default router;
