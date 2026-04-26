import jwt from "jsonwebtoken";
import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Register Attempt:", { name, email, role });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === "FREELANCER" ? "FREELANCER" : "CLIENT"
      }
    });
    
    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET is missing from environment variables");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered Successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  }
  catch (error) {
    console.error("Register Error Details:", error);
    res.status(500).json({ message: "Server Error" });
  }

}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET is missing from environment variables");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }

    });
  }
  catch (error) {
    console.error("Login Error Details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        walletBalance: true,
        heldAmount: true,
        createdAt: true,
        kyc: true
      }
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json(user);
  }
  catch (error) {
    console.error("Profile Error Details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
