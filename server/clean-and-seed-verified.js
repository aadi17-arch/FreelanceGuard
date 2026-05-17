import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping database completely...");
  
  // Wipe all tables in correct dependency order
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

  console.log("Creating verified client & freelancer profiles...");

  // 1. Create Client User
  const client = await prisma.user.create({
    data: {
      name: "Alexander Pierce",
      email: "client@test.com",
      password: hashedPassword,
      role: "CLIENT",
      walletBalance: 75000,
      heldAmount: 0,
      bio: "Operations Director at TechFlow Solutions"
    }
  });

  // 2. Create Freelancer User
  const freelancer = await prisma.user.create({
    data: {
      name: "Marcus Thorne",
      email: "freelancer@test.com",
      password: hashedPassword,
      role: "FREELANCER",
      walletBalance: 4200,
      heldAmount: 0,
      bio: "Senior Full Stack Engineer & UI Architect"
    }
  });

  // 3. Approve KYC for Client
  await prisma.kYC.create({
    data: {
      userId: client.id,
      documentType: "PASSPORT",
      documentUrl: "https://placeholder.com/passport.jpg",
      status: "APPROVED",
      verifiedAt: new Date()
    }
  });

  // 4. Approve KYC for Freelancer
  await prisma.kYC.create({
    data: {
      userId: freelancer.id,
      documentType: "PASSPORT",
      documentUrl: "https://placeholder.com/passport.jpg",
      status: "APPROVED",
      verifiedAt: new Date()
    }
  });

  console.log("Creating fresh AI analytics project, proposal & bid for testing...");

  // 5. Create Project Titled "AI-Powered Financial Analytics Platform"
  const project = await prisma.project.create({
    data: {
      title: "AI-Powered Financial Analytics Platform",
      description: "Secure escrow engagement protecting counterparties. Need high-fidelity implementation of charts, transactional widgets, and real-time updates.",
      budget: 1868,
      category: "Development",
      clientId: client.id,
      status: "OPEN"
    }
  });

  // 6. Create Bid
  const bid = await prisma.bid.create({
    data: {
      projectId: project.id,
      freelancerId: freelancer.id,
      amount: 1868,
      proposal: "I will implement a world-class financial dashboard with premium styling, fully custom charts, and robust real-time API integrations.",
      status: "PENDING"
    }
  });

  // 7. Create Proposal
  const proposal = await prisma.proposal.create({
    data: {
      projectId: project.id,
      freelancerId: freelancer.id,
      amount: 1868,
      duration: 30,
      coverLetter: "I will implement a world-class financial dashboard with premium styling, fully custom charts, and robust real-time API integrations.",
      status: "PENDING",
      milestones: [
        {
          title: "Project Milestone",
          amount: 1868
        }
      ]
    }
  });

  console.log("--------------------------------------------------");
  console.log("✅ SUCCESS: Fresh Verified Test Bed Loaded!");
  console.log("--------------------------------------------------");
  console.log("Client login:");
  console.log("Email:    client@test.com");
  console.log("Password: password123");
  console.log("--------------------------------------------------");
  console.log("Freelancer login:");
  console.log("Email:    freelancer@test.com");
  console.log("Password: password123");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
