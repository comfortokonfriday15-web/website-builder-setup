# BookSmart — Post-Launch Operations Plan

**Version:** 1.0  
**Owner:** Post-Launch Operations Team  
**Last Updated:** 2026-06-30  

---

## 1. Analytics & Reporting

### 1.1 KPI Dashboard — Definitions

| KPI | Definition | Source | Refresh |
|---|---|---|---|
| **MRR** | Sum of all active subscription charges (excl. trials) | Stripe | Daily |
| **Active Clients** | Tenants with ≥1 booking in trailing 28 days | Supabase (`bookings`) | Daily |
| **No-Show Rate** | Bookings marked `no_show` ÷ total confirmed bookings × 100 | Supabase (`bookings.status`) | Daily |
| **Total Bookings** | Count of confirmed bookings (all time) | Supabase (`bookings`) | Daily |
| **Emails Sent / Delivered / Bounced** | SES delivery notification counts | AWS SES + Trigger.dev | Hourly |
| **Review Requests Sent / Opened / Clicked** | Review-link events | Trigger.dev + Supabase `events` | Daily |
| **New Trial Signups** | Tenants created with `tier = 'trial'` | Supabase (`tenants.created_at`) | Daily |
| **Trial → Paid Conversion Rate** | Trials that subscribe ÷ total trials in cohort × 100 | Stripe + Supabase | Weekly |
| **Churn Rate** | Cancelled subscriptions ÷ active subs at period start × 100 | Stripe | Monthly |

### 1.2 Data Sources

| System | Data Retrieved | Integration Method |
|---|---|---|
| **Supabase** | Bookings, clients, staff, intake forms, events | Direct SQL / REST API |
| **Stripe** | Subscriptions, invoices, payment history | Stripe API (webhooks + sync) |
| **AWS SES** | Email delivery, opens, clicks, bounces, complaints | SNS → Trigger.dev events |
| **Trigger.dev** | Workflow execution logs, job status, email/review events | Trigger.dev API |

### 1.3 Reporting Cadence

| Schedule | Audience | Format | Content |
|---|---|---|---|
| **Daily Ops Alert** | Ops team | Slack webhook + email | MRR, active clients, no-show rate, email bounce spike, failed payments |
| **Weekly Team Review** | Ops + Product | Shared dashboard (read-only) | All KPIs, week-over-week trends, top 3 anomalies, churn triggers fired |
| **Monthly Executive Summary** | Leadership | PDF + slide deck | MRR trend, cohort conversion, NPS, at-risk accounts, no-show savings, recommendations |

### 1.4 Dashboard Tool Recommendation

**Recommendation: Retool** (self-hosted on the existing infrastructure)

- **Why Retool:** Connects natively to Supabase, Stripe, and REST APIs; supports role-based views (ops vs. exec); quick iteration with drag-and-drop; can embed daily-ops alerts inline.
- **Fallback:** Metabase (open-source, SQL-first, good for weekly/monthly PDF exports but weaker on real-time alerts and per-tenant drill-downs).
- **Not recommended:** Custom dashboard — too much maintenance overhead for a post-launch phase.

**Dashboard Pages:**
1. **Executive** — MRR sparkline, active/at-risk counts, no-show savings, NPS gauge
2. **Operations** — Per-client booking volume, email delivery stats, error counts
3. **Tenant Drill-Down** — Single-tenant view: adoption metrics, billing status, support tickets

---

## 2. Client Onboarding Flow

### 2.1 Day-by-Day Playbook

| Day | Action | Owner | Trigger | Notes |
|---|---|---|---|---|
| **Day 1** | **Welcome email** + setup link + account creation | Trigger.dev automation | Tenant created | Link points to `app.booksmart.io/setup`; include 2-min video walkthrough |
| **Day 2** | **Business profile** — name, address, logo, hours, timezone | In-app guided wizard | Day-1 complete | Validate address via Google Places API; save logo to R2 |
| **Day 3** | **Add staff** (name, email, role, colour) + **services** (name, duration, price, category) | In-app guided wizard | Day-2 complete | Max 5 staff on trial; upsell unlimited staff on check-in |
| **Day 4** | **Intake forms** (custom fields, required/optional) + **waiver templates** | In-app builder with drag-and-drop | Day-3 complete | Provide 3 industry templates (medical, salon, fitness) |
| **Day 5** | **Reminder timing** (email/SMS, 24h/2h/30min) + **review links** (auto vs manual) | In-app settings | Day-4 complete | Default: SMS 24h + email 2h; review link sent after check-in |
| **Day 6** | **Test booking flow** — client books → staff notified → reminder fires → check-in → review sent | Ops team manual QA | Day-5 complete | Run 3 test bookings; log any issues in #ops-onboarding |
| **Day 7** | **Go live** — enable public booking link + celebrate in #launches | Ops team | Day-6 pass | Share personalised `book.booksmart.io/your-practice` in #general |

