import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../src/lib/insforge.js";

const VALID_TYPES = ["concept-requested", "concept-delivered", "call-booked", "testimonial", "won"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { leadId, type, note } = req.body || {};

    if (!leadId || !type) {
      return res.status(400).json({ error: "leadId and type required" });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: `invalid type. valid: ${VALID_TYPES.join(", ")}` });
    }

    const { data: event } = await admin.database
      .from("LeadEvent")
      .insert([{ leadId, type, note: note || null }])
      .select()
      .single();

    if (type === "won") {
      await admin.database
        .from("Lead")
        .update({ status: "won" })
        .eq("id", leadId);
    }

    res.status(201).json({ event });
  } catch (err: any) {
    console.error("Log event error:", err);
    res.status(500).json({ error: err.message });
  }
}
