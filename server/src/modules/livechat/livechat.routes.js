import { Router } from "express";
import authMiddleware, { roleMiddleware } from "../auth/auth.middleware.js";
import {
  closeSession,
  createSession,
  getAdminSessions,
  getMySessions,
  getSession,
  reply,
} from "./livechat.controller.js";

const router = Router();

router.post("/session", authMiddleware, createSession);
router.get("/my-sessions", authMiddleware, getMySessions);
router.get(
  "/admin/sessions",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAdminSessions,
);
router.get("/session/:id", authMiddleware, getSession);
router.post("/reply/:id", authMiddleware, reply);
router.put(
  "/session/:id/close",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  closeSession,
);

export default router;
