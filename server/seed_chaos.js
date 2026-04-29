import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Fetch all active contracts with their projects and milestones
  const contracts = await prisma.contract.findMany({
    include: {
      project: true,
      milestones: true
    }
  });

  if (contracts.length === 0) {
    console.log("No active contracts found to dispute!");
    return;
  }

  const reasons = [
    "Work does not meet the specified quality standards for the initial architectural phase.",
    "Milestone submission is incomplete and missing key documentation required for audit.",
    "Unreasonable delay in communication and failure to provide daily status updates.",
    "Scope creep: Requested features are significantly outside the original agreement.",
    "Technical disagreement over the choice of database architecture for the scale phase."
  ];

  console.log(`Found ${contracts.length} contracts. Initiating disputes...`);

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const firstMilestone = contract.milestones[0];

    if (!firstMilestone) {
      console.log(`Skipping contract ${contract.id} - No milestones found.`);
      continue;
    }

    // Alternate between Client and Freelancer as the raiser
    const isClientRaising = i % 2 === 0;
    const raisedById = isClientRaising ? contract.project.clientId : contract.freelancerId;

    // Create the Dispute
    const dispute = await prisma.dispute.create({
      data: {
        milestoneId: firstMilestone.id,
        raisedById: raisedById,
        reason: reasons[i % reasons.length],
        status: "OPEN"
      }
    });

    // Update Milestone Status
    await prisma.milestone.update({
      where: { id: firstMilestone.id },
      data: { status: "DISPUTED" }
    });

    // Update Contract Status
    await prisma.contract.update({
      where: { id: contract.id },
      data: { status: "DISPUTED" }
    });

    const raiserRole = isClientRaising ? "CLIENT" : "FREELANCER";
    console.log(`[DISPUTE RAISED] Case #${dispute.id.slice(0, 8)} | Project: ${contract.project.title} | Raised By: ${raiserRole}`);
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
