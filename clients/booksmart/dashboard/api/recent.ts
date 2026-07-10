import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const [emailEvents, leadEvents] = await Promise.all([
      sql`
        SELECT ee.id, l.name AS lead_name, l.email AS lead_email,
          ee.type, ee.subject, ee."stepOrder", ee."createdAt",
          'email' AS kind
        FROM "EmailEvent" ee
        JOIN "Lead" l ON l.id = ee."leadId"
        ORDER BY ee."createdAt" DESC
        LIMIT 50
      `,
      sql`
        SELECT le.id, l.name AS lead_name, l.email AS lead_email,
          le.type, NULL AS subject, NULL AS "stepOrder", le."createdAt",
          'lead' AS kind, le.note
        FROM "LeadEvent" le
        JOIN "Lead" l ON l.id = le."leadId"
        ORDER BY le."createdAt" DESC
        LIMIT 20
      `,
    ]);

    const merged = [...emailEvents, ...leadEvents]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    res.status(200).json({ events: merged });
  } catch (err: any) {
    console.error("Recent error:", err);
    res.status(500).json({ error: err.message });
  }
}
