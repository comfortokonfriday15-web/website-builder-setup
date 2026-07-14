import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendNtfy } from "../../src/lib/ntfy.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, email, phone, company, message } = req.body ?? {};

    if (!name || !email) {
      return res.status(400).json({ error: "name and email required" });
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
        .update({ name, phone: phone || null, company: company || null, source: "web_form" })
        .eq("id", leadId);
    } else {
      const { data: newLead } = await admin.database
        .from("Lead")
        .insert([{ name, email, phone: phone || null, company: company || null, source: "web_form" }])
        .select()
        .single();
      leadId = (newLead as any).id;
    }

    const { data: activeSeq } = await admin.database
      .from("Sequence")
      .select("id")
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (activeSeq) {
      const seqId = (activeSeq as any).id;
      const { data: existingEnroll } = await admin.database
        .from("SequenceEnrollment")
        .select("id")
        .eq("leadId", leadId)
        .eq("sequenceId", seqId)
        .maybeSingle();

      if (!existingEnroll) {
        await admin.database
          .from("SequenceEnrollment")
          .insert([{ leadId, sequenceId: seqId, currentStep: 0 }]);
      }
    }

    if (message) {
      await admin.database.from("LeadEvent").insert([{
        leadId,
        type: "form_submission",
        note: message,
      }]);
    }

    await sendNtfy({
      title: "BookSmart - Form Submission",
      message: `${name} (${email}) submitted a form${message ? `: ${message.substring(0, 200)}` : ""}`,
      tags: ["memo"],
      priority: 3,
    });

    res.status(200).json({ success: true, leadId });
  } catch (err: any) {
    console.error("form webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}
