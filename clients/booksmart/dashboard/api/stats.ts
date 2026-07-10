import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const [leadResult, statusResult, enrollmentResult, emailResult] = await Promise.all([
      sql`SELECT COUNT(*)::int AS total FROM "Lead"`,
      sql`SELECT status, COUNT(*)::int AS count FROM "Lead" GROUP BY status`,
      sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE NOT completed)::int AS active FROM "SequenceEnrollment"`,
      sql`SELECT
        COUNT(*) FILTER (WHERE type = 'sent' AND "createdAt" >= NOW() - INTERVAL '1 day')::int AS sent_today,
        COUNT(*) FILTER (WHERE type = 'sent')::int AS total_sent
      FROM "EmailEvent"`,
    ]);

    const sequences = await sql`
      SELECT s.id, s.name, s.active,
        COUNT(DISTINCT ss.id)::int AS steps,
        COUNT(DISTINCT se.id)::int AS enrolled
      FROM "Sequence" s
      LEFT JOIN "SequenceStep" ss ON ss."sequenceId" = s.id
      LEFT JOIN "SequenceEnrollment" se ON se."sequenceId" = s.id
      GROUP BY s.id, s.name, s.active
      ORDER BY s."createdAt" ASC
    `;

    const leads = leadResult[0] as { total: number };
    const statuses = statusResult as { status: string; count: number }[];
    const enrollments = enrollmentResult[0] as { total: number; active: number };
    const emails = emailResult[0] as { sent_today: number; total_sent: number };

    res.status(200).json({
      leads: {
        total: leads.total,
        byStatus: Object.fromEntries(statuses.map((s: any) => [s.status, s.count])),
      },
      enrollments: {
        total: enrollments.total,
        active: enrollments.active,
      },
      emails: {
        sentToday: emails.sent_today,
        totalSent: emails.total_sent,
      },
      sequences: sequences.map((s: any) => ({
        id: s.id,
        name: s.name,
        active: s.active,
        steps: s.steps,
        enrolled: s.enrolled,
      })),
    });
  } catch (err: any) {
    console.error("Stats error:", err);
    res.status(500).json({ error: err.message });
  }
}
