import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  
  // Clean in order of dependencies
  await prisma.evidence.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.project.deleteMany();
  await prisma.kYC.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleaned.");

  const hashedHeader = await bcrypt.hash("password123", 10);

  console.log("Creating test users...");

  const client = await prisma.user.create({
    data: {
      name: "Test Client",
      email: "client@test.com",
      password: hashedHeader,
      role: "CLIENT",
      walletBalance: 10000,
    }
  });

  const freelancer = await prisma.user.create({
    data: {
      name: "Test Freelancer",
      email: "freelancer@test.com",
      password: hashedHeader,
      role: "FREELANCER",
      walletBalance: 0,
    }
  });

  console.log("-----------------------------------------");
  console.log("SUCCESS: Database wiped and seeded!");
  console.log("-----------------------------------------");
  console.log("Client Login:");
  console.log("Email: client@test.com");
  console.log("Pass:  password123");
  console.log("-----------------------------------------");
  console.log("Freelancer Login:");
  console.log("Email: freelancer@test.com");
  console.log("Pass:  password123");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