### 2.2 Post-Launch Check-Ins

| Milestone | Action | Owner | Decision Gate |
|---|---|---|---|
| **30-day check-in** | Review adoption metrics (bookings, logins), no-show rate vs. baseline, support tickets | CSM | Flag if bookings < 10 or no-show > 20% |
| **60-day check-in** | Full ROI review: time saved, no-show reduction, revenue impact; upsell to annual plan or add-ons (SMS credits, extra staff) | CSM | Present case study; offer 10% annual discount if converting today |

---

## 3. Customer Success & Churn Prevention

### 3.1 Health Scoring

Each tenant gets a **health score** (0–100) calculated daily:

| Factor | Weight | Healthy → Unhealthy |
|---|---|---|
| Booking volume (28d) | 40% | ≥20 → 0 |
| Login frequency (14d) | 25% | ≥8 → 0 |
| Support ticket volume (30d) | 15% | 0 → ≥5 |
| Billing status | 10% | Active → Past due / Cancel |
| Onboarding completion | 10% | 100% → 0% |

**Health Buckets:**
- **Healthy (80–100):** No intervention needed; auto-NPS survey every 90 days.
- **Watch (50–79):** CSM reviews weekly; proactive tips email.
- **At Risk (20–49):** Playbook activation required.
- **Critical (0–19):** Director of CS loops in; escalation.

### 3.2 Churn Triggers

| Trigger | Detection | Action |
|---|---|---|
| **0 bookings in 7 days** | Cron job (hourly) on `bookings` table | Flag tenant → CSM → Low Adoption Playbook |
| **No login in 14 days** | Cron job (daily) on `auth.sessions` | Flag tenant → CSM → Low Adoption Playbook |
| **Payment failure** | Stripe `invoice.payment_failed` webhook | Immediate: send dunning email; if 2nd failure → Billing Issue Playbook |
| **Support ticket tagged "cancellation"** | Zendesk API → Trigger.dev | Escalate to CSM within 1 hour → Feature Gap Playbook |

### 3.3 Intervention Playbooks

#### Low Adoption Playbook
1. **Day 0 (trigger):** Flag tenant in #cs-alerts
2. **Day 1:** CSM sends personalised email with "Quick Wins" checklist + links to 3 most-used features
3. **Day 3:** CSM calls practice owner; offers 15-min walkthrough of features they haven't touched
4. **Day 7:** If no improvement, offer 30-min training session with a power-user case study
5. **Day 14:** Escalate to Director of CS; consider extended trial or discount

#### Billing Issue Playbook
1. **Day 0 (1st failure):** Auto-send dunning email + retry charge in 3 days
2. **Day 3 (2nd failure):** CSM calls practice owner; explain grace period (7 days)
3. **Day 5 (3rd failure):** Downgrade to restricted mode (can view data, cannot accept new bookings)
4. **Day 7 (grace end):** Suspend account; data retained for 30 days, then archived
5. **If resolved:** Remove restrictions immediately; credit one month if payment was made within 24h of suspension

#### Feature Gap Playbook
1. **Day 0:** CSM acknowledges feedback within 4 hours; tags in Productboard
2. **Day 1:** CSM calls to deeply understand the need; logs detailed use case
3. **Day 3:** CSM shares roadmap timeline (if planned) or alternative workflows
4. **Day 7:** Follow-up email summarising discussion and next steps
5. **Day 30:** Check-in to see if workaround is working; offer discount until feature ships (if high-value)

### 3.4 Win-Back Sequence (Cancelled Accounts)

| Day | Channel | Action |
|---|---|---|
| **Day 1** | Email | "We're sorry to see you go" — 30-day data export link + 1-click reactivation |
| **Day 3** | Phone call | CSM calls to learn why and address concerns; take detailed notes |
| **Day 7** | Email | Offer: "Come back for free" — one month free OR 30% off annual plan; link expires in 7 days |
| **Day 30** | Email | Final: data export reminder (data permanently deleted after 90 days) |

---

## 4. Support Operations

### 4.1 Support Channels

| Channel | Availability | Priority | Notes |
|---|---|---|---|
| **Email** (`support@booksmart.io`) | 24/7 (ticketing) | All | Primary channel; Zendesk queue; auto-reply with ticket ID |
| **Chat** (in-app) | Mon–Fri 9 AM–9 PM ET | Medium, Low | V2 feature — planned for month 3 post-launch |
| **Phone** (`+1-555-BOOKSMART`) | Emergency only | Critical | Published on /support; answered by on-call engineer |

### 4.2 SLAs

