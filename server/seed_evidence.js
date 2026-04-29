import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const disputes = await prisma.dispute.findMany();

  if (disputes.length === 0) {
    console.log("No disputes found to attach evidence to!");
    return;
  }

  const evidenceTemplates = [
    { name: "Final_Architecture_V2.pdf", url: "uploads/evidence/arch_v2.pdf" },
    { name: "Communication_Logs_Week3.png", url: "uploads/evidence/logs.png" },
    { name: "Git_Commit_History.pdf", url: "uploads/evidence/git_history.pdf" },
    { name: "API_Documentation_Draft.pdf", url: "uploads/evidence/api_draft.pdf" }
  ];

  console.log(`Attaching evidence to ${disputes.length} disputes...`);

  for (const dispute of disputes) {
    // Attach 2 pieces of evidence to each dispute
    for (let i = 0; i < 2; i++) {
      const template = evidenceTemplates[(Math.floor(Math.random() * evidenceTemplates.length))];
      await prisma.evidence.create({
        data: {
          disputeId: dispute.id,
          uploadedById: dispute.raisedById, // Default to the person who raised it for testing
          fileName: template.name,
          fileUrl: template.url
        }
      });
    }
    console.log(`[EVIDENCE LOGGED] Attached proof to Case #${dispute.id.slice(0, 8).toUpperCase()}`);
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
