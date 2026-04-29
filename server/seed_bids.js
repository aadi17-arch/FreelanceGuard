import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@gmail.com';
  const password = 'test1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or Find the Freelancer
  const freelancer = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Test Freelancer',
      role: 'FREELANCER',
    },
  });

  console.log(`Freelancer created/found: ${freelancer.email}`);

  // 2. Fetch all Projects
  const projects = await prisma.project.findMany();
  
  if (projects.length === 0) {
    console.log("No projects found to bid on!");
    return;
  }

  // 3. Generate Bids
  const messages = [
    "I have extensive experience in this field and can deliver a high-quality solution within your timeframe.",
    "This project aligns perfectly with my skill set. I've built similar systems before and can guarantee security.",
    "I'm very interested in this opportunity. Let's discuss the milestones and get started!",
    "Expert level developer here. I can ensure the best performance and maintainable code for this project.",
    "I've reviewed your requirements and I'm confident I can exceed your expectations."
  ];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    
    // Bid slightly around the budget
    const bidAmount = p.budget - (Math.random() * 500);

    const createdBid = await prisma.bid.create({
      data: {
        amount: Math.floor(bidAmount),
        proposal: messages[i % messages.length],
        projectId: p.id,
        freelancerId: freelancer.id,
        status: "PENDING"
      }
    });
    
    console.log(`Bid placed on "${p.title}": $${createdBid.amount}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
