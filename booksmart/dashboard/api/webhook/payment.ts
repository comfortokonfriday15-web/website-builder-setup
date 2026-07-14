import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendNtfy } from "../../src/lib/ntfy.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { email, name, amount, paymentId, plan } = req.body ?? {};

    if (!email) {
      return res.status(400).json({ error: "email required" });
    }

    const { data: existingLead } = await admin.database
      .from("Lead")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let leadId: string;
    if (existingLead) {
      leadId = (existingLead as any).id;
      await admin.database
        .from("Lead")
        .update({ name: name || undefined, status: "won", source: "payment" })
        .eq("id", leadId);
    } else {
      const { data: newLead } = await admin.database
        .from("Lead")
        .insert([{ name: name || "New Client", email, source: "payment" }])
        .select()
        .single();
      leadId = (newLead as any).id;
    }

    await admin.database.from("LeadEvent").insert([{
      leadId,
      type: "won",
      value: amount ? parseFloat(amount) : null,
      note: plan ? `Payment received — ${plan}` : `Payment received — $${amount}`,
    }]);

    await sendNtfy({
      title: "BookSmart - Payment Received",
      message: `${name || email} paid $${amount || "—"}${plan ? ` (${plan})` : ""}`,
      tags: ["moneybag"],
      priority: 5,
    });

    res.status(200).json({ success: true, leadId });
  } catch (err: any) {
    console.error("payment webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}
