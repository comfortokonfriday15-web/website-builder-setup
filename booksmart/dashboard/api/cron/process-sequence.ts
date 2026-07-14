import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendEmail, baseHtml } from "../../src/lib/email.js";
import { sendNtfy } from "../../src/lib/ntfy.js";

const DAILY_CAP = 25;
const FIRST_RUN_AT = new Date("2026-07-12T19:00:00.000Z");

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

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const now = new Date();
    if (now < FIRST_RUN_AT) {
      return res.status(200).json({ skipped: true, reason: "before_first_run" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: sentRows } = await admin.database
      .from("EmailEvent")
      .select("id")
      .eq("type", "sent")
      .gte("createdAt", today.toISOString());

    const sentToday = (sentRows as any[] | null)?.length ?? 0;
    const remaining = DAILY_CAP - sentToday;

    if (remaining <= 0) {
      return res.status(200).json({ skipped: true, reason: "daily_cap_reached", sentToday });
    }

    const { data: firstDue } = await admin.database
      .from("SequenceEnrollment")
      .select("id, leadId, currentStep, sequenceId")
      .eq("completed", false)
      .or("nextSendAt.lte." + now.toISOString() + ",nextSendAt.is.null")
      .order("nextSendAt", { ascending: true, nullsFirst: true })
      .limit(1);

    if (!firstDue || (firstDue as any[]).length === 0) {
      return res.status(200).json({ processed: 0 });
    }

    const enrollment = (firstDue as any[])[0];

    const [stepsResult, leadResult] = await Promise.all([
      admin.database
        .from("SequenceStep")
        .select("id, stepOrder, delayDays, subject, body")
        .eq("sequenceId", enrollment.sequenceId)
        .order("stepOrder", { ascending: true }),
      admin.database
        .from("Lead")
        .select("id, name, email, company, reviewCount, rating, status")
        .eq("id", enrollment.leadId)
        .single(),
    ]);

    const steps = (stepsResult.data ?? []) as any[];
    const step = steps[enrollment.currentStep];
    const lead = leadResult.data as any;

    if (!step || !lead) {
      if (!lead) {
        await admin.database
          .from("SequenceEnrollment")
          .update({ completed: true })
          .eq("id", enrollment.id);
      }
      return res.status(200).json({ skipped: true, reason: "no_step_or_lead" });
    }

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

      await admin.database.from("EmailEvent").insert([{
        leadId: lead.id,
        stepOrder: step.stepOrder,
        type: "sent",
        to: lead.email,
        subject: step.subject,
      }]);

      const nextStepIndex = step.stepOrder + 1;
      const hasNext = steps.length > nextStepIndex;
      const nextDelayMs = hasNext ? steps[nextStepIndex].delayDays * 24 * 60 * 60 * 1000 : 0;

      await admin.database
        .from("SequenceEnrollment")
        .update({
          currentStep: nextStepIndex,
          completed: !hasNext,
          nextSendAt: hasNext
            ? new Date(Date.now() + nextDelayMs).toISOString()
            : null,
        })
        .eq("id", enrollment.id);

      res.status(200).json({ sent: true, to: lead.email, step: step.stepOrder, capUsed: sentToday + 1 });
    } catch (err: any) {
      await admin.database.from("EmailEvent").insert([{
        leadId: lead.id,
        stepOrder: step.stepOrder,
        type: isPermanentBounce(err) ? "bounced" : "error",
        to: lead.email,
        subject: step.subject,
        error: err.message,
      }]);

      if (isPermanentBounce(err)) {
        await admin.database
          .from("Lead")
          .update({ status: "bounced" })
          .eq("id", lead.id);
        await admin.database
          .from("SequenceEnrollment")
          .update({ completed: true })
          .eq("id", enrollment.id);
      }

      res.status(200).json({ error: err.message, bounced: isPermanentBounce(err) });
    }
  } catch (err: any) {
    console.error("process-sequence error:", err);
    res.status(500).json({ error: err.message });
  }
}
