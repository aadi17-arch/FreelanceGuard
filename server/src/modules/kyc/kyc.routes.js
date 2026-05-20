import express from "express";
import { submitKYC, verifyKYC, getPendingKYC } from "./kyc.controller.js";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();
router.post("/submit", authMiddleware, roleMiddleware(["CLIENT", "FREELANCER"]), upload.single('document'), submitKYC);
router.get("/pending", authMiddleware, roleMiddleware(["ADMIN"]), getPendingKYC);
router.put("/verify/:id", authMiddleware, roleMiddleware(["ADMIN"]), verifyKYC);
export default router;
