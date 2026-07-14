import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../src/lib/insforge.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twentyNineDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

    const [
      { data: leads },
      { data: sentTodayRows },
      { data: sentTotalRows },
      { data: sentLastMonthRows },
      { data: enrollRows },
      { data: sequences },
      { data: leadEvents },
      { data: repliedRows },
    ] = await Promise.all([
      admin.database.from("Lead").select("status"),
      admin.database.from("EmailEvent").select("id").eq("type", "sent").gte("createdAt", today.toISOString()),
      admin.database.from("EmailEvent").select("id").eq("type", "sent"),
      admin.database.from("EmailEvent").select("id").eq("type", "sent").gte("createdAt", thirtyDaysAgo.toISOString()).lt("createdAt", twentyNineDaysAgo.toISOString()),
      admin.database.from("SequenceEnrollment").select("completed"),
      admin.database.from("Sequence").select("id, name, active"),
      admin.database.from("LeadEvent").select("type, value"),
      admin.database.from("Lead").select("id").eq("status", "replied"),
    ]);

    const byStatus: Record<string, number> = {};
    for (const l of (leads ?? []) as { status: string }[]) {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    }
    const totalLeads = (leads ?? []).length;

    const sentToday = (sentTodayRows ?? []).length;
    const sentTotal = (sentTotalRows ?? []).length;
    const sentLastMonth = (sentLastMonthRows ?? []).length;

    const enrollments = (enrollRows ?? []) as { completed: boolean }[];
    const totalEnrolled = enrollments.length;
    const activeEnrolled = enrollments.filter((e) => !e.completed).length;

    const seqData = (sequences ?? []) as { id: string; name: string; active: boolean }[];

    const eventMap: Record<string, { count: number; value: number }> = {};
    for (const e of (leadEvents ?? []) as { type: string; value: number | null }[]) {
      if (!eventMap[e.type]) eventMap[e.type] = { count: 0, value: 0 };
      eventMap[e.type].count++;
      eventMap[e.type].value += e.value ?? 0;
    }

    const positiveReplies = (repliedRows ?? []).length;
    const replyRate = sentTotal > 0 ? (positiveReplies / sentTotal) * 100 : 0;
    const monthAgoReplies = 0;
    const monthAgoRate = sentLastMonth > 0 ? (monthAgoReplies / sentLastMonth) * 100 : 0;
    const replyRateChange = monthAgoRate > 0 ? replyRate - monthAgoRate : 0;

    const campaignHealth = {
      sentToday,
      opens: Math.round(sentToday * 0.48),
      openRate: 48.0,
      replyRate: Math.round(replyRate * 10) / 10,
      bounceRate: totalLeads > 0 ? Math.round(((byStatus.bounced || 0) / totalLeads) * 1000) / 10 : 0,
    };

    const pipelineStages = [
      { id: "qualified", label: "Qualified", count: byStatus.qualified || 0 },
      { id: "contacted", label: "Contacted", count: byStatus.contacted || 0 },
      { id: "replied", label: "Replied", count: byStatus.replied || 0 },
      { id: "concept_requested", label: "Concept Requested", count: eventMap["concept-requested"]?.count || 0 },
      { id: "concept_delivered", label: "Concept Delivered", count: eventMap["concept-delivered"]?.count || 0 },
      { id: "call_booked", label: "Call Booked", count: eventMap["call-booked"]?.count || 0 },
      { id: "won", label: "Won", count: byStatus.won || 0 },
    ];

    const pipelineWithConversion = pipelineStages.map((s, i) => ({
      ...s,
      conversion: i > 0 && pipelineStages[i - 1].count > 0
        ? Math.round((s.count / pipelineStages[i - 1].count) * 100)
        : null,
    }));

    const todayQueue = {
      qualifiedReady: byStatus.qualified ? Math.max(0, byStatus.qualified - (byStatus.contacted || 0)) : 0,
      scheduledToday: Math.min(sentToday, 30),
      remainingCapacity: Math.max(0, 30 - sentToday),
    };

    res.status(200).json({
      northStar: {
        emailsSentToday: { current: sentToday, max: 30 },
        positiveReplies,
        replyRate: Math.round(replyRate * 10) / 10,
        replyRateChange: Math.round(replyRateChange * 10) / 10,
        callsBooked: eventMap["call-booked"]?.count || 0,
      },
      momentum: {
        conceptRequests: eventMap["concept-requested"]?.count || 0,
        conceptsDelivered: eventMap["concept-delivered"]?.count || 0,
        testimonialsReceived: eventMap["testimonial"]?.count || 0,
        pipelineValue: eventMap["won"]?.value || 0,
      },
      pipeline: pipelineWithConversion,
      todayQueue,
      campaignHealth,
      topNiche: null,
      sequences: seqData.map((s) => ({
        id: s.id,
        name: s.name,
        active: s.active,
        steps: 0,
        enrolled: 0,
      })),
      leads: { total: totalLeads, byStatus },
    });
  } catch (err: any) {
    console.error("Stats error:", err);
    res.status(500).json({ error: err.message });
  }
}
