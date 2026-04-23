import express from "express";
import { login, register, getProfile } from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

export default router;
