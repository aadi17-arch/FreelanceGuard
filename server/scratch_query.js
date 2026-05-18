import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("=== USERS ===");
  console.log(users.map(u => ({ id: u.id, name: u.name, walletBalance: u.walletBalance, heldAmount: u.heldAmount })));

  const contracts = await prisma.contract.findMany({
    include: { milestones: true }
  });
  console.log("=== CONTRACTS & MILESTONES ===");
  console.log(JSON.stringify(contracts, null, 2));
}

main().finally(() => prisma.$disconnect());
