import { admin } from "../../src/lib/insforge.js";
import { sendEmail, baseHtml } from "../../src/lib/email.js";
import { sendNtfy } from "../../src/lib/ntfy.js";
import { hasMxRecord } from "../../src/lib/email-utils.js";
import { withRunLog } from "../../src/lib/withRunLog.js";

const DAILY_CAP = 25;
const BATCH_SIZE = 1;
const TEST_EMAIL = process.env.TEST_EMAIL;

function isPermanentBounce(err: any): boolean {
  const msg = (err?.message || "").toLowerCase();
  return (
    msg.includes("user unknown") ||
    msg.includes("does not exist") ||
    msg.includes("mailbox not found") ||
    msg.includes("no such user") ||
    msg.includes("invalid recipient")
  );
}

function getUTCHour(): number {
  return new Date().getUTCHours();
}

function isInSession(): boolean {
  const h = getUTCHour();
  return h >= 11 && h < 13; // 11-13 UTC = 6-8am EST
}

async function processOne(): Promise<{ sent: boolean; reason?: string; email?: string; step?: number; error?: string; bounced?: boolean }> {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: sentRows } = await admin.database
    .from("EmailEvent")
    .select("id")
    .eq("type", "sent")
    .eq("stepOrder", 0)
    .gte("createdAt", today.toISOString());

  const sentToday = (sentRows as any[] | null)?.length ?? 0;
  if (sentToday >= DAILY_CAP) {
    return { sent: false, reason: "daily_cap" };
  }

  const { data: firstDue } = await admin.database
    .from("SequenceEnrollment")
    .select("id, leadId, currentStep, sequenceId")
    .eq("completed", false)
    .or("nextSendAt.lte." + now.toISOString() + ",nextSendAt.is.null")
    .order("nextSendAt", { ascending: true, nullsFirst: true })
    .limit(1);

  if (!firstDue || (firstDue as any[]).length === 0) {
    return { sent: false, reason: "none_due" };
  }

  const enrollment = (firstDue as any[])[0];

  const { data: replies } = await admin.database
    .from("EmailEvent")
    .select("id")
    .eq("leadId", enrollment.leadId)
    .eq("type", "replied")
    .limit(1);

  if (replies && (replies as any[]).length > 0) {
    await admin.database
      .from("SequenceEnrollment")
      .update({ completed: true })
      .eq("id", enrollment.id);
    return { sent: false, reason: "lead_replied" };
  }

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
    return { sent: false, reason: "no_step_or_lead" };
  }

  const firstName = lead.name?.split(" ")[0]?.trim() || "there";
  const resolveVars = (text: string) =>
    text
      .replace(/{{name}}/g, lead.name || "")
      .replace(/{{first_name}}/g, firstName)
      .replace(/{{firstname}}/g, firstName)
      .replace(/{{company}}/g, lead.company || "your company")
      .replace(/\{\{\s*Business\s*Name\s*\}\}/gi, lead.company || "your business")
      .replace(/\{\{business_name\}\}/g, lead.company || "your business")
      .replace(/{{review_count}}/g, String(lead.reviewCount ?? ""))
      .replace(/{{rating}}/g, String(lead.rating ?? ""));

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://dashboard-comfortokonfriday15-webs-projects.vercel.app";
  const trackId = `${lead.id}:${step.stepOrder}`;
  const trackingPixelUrl = `${baseUrl}/api/track/open?id=${encodeURIComponent(trackId)}`;
  const html = baseHtml(resolveVars(step.body), trackingPixelUrl);

  const to = TEST_EMAIL || lead.email;
  const hasMx = TEST_EMAIL ? true : await hasMxRecord(to);
  if (!hasMx) {
    await admin.database.from("EmailEvent").insert([{
      leadId: lead.id,
      stepOrder: step.stepOrder,
      type: "bounced",
      to,
      subject: step.subject,
      error: "Domain has no MX records",
    }]);
    await admin.database.from("Lead").update({ status: "bounced" }).eq("id", lead.id);
    await admin.database.from("SequenceEnrollment").update({ completed: true }).eq("id", enrollment.id);
    return { sent: false, reason: "no_mx", email: to };
  }

  try {
    await sendEmail(
      to,
      resolveVars(step.subject),
      html
    );

    await admin.database.from("EmailEvent").insert([{
      leadId: lead.id,
      stepOrder: step.stepOrder,
      type: "sent",
      to: TEST_EMAIL || lead.email,
      subject: step.subject,
    }]);

    sendNtfy({
      title: `Email sent (step ${step.stepOrder})`,
      message: `${TEST_EMAIL ? "[TEST] " : ""}${lead.name} <${lead.email}>`,
      priority: 3,
    });

    const nextStepIndex = step.stepOrder + 1;
    const hasNext = steps.length > nextStepIndex;
    const nextDelayMs = hasNext ? steps[nextStepIndex].delayDays * 24 * 60 * 60 * 1000 : 0;

    if (!TEST_EMAIL) {
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
    }

    return { sent: true, email: lead.email, step: step.stepOrder };
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

    return { sent: false, reason: "error", error: err.message, bounced: isPermanentBounce(err) };
  }
}

export default withRunLog("cron.process-sequence", async (_req, res) => {
  if (!isInSession() && !TEST_EMAIL) {
    res.status(200).json({ skipped: true, reason: "outside_session" });
    return;
  }

  const results = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    const result = await processOne();
    results.push(result);
    if (!result.sent) break;
  }

  res.status(200).json({ batch: results });
});
