import { admin } from "../../src/lib/insforge.js";
import { sendNtfy } from "../../src/lib/ntfy.js";
import { withRunLog } from "../../src/lib/withRunLog.js";

export default withRunLog("webhook.booking", async (req, res) => {
  const { name, email, phone, company } = req.body ?? {};

  if (!name || !email) {
    res.status(400).json({ error: "name and email required" });
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
      .update({ name, phone: phone || null, company: company || null, source: "booking" })
      .eq("id", leadId);
  } else {
    const { data: newLead } = await admin.database
      .from("Lead")
      .insert([{ name, email, phone: phone || null, company: company || null, source: "booking" }])
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

  await sendNtfy({
    title: "BookSmart - New Booking",
    message: `${name} (${email}) booked an appointment`,
    tags: ["calendar"],
    priority: 4,
  });

  res.status(200).json({ success: true, leadId });
});
