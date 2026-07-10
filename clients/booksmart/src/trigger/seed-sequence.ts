import { task } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";

export const seedSequence = task({
  id: "seed-sequence",
  run: async () => {
    const prisma = new PrismaClient();
    try {
      const existing = await prisma.sequence.findFirst({ where: { active: true } });
      if (existing) {
        console.log(`Sequence already exists: "${existing.name}"`);
        return existing;
      }

      const sequence = await prisma.sequence.create({
        data: {
          name: "Default Outreach",
          active: true,
          steps: {
            create: [
              {
                stepOrder: 0,
                delayDays: 0,
                subject: "Quick question, {{name}}",
                body: `Hi {{name}},

I came across {{company}} and wanted to reach out.

We help service businesses like yours automate repetitive tasks — saving 10-15 hours a week on things like appointment reminders, follow-ups, and lead outreach.

Would you be open to a quick call to see if this is relevant?

Best,
Samuel`,
              },
              {
                stepOrder: 1,
                delayDays: 3,
                subject: "Re: Quick question, {{name}}",
                body: `Hi {{name}},

Following up on my last email — just in case it got buried.

Quick example of what we do:
A dental clinic we worked with was losing 20% of appointments to no-shows. We built a system that texts patients 48h and 24h before — dropped no-shows to under 5%.

Same approach works for lead follow-up, invoice reminders, review requests.

Worth 15 minutes to see if this fits what you need?

Best,
Samuel`,
              },
              {
                stepOrder: 2,
                delayDays: 7,
                subject: "One more thought, {{name}}",
                body: `Hi {{name}},

Not trying to spam you — just wanted to share one more thing.

The businesses that work with us save an average of 12 hours/week on manual tasks. That's not theory, it's what our clients report after 3 months.

If timing isn't right, no worries at all. Just let me know and I won't follow up again.

Best,
Samuel`,
            ],
          },
        },
      });

      console.log(`Created sequence: "${sequence.name}" with 3 steps`);
      return sequence;
    } finally {
      await prisma.$disconnect();
    }
  },
});
