import express from "express";
import { login, register, getProfile, addFunds, updateProfile } from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/add-funds", authMiddleware, addFunds);

export default router;
