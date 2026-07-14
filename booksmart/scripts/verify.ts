import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "asc" }, take: 5 });
  const totalLeads = await prisma.lead.count();
  console.log(`Total leads: ${totalLeads}`);
  for (const l of leads) {
    console.log(`  ${l.name.padEnd(40)} | rating: ${String(l.rating).padStart(3)} | reviews: ${String(l.reviewCount).padStart(3)}`);
  }
  console.log("  ...");

  const withReviewCount = await prisma.lead.count({ where: { reviewCount: { not: null } } });
  console.log(`\nLeads with review data: ${withReviewCount} / ${totalLeads}`);

  const enrollments = await prisma.sequenceEnrollment.findMany({
    where: { currentStep: 0, completed: false },
    orderBy: { nextSendAt: "asc" },
    include: { lead: true },
  });
  console.log(`Enrollments: ${enrollments.length}`);
  if (enrollments.length > 0) {
    const sun = enrollments.filter(e => e.nextSendAt?.toISOString().startsWith("2026-07-12")).length;
    const mon = enrollments.filter(e => e.nextSendAt?.toISOString().startsWith("2026-07-13")).length;
    console.log(`  Sunday batch: ${sun}, Monday batch: ${mon}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
