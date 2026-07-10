# Project Timeline & Risk Register — BookSmart

| **Field** | **Detail** |
|---|---|
| **Project** | BookSmart — Unified Booking & Client Intake System |
| **Stage** | Phase 1 — Architecture & Planning |
| **Author** | Project Shepherd Agent |
| **Date** | 2026-06-30 |
| **Status** | Approved (post-Roast reshape) |

---

## 1. Executive Summary

**Total duration:** 6 weeks (3 sprints of 2 weeks each)

**Team:** 3-person core: 1 full-stack engineer (lead), 1 frontend-focused engineer, 1 part-time DevOps/QA. Product management absorbed by founder.

**Pricing model** (reshape directive): $0 setup + $197/mo (Starter) / $497/mo (Pro). No $5K setup fee — that was the #1 buyer trust killer identified in the Roast.

**Vertical wedge:** Dental. Highest no-show cost ($55-70K/yr per practice), highest willingness to pay, clearest HIPAA regulatory need. Salon and auto shop consensus in Buyer panel was "no." Win dental first, expand after 20+ paying clients.

**Delivery approach:** 2-week sprints with end-of-sprint demos. Closed beta sign-off at week 4 (Stripe live, email automation running). Soft launch at week 6 (intake + e-sign + portal). No drag-and-drop form builder — simplified template-based intake forms only (phase 2 item).

**Key milestone summary:**

