import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const recent = await sql`
      SELECT
        ee.id,
        l.name AS lead_name,
        l.email AS lead_email,
        ee.type,
        ee.subject,
        ee."stepOrder",
        ee."createdAt"
      FROM "EmailEvent" ee
      JOIN "Lead" l ON l.id = ee."leadId"
      ORDER BY ee."createdAt" DESC
      LIMIT 50
    `;

    res.status(200).json({ events: recent });
  } catch (err: any) {
    console.error("Recent error:", err);
    res.status(500).json({ error: err.message });
  }
}
