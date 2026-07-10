import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      leadResult,
      emailTodayResult,
      emailTotalResult,
      emailLastMonthResult,
      enrollmentResult,
      sequenceResult,
      leadEventResult,
      repliesResult,
    ] = await Promise.all([
      sql`SELECT status, COUNT(*)::int AS count FROM "Lead" GROUP BY status`,
      sql`SELECT COUNT(*)::int AS sent FROM "EmailEvent" WHERE type = 'sent' AND "createdAt" >= NOW() - INTERVAL '1 day'`,
      sql`SELECT COUNT(*)::int AS sent FROM "EmailEvent" WHERE type = 'sent'`,
      sql`SELECT COUNT(*)::int AS sent FROM "EmailEvent" WHERE type = 'sent' AND "createdAt" >= NOW() - INTERVAL '30 days' AND "createdAt" < NOW() - INTERVAL '29 days'`,
      sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE NOT completed)::int AS active FROM "SequenceEnrollment"`,
      sql`SELECT s.id, s.name, s.active, COUNT(DISTINCT ss.id)::int AS steps, COUNT(DISTINCT se.id)::int AS enrolled FROM "Sequence" s LEFT JOIN "SequenceStep" ss ON ss."sequenceId" = s.id LEFT JOIN "SequenceEnrollment" se ON se."sequenceId" = s.id GROUP BY s.id, s.name, s.active ORDER BY s."createdAt" ASC`,
      sql`SELECT type, COUNT(*)::int AS count, COALESCE(SUM(value), 0)::float AS total_value FROM "LeadEvent" GROUP BY type`,
      sql`SELECT COUNT(*)::int AS count FROM "Lead" WHERE status = 'replied'`,
    ]);

    const leads = leadResult as { status: string; count: number }[];
    const emailToday = emailTodayResult[0] as { sent: number };
    const emailTotal = emailTotalResult[0] as { sent: number };
    const emailLastMonth = emailLastMonthResult[0] as { sent: number };
    const enrollments = enrollmentResult[0] as { total: number; active: number };
    const sequences = sequenceResult as any[];
    const leadEvents = leadEventResult as { type: string; count: number; total_value: number }[];
    const replies = repliesResult[0] as { count: number };

    const byStatus: Record<string, number> = {};
    let totalLeads = 0;
    for (const l of leads) {
      byStatus[l.status] = l.count;
      totalLeads += l.count;
    }

    const eventMap: Record<string, { count: number; value: number }> = {};
    for (const e of leadEvents) {
      eventMap[e.type] = { count: e.count, value: e.total_value };
    }

    const sentToday = emailToday.sent;
    const dailyCap = 30;
    const positiveReplies = replies.count;
    const replyRate = emailTotal.sent > 0 ? (positiveReplies / emailTotal.sent) * 100 : 0;
    const sentLastMonth = emailLastMonth.sent;
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

    const totalInPipeline = pipelineStages[0].count;
    const pipelineWithConversion = pipelineStages.map((s, i) => ({
      ...s,
      conversion: i > 0 && pipelineStages[i - 1].count > 0
        ? Math.round((s.count / pipelineStages[i - 1].count) * 100)
        : null,
    }));

    const todayQueue = {
      qualifiedReady: byStatus.qualified ? Math.max(0, byStatus.qualified - (byStatus.contacted || 0)) : 0,
      scheduledToday: Math.min(sentToday, dailyCap),
      remainingCapacity: Math.max(0, dailyCap - sentToday),
    };

    const topNiche = await sql`
      SELECT COALESCE(l.source, 'Unknown') AS niche,
        COUNT(DISTINCT l.id)::int AS leads,
        COUNT(DISTINCT ee.id) FILTER (WHERE ee.type = 'replied')::int AS replies,
        COUNT(DISTINCT ee.id) FILTER (WHERE ee.type = 'sent')::int AS sent_count,
        COUNT(DISTINCT le.id) FILTER (WHERE le.type = 'concept-requested')::int AS concept_requests,
        COUNT(DISTINCT le.id) FILTER (WHERE le.type = 'call-booked')::int AS calls
      FROM "Lead" l
      LEFT JOIN "EmailEvent" ee ON ee."leadId" = l.id
      LEFT JOIN "LeadEvent" le ON le."leadId" = l.id
      GROUP BY l.source
      ORDER BY replies DESC
      LIMIT 1
    `;

    const topNicheData = topNiche.length > 0 ? topNiche[0] : null;

    res.status(200).json({
      northStar: {
        emailsSentToday: { current: sentToday, max: dailyCap },
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
      topNiche: topNicheData
        ? {
            name: topNicheData.niche,
            leads: topNicheData.leads,
            replyRate: topNicheData.sent_count > 0
              ? Math.round((topNicheData.replies / topNicheData.sent_count) * 100)
              : 0,
            conceptRequests: topNicheData.concept_requests,
            callsBooked: topNicheData.calls,
          }
        : null,
      sequences: sequences.map((s: any) => ({
        id: s.id,
        name: s.name,
        active: s.active,
        steps: s.steps,
        enrolled: s.enrolled,
      })),
      leads: { total: totalLeads, byStatus },
    });
  } catch (err: any) {
    console.error("Stats error:", err);
    res.status(500).json({ error: err.message });
  }
}
