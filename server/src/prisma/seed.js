import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.payment.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding data...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const client = await prisma.user.create({
    data: {
      name: 'Test Client',
      email: 'client@test.com',
      password: hashedPassword,
      role: 'CLIENT',
      walletBalance: 5000
    }
  });

  const freelancer = await prisma.user.create({
    data: {
      name: 'John Freelancer',
      email: 'freelancer@test.com',
      password: hashedPassword,
      role: 'FREELANCER',
      walletBalance: 100
    }
  });

  // 1.5 Verify Users (KYC)
  await prisma.kYC.create({
    data: {
      userId: client.id,
      documentType: 'PASSPORT',
      documentUrl: 'https://example.com/doc.pdf',
      status: 'APPROVED',
      verifiedAt: new Date()
    }
  });

  await prisma.kYC.create({
    data: {
      userId: freelancer.id,
      documentType: 'PASSPORT',
      documentUrl: 'https://example.com/doc.pdf',
      status: 'APPROVED',
      verifiedAt: new Date()
    }
  });

  // 2. Create Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Build a Modern Portfolio',
      description: 'Need a high-end portfolio website with animations and glassmorphism design.',
      budget: 1500,
      category: 'Web Development',
      clientId: client.id,
      status: 'OPEN'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Mobile App UI Design',
      description: 'Looking for a clean, minimalist UI design for a fitness tracking application.',
      budget: 800,
      category: 'Design',
      clientId: client.id,
      status: 'OPEN'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Smart Contract Audit',
      description: 'Urgent security audit needed for a new DeFi protocol launching next week.',
      budget: 3000,
      category: 'Blockchain',
      clientId: client.id,
      status: 'OPEN'
    }
  });

  // 3. Create a starting Proposal
  await prisma.proposal.create({
    data: {
      projectId: project1.id,
      freelancerId: freelancer.id,
      amount: 1450,
      duration: 14,
      coverLetter: 'I have 5 years of experience in React and GSAP. I can build your portfolio to look premium and high-end.',
      status: 'PENDING'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
