import express from "express";
import { submitKYC } from "./kyccontroller.js";
import authMiddleware from "../auth/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();
router.post("/submit", authMiddleware, upload.single('document'), submitKYC);
export default router;
