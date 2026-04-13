import express from "express";
import { createBid, getProjectBids, acceptBid } from "../controllers/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/createBid", authMiddleware, createBid);
router.get("/project/:projectId", authMiddleware, getProjectBids);
router.post("/bid/:bidId", authMiddleware, acceptBid);


export default router;
