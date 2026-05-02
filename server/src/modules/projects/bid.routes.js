import express from "express";
import { createBid, getProjectBids, acceptBid } from "./bid.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import kycmiddleware from "../kyc/kyc.middleware.js";


const router = express.Router();
router.post("/createBid", authMiddleware, kycmiddleware, createBid);
router.get("/project/:projectId", authMiddleware, getProjectBids);


export default router;
