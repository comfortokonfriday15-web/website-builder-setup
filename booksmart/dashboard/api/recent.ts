import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../src/lib/insforge.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { data: emailEvents } = await admin.database
      .from("EmailEvent")
      .select("id, leadId, type, subject, stepOrder, createdAt")
      .order("createdAt", { ascending: false })
      .limit(50);

    const { data: leadEvents } = await admin.database
      .from("LeadEvent")
      .select("id, leadId, type, note, createdAt")
      .order("createdAt", { ascending: false })
      .limit(20);

    const leadIds = new Set<string>();
    for (const e of [...(emailEvents ?? []), ...(leadEvents ?? [])] as any[]) {
      leadIds.add(e.leadId);
    }

    const { data: leads } = await admin.database
      .from("Lead")
      .select("id, name, email")
      .in("id", [...leadIds]);

    const leadMap = new Map<string, { name: string; email: string }>();
    for (const l of (leads ?? []) as { id: string; name: string; email: string }[]) {
      leadMap.set(l.id, l);
    }

    const merged: any[] = [];
    for (const ee of (emailEvents ?? []) as any[]) {
      const lead = leadMap.get(ee.leadId);
      merged.push({
        id: ee.id,
        lead_name: lead?.name ?? "Unknown",
        lead_email: lead?.email ?? "",
        type: ee.type,
        subject: ee.subject,
        stepOrder: ee.stepOrder,
        createdAt: ee.createdAt,
        kind: "email",
      });
    }
    for (const le of (leadEvents ?? []) as any[]) {
      const lead = leadMap.get(le.leadId);
      merged.push({
        id: le.id,
        lead_name: lead?.name ?? "Unknown",
        lead_email: lead?.email ?? "",
        type: le.type,
        subject: null,
        stepOrder: null,
        createdAt: le.createdAt,
        kind: "lead",
        note: le.note,
      });
    }

    merged.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const events = merged.slice(0, 50);

    res.status(200).json({ events });
  } catch (err: any) {
    console.error("Recent error:", err);
    res.status(500).json({ error: err.message });
  }
}
