import { PrismaClient } from "@prisma/client";
import { fetchLeadsFromSheet } from "../src/lib/sheets.js";

const prisma = new PrismaClient();

const FIRST_RUN_AT = new Date("2026-07-12T19:00:00.000Z");
const SECOND_RUN_AT = new Date("2026-07-13T07:00:00.000Z");

async function main() {
  console.log("Fetching leads from Google Sheet...");
  const leads = await fetchLeadsFromSheet();
  console.log(`Found ${leads.length} leads in sheet`);

  const activeSequence = await prisma.sequence.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });

  if (!activeSequence) {
    console.error("No active sequence found!");
    return;
  }

  console.log(`Using sequence: ${activeSequence.id}`);

  let imported = 0;
  for (const row of leads) {
    try {
      if (!row.email) continue;

      const lead = await prisma.lead.upsert({
        where: { email: row.email },
        update: {
          name: row.name,
          company: row.company || null,
          phone: row.phone || null,
          notes: row.notes || null,
          rating: row.rating || null,
          reviewCount: row.reviewCount || null,
          source: "google_sheets",
        },
        create: {
          name: row.name,
          email: row.email,
          company: row.company || null,
          phone: row.phone || null,
          notes: row.notes || null,
          rating: row.rating || null,
          reviewCount: row.reviewCount || null,
          source: "google_sheets",
        },
      });

      const existing = await prisma.sequenceEnrollment.findUnique({
        where: {
          leadId_sequenceId: {
            leadId: lead.id,
            sequenceId: activeSequence.id,
          },
        },
      });

      if (!existing) {
        await prisma.sequenceEnrollment.create({
          data: {
            leadId: lead.id,
            sequenceId: activeSequence.id,
            currentStep: 0,
          },
        });
      }

      imported++;
    } catch (err: any) {
      console.error(`Failed to process lead ${row.email}:`, err.message);
    }
  }

  console.log(`Imported/updated ${imported} leads`);

  // Set enrollment times: first 25 to Sunday, rest to Monday
  const enrollments = await prisma.sequenceEnrollment.findMany({
    where: {
      completed: false,
      currentStep: 0,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${enrollments.length} step 0 enrollments`);

  const batch1 = enrollments.slice(0, 25);
  const batch2 = enrollments.slice(25);

  for (const e of batch1) {
    await prisma.sequenceEnrollment.update({
      where: { id: e.id },
      data: { nextSendAt: FIRST_RUN_AT },
    });
  }
  console.log(`Set ${batch1.length} enrollments to Sunday 8pm WAT`);

  for (const e of batch2) {
    await prisma.sequenceEnrollment.update({
      where: { id: e.id },
      data: { nextSendAt: SECOND_RUN_AT },
    });
  }
  console.log(`Set ${batch2.length} enrollments to Monday 8am WAT`);

  console.log("\nAll done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
