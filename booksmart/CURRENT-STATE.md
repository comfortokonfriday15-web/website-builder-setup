# CURRENT-STATE.md

## Objective
- Build and deploy a reliable $0 automation stack (Vercel + InsForge + cron-job.org) replacing Trigger.dev and Neon

## Stack
- **Scheduler:** cron-job.org (fires GET to Vercel endpoints)
- **Database:** InsForge Postgres (kept warm by 30-min cron)
- **Execution:** Vercel serverless functions (10s Hobby timeout)
- **Email:** nodemailer + Gmail SMTP
- **Notifications:** ntfy.sh

## Architecture Decisions
- **1 email per cron tick** — Vercel Hobby's 10s timeout can't handle 35s delays between multi-email batches. cron-job.org fires every 30 min, so each tick processes exactly 1 enrollment. The 30-min gap IS the delay.
- **Event-driven webhooks** (booking, form, missed-call, payment) are instant — external service POSTs to Vercel endpoint → creates lead → enrolls in sequence → returns 200
- **Business logic in `dashboard/src/lib/`** — all shared modules inside the Vercel-deployed directory

## New File Structure
```
booksmart/
├── dashboard/
│   ├── api/
│   │   ├── cron/
│   │   │   ├── process-sequence.ts  ← 1 email per tick, daily cap check, bounce handling
│   │   │   ├── sync-leads.ts       ← Hourly Google Sheet import with upsert + auto-enroll
│   │   │   └── check-replies.ts    ← IMAP inbox scan for replies
│   │   ├── webhook/
│   │   │   ├── booking.ts          ← New booking → create lead → enroll
│   │   │   ├── form.ts             ← Form submission → same flow
│   │   │   ├── missed-call.ts      ← Missed call → high-priority lead
│   │   │   └── payment.ts          ← Payment → mark won → log event
│   │   ├── stats.ts                ← Dashboard stats (InsForge SDK)
│   │   ├── recent.ts               ← Activity feed (InsForge SDK)
│   │   └── log-event.ts            ← Pipeline event logging (InsForge SDK)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── insforge.ts         ← Admin client singleton
│   │   │   ├── email.ts            ← nodemailer transport
│   │   │   ├── ntfy.ts             ← Push notifications
│   │   │   ├── replies.ts          ← IMAP reply checker (InsForge SDK)
│   │   │   └── sheets.ts           ← CSV parser from Google Sheet
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── package.json
│   └── vercel.json
├── .env.local                       ← Local dev env vars (gitignored)
├── .env                             ← Root env vars (gitignored)
├── .insforge/project.json           ← InsForge CLI config (gitignored)
├── package.json                     ← Root (cleaned, no Trigger/Prisma deps)
├── migrations/                      ← SQL migrations (applied to InsForge)
└── CURRENT-STATE.md

## Deployed State
- **InsForge project:** Dental-Clinic (`jaa2tj8x.us-east.insforge.app`)
- **Vercel project:** `website-builder-setup-e685.vercel.app` (points to `booksmart/dashboard`)
- **Tables created:** User, Lead, Sequence, SequenceStep, SequenceEnrollment, EmailEvent, LeadEvent
- **Default sequence seeded:** BookSmart Outreach (3 steps, 0/2/4 day delays)

## Env Vars Needed on Vercel
- `INSFORGE_URL` = https://jaa2tj8x.us-east.insforge.app
- `INSFORGE_API_KEY` = ik_b4a26f81d042d298e6a8389e0f92321f
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `GOOGLE_SHEET_CSV_URL`
- `NTFY_TOPIC`

## cron-job.org Jobs to Create
| URL | Schedule | Purpose |
|-----|----------|---------|
| `https://website-builder-setup-e685.vercel.app/api/cron/process-sequence` | Every 30 min | Send 1 email per tick |
| `https://website-builder-setup-e685.vercel.app/api/cron/sync-leads` | Every 60 min | Import from Google Sheet |
| `https://website-builder-setup-e685.vercel.app/api/cron/check-replies` | Every 15 min | Scan IMAP inbox |

## Next Move
1. Set env vars in Vercel dashboard (INSFORGE_URL, INSFORGE_API_KEY, SMTP_*, etc.)
2. Deploy: `cd booksmart/dashboard && npx vercel --prod`
3. Create 3 cron-job.org jobs pointing to the cron endpoints
4. Test: hit each `/api/cron/*` and `/api/webhook/*` endpoint
5. Verify DB writes in InsForge dashboard
