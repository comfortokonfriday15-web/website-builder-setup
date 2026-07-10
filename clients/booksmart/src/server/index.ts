import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/stats", async (_req, res) => {
  try {
    const [
      totalLeads,
      leadsByStatus,
      totalEnrollments,
      activeEnrollments,
      sentToday,
      totalSent,
      sequences,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({ by: ["status"], _count: true }),
      prisma.sequenceEnrollment.count(),
      prisma.sequenceEnrollment.count({ where: { completed: false } }),
      prisma.emailEvent.count({
        where: {
          type: "sent",
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.emailEvent.count({ where: { type: "sent" } }),
      prisma.sequence.findMany({
        include: { _count: { select: { steps: true, enrollments: true } } },
      }),
    ]);

    res.json({
      leads: {
        total: totalLeads,
        byStatus: Object.fromEntries(leadsByStatus.map((s) => [s.status, s._count])),
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
      },
      emails: {
        sentToday,
        totalSent,
      },
      sequences: sequences.map((s) => ({
        id: s.id,
        name: s.name,
        active: s.active,
        steps: s._count.steps,
        enrolled: s._count.enrollments,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
