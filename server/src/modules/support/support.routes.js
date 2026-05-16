import express from "express";
import { createTicket, getUserTicket, replyToTicket ,getAllTickets, resolveTicket, getMyTickets} from "./support.controller.js";
import authMiddleware,{ roleMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/ticket",authMiddleware,roleMiddleware(["CLIENT", "FREELANCER"]),createTicket);
router.get("/ticket/:id",authMiddleware,getUserTicket);
router.post("/reply/ticket/:id", authMiddleware,roleMiddleware(["ADMIN"]), replyToTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.get("/admin/all", authMiddleware, roleMiddleware(["ADMIN"]), getAllTickets);
router.put("/ticket/:id/resolve",authMiddleware,roleMiddleware(["ADMIN"]),resolveTicket);
export default router;
