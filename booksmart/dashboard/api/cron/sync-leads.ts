import { admin } from "../../src/lib/insforge.js";
import { fetchLeadsFromSheet } from "../../src/lib/sheets.js";
import { withRunLog } from "../../src/lib/withRunLog.js";

export default withRunLog("cron.sync-leads", async (_req, res) => {
  const leads = await fetchLeadsFromSheet();

  const { data: activeSeq } = await admin.database
    .from("Sequence")
    .select("id")
    .eq("active", true)
    .order("createdAt", { ascending: true })
    .limit(1)
    .maybeSingle();

  let imported = 0;
  for (const row of leads) {
    if (!row.email) continue;

    const { data: existingLead } = await admin.database
      .from("Lead")
      .select("id")
      .eq("email", row.email)
      .maybeSingle();

    let leadId: string;
    if (existingLead) {
      leadId = (existingLead as any).id;
      await admin.database
        .from("Lead")
        .update({
          name: row.name,
          company: row.company || null,
          phone: row.phone || null,
          notes: row.notes || null,
          rating: row.rating || null,
          reviewCount: row.reviewCount || null,
          source: "google_sheets",
        })
        .eq("id", leadId);
    } else {
      const { data: newLead } = await admin.database
        .from("Lead")
        .insert([{
          name: row.name,
          email: row.email,
          company: row.company || null,
          phone: row.phone || null,
          notes: row.notes || null,
          rating: row.rating || null,
          reviewCount: row.reviewCount || null,
          source: "google_sheets",
        }])
        .select()
        .single();

      leadId = (newLead as any).id;
    }

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
        imported++;
      }
    } else {
      imported++;
    }
  }

  res.status(200).json({ total: leads.length, imported });
});
