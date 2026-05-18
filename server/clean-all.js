import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping all tables completely...");

  // Wipe in correct dependency order to prevent FK violations
  await prisma.notification.deleteMany({});
  await prisma.supportMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.dispute.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.proposal.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.kYC.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database wiped successfully!");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  console.log("Creating default verified users...");

  // 1. Client Profile
  const client = await prisma.user.create({
    data: {
      name: "Alexander Pierce",
      email: "c@t.com",
      password: hashedPassword,
      role: "CLIENT",
      walletBalance: 50000,
      heldAmount: 0,
      bio: "Operations Director at TechFlow Solutions"
    }
  });

  // 2. Freelancer Profile
  const freelancer = await prisma.user.create({
    data: {
      name: "Marcus Thorne",
      email: "f@t.com",
      password: hashedPassword,
      role: "FREELANCER",
      walletBalance: 0,
      heldAmount: 0,
      bio: "Senior Full Stack Engineer & UI Architect"
    }
  });

  // 3. Admin Profile
  const admin = await prisma.user.create({
    data: {
      name: "Adrian Cole",
      email: "a@t.com",
      password: adminPassword,
      role: "ADMIN",
      walletBalance: 0,
      heldAmount: 0,
    }
  });

  // 4. Client KYC Approval
  await prisma.kYC.create({
    data: {
      userId: client.id,
      documentType: "PASSPORT",
      documentUrl: "https://placeholder.com/passport.jpg",
      status: "APPROVED",
      verifiedAt: new Date()
    }
  });

  // 5. Freelancer KYC Approval
  await prisma.kYC.create({
    data: {
      userId: freelancer.id,
      documentType: "PASSPORT",
      documentUrl: "https://placeholder.com/passport.jpg",
      status: "APPROVED",
      verifiedAt: new Date()
    }
  });

  console.log("--------------------------------------------------");
  console.log("🚀 SUCCESS: Database Cleared & Seeded Cleanly!");
  console.log("--------------------------------------------------");
  console.log("CLIENT LOGIN:");
  console.log("Email:    c@t.com");
  console.log("Password: password123");
  console.log("--------------------------------------------------");
  console.log("FREELANCER LOGIN:");
  console.log("Email:    f@t.com");
  console.log("Password: password123");
  console.log("--------------------------------------------------");
  console.log("ADMIN LOGIN:");
  console.log("Email:    a@t.com");
  console.log("Password: admin123");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("Error seeding fresh DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
