import express from "express";
import { createTicket, getUserTicket, replyToTicket ,getAllTickets, resolveTicket, getMyTickets} from "./support.controller.js";
import authMiddleware,{ adminMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/ticket",authMiddleware,createTicket);
router.get("/ticket/:id",authMiddleware,getUserTicket);
router.post("/reply/ticket/:id", authMiddleware, replyToTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.get("/admin/all", authMiddleware, adminMiddleware, getAllTickets);
router.put("/ticket/:id/resolve",authMiddleware,adminMiddleware,resolveTicket);
export default router;
