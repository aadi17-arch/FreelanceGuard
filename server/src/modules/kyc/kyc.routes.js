import express from "express";
import { submitKYC } from "./kyc.controller.js";
import authMiddleware ,{roleMiddleware} from "../auth/auth.middleware.js";
import upload from "../../middleware/upload.js";


const router = express.Router();
router.post("/submit", authMiddleware,roleMiddleware(["CLIENT","FREELANCER"]),upload.single('document'), submitKYC);
export default router;
