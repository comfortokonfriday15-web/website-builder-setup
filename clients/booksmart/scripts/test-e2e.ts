import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { fetchLeadsFromSheet } from "../src/lib/sheets.js";
import { sendEmail, baseHtml } from "../src/lib/email.js";

const prisma = new PrismaClient();

async function main() {
  console.log("=== E2E TEST ===\n");

  // 1. Fetch leads from sheet
  console.log("1. Fetching leads from Google Sheet...");
  const leads = await fetchLeadsFromSheet();
  console.log(`   Found ${leads.length} leads`);
  if (leads.length === 0) {
    console.log("   No leads found. Make sure your sheet has data.");
    return;
  }
  leads.forEach((l) => console.log(`   - ${l.name} <${l.email}>`));

  // 2. Import into DB
  console.log("\n2. Importing into database...");
  let imported = 0;
  for (const row of leads) {
    const existing = await prisma.lead.findUnique({ where: { email: row.email } });
    if (existing) {
      console.log(`   Skipped ${row.email} (already exists)`);
      continue;
    }
    await prisma.lead.create({
      data: {
        name: row.name,
        email: row.email,
        company: row.company || null,
        phone: row.phone || null,
        notes: row.notes || null,
        source: "google_sheets",
      },
    });
    imported++;
    console.log(`   Imported ${row.email}`);
  }

  // 3. Enroll in sequence
  console.log("\n3. Enrolling in sequence...");
  const sequence = await prisma.sequence.findFirst({
    where: { active: true },
    include: { steps: { orderBy: { stepOrder: "asc" } } },
  });

  if (!sequence) {
    console.log("   No active sequence found. Run seed first.");
    return;
  }
  console.log(`   Using sequence: "${sequence.name}" (${sequence.steps.length} steps)`);

  for (const row of leads) {
    const lead = await prisma.lead.findUnique({ where: { email: row.email } });
    if (!lead) continue;

    const existingEnroll = await prisma.sequenceEnrollment.findUnique({
      where: { leadId_sequenceId: { leadId: lead.id, sequenceId: sequence.id } },
    });
    if (existingEnroll) {
      console.log(`   Already enrolled: ${row.email}`);
      continue;
    }

    await prisma.sequenceEnrollment.create({
      data: {
        leadId: lead.id,
        sequenceId: sequence.id,
        currentStep: 0,
        nextSendAt: new Date(),
      },
    });
    console.log(`   Enrolled: ${row.email}`);
  }

  // 4. Send step 0 email
  console.log("\n4. Sending first email...");
  const enrollments = await prisma.sequenceEnrollment.findMany({
    where: {
      completed: false,
      nextSendAt: { lte: new Date() },
    },
    include: { lead: true, sequence: { include: { steps: { orderBy: { stepOrder: "asc" } } } } },
  });

  let sent = 0;
  for (const enrollment of enrollments) {
    const step = enrollment.sequence.steps[enrollment.currentStep];
    if (!step) continue;

    const lead = enrollment.lead;
    const html = baseHtml(
      step.body.replace(/{{name}}/g, lead.name).replace(/{{company}}/g, lead.company || "your company")
    );

    try {
      await sendEmail(lead.email, step.subject.replace(/{{name}}/g, lead.name), html);
      console.log(`   ✅ Sent step ${step.stepOrder} to ${lead.email}`);

      await prisma.emailEvent.create({
        data: { leadId: lead.id, stepOrder: step.stepOrder, type: "sent", to: lead.email, subject: step.subject },
      });

      const nextStepOrder = step.stepOrder + 1;
      const hasNext = enrollment.sequence.steps.length > nextStepOrder;

      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          currentStep: nextStepOrder,
          completed: !hasNext,
          nextSendAt: hasNext ? new Date(Date.now() + step.delayDays * 24 * 60 * 60 * 1000) : null,
        },
      });
      sent++;
    } catch (err: any) {
      console.log(`   ❌ Failed to send to ${lead.email}: ${err.message}`);
      await prisma.emailEvent.create({
        data: { leadId: lead.id, stepOrder: step.stepOrder, type: "bounced", to: lead.email, subject: step.subject, error: err.message },
      });
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Leads found: ${leads.length}`);
  console.log(`New imports: ${imported}`);
  console.log(`Emails sent: ${sent}`);
  console.log(`Next steps scheduled per their delay settings.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
