import { Router } from "express";
import { getChatHistory, sendNewMessage } from "./chat.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router.get("/:contractId", authMiddleware, getChatHistory);
router.post("/:contractId", authMiddleware, sendNewMessage);

export default router;