| Severity | Definition | Response Time | Resolution Time | Notification |
|---|---|---|---|---|
| **Critical** | All tenants cannot book; data loss; security breach | < 4 hours | < 8 hours | Slack #incident + page on-call engineer |
| **High** | Single tenant cannot book; email not sending; payment failures | < 8 hours | < 24 hours | Slack #support-high |
| **Medium** | Feature not working as expected; UI bug; slow page load | < 24 hours | < 72 hours | Slack #support-med |
| **Low** | Feature request; typo; documentation question | < 72 hours | Next sprint | Jira ticket triaged |

### 4.3 Common Tickets Playbook

| Issue | Diagnosis Steps | Resolution |
|---|---|---|
| **Booking not showing up** | 1. Check `bookings` table for the client + time. 2. Check Trigger.dev job `sync-booking-calendar`. 3. Check client confirmation email sent status. | Re-run sync job; if missing, manually insert booking and notify client. |
| **Email not sending** | 1. Check SES bounce/complaint list. 2. Check Trigger.dev email job logs. 3. Verify tenant's SMTP settings (if custom). | If bounced: remove address, notify client by SMS. If SES quota exceeded: request limit increase. |
| **Can't log in** | 1. Check Supabase Auth logs for the email. 2. Check if tenant is `suspended` in `tenants` table. 3. Check if trial expired. | Password reset; if suspended → direct to billing. |
| **Client can't book** | 1. Test public booking link. 2. Check tenant's `is_live` flag. 3. Check if max daily booking cap hit. 4. Check if all staff are `available`. | Toggle live flag; adjust caps; mark staff available. |

### 4.4 Escalation Path

```
Tier 1 (L1)  — Support agent (Zendesk)
  │
  ├─ Resolves: password reset, basic Q&A, billing inquiries
  │
  └─ Escalates to:
       │
  Tier 2 (L2)  — CSM / On-call engineer
       │
       ├─ Resolves: booking data issues, email delivery, feature bugs
       │
       └─ Escalates to:
            │
  Tier 3 (L3)  — Engineering lead / Security officer
            │
            └─ Resolves: data corruption, security incidents, architectural bugs
```

---

## 5. Infrastructure Operations

### 5.1 Monitoring Stack

| Tool | Monitors | Alert Channel | Frequency |
|---|---|---|---|
| **healthchecks.io** | Trigger.dev cron jobs (daily digest, billing sync, backup cron, email queue flush) | Slack #ops-alerts | Ping every 5 min; dead if no ping in 15 min |
| **Sentry** | JS errors (frontend + backend), API errors > 500, slow queries (p95 > 2s) | Slack #errors + email | Real-time; rate-limited to 1/min per project |
| **Uptime Robot** | API health endpoint (`GET /api/health`), public booking page (`book.booksmart.io`) | SMS (critical) + Slack | Every 5 min from 3 regions |

### 5.2 Backup & Recovery

| Backup | Frequency | Destination | Retention | Test Restore |
|---|---|---|---|---|
| **Supabase (full)** | Daily at 02:00 UTC | Cloudflare R2 (`booksmart-backups/db/`) | 30 days | Weekly (every Monday 10:00 UTC) to staging |
| **Supabase (WAL)** | Continuous | Cloudflare R2 (`booksmart-backups/wal/`) | 7 days | N/A (PITR up to 7 days) |
| **R2 Storage** (logos, intake file uploads) | Daily incremental | Cross-region R2 bucket | 90 days | Monthly |

**Test Restore Procedure:**
1. Create a new Supabase project in staging environment.
2. Restore from the latest backup file.
3. Run integration test suite against restored data.
4. Confirm all 3 test tenants match expected record counts.
5. Report results in #ops-alerts. If failure → page on-call engineer.

### 5.3 Maintenance Window

| Aspect | Detail |
|---|---|
| **Schedule** | Sunday 02:00 – 04:00 ET |
| **Announcement** | Email all tenants + in-app banner 48 hours in advance |
| **Deployments** | Only non-breaking changes during window; DB migrations must have rollback script |
| **Exceptions** | Emergency security patches deployed immediately with post-mortem within 24h |
| **Blackout periods** | Black Friday week + first week of January (no maintenance unless critical) |

### 5.4 Incident Response

#### Severity Levels

| Level | Example | Response | Post-Mortem |
|---|---|---|---|
| **SEV-1** | Complete outage; data loss; security breach | Immediate page all engineers; 15-min status updates in #incident | Required within 48h |
| **SEV-2** | Partial outage (single tenant down); degraded performance | Page on-call; 1-hour status updates | Required within 72h |
| **SEV-3** | Minor bug; cosmetic issue; slow page for small subset | Next business day fix; no page | Summary in sprint retro |
| **SEV-4** | Feature request; minor annoyance | Triage into backlog | None |

#### Communication Templates

