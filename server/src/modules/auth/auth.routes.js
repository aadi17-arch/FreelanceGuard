import express from "express";
import { login, register, getProfile, updateProfile, refresh } from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "../../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", refresh);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
