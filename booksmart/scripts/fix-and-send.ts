import { PrismaClient } from "@prisma/client";
import { sendEmail, baseHtml } from "../src/lib/email.js";
import { sendNtfy } from "../src/lib/ntfy.js";

const DELAY_BETWEEN_MS = 35000;

async function main() {
  const prisma = new PrismaClient();
  try {
    // 1. Find and delete wrongly sent step 1 emails, reset enrollments
    const step1Events = await prisma.emailEvent.findMany({ where: { type: "sent", stepOrder: 1 } });
    console.log(`Found ${step1Events.length} wrongly sent step 1 events`);

    for (const ev of step1Events) {
      await prisma.emailEvent.delete({ where: { id: ev.id } });

      // Reset enrollment back to step 1 with correct nextSendAt (3 days from step 0 send)
      const step0Event = await prisma.emailEvent.findFirst({
        where: { leadId: ev.leadId, type: "sent", stepOrder: 0 },
        orderBy: { createdAt: "asc" },
      });

      if (step0Event) {
        const threeDaysLater = new Date(step0Event.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
        await prisma.sequenceEnrollment.update({
          where: { leadId_sequenceId: { leadId: ev.leadId, sequenceId: (await prisma.sequenceEnrollment.findFirst({ where: { leadId: ev.leadId } }))!.sequenceId } },
          data: { currentStep: 1, nextSendAt: threeDaysLater },
        });
        console.log(`  Reset ${ev.to}: step 1 scheduled for ${threeDaysLater.toISOString()}`);
      }
    }

    // 2. Fix step 0 delayDays from 0 → 3
    const seq = await prisma.sequence.findFirst({ where: { active: true } });
    if (seq) {
      const step0 = await prisma.sequenceStep.findUnique({
        where: { sequenceId_stepOrder: { sequenceId: seq.id, stepOrder: 0 } },
      });
      if (step0 && step0.delayDays === 0) {
        await prisma.sequenceStep.update({
          where: { id: step0.id },
          data: { delayDays: 3 },
        });
        console.log("Fixed step 0 delayDays: 0 → 3");
      }
    }

    // 3. Send remaining step 0 emails (only new leads, no follow-ups)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [{ count: sentToday }] = await prisma.$queryRaw<
      { count: bigint }[]
    >`SELECT COUNT(*)::int AS count FROM "EmailEvent" WHERE type = 'sent' AND "stepOrder" = 0 AND "createdAt" >= ${today}`;

    const remaining = 25 - Number(sentToday);
    console.log(`\nSent today (step 0): ${Number(sentToday)}, remaining cap: ${remaining}`);

    const dueStep0 = await prisma.sequenceEnrollment.findMany({
      where: { completed: false, currentStep: 0, nextSendAt: { lte: new Date() } },
      include: { lead: true, sequence: { include: { steps: { orderBy: { stepOrder: "asc" } } } } },
      orderBy: { createdAt: "asc" },
      take: remaining,
    });

    console.log(`Sending ${dueStep0.length} step 0 emails (new leads only)...`);

    let sent = 0;
    for (const enrollment of dueStep0) {
      const step = enrollment.sequence.steps[0];
      if (!step) continue;

      const lead = enrollment.lead;
      const html = baseHtml(
        step.body
          .replace(/{{name}}/g, lead.name)
          .replace(/{{company}}/g, lead.company || "your company")
          .replace(/{{review_count}}/g, String(lead.reviewCount ?? ""))
          .replace(/{{rating}}/g, String(lead.rating ?? ""))
      );

      try {
        await sendEmail(
          lead.email,
          step.subject.replace(/{{company}}/g, lead.company || "your company"),
          html
        );
        console.log(`  Sent step 0 to ${lead.email}`);

        await prisma.emailEvent.create({
          data: { leadId: lead.id, stepOrder: 0, type: "sent", to: lead.email, subject: step.subject },
        });

        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { currentStep: 1, nextSendAt: new Date(Date.now() + step.delayDays * 24 * 60 * 60 * 1000) },
        });

        sent++;
        if (sent >= remaining) break;
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_MS));
      } catch (err: any) {
        console.error(`  Failed: ${lead.email} - ${err.message}`);
        await prisma.emailEvent.create({
          data: { leadId: lead.id, stepOrder: 0, type: "error", to: lead.email, subject: step.subject, error: err.message },
        });
      }
    }

    console.log(`\nSent ${sent} emails this run`);

    await sendNtfy({
      title: "BookSmart",
      message: `Manual fix — ${sent} step 0 emails sent (${Number(sentToday) + sent}/25 total today)`,
      tags: ["envelope"],
    });

    // Verify final state
    const due = await prisma.sequenceEnrollment.findMany({
      where: { completed: false, currentStep: 0, nextSendAt: { lte: new Date() } },
    });
    console.log(`\nRemaining due step 0: ${due.length}`);

    const scheduledTomorrow = await prisma.sequenceEnrollment.findMany({
      where: { completed: false, currentStep: 0, nextSendAt: { gt: new Date() } },
    });
    console.log(`Tomorrow batch (step 0, future): ${scheduledTomorrow.length}`);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
