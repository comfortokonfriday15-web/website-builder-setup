import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { leadId, type, note } = req.body || {};

    if (!leadId || !type) {
      return res.status(400).json({ error: "leadId and type required" });
    }

    const validTypes = ["concept-requested", "concept-delivered", "call-booked", "testimonial", "won"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "invalid type: " + validTypes.join(", ") });
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      INSERT INTO "LeadEvent" ("leadId", "type", "note", "createdAt")
      VALUES (${leadId}, ${type}, ${note || null}, NOW())
      RETURNING id, "leadId", type, note, "createdAt"
    `;

    if (type === "won") {
      await sql`UPDATE "Lead" SET status = 'won' WHERE id = ${leadId}`;
    }

    res.status(201).json({ event: result[0] });
  } catch (err: any) {
    console.error("Log event error:", err);
    res.status(500).json({ error: err.message });
  }
}
