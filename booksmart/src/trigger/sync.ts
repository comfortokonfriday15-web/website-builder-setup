import { schedules } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";
import { fetchLeadsFromSheet } from "../lib/sheets.js";

export const syncLeads = schedules.task({
  id: "sync-leads",
  cron: "0 * * * *",
  run: async () => {
    const prisma = new PrismaClient();
    try {
      console.log("Syncing leads from Google Sheet...");

      const leads = await fetchLeadsFromSheet();
      console.log(`Found ${leads.length} leads in sheet`);

      const activeSequence = await prisma.sequence.findFirst({
        where: { active: true },
        orderBy: { createdAt: "asc" },
      });

      let imported = 0;
      for (const row of leads) {
        try {
          if (!row.email) continue;

          const lead = await prisma.lead.create({
            data: {
              name: row.name,
              email: row.email,
              company: row.company || null,
              phone: row.phone || null,
              notes: row.notes || null,
              source: "google_sheets",
            },
          });

          if (activeSequence) {
            await prisma.sequenceEnrollment.create({
              data: {
                leadId: lead.id,
                sequenceId: activeSequence.id,
                currentStep: 0,
                nextSendAt: new Date(Date.now() + 30 * 60 * 1000),
              },
            });
          }

          imported++;
        } catch (err: any) {
          if (err?.code === "P2002") continue;
          console.error(`Failed to process lead ${row.email}:`, err.message);
        }
      }

      console.log(`Imported ${imported} new leads`);
      return { total: leads.length, imported };
    } finally {
      await prisma.$disconnect();
    }
  },
});
