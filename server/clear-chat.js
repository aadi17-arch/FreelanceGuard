import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.chatMessage.deleteMany({});
  console.log("All chat messages cleared successfully!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
