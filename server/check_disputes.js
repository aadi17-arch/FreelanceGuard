import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const disputes = await prisma.dispute.findMany({
    include: {
      milestone: {
        include: {
          contract: {
            include: {
              project: true
            }
          }
        }
      }
    }
  });

  console.log("--- DISPUTE DATA AUDIT ---");
  disputes.forEach(d => {
    console.log(`ID: ${d.id}`);
    console.log(`Reason: ${d.reason}`);
    console.log(`Milestone Amount: ${d.milestone?.amount}`);
    console.log(`Project: ${d.milestone?.contract?.project?.title}`);
    console.log("------------------------");
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