**Status Page** (status.booksmart.io — via Uptime Robot):
```
Title: [Investigating / Identified / Monitoring / Resolved] — [Brief Issue Name]
Impact: [All tenants / Single tenant / No impact] — [e.g., Unable to create bookings]
Timeline: [UTC timestamps of detection, actions, fix]
```

**Internal Slack #incident:**
```
🚨 SEV-1: [Title]
Detected: [Time] by [Source]
Impact: [Scope]
Current: [Investigating / Mitigating / Resolved]
Lead: @[name]
```

**Customer Email (for SEV-1/SEV-2 > 15 min):**
```
Subject: [BookSmart] Service Update — [Date]

We are currently experiencing [brief description]. Our team is actively working on a fix. 
We will update you within 30 minutes or when the issue is resolved.

If you have an urgent request, reply to this email or call +1-555-BOOKSMART (critical only).

— BookSmart Ops
```

---

## 6. Executive Dashboard

### 6.1 One-Page Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  BOOKSMART EXECUTIVE DASHBOARD              Last refreshed: [time] │
├─────────────────┬───────────────────┬──────────────────┬───────────┤
│   MRR TREND     │ TOTAL CLIENTS     │ ACTIVE vs AT-RISK│ NPS       │
│  ┌─────────┐    │                   │                   │           │
│  │sparkline│    │  XXX clients      │  Active: XXX    │  ██████░░  │
│  └─────────┘    │  +XX% MoM        │  Watch: XXX     │  72 (Good) │
│  $XXX,XXX       │                   │  At Risk: XXX   │           │
├─────────────────┼───────────────────┼──────────────────┼───────────┤
│  NO-SHOW RATE   │ NO-SHOW SAVINGS   │  CHURN RATE     │  TRIAL→PAID│
│  ██████░░░ 8.2% │  $XX,XXX/mo      │  ██░░ 2.1%      │  ██████░   │
│  -2.1pp vs LY   │  (est. revenue    │  Target: <3%    │  38%       │
│                 │   recovered)      │                  │            │
├─────────────────┴───────────────────┴──────────────────┴───────────┤
│  RECENT ANOMALIES / ALERTS                                          │
│  • 3 tenants with 0 bookings in 7 days — CSM assigned               │
│  • Email bounce rate 4.2% (threshold: 3%) — SES review underway     │
│  • 2 payment failures — dunning sequence active                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Monthly Business Review (MBR) Template

**Month:** [Month Year]  
**Prepared by:** [Name]  
**Reviewed by:** [Leadership Team]

---

#### 1. Executive Summary (1 paragraph)
> *Brief narrative: what went well, what didn't, key metric movements, 1–3 priority actions for next month.*

#### 2. KPIs

| Metric | This Month | Last Month | MoM Change | Target | Status |
|---|---|---|---|---|---|
| MRR | $ | $ | +X% | $ | 🟢🟡🔴 |
| Active Clients | X | X | +X% | X | 🟢🟡🔴 |
| No-Show Rate | X% | X% | ±Xpp | <10% | 🟢🟡🔴 |
| Total Bookings | X | X | +X% | X | 🟢🟡🔴 |
| Trial Signups | X | X | +X% | X | 🟢🟡🔴 |
| Trial → Paid | X% | X% | ±Xpp | >40% | 🟢🟡🔴 |
| Churn Rate | X% | X% | ±Xpp | <3% | 🟢🟡🔴 |
| NPS | X | X | ±X | >50 | 🟢🟡🔴 |

#### 3. Cohort Analysis
- **Trials started this month:** X → converted Y → churned Z
- **6-month cohort retention:** X%
- **Average bookings per client by tenure:** [table]

#### 4. No-Show Impact
- **No-show rate:** X% (baseline: [industry benchmark])  
- **Estimated savings for clients:** $X (assumes $Y avg appt value × no-shows prevented)  
- **Highlight client story:** [Name] — reduced no-shows from X% to Y%

#### 5. Customer Health
- **Health distribution:** Healthy X% · Watch X% · At Risk X% · Critical X%
- **Top churn triggers fired:** [list]
- **Win-back:** Contacted X, reactivated Y, lost Z

#### 6. Support & Ops
- **Tickets by severity:** C: X / H: X / M: X / L: X
- **SLA compliance:** C: X% / H: X% / M: X% / L: X%
- **Common issue themes:** [top 3]
- **Infrastructure uptime:** X% (target: 99.9%)

#### 7. Product Feedback Themes
- Top 3 feature requests from clients
- Top 3 complaints / pain points
- Roadmap adjustments recommended

#### 8. Goals for Next Month

| Goal | Owner | Success Metric |
|---|---|---|
| 1. | | |
| 2. | | |
| 3. | | |

#### 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [e.g., SES deliverability] | Medium | High | [action] |

---

*End of Post-Launch Operations Plan*
