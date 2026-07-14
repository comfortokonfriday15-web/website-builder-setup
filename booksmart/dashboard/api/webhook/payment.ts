import { admin } from "../../src/lib/insforge.js";
import { sendNtfy } from "../../src/lib/ntfy.js";
import { withRunLog } from "../../src/lib/withRunLog.js";

export default withRunLog("webhook.payment", async (req, res) => {
  const { email, name, amount, paymentId, plan } = req.body ?? {};

  if (!email) {
    res.status(400).json({ error: "email required" });
    return;
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
});
