import express from "express";
import { createBid, getProjectBids } from "./bid.controller.js";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
import kycmiddleware from "../kyc/kyc.middleware.js";

const router = express.Router();

router.post("/createBid", authMiddleware, roleMiddleware(["FREELANCER"]), kycmiddleware, createBid);

router.get("/project/:projectId", authMiddleware, getProjectBids);

export default router;
