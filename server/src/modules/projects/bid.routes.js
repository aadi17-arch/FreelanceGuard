import express from "express";
import { createBid, getProjectBids, acceptBid } from "./bid.controller.js";
import authMiddleware from "../auth/auth.middleware.js";


const router = express.Router();
router.post("/createBid", authMiddleware, createBid);
router.get("/project/:projectId", authMiddleware, getProjectBids);
router.post("/bid/:bidId", authMiddleware, acceptBid);


export default router;
