import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "admin@freelanceguard.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
      },
      create: {
        name: "Master Admin",
        email: email,
        password: hashedPassword,
        role: "ADMIN",
        walletBalance: 0,
      },
    });
    console.log("-----------------------------------------");
    console.log("SUCCESS: Admin account ready today!");
    console.log("EMAIL: admin@freelanceguard.com");
    console.log("PASSWORD: admin123");
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("ERROR creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
