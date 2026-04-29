import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'client@gmail.com';
  const password = 'client1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or Find the Client
  const client = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Global Ventures Client',
      role: 'CLIENT',
    },
  });

  console.log(`User created/found: ${client.email}`);

  // 2. Project Data
  const projects = [
    {
      title: "AI Video Generation Tool",
      description: "Building a high-performance generative AI tool for automated video editing and dynamic scene generation using stable diffusion.",
      budget: 15000,
      status: "OPEN"
    },
    {
      title: "Sustainable E-commerce Rebrand",
      description: "Full UI/UX overhaul and platform migration for a leading eco-friendly marketplace focusing on zero-waste logistics.",
      budget: 4500,
      status: "OPEN"
    },
    {
      title: "Real-time Trading Dashboard",
      description: "Developing a low-latency financial dashboard for stock and crypto analysis with real-time websocket integration.",
      budget: 12000,
      status: "OPEN"
    },
    {
      title: "Decentralized Portfolio App",
      description: "Web3 portfolio tracker that aggregates multi-chain assets and provides risk assessment analytics for DAO members.",
      budget: 3000,
      status: "OPEN"
    },
    {
      title: "Smart City IoT Monitor",
      description: "End-to-end data visualization platform for urban IoT sensors monitoring air quality and traffic flow in real-time.",
      budget: 25000,
      status: "OPEN"
    }
  ];

  // 3. Insert Projects
  for (const p of projects) {
    const created = await prisma.project.create({
      data: {
        ...p,
        clientId: client.id
      }
    });
    console.log(`Project Created: ${created.title} ($${created.budget})`);
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
