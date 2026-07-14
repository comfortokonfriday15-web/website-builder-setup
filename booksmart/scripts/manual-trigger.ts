import { PrismaClient } from "@prisma/client";
import { sendEmail, baseHtml } from "../src/lib/email.js";
import { sendNtfy } from "../src/lib/ntfy.js";

const DAILY_CAP = 25;
const DELAY_BETWEEN_MS = 35000;

function isPermanentBounce(err: any): boolean {
  const msg = (err?.message || "").toLowerCase();
  return (
    msg.includes("address") ||
    msg.includes("mailbox") ||
    msg.includes("recipient") ||
    msg.includes("user unknown") ||
    msg.includes("does not exist") ||
    msg.includes("invalid")
  );
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [{ count: sentToday }] = await prisma.$queryRaw<
      { count: bigint }[]
    >`SELECT COUNT(*)::int AS count FROM "EmailEvent" WHERE type = 'sent' AND "stepOrder" = 0 AND "createdAt" >= ${today}`;

    const remaining = DAILY_CAP - Number(sentToday);
    console.log(`Sent today: ${Number(sentToday)}, remaining: ${remaining}`);

    if (remaining <= 0) {
      console.log("Daily cap reached. Nothing to send.");
      return;
    }

    const allDue = await prisma.sequenceEnrollment.findMany({
      where: {
        completed: false,
        nextSendAt: { lte: now },
      },
      include: {
        lead: true,
        sequence: {
          include: { steps: { orderBy: { stepOrder: "asc" } } },
        },
      },
    });

    const followUps = allDue.filter((e) => e.currentStep > 0);
    const newLeads = allDue.filter((e) => e.currentStep === 0).slice(0, remaining);
    const enrollments = [...followUps, ...newLeads];

    console.log(`Found ${followUps.length} follow-ups + ${newLeads.length} new leads due`);

    let sent = 0;
    for (const enrollment of enrollments) {
      const step = enrollment.sequence.steps[enrollment.currentStep];

      if (!step) {
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { completed: true },
        });
        continue;
      }

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
          step.subject
            .replace(/{{name}}/g, lead.name)
            .replace(/{{company}}/g, lead.company || "your company"),
          html
        );
        console.log(`Sent step ${step.stepOrder} to ${lead.email}`);

        await prisma.emailEvent.create({
          data: {
            leadId: lead.id,
            stepOrder: step.stepOrder,
            type: "sent",
            to: lead.email,
            subject: step.subject,
          },
        });

        const nextStepOrder = step.stepOrder + 1;
        const hasNext = enrollment.sequence.steps.length > nextStepOrder;
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: {
            currentStep: nextStepOrder,
            completed: !hasNext,
            nextSendAt: hasNext
              ? new Date(Date.now() + step.delayDays * 24 * 60 * 60 * 1000)
              : null,
          },
        });

        sent++;
        if (sent >= remaining) break;
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_MS));
      } catch (err: any) {
        console.error(`Failed to send to ${lead.email}:`, err.message);
        await prisma.emailEvent.create({
          data: {
            leadId: lead.id,
            stepOrder: step.stepOrder,
            type: isPermanentBounce(err) ? "bounced" : "error",
            to: lead.email,
            subject: step.subject,
            error: err.message,
          },
        });
        if (isPermanentBounce(err)) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { status: "bounced" },
          });
          await prisma.sequenceEnrollment.update({
            where: { id: enrollment.id },
            data: { completed: true },
          });
        }
      }
    }

    console.log(`Sent ${sent} emails this run`);

    await sendNtfy({
      title: "BookSmart",
      message: `Manual trigger — ${sent} sent today (${Number(sentToday)}/${DAILY_CAP} cap used)`,
      tags: ["envelope"],
    });

    console.log("Done.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
