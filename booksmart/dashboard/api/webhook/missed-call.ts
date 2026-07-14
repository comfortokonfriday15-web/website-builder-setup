import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendNtfy } from "../../src/lib/ntfy.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, email, phone, callerNumber, callTime } = req.body ?? {};

    if (!phone && !callerNumber) {
      return res.status(400).json({ error: "phone or callerNumber required" });
    }

    const contactPhone = phone || callerNumber;

    const { data: existingLead } = await admin.database
      .from("Lead")
      .select("id")
      .eq("phone", contactPhone)
      .maybeSingle();

    let leadId: string;
    if (existingLead) {
      leadId = (existingLead as any).id;
      await admin.database
        .from("Lead")
        .update({ name: name || null, source: "missed_call" })
        .eq("id", leadId);
    } else {
      const ts = Date.now();
      const { data: newLead } = await admin.database
        .from("Lead")
        .insert([{
          name: name || "Unknown Caller",
          email: email || `missed-call-${contactPhone.replace(/\D/g, "")}-${ts}@lead.local`,
          phone: contactPhone,
          source: "missed_call",
        }])
        .select()
        .single();
      leadId = (newLead as any).id;
    }

    await admin.database.from("LeadEvent").insert([{
      leadId,
      type: "missed_call",
      note: `Missed call from ${callerNumber || contactPhone} at ${callTime || new Date().toISOString()}`,
    }]);

    await sendNtfy({
      title: "BookSmart - Missed Call",
      message: `${name || "Unknown"} called from ${callerNumber || contactPhone}${callTime ? ` at ${callTime}` : ""}`,
      tags: ["phone"],
      priority: 5,
    });

    res.status(200).json({ success: true, leadId });
  } catch (err: any) {
    console.error("missed-call webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}
