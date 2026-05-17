import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Wiping Database ---');
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

  console.log('--- Creating Real World Identities ---');
  const password = await bcrypt.hash('password123', 10);

  // REAL NAMES FOR ACCOUNTS
  const admin = await prisma.user.create({
    data: {
      email: 'admin@freelanceguard.com',
      name: 'Aditya Srivastava',
      password,
      role: 'ADMIN',
      walletBalance: 1000000,
      bio: 'Lead System Administrator & Resolution Specialist'
    }
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@test.com',
      name: 'Alexander Pierce',
      password,
      role: 'CLIENT',
      walletBalance: 75000,
      bio: 'Operations Director at TechFlow Solutions'
    }
  });

  const freelancer = await prisma.user.create({
    data: {
      email: 'dev@test.com',
      name: 'Marcus Thorne',
      password,
      role: 'FREELANCER',
      walletBalance: 4200,
      bio: 'Senior Full Stack Engineer & UI Architect'
    }
  });

  console.log('--- Seeding 50 Professional Projects ---');
  const projectTitles = [
    'Enterprise Cloud Infrastructure Migration', 'Next-Gen Fintech UI/UX Redesign',
    'AI-Powered Logistics Optimizer', 'Global Supply Chain Audit System',
    'Custom ERP Implementation', 'High-Performance E-commerce Engine',
    'Cybersecurity Shield Integration', 'SaaS Platform Analytics Hub',
    'Mobile Banking Core Development', 'Smart Contract Security Audit'
  ];

  for (let i = 1; i <= 50; i++) {
    const isCompleted = i % 10 === 0;
    const isActive = !isCompleted && i % 5 === 0;
    const status = isCompleted ? 'COMPLETED' : (isActive ? 'IN_PROGRESS' : 'OPEN');
    
    const title = `${projectTitles[i % projectTitles.length]} #${i}`;
    
    const project = await prisma.project.create({
      data: {
        title,
        description: `High-density professional execution required for ${title}. We are seeking senior talent with proven expertise in enterprise architecture and rapid delivery.`,
        budget: Math.floor(Math.random() * 8000) + 1500,
        status,
        clientId: client.id,
      }
    });

    if (isActive || isCompleted) {
      const contract = await prisma.contract.create({
        data: {
          projectId: project.id,
          freelancerId: freelancer.id,
          totalAmount: project.budget,
          status: isCompleted ? 'COMPLETED' : 'ACTIVE',
        }
      });

      const milestone = await prisma.milestone.create({
        data: {
          contractId: contract.id,
          title: 'Initial Deliverable & Setup',
          description: 'Environment configuration and phase 1 architectural blueprint.',
          amount: Math.floor(project.budget * 0.3),
          dueDate: new Date(),
          status: isCompleted ? 'APPROVED' : 'IN_PROGRESS'
        }
      });

      if (i <= 8 && isActive) {
        await prisma.dispute.create({
          data: {
            milestoneId: milestone.id,
            raisedById: i % 2 === 0 ? freelancer.id : client.id,
            reason: i % 3 === 0 ? 'Milestone payment delay verification' : 'Technical scope misalignment',
            status: 'OPEN'
          }
        });
      }
    }

    if (i <= 6) {
      const ticket = await prisma.supportTicket.create({
        data: {
          userId: freelancer.id,
          subject: i % 2 === 0 ? 'Enterprise Wallet Synchronization' : 'Identity Verification Escalation',
          category: i % 2 === 0 ? 'PAYMENT' : 'TECHNICAL',
          status: 'OPEN'
        }
      });

      await prisma.supportMessage.create({
        data: {
          ticketId: ticket.id,
          senderId: freelancer.id,
          content: "System synchronization error detected on large transaction release. Please review audit logs."
        }
      });
    }
  }

  console.log('--- SEEDING COMPLETE ---');
  console.log('Admin: Aditya Srivastava (admin@freelanceguard.com)');
  console.log('Client: Alexander Pierce (client@test.com)');
  console.log('Freelancer: Marcus Thorne (dev@test.com)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
