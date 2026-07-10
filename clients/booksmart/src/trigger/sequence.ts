import { schedules } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";
import { sendEmail, baseHtml } from "../lib/email.js";

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

export const processSequence = schedules.task({
  id: "process-sequence",
  cron: "0 8 * * *",
  run: async () => {
    const prisma = new PrismaClient();
    try {
      console.log("Processing sequence enrollments...");

      const enrollments = await prisma.sequenceEnrollment.findMany({
        where: {
          completed: false,
          nextSendAt: { lte: new Date() },
        },
        include: {
          lead: true,
          sequence: {
            include: { steps: { orderBy: { stepOrder: "asc" } } },
          },
        },
      });

      console.log(`Found ${enrollments.length} enrollments due`);

      let sent = 0;
      for (const enrollment of enrollments) {
        const step = enrollment.sequence.steps[enrollment.currentStep];

        if (!step) {
          console.warn(`Enrollment ${enrollment.id} at step ${enrollment.currentStep} but sequence has no step — marking complete`);
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
        );

        try {
          await sendEmail(lead.email, step.subject.replace(/{{name}}/g, lead.name), html);
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

      console.log(`Sent ${sent} emails`);
      return { processed: enrollments.length, sent };
    } finally {
      await prisma.$disconnect();
    }
  },
});
