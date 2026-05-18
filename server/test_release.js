import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const milestoneId = "0a235408-337e-4b4e-abd2-e37b32116f74"; // Change this to any active milestone ID
  const clientId = "90159f75-9699-44a6-b170-51d050e1b503"; // Test Client ID

  console.log("Fetching milestone...");
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include:{contract:{include:{project:true}}}
  });

  if (!milestone) {
    console.log("Milestone not found.");
    return;
  }

  const freelancerId = milestone.contract.freelancerId;
  const milestoneAmount = milestone.amount;

  console.log("Attempting prisma transaction for release...");
  try {
    const result = await prisma.$transaction(async (tx) => {
      console.log("1. Decrementing client heldAmount...");
      await tx.user.update({
        where: { id: clientId },
        data: {
          heldAmount: {
            decrement: milestoneAmount
          }
        }
      });

      console.log("2. Incrementing freelancer walletBalance...");
      await tx.user.update({
        where: { id: freelancerId },
        data: {
          walletBalance: {
            increment: milestoneAmount
          }
        }
      });

      console.log("3. Decrementing contract heldAmount...");
      await tx.contract.update({
        where: { id: milestone.contractId },
        data: {
          heldAmount: {
            decrement: milestoneAmount
          }
        }
      });

      console.log("4. Setting milestone status to APPROVED...");
      const updatedMilestone = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: "APPROVED"
        }
      });

      console.log("5. Checking if all milestones are approved...");
      const listofMilestone = await tx.milestone.findMany({
        where: { contractId: milestone.contractId },
      });
      const notApprovedMilestone = listofMilestone.filter(
        m => m.id !== milestoneId && m.status !== "APPROVED" && m.status !== "RELEASED"
      );

      if (notApprovedMilestone.length === 0) {
        console.log("All milestones approved, completing contract & project...");
        await tx.contract.update({
          where: { id: milestone.contractId },
          data: { status: "COMPLETED" }
        });
        await tx.project.update({
          where: { id: milestone.contract.projectId },
          data: { status: "COMPLETED" }
        });
      }

      console.log("6. Creating payment release record...");
      await tx.payment.create({
        data: {
          contractId: milestone.contractId,
          milestoneId: milestone.id,
          amount: milestoneAmount,
          type: "RELEASE"
        }
      });

      return updatedMilestone;
    });

    console.log("Transaction succeeded!", result);
  } catch (error) {
    console.error("TRANSACTION FAILED!", error);
  }
}

main().finally(() => prisma.$disconnect());
