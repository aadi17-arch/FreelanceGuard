import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function runTest() {
  console.log("--------------------------------------------------");
  console.log("🧪 STARTING DISPUTE INTEGRATION FLOW TEST...");
  console.log("--------------------------------------------------");

  // 1. Fetch our seeded test accounts
  const client = await prisma.user.findFirst({ where: { email: "c@t.com" } });
  const freelancer = await prisma.user.findFirst({ where: { email: "f@t.com" } });
  const admin = await prisma.user.findFirst({ where: { email: "a@t.com" } });

  if (!client || !freelancer || !admin) {
    throw new Error("Seeded accounts not found! Run clean-all.js first.");
  }
  console.log(`Verified seeding: Client (${client.name}), Freelancer (${freelancer.name}), Admin (${admin.name})`);

  // 2. Create a test project
  console.log("\n1. Creating test project...");
  const project = await prisma.project.create({
    data: {
      clientId: client.id,
      title: "Dispute Sync Test Project",
      description: "Testing automated resolution tracking and milestone updates.",
      budget: 3000,
      category: "Development",
      status: "OPEN"
    }
  });
  console.log(`Created Project: "${project.title}" (ID: ${project.id})`);

  // 3. Create a proposal/bid
  console.log("\n2. Freelancer bidding on project...");
  const proposal = await prisma.proposal.create({
    data: {
      projectId: project.id,
      freelancerId: freelancer.id,
      amount: 3000,
      status: "PENDING",
      duration: 7,
      coverLetter: "This is my cover letter details."
    }
  });
  console.log(`Submitted proposal (ID: ${proposal.id})`);

  // 4. Accept proposal & create contract
  console.log("\n3. Client accepting proposal & funding escrow...");
  const contract = await prisma.contract.create({
    data: {
      projectId: project.id,
      freelancerId: freelancer.id,
      totalAmount: 3000,
      status: "ACTIVE"
    }
  });

  // Create active milestone
  const milestone = await prisma.milestone.create({
    data: {
      contractId: contract.id,
      title: "Core API Integration",
      description: "Complete fully synced database endpoints.",
      amount: 3000,
      status: "PENDING",
      dueDate: new Date()
    }
  });

  // Update user balances to simulate escrow locking
  await prisma.user.update({
    where: { id: client.id },
    data: {
      walletBalance: { decrement: 3000 },
      heldAmount: { increment: 3000 }
    }
  });
  await prisma.contract.update({
    where: { id: contract.id },
    data: { heldAmount: 3000 }
  });

  console.log(`Created contract (ID: ${contract.id}) & funded milestone "${milestone.title}" (ID: ${milestone.id}) for $${milestone.amount}`);

  // 5. Freelancer submits work
  console.log("\n4. Freelancer submitting work deliverable...");
  const updatedMilestoneSubmitted = await prisma.milestone.update({
    where: { id: milestone.id },
    data: {
      status: "SUBMITTED",
      submissionNote: "Finished all endpoints and verified resolving sync."
    }
  });
  console.log(`Milestone status updated to: ${updatedMilestoneSubmitted.status}`);

  // 6. Client disputes the work
  console.log("\n5. Client disputing work...");
  const updatedMilestoneDisputed = await prisma.milestone.update({
    where: { id: milestone.id },
    data: { status: "DISPUTED" }
  });

  const dispute = await prisma.dispute.create({
    data: {
      milestoneId: milestone.id,
      raisedById: client.id,
      reason: "API has latency under heavy loads.",
      status: "OPEN"
    }
  });
  console.log(`Dispute raised! Status: ${dispute.status} (ID: ${dispute.id})`);

  // 7. Admin resolves the dispute (let's refund to client as a test case)
  console.log("\n6. Admin resolving the dispute (Verdict: REFUNDED to client)...");
  
  // Start resolution transaction simulating Admin resolving
  await prisma.$transaction(async (tx) => {
    // A. Update dispute state
    await tx.dispute.update({
      where: { id: dispute.id },
      data: {
        status: "RESOLVED",
        resolution: "Admin resolved dispute : Funds refunded to client."
      }
    });

    // B. Update milestone status
    await tx.milestone.update({
      where: { id: milestone.id },
      data: { status: "RESOLVED" }
    });

    // C. Refund funds from escrow back to client's wallet balance
    await tx.user.update({
      where: { id: client.id },
      data: {
        walletBalance: { increment: 3000 },
        heldAmount: { decrement: 3000 }
      }
    });

    // D. Decrement contract heldAmount
    await tx.contract.update({
      where: { id: contract.id },
      data: { heldAmount: { decrement: 3000 } }
    });

    // E. Create payment ledger record
    await tx.payment.create({
      data: {
        contractId: contract.id,
        milestoneId: milestone.id,
        amount: 3000,
        type: "REFUND"
      }
    });
  });

  console.log("Dispute successfully resolved by Admin transaction!");

  // 8. Fetch and verify final outcome state
  console.log("\n7. VERIFYING DIMS / STATUS STATES IN DATABASE...");
  
  const finalMilestone = await prisma.milestone.findUnique({
    where: { id: milestone.id },
    include: { disputes: true }
  });

  const finalClient = await prisma.user.findUnique({ where: { id: client.id } });
  const finalContract = await prisma.contract.findUnique({ where: { id: contract.id } });

  console.log("--------------------------------------------------");
  console.log(`Milestone Status:    ${finalMilestone.status} (Expected: RESOLVED)`);
  console.log(`Dispute Status:      ${finalMilestone.disputes[0].status} (Expected: RESOLVED)`);
  console.log(`Dispute Verdict:     "${finalMilestone.disputes[0].resolution}"`);
  console.log(`Client heldAmount:   $${finalClient.heldAmount} (Expected: 0)`);
  console.log(`Contract heldAmount: $${finalContract.heldAmount} (Expected: 0)`);
  
  if (finalMilestone.status === "RESOLVED" && finalMilestone.disputes[0].status === "RESOLVED") {
    console.log("🚀 STATUS ASSERTION PASSED PERFECTLY!");
  } else {
    throw new Error("Flow verification failed: unexpected status values.");
  }
  console.log("--------------------------------------------------");
}

runTest()
  .catch((e) => {
    console.error("❌ TEST FAILED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