| Milestone | Target | What ships |
|---|---|---|
| M1: Booking engine end-to-end | End of week 2 | Supabase schema, auth, business/staff/service CRUD, real-time availability, conflict detection, public booking page (subdomain), booking confirmation + add-to-calendar |
| M2: Email automation + Stripe live | End of week 4 | AWS SES via Trigger.dev (confirmation, 48h reminder, 24h reminder, review request), Stripe checkout (deposits/full payment), admin dashboard v1 (today's schedule, client list, no-show stats) |
| M3: Full MVP | End of week 6 | Intake form builder (templates, no drag-drop), Dropbox Sign e-sign waivers, PDF generation + Cloudflare R2 storage, client portal (magic link login, history, reschedule), review automation dashboard, QA + security review + deployment |

---

## 2. Phased Build Timeline

### Sprint 1 (Weeks 1-2): Foundation — Booking Engine

**Goal:** Working end-to-end booking flow. A client can find a dental practice, see a staff member's available slots, book an appointment, and receive a confirmation.

#### Week 1 — Backbone & Auth

| Day | Tasks | Owner | Dependencies |
|---|---|---|---|
| Day 1-2 | Supabase project creation, Prisma schema (Business, Staff, Service, Appointment, Client, User tables), Row-Level Security policies, migration scripts | Lead engineer | Supabase account |
| Day 3 | Auth system: magic link email authentication + Google OAuth. Supabase Auth configuration. Passwordless login flow for both business admins and clients. | Lead engineer | Schema completed |
| Day 4 | Business + Staff + Service CRUD admin endpoints. Create business profile, add staff members with schedules, define services with duration/price. | Lead engineer | Auth completed |
| Day 5-6 | Real-time availability engine. Given a business/staff/service/date, return available time slots accounting for: staff schedule, existing appointments, buffer time, business hours, holidays. | Lead engineer | Schema, CRUD completed |
| Day 7 | Availability API endpoint + basic conflict detection (double-booking prevention at database level via exclusion constraints). | Lead engineer | Availability engine |

**Week 2 — Booking Flow & Public Page**

| Day | Tasks | Owner | Dependencies |
|---|---|---|---|
| Day 8-9 | Public booking page (subdomain-based: `book.practice.com`). Embeddable widget format. Business branding (logo, colors). Step-by-step: service selection → staff selection → date/time picker → client info → confirmation. | Frontend engineer | Availability API |
| Day 10 | Appointment creation API with Stripe payment intent creation (deposit required / free booking depending on business config). Conflict detection at write time. | Lead engineer | Booking page |
| Day 11 | Booking confirmation screen: appointment details, calendar links (Google Calendar, Outlook, iCal download), reschedule/cancel buttons with time-window policy. | Frontend engineer | Booking creation API |
| Day 12-13 | Add-to-calendar integration (ics file generation, Google Calendar redirect, Outlook redirect). Email notification for booking confirmation (via Trigger.dev task + SES — works even while SES sandbox is lifted). | Both | Booking flow |
| Day 14 | **Sprint 1 demo.** End-to-end booking test: client visits subdomain → browses services → picks slot → enters info → gets confirmation + calendar invite + email. | Team | All above |

**M1 Gate: Booking engine working end-to-end**

---

### Sprint 2 (Weeks 3-4): Core Features — Payments, Email, Admin

**Goal:** Automated email sequences running, Stripe accepting deposits/payments, admin can see their day.

#### Week 3 — Email Automation & Stripe Foundation

| Day | Tasks | Owner | Dependencies |
|---|---|---|---|
| Day 15 | AWS SES production access request (submitted week 1, should clear by now — typically 24-48h). Domain verification, DKIM/SPF setup. | Lead engineer | AWS account |
| Day 16 | Trigger.dev project setup. Create email tasks: `sendBookingConfirmation`, `sendReminder48h`, `sendReminder24h`, `sendReviewRequest`. SES email templates for each. Fallback to SendGrid if SES sandbox extension granted. | Lead engineer | SES verified |
| Day 17 | Stripe Connect integration for multi-business payments. Standard Connect (businesses onboard individually). Deposit amount handling (percentage or fixed). Full payment capture at appointment time vs. deposit only. | Lead engineer | Stripe account |
| Day 18 | Stripe checkout session creation from booking flow. Webhook handling for `checkout.session.completed`. Payment status tracking on Appointment model. Refund flow for cancellations. | Lead engineer | Stripe Connect |
| Day 19 | Scheduling engine for email reminders. Cron trigger in Trigger.dev running daily at 8 AM. Query appointments 48h out and 24h out, fire reminder emails. Respect business timezone. | Lead engineer | Email tasks |

#### Week 4 — Admin Dashboard v1

| Day | Tasks | Owner | Dependencies |
|---|---|---|---|
| Day 20 | Admin dashboard layout. Auth guard (magic link login for business admins). Sidebar navigation. | Frontend engineer | Auth |
| Day 21 | Today's schedule view: list of today's appointments in chronological order, client name/phone/service/staff/status. Color-coded (confirmed/checked-in/no-show/completed/cancelled). | Frontend engineer | Booking engine |
| Day 22 | Client list: searchable table of all clients for the business. Contact info, appointment history count, total spent, last visit date. Drill-down to individual client profile. | Frontend engineer | Client data |
| Day 23 | No-show stats: no-show rate per staff member, per service, per day-of-week. Simple charts (Chart.js or Recharts). Monthly trend line. Revenue lost to no-shows calculation. | Frontend engineer | Appointment data |
| Day 24 | Review automation dashboard: review requests sent, reviews collected, average rating, response rate. Link to Google Business Profile / Yelp. | Frontend engineer | Review email task |
| Day 25-26 | Integration testing: booking flow with real Stripe payments, email receipt, admin dashboard reflects appointment. Edge cases: cancellation + refund, reminder for rescheduled, multi-timezone. | Both | All Sprint 2 |
| Day 27 | Bug fixes, polish. | Both | — |
| Day 28 | **Sprint 2 demo.** Live payment flow, automated email reminders firing, admin dashboard usable. | Team | All above |

**M2 Gate: Email automation + Stripe live**

---

### Sprint 3 (Weeks 5-6): Intake, E-Sign, Portal

**Goal:** Patients fill intake forms before appointment, sign waivers electronically, access history through a client portal.

#### Week 5 — Intake Forms & E-Sign

| Day | Tasks | Owner | Dependencies |
|---|---|---|---|
| Day 29-30 | Intake form builder — simplified. Pre-built templates (new patient medical history, consent to treatment, HIPAA acknowledgment, dental health questionnaire). Business customizes via field toggles, not drag-drop. Template library stored in DB as JSON schema. | Lead engineer | Schema extended |
| Day 31 | Public intake form routing. On booking confirmation, generate unique intake link for the appointment. Client fills form ahead of time (mobile-friendly). Responses stored as JSONB on Appointment. | Frontend engineer | Intake templates |
| Day 32 | Dropbox Sign API integration. Create signature request via API with document URL + signer email. Embedded signing experience (iFrame or redirect). Webhook receiver for `signature_request_completed`. | Lead engineer | Dropbox Sign account |
| Day 33 | E-sign waiver templates: standard dental waiver (consent to treatment, financial policy, HIPAA authorization). Dynamic fields (patient name, date, procedure). PDF generation from template + JSON data (use pdf-lib or similar). | Both | Dropbox Sign API |
| Day 34-35 | Cloudflare R2 bucket setup (S3-compatible, no egress fees). Upload signed PDFs to R2. Store R2 key on Appointment record. Generate pre-signed URLs for admin download. | Lead engineer | R2 bucket |

#### Week 6 — Client Portal, QA, Deployment

| Day | Tasks | Owner | Dependencies |
|---|---|---|---|
| Day 36 | Client portal — magic link login (no password). Dashboard: upcoming appointments, past appointments, intake form status, e-sign status. | Frontend engineer | Auth |
| Day 37 | Portal features: reschedule (time window policy, availability check), cancel (with cancellation policy). View/download past intake forms and signed documents. | Frontend engineer | Booking engine |
| Day 38 | Review automation final pass: post-appointment review request fired 24h after checkout.session.completed. SMS fallback via Twilio for clients who don't open email. | Lead engineer | Email tasks |
| Day 39-40 | Full QA pass: booking flow, payment flow, email flow, intake + e-sign flow, client portal flow. Security scan (OWASP top 10 — XSS, CSRF, SQLi, auth bypass). Penetration test of auth + API endpoints. | QA/DevOps | All features |
| Day 41 | Production deployment. Supabase project promotion. Domain configuration (subdomain DNS for booking pages). Stripe Connect activation. Cloudflare R2 public URLs. Monitoring setup (Sentry + uptime monitor). | DevOps | QA passed |
| Day 42 | **Sprint 3 demo.** Full MVP walkthrough: book → pay → get reminder → fill intake → sign waiver → portal login → review request. Ship. | Team | All above |

**M3 Gate: Full MVP with intake + e-sign + portal**

---

## 3. Dependencies & Critical Path

### Hard Dependencies (sequential — A must finish before B starts)

| Dependency | Reason | Risk if violated |
|---|---|---|
| Supabase schema → CRUD endpoints → Booking engine | Schema defines tables that endpoints query; engine builds on top of both | Booking engine built against wrong schema = rewrite |
| Auth system → Admin dashboard | Dashboard requires auth guard | Can't test admin until users can log in |
| Stripe Connect → Checkout session | Checkout requires Connect account configured | Payment flow broken if Connect not set up |
| Email templates → Trigger.dev tasks | Tasks reference SES template IDs | Tasks deploy with broken references |
| Intake form templates → Intake form routing | Routing renders the template UI | Forms render empty or broken |
| Dropbox Sign API key → E-sign integration | API calls fail without credentials | No e-sign capability |
| PDF generation → R2 upload | Need PDF before upload | R2 bucket has nothing to store |

### External Dependencies

| Service | What it's used for | Setup lead time | Fallback |
|---|---|---|---|
| Supabase | Database, auth, RLS, real-time | Day 1 (instant) | Neon PostgreSQL + custom auth (adds 2 weeks) |
| AWS SES | Transactional email | 24-48h for production access | SendGrid (instant setup) |
| Trigger.dev | Email scheduling, cron, webhook orchestration | Day 1 (instant) | In-node bull queue + cron (adds dev time) |
| Stripe Connect | Multi-business payment processing | 3-5 business days for approval | Single Stripe account with platform fees |
| Dropbox Sign | E-signature with ESIGN Act compliance | API key instant, need to configure webhook | Typeform e-sign module |
| Cloudflare R2 | Signed document storage | Day 1 (instant) | AWS S3 (higher egress cost) |
| Google OAuth | Auth provider | Client ID/Secret (15 min setup) | Magic link only |
| Vercel / Cloudflare Pages | Frontend hosting | Day 1 (instant) | Self-hosted on VPS |

### What Can Be Parallelized

| Parallel track A | Parallel track B | Notes |
|---|---|---|
| Supabase project setup | Domain registration + DNS config | No overlap |
| Business/Staff/Service CRUD | Frontend component library setup | Different codebases |
| Booking engine API | Public booking page UI (mock data) | UI can build against spec before API is live |
| Stripe Connect onboarding | Email template design | Zero overlap |
| Admin dashboard | Intake form template content | Different domains |
| Client portal | QA test script writing | QA writes tests against spec while dev builds |
| PDF generation | Cloudflare R2 bucket config | Different concerns |

---

## 4. Milestones & Deliverables

### M1: Booking engine working end-to-end (End of week 2)

**Deliverables:**
- [ ] Supabase project live with all tables, RLS policies, indexes
- [ ] Auth: magic link login + Google OAuth working for both admin and client
- [ ] Business CRUD: create, update, view business profile
- [ ] Staff CRUD: add staff members with weekly schedules
- [ ] Service CRUD: define services with duration, price, deposit amount
- [ ] Availability engine: given business + staff + service + date, return open slots
- [ ] Conflict detection: double-booking prevented at database and API level
- [ ] Public booking page: subdomain-based, step-by-step booking flow
- [ ] Booking confirmation: appointment details + calendar links
- [ ] Add-to-calendar: .ics download + Google Calendar + Outlook redirect
- [ ] Email confirmation sent via Trigger.dev task

**Acceptance criteria:** A new client can book an appointment from scratch without admin intervention. Booking appears in the database within 2 seconds of submission. Confirmation email arrives within 30 seconds.

### M2: Email automation + Stripe live (End of week 4)

**Deliverables:**
- [ ] AWS SES production access granted, domain verified, DKIM/SPF configured
- [ ] 4 Trigger.dev email tasks: confirmation, 48h reminder, 24h reminder, review request
- [ ] Stripe Connect platform account active
- [ ] Stripe checkout session created on booking, completed via webhook
- [ ] Payment status tracked on Appointment model
- [ ] Refund flow for cancellations (within policy window)
- [ ] Admin dashboard: today's schedule, client list, no-show stats
- [ ] Review automation dashboard: sent, collected, rating

**Acceptance criteria:** Client books → redirected to Stripe → pays deposit → returns to confirmation → receives confirmation email → receives reminder 48h before → receives reminder 24h before → receives review request after. Admin can see all appointments and no-show stats.

### M3: Full MVP with intake + e-sign + portal (End of week 6)

**Deliverables:**
- [ ] Intake form builder: 4 pre-built dental templates, business can toggle fields
- [ ] Intake form routing: unique link per appointment, mobile-friendly
- [ ] Dropbox Sign integration: signature request via API, embedded signing
- [ ] E-sign waiver templates: consent, HIPAA, financial policy
- [ ] PDF generation: dynamic PDF from template + appointment data
- [ ] Cloudflare R2: signed PDFs uploaded, pre-signed URLs for admin
- [ ] Client portal: magic link login, upcoming/past appointments, reschedule/cancel
- [ ] Client document access: view/download intake forms and signed waivers
- [ ] SMS fallback for review requests (Twilio)
- [ ] Full QA: OWASP scan, auth penetration test, all flows tested
- [ ] Production deployment: DNS, SSL, monitoring

**Acceptance criteria:** Full patient journey: book online → pay deposit → receive reminder emails → fill intake form before appointment → sign waiver electronically → appointment happens → portal login to view history → automated review request.

---

## 5. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **AWS SES account stuck in sandbox.** Production access request denied or delayed beyond 48h. | High (30-40% of new SES accounts face review delays) | High — email automation completely blocked. No confirmation, reminders, or review requests. | Submit SES production request week 1 day 1. Configure SendGrid as warm standby with identical templates. Dual-write emails in Trigger.dev tasks with fallback logic. |
| 2 | **Dropbox Sign API complexity causes timeline slip.** Webhook setup, embedded signing UX, or template variable binding takes longer than estimated. | Medium (25%) | Medium — e-sign feature slips past week 6, delaying M3. | Start Dropbox Sign integration at week 4 day 1 (start of Sprint 3), not week 5. Hard fallback: Typeform e-sign (simpler API, less customization). Document Slack channel for Dropbox Sign API support. |
| 3 | **Supabase RLS policies misconfigured, leaking cross-tenant data.** Multi-tenant data accessible between businesses. | Medium (20%) | Critical — HIPAA violation, legal liability, business-ending. | Every RLS policy reviewed by second engineer before deployment. Automated test suite creates two businesses and verifies data isolation. Weekly security audit of RLS policies. |
| 4 | **Stripe Connect onboarding friction.** Dental practice owners abandon onboarding due to complex KYC/document requirements. | High (40%) | High — businesses can't accept payments. Zero revenue. | Provide step-by-step onboarding guide with screenshots. Offer white-glove setup call (30 min). Use Stripe's embedded onboarding component to keep user in our UI. Pre-fill as much data as possible. |
| 5 | **Client portal adoption low.** Clients don't use magic link login, call office instead for reschedules. | Medium (25%) | Medium — reduces value prop of unified system. | Embed portal access in every email footer. Push notification on booking confirmation: "Manage your appointment here." Offer SMS-based quick actions (reply 1 to reschedule). |
| 6 | **Calendar sync gaps.** Add-to-calendar links don't work for all providers (Outlook vs. Google vs. Apple). Timezone confusion. | Medium (15%) | Medium — clients miss appointments, blame BookSmart. | Generate standard .ics files (RFC 5545 compliant) rather than provider-specific links. Provide both download and redirect options. Test on all 3 major calendar platforms. Include explicit timezone in event body. |
| 7 | **Real-time availability performance degrades at scale.** 50+ businesses with 500+ appointments/day causes slow slot queries. | Low (10%) | Medium — booking page becomes slow, clients abandon. | Database indexes on (business_id, staff_id, date, start_time). Materialized view for daily slot availability. Cache popular time slots in Redis (via Upstash). Monitor query performance from sprint 1. |
| 8 | **HIPAA compliance gap discovered late.** Missing BAA, audit logs, or encryption requirement blocks dental adoption. | Medium (20%) | Critical — entire dental vertical blocked. | Execute BAA with Supabase + AWS + Dropbox Sign + Cloudflare before week 1. Enable audit logging on all PHI-accessing tables. Encrypt at rest (default in Supabase + R2). Third-party HIPAA review in week 5. |
| 9 | **Intake form template scope creep.** Dental practices request custom field types exceeding simplified template approach. | Medium (30%) | Medium — dev time diverted to form builder, delaying e-sign or portal. | Strictly enforce MVP boundary: 4 pre-built templates only. Collect custom requests as feature backlog. Promise phase 2 form builder. If 3+ paying clients request same field, add to template. |
| 10 | **Email deliverability issues (landing in spam).** SES reputation starts cold, dental practice emails flagged. | Medium (25%) | High — reminders not seen, no-show rates don't decrease (core value prop). | Warm SES reputation with low-volume sending week 1-2. Use dedicated sending domain. Set up DMARC, DKIM, SPF properly. Monitor bounce rates and complaint rates daily. Engage AWS support if reputation dips. |
| 11 | **Browser compatibility issues with embedded Dropbox Sign.** Patient on old Safari or Edge can't sign. | Low (10%) | Medium — e-sign flow broken for some patients. | Test embedded signing on Chrome, Firefox, Safari, Edge (last 2 major versions). Fallback: redirect-based signing (opens new tab). Email signing link as third fallback. |
| 12 | **Subdomain SSL/HTTPS misconfiguration.** Booking pages show "Not Secure" and clients bounce. | Low (10%) | Medium — trust destroyed, bookings lost. | Auto-provision SSL via Cloudflare or Vercel. Use wildcard cert for *.booksmart.app. Test HTTPS on every subdomain during deployment. Set up uptime monitoring with SSL expiry alerts. |
| 13 | **Staff availability schedule complexity.** Dental practices have irregular schedules (Wed off, every other Sat, lunch breaks, rotating hygienists). | High (50%) | High — booking engine shows unavailable slots or misses available ones. | Build flexible schedule model from day 1: weekly schedule template + exception/override list + per-day overrides. Allow block scheduling (lunch, meetings). Validate against real dental practice schedules during sprint 1. |
| 14 | **No-show stats inaccurate due to missing status transitions.** Staff forgets to mark no-shows, dashboard data is garbage. | Medium (25%) | Medium — admin dashboard loses trust. | Auto-mark no-show if appointment passes without check-in (configurable grace period). Manual override always available. Dashboard shows "unconfirmed" as separate category. Audit log of all status changes. |
| 15 | **PDF generation fails for complex templates.** Text overflow, missing fields, encoding issues with patient names. | Medium (15%) | Low — admin can't download signed waiver PDF. | Use battle-tested library (pdf-lib or @react-pdf/renderer). Generate test PDFs for edge cases (long names, special characters, multi-page content). Manual review of generated PDFs before shipping. |

### Risk Heat Map Summary

| Impact \ Probability | Low (≤15%) | Medium (16-30%) | High (>30%) |
|---|---|---|---|
| **Critical** | — | #3 (RLS leak), #8 (HIPAA gap) | — |
| **High** | #7 (Perf at scale) | #10 (Email deliverability), #13 (Schedule complexity) | #1 (SES sandbox), #4 (Stripe onboarding friction) |
| **Medium** | #6 (Calendar sync), #11 (Browser compat), #12 (SSL) | #2 (Dropbox Sign delay), #5 (Portal adoption), #9 (Form scope creep), #14 (No-show stats) | — |
| **Low** | #15 (PDF generation) | — | — |

---

## 6. Resource Plan

### Tools & Infrastructure

| Category | Choice | Justification |
|---|---|---|
| **Database** | Supabase (PostgreSQL) | Managed Postgres with built-in auth, RLS, real-time subscriptions. Eliminates DevOps overhead of self-hosted Postgres. Starts free, scales to $25/mo at production. |
| **Auth** | Supabase Auth | Magic link + Google OAuth built-in. Row-Level Security ties directly to auth.uid(). No separate auth service needed. |
| **Email** | AWS SES (primary) + SendGrid (cold standby) | SES: $0.10 per 1,000 emails. SendGrid: $19.95/mo for 50k emails. Both > 500/day Gmail cap. Dual-provider prevents single point of failure. |
| **Background jobs** | Trigger.dev | Built for this use case: cron scheduling, idempotency, retries with backoff, webhook receivers. Replaces need for separate queue infrastructure. |
| **Payments** | Stripe Connect (Standard) | Industry standard for platform payment models. Standard onboarding (business gets separate Stripe account) vs. Express (lighter KYC). Standard preferred for trust. |
| **E-sign** | Dropbox Sign API | ESIGN Act compliant. Embedded signing via iFrame. Webhook on completion. $15/mo for 5 requests, scales to $150/mo unlimited. Faster integration than DocuSign. |
| **File storage** | Cloudflare R2 | S3-compatible, zero egress fees (vs. AWS S3 at $0.09/GB egress). Signed document downloads don't incur bandwidth cost. |
| **Frontend** | React + Vite + Tailwind | Standard choice in stack. Vite for fast dev builds. Tailwind for consistent design system. |
| **Backend** | Next.js API routes + tRPC | Type-safe API layer. Next.js handles routing, SSR for booking pages, subdomain routing. tRPC for end-to-end typesafety. |
| **Hosting** | Vercel (frontend) + Trigger.dev (jobs) | Vercel: native Next.js hosting, preview deployments per branch, automatic SSL. Trigger.dev: handles job execution. |
| **Monitoring** | Sentry (errors) + Checkly (uptime) | Sentry: error tracking with sourcemaps. Checkly: Playwright-based synthetic monitoring for booking flow. |

### Environments

| Environment | Purpose | URL | Deploy trigger |
|---|---|---|---|
| **Local** | Development | localhost:3000 | `npm run dev` |
| **Preview** | PR review & QA | `<branch>.booksmart.preview.vercel.app` | PR opened |
| **Staging** | Integration testing | staging.booksmart.app | Manual deploy from main |
| **Production** | Live | app.booksmart.app | Manual promote from staging |

### CI/CD Pipeline

```
Git push → GitHub Actions
  ├── lint (biome check)
  ├── typecheck (tsc --noEmit)
  ├── test (vitest unit + integration)
  ├── build (npm run build)
  └── deploy (Vercel — preview for PRs, production on main merge)
```

- **Lint + typecheck in < 30s** (fail fast)
- **Tests in < 2 min**
- **Build in < 3 min**
- **Total CI < 6 min**

### Testing Strategy

| Layer | Tool | What we test | Frequency |
|---|---|---|---|
| **Unit** | Vitest | Utility functions, availability engine logic, date math, price calculations, validation schemas | Every PR |
| **Integration** | Vitest + Supertest | API endpoints with real Supabase connection (test tenant), auth flow, CRUD operations | Every PR |
| **E2E** | Playwright | Full booking flow, Stripe checkout (test mode), calendar link generation, portal login | Every PR (critical paths) + nightly (full suite) |
| **Visual** | Percy (or Chromatic) | Booking page responsive layouts, admin dashboard, intake forms | Every PR (UI changes) |
| **Security** | OWASP ZAP API scan + manual auth review | RLS policy isolation, XSS, CSRF, rate limiting | Weekly + pre-release |
| **Performance** | k6 (or autocannon) | Availability endpoint (target < 200ms P95), booking creation (< 500ms P95), slot query at 100 concurrent users | Pre-release |

### Testing data strategy

- **Seed script** creates: 2 dental practices, 4 staff total, 8 services, 50 past appointments, 10 upcoming appointments, 5 clients with intake forms, 3 signed waivers.
- Supabase branch-based testing: each PR gets its own Supabase branch with seed data.
- Test mode Stripe keys for payment testing.
- Dropbox Sign test mode for e-sign testing.

### Deployment Runbook (Day 41)

```
1. Verify staging passes all checks
2. Promote Supabase schema to production (supabase db push)
3. Deploy Trigger.dev tasks to production (npx trigger.dev deploy)
4. Deploy Vercel production (merge to main, auto-deploy)
5. Configure production DNS: app.booksmart.app, *.booksmart.app
6. Enable Stripe Connect in production mode
7. Verify Dropbox Sign webhook points to production
8. Switch SES from sandbox to production (verify sending)
9. Run post-deployment smoke tests (Playwright)
10. Enable Sentry release tracking + Checkly monitors
11. Document rollback steps (Vercel rollback, Stripe disable, DNS revert)
```

### Rollback Procedure

| Failure scenario | Rollback action | RTO |
|---|---|---|
| Booking flow broken | Vercel rollback to previous deployment | < 2 min |
| Data corruption | Supabase point-in-time recovery (30-day window) | < 15 min |
| Payment processing error | Disable Stripe webhook handler, rollback to previous API deploy | < 5 min |
| Email sending broken | Flip Trigger.dev task to SendGrid fallback | < 10 min |
| Full system failure | DNS swap to static maintenance page | < 5 min |

---

## Appendix A: Week-by-Week Owner Allocation

| Week | Lead engineer | Frontend engineer | QA/DevOps |
|---|---|---|---|
| 1 | Schema, auth, CRUD APIs, availability engine | Component library setup, booking page mockup | Supabase project, CI pipeline |
| 2 | Booking creation API, Stripe intents, email tasks | Public booking page, confirmation screen, calendar links | Integration test suite, availability edge cases |
| 3 | SES production, Trigger.dev tasks, Stripe Connect, payment webhooks | — (offloading to lead on infra) | Email deliverability testing, Stripe test mode |
| 4 | Payment polish, cron scheduling, webhook reliability | Admin dashboard: schedule, clients, stats, no-show charts | Full booking+payment E2E tests |
| 5 | Intake form builder, Dropbox Sign integration, PDF gen, R2 | Public intake form routing, portal mockups | Security audit, HIPAA checklist |
| 6 | Production deployment, monitoring, rollback scripts | Client portal pages, QA fixes | Full QA pass, OWASP scan, deployment |

## Appendix B: Budget Estimates (Monthly Infrastructure)

| Service | Starter tier (up to 5 businesses) | Pro tier (up to 25 businesses) |
|---|---|---|
| Supabase | $25/mo (Pro) | $75/mo (Team) |
| AWS SES | $5/mo (50k emails) | $25/mo (250k emails) |
| Trigger.dev | $25/mo (Starter) | $50/mo (Pro) |
| Stripe Connect | $0/mo + 0.25% + $0.30/transaction | $0/mo + 0.25% + $0.30/transaction |
| Dropbox Sign | $15/mo (5 requests) | $150/mo (unlimited) |
| Cloudflare R2 | $0/mo (10GB free) | $5/mo (50GB) |
| Vercel | $20/mo (Pro) | $200/mo (Enterprise) |
| Sentry | $0/mo (free tier) | $29/mo (Team) |
| Twilio (SMS) | $0 (email-only) | $10/mo (SMS fallback) |
| **Total** | **~$90/mo** | **~$544/mo** |

At $197/mo (Starter) × 5 clients = $985/mo → 90% margin after infra.
At $497/mo (Pro) × 25 clients = $12,425/mo → 95% margin after infra.
