# PRD: BookSmart — Unified Booking & Client Intake System

| **Field** | **Detail** |
|---|---|
| **Product** | BookSmart |
| **Stage** | Phase 1 — MVP |
| **Author** | Product Manager |
| **Date** | 2026-06-30 |
| **Status** | Draft |

---

## 1. Problem Statement

Service-based businesses in North America operate on thin margins and face a fragmented technology landscape that leaks revenue at every touchpoint.

### The No-Show Crisis

The service industry loses **$26B annually** to no-shows (Mewayz Market Report, 2026). A single dental practice averages **$67K/yr in lost revenue** from missed appointments. Chiropractic clinics report no-show rates of 12–20%, with the highest rates among new-patient consultations.

### The Friction Barrier

**71% of regular clients prefer online booking**, yet the majority of service businesses still require a phone call to schedule. Every phone-based booking is a dropout risk — the client gets voicemail, plays tag, or simply abandons the attempt. The same friction applies to intake paperwork: clients arrive 10 minutes early to fill out paper forms, or staff spends 5 minutes per appointment entering data manually.

### The Tool Fragmentation Problem

To run a modern service business, owners are told they need:

| Tool | Purpose | Monthly Cost |
|---|---|---|
| Calendly | Appointment scheduling | $14/mo |
| DocuSign / e-sign | Digital waivers & consent | $25/mo |
| Review platform (BirdEye / Reputation) | Review generation | $25/mo+ |
| JotForm / Typeform | Intake forms | $30/mo |
| Practice management | Patient records | $100–500/mo |

That's **4+ separate tools** doing what one unified system should. The average business uses **8.7 tools** in their stack; **94% pay for at least one they "rarely use"** (Mewayz 2026). Integration tax — moving data between tools — consumes 3–6 staff hours per week.

### Existing Solutions Are Not Enough

| Pain Point | Source |
|---|---|
| "Curve Dental was down for 6+ hours — couldn't book a single patient" | r/Dentistry |
| "Vagaro is extremely glitchy. Double-booked 3 clients last week." | r/SalonOwners |
| "Acuity scheduling errors caused a client to show up at wrong time." | r/smallbusiness |
| "Square Appointments doesn't handle waivers. Clients fill them on paper." | Google Play reviews |

**The core insight:** No existing tool combines **booking + intake forms + e-sign waivers + review automation** in a single, fast, affordable package. That is BookSmart's wedge.

---

## 2. Target Personas

### Persona 1: Dr. Sarah Chen — Dental Practice Owner

| Attribute | Detail |
|---|---|
| **Demographics** | 45, female, DDS, owns a 3-chair general dentistry practice in Phoenix, AZ |
| **Staff** | 2 hygienists, 1 front-desk receptionist, 1 office manager |
| **Volume** | ~80 appointments/week (16/day), mix of cleanings, fillings, crowns, new-patient exams |
| **Current Stack** | Curve Dental ($399/mo) for charting/records, Calendly ($14/mo) for new-patient booking, paper intake forms, manual phone reminders, no review automation |
| **Pain Points** | Curve Dental has recurring outages; clients complain they can't book online; intake forms are paper (lost 3x last month); no-show rate is 14% ($93K/yr loss); front desk spends 2 hrs/day on reminder calls |
| **Budget** | Willing to spend up to **$600/mo** on software that reduces admin burden |
| **Decision Criteria** | Reliability (cannot go down), ease of use for elderly patients, seamless waiver/e-sign for HIPAA consent forms, integration with existing Curve Dental if possible |
| **Buying Triggers** | A major no-show day (4+ missed), another Curve outage, or a new-patient complaint about booking friction |

Dr. Sarah needs a system where a new patient can go from "find me on Google" → "book a cleaning" → "fill out medical history" → "sign consent" in under 3 minutes, with zero staff involvement.

---

### Persona 2: Marcus Williams — Salon Owner

| Attribute | Detail |
|---|---|
| **Demographics** | 38, male, owns a mid-tier unisex salon in Atlanta, GA |
| **Staff** | 6 stylists (2 senior, 4 junior), 1 receptionist |
| **Volume** | ~120 appointments/week (24/day), cuts, color, blowouts, waxing |
| **Current Stack** | Vagaro ($95/mo) for booking + POS, paper service consent forms (for color/chemicals), Instagram for marketing, no automated review system |
| **Pain Points** | Vagaro double-booked 3 clients in one week; receptionist manually reconciles; no digital waivers (clients sign paper waivers for chemical services — lost 12 in 6 months); 18% no-show rate on Saturdays; no auto-reminders for color touch-ups (repeat revenue opportunity); "Vagaro's glitchiness makes me look unprofessional" |
| **Budget** | **$400–500/mo** — price-sensitive but will pay to look professional |
| **Decision Criteria** | Instagram-friendly booking link, mobile-first for stylist scheduling, built-in intake forms for chemical service waivers, reliable double-booking prevention, easy staff onboarding (stylists are not tech-savvy) |

Marcus needs a system that eliminates paper waivers, prevents double bookings, auto-reminds clients about touch-up appointments, and automatically asks for Google reviews after every visit.

---

### Persona 3: Tony Russo — Auto Shop Manager

| Attribute | Detail |
|---|---|
| **Demographics** | 52, male, manages a family-owned 4-bay auto repair shop in Cleveland, OH |
| **Staff** | 4 mechanics, 1 front-desk service writer (his daughter) |
| **Volume** | ~60 appointments/week (12/day), oil changes, brakes, diagnostics, major repairs |
| **Current Stack** | Square Appointments ($0/mo, free tier), paper work orders, phone booking only, cash register |
| **Pain Points** | Square Appointments is too simplistic — no intake forms for vehicle info (year/make/model/mileage), no digital authorization for repairs, no waiver for test drives; clients drop off keys and paper gets lost; "I had a client say I did $2K of work they didn't authorize — had to eat the cost"; customers don't leave reviews even though work is good |
| **Budget** | **$300/mo** — very cost-sensitive; must see immediate ROI |
| **Decision Criteria** | Simple interface (his daughter runs the front desk), vehicle intake forms, digital repair authorization with e-sign, automated review requests, no per-transaction fees |

Tony needs a system where a client can book an oil change, enter their vehicle info, sign a digital repair authorization, and get reminded via email — all before pulling into the bay.

---

## 3. Success Metrics (OKRs)

### Objective 1: Eliminate Fragmented Booking Stack

| KR | Target | Measurement |
|---|---|---|
| KR1: Replace 4+ separate tools with 1 unified system | 100% of clients using intake + booking + e-sign in BookSmart | Feature adoption analytics; tool stack audit per client |
| KR2: Reduce no-show rate from ~12% to <5% within 60 days | <5% no-show rate | Compare 60-day pre-launch vs 60-day post-launch no-show data |
| KR3: Reduce admin time on booking tasks by 80% | 80% reduction | Time tracking: phone call minutes, reminder call minutes, paperwork processing time |

### Objective 2: Drive Client Adoption

| KR | Target | Measurement |
|---|---|---|
| KR1: 70% of regular clients use online booking within 30 days | 70% adoption | Booking source tracking (online vs phone) |
| KR2: 50% of intake forms completed pre-appointment | 50% completion rate | Intake form completion analytics; reduce in-office paperwork time |
| KR3: 60% of clients receive at least one reminder email | 60% delivery | Email delivery logs; compare to prior manual reminder rate |

### Objective 3: Agency Profitability

| KR | Target | Measurement |
|---|---|---|
| KR1: 8 paying clients in Year 1 | 8 clients signed | Sales pipeline tracking |
| KR2: < 1 week build time per client | ≤ 5 business days | Project tracking; template reusability measurement |
| KR3: Monthly churn < 5% | < 5% churn | Subscription cancellations / total active clients |

---

## 4. Competitive Landscape

| Feature | **BookSmart** | **Calendly** | **Acuity Scheduling** | **Vagaro** | **Booksy** | **Square Appts** |
|---|---|---|---|---|---|---|
| **Pricing** | $497/mo (flat) | $14/mo (basic) | $16/mo (basic) | $95/mo (basic) | $29.95/mo (basic) | $0/mo (free tier) |
| **Intake Forms** | ✅ Built-in form builder | ❌ None | ✅ Basic custom forms | ❌ None | ❌ None | ❌ None |
| **E-Sign / Waivers** | ✅ Canvas e-sign + PDF | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **Review Automation** | ✅ Google + Yelp auto-email | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **Email Reminders** | ✅ Trigger.dev (Gmail SMTP) | ✅ Basic (email only) | ✅ Email + SMS (extra) | ✅ Yes | ✅ Yes | ✅ Yes |
| **No Double-Booking** | ✅ DB-level constraint | ✅ Yes | ✅ Yes | ❌ Reported bugs | ✅ Yes | ✅ Yes |
| **Client Portal** | ✅ View history, reschedule | ❌ None | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Basic |
| **Staff Management** | ✅ Per-staff hours, holidays, buffer | ❌ Basic (round-robin) | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Basic |
| **HIPAA-Ready** | ✅ (dental/medical) | ❌ Not designed for it | ❌ Not designed for it | ❌ Not designed for it | ❌ Not designed for it | ❌ Not designed for it |
| **Setup Cost** | $5K one-time | Free | Free | Free | Free | Free |
| **Integration Tax** | None — all in one | Needs + forms + e-sign + reviews | Needs + e-sign + reviews | Needs + forms + e-sign | Needs + forms + e-sign + reviews | Needs + forms + e-sign + reviews |

### Gaps BookSmart Fills

1. **Calendly** is a single-purpose scheduler. No intake forms, no e-sign, no reviews. To replicate BookSmart with Calendly, a business needs 3+ additional tools ($75+/mo) plus integration headaches.
2. **Acuity** has basic forms but no e-sign and no review automation. Waivers still require paper or a separate DocuSign subscription.
3. **Vagaro** is salon-centric, glitchy (confirmed double-booking Reddit threads), and doesn't do waivers or intake forms.
4. **Booksy** targets barbers exclusively — no dental, no auto, no chiropractic. Limited service categories.
5. **Square Appointments** is the closest in scope (free, basic booking) but has zero intake forms, zero e-sign, zero review automation. Tony's repair authorizations still need paper.

**BookSmart's competitive moat:** the first (and only) tool that combines booking + intake + waivers + reviews in one system, priced at a point that saves businesses $100+/mo compared to maintaining 4 separate tools.

---

## 5. Feature Specifications

### MVP Features (Build #1 — Must Have)

#### 5.1 Booking Engine

| ID | Feature | Detail |
|---|---|---|
| BE-01 | Public booking page | Subdomain URL (`business.booksmart.app`). Shows business name, logo, services. Fully responsive. |
| BE-02 | Service selection | Admin-configurable service catalog with name, duration, price, description, category. Client picks service first. |
| BE-03 | Staff selection | After service, client picks from available staff (or "any available"). Shows staff photos, titles. |
| BE-04 | Date/time picker | Real-time availability grid. 30-min slots. Grey out booked + blocked. Timezone-aware via `Intl.DateTimeFormat` client detection. |
| BE-05 | Buffer times | Configurable gap between appointments per staff (e.g., 15min between patients for room cleanup). |
| BE-06 | Holidays & blackouts | Admin sets closed dates, recurring weekly off days, and per-staff blackout blocks. |
| BE-07 | Admin calendar views | Day / Week / Month toggle. Color-coded by service type. Drag-and-drop reschedule. |
| BE-08 | Double-booking prevention | `UNIQUE` constraint on `(staffId, startTime)` at database level + application-level optimistic locking. |
| BE-09 | Cancel / reschedule | Client can cancel or reschedule from email link or client portal. Admin sets cancel window (e.g., 4h before). |

#### 5.2 Intake Forms

| ID | Feature | Detail |
|---|---|---|
| IF-01 | Form builder (admin) | Drag-and-drop field palette: text input, textarea, select (single), checkbox (multi), radio group, file upload, date picker, signature. |
| IF-02 | Per-service form assignment | Admin assigns an intake form to one or more services. Different services (e.g., "New Patient Exam" vs "Root Canal") can have different forms. |
| IF-03 | Pre-appointment email | When appointment is booked, system emails the intake form link. Client completes before arrival. |
| IF-04 | In-office tablet mode | Admin can open a client's intake form on an iPad/kiosk for walk-ins. |
| IF-05 | Conditional logic | Show/hide fields based on previous answers (MVP: simple "if answer = X, show field Y"). |
| IF-06 | File upload | Client uploads images (e.g., insurance card photo). Stored in Cloudflare R2. |

#### 5.3 Digital Waivers (E-Sign)

| ID | Feature | Detail |
|---|---|---|
| DW-01 | Canvas signature pad | HTML5 `<canvas>` component. Mouse/touch draw. "Clear" button. Saves as base64 + PNG. |
| DW-02 | Embedded in intake flow | Signature field is the last step before confirmation. Client signs waiver as part of booking. |
| DW-03 | PDF generation | Server-side PDF generation (via `pdf-lib` or similar) combining: (1) waiver text, (2) client name + date, (3) signature image, (4) appointment details. |
| DW-04 | R2 storage | Signed PDF uploaded to Cloudflare R2 in path: `/{businessId}/{appointmentId}/waiver.pdf`. Public URL stored in database. |
| DW-05 | Admin download | Admin can view/download signed PDF from client profile or appointment detail. |

#### 5.4 Client Management

| ID | Feature | Detail |
|---|---|---|
| CM-01 | Client profiles | Each client record: name, email, phone, address, DOB, notes, tags. |
| CM-02 | Appointment history | Reverse-chronological list of past + upcoming appointments. Links to intake form submissions and signed waivers. |
| CM-03 | Client portal | Optional login (magic link via email). Clients view upcoming appointments, reschedule, download past waivers. |
| CM-04 | Merge duplicates | Admin can merge duplicate client records (same email or phone) — keeps history, drops duplicate. |

#### 5.5 Email Automation

| ID | Feature | Detail |
|---|---|---|
| EA-01 | Confirmation email | Immediate on booking. Includes: service, staff, date, time, location, intake form link, cancel/reschedule link. |
| EA-02 | Reminder 48h before | "Your appointment with [Staff] at [Business] is in 2 days." Includes intake link if not completed. |
| EA-03 | Reminder 24h before | Same as 48h but at 24h mark. Admin can toggle each reminder on/off. |
| EA-04 | Review request 2h after | "Thanks for visiting [Business]! Leave a review: [Google] [Yelp]." |
| EA-05 | Configurable timing | Admin dashboard: set hours-before for each reminder. Per-business configuration stored in DB. |
| EA-06 | Email engine | Trigger.dev cron jobs + Nodemailer via Gmail SMTP (500 emails/day free limit). Queued delivery. |

#### 5.6 Review Automation

| ID | Feature | Detail |
|---|---|---|
| RA-01 | Auto email | Review request fires 2h after appointment end time (configurable). |
| RA-02 | Dashboard stats | Total review requests sent, emails opened (tracking pixel), links clicked, response rate %. |
| RA-03 | Business links config | Admin enters their Google Business Profile URL and Yelp business page URL in settings. |

#### 5.7 Admin Dashboard

| ID | Feature | Detail |
|---|---|---|
| AD-01 | Today's schedule | Card view of today's appointments. Cards show: time, client name, service, staff, status (confirmed/checked-in/no-show/cancelled). |
| AD-02 | Upcoming appointments | Next 7 days. List view. Filterable by staff, service, status. |
| AD-03 | Client list + search | Searchable table of all clients. Click → profile. |
| AD-04 | No-show stats | Last 30/60/90 days: total appointments, no-shows, no-show %. Cost savings calculator: no-shows avoided × avg ticket price. |
| AD-05 | Review analytics | Requests sent, open rate, click-through rate. |

---

### V2 Features (Future Builds)

| ID | Feature | Priority | Notes |
|---|---|---|---|
| V2-01 | SMS reminders (Twilio) | High | Clients without email. Text reminders with opt-out. ~$0.0079/msg. |
| V2-02 | Online payments / deposits (Stripe) | High | Collect deposit at booking to reduce no-shows further. Stripe Connect for payout splitting. |
| V2-03 | Two-way calendar sync (Google/Outlook) | High | Staff see BookSmart appointments in their personal calendar. OAuth2 + webhook sync. |
| V2-04 | Waitlist management | Medium | Auto-notify when a slot opens. FIFO queue per staff/service. |
| V2-05 | Group booking / multi-client | Medium | Salon: book 2+ people same slot. Dental: family block booking. |
| V2-06 | Recurring appointment templates | Medium | "Every 6 months cleaning" auto-booking. Configurable interval. |
| V2-07 | Automated follow-up surveys | Low | NPS survey 24h after appointment. Dashboard of trends. |
| V2-08 | White-label custom domain | Low | `book.yourbusiness.com` instead of subdomain. |
| V2-09 | Multi-location management | Low | One account, multiple locations, centralized or per-location admin. |
| V2-10 | Zapier / Make integration | Low | Webhook triggers for external workflows. |

---

## 6. User Flows

### Flow 1: Client Books an Appointment (End-to-End)

```
Step 1: LANDING
  Client opens booking link (email, website button, Google Maps).
  → Sees business name, logo, "Book an Appointment" CTA.

Step 2: SELECT SERVICE
  Client sees service catalog grouped by category.
  → Clicks "New Patient Exam" (30 min, $89).
  → If only 1 service, skip to step 3.

Step 3: SELECT STAFF
  Client sees available staff: photos, title, "Next Available" badge.
  → Clicks "Dr. Chen" (shows next 3 available slots for her).
  → OR clicks "Any Available" (shows combined calendar).

Step 4: PICK DATE & TIME
  Calendar view shows 4 weeks ahead.
  → Available slots in green, booked in grey, blocked in red (holiday).
  → Client clicks "Thu, Jul 3 @ 10:00 AM".

Step 5: ENTER CLIENT INFO
  → New client: Name, Email, Phone (required). DOB, Address (optional).
  → Returning client: Email auto-fills profile (magic link login).

Step 6: COMPLETE INTAKE FORM
  Intake form loaded (assigned to "New Patient Exam"):
    - Reason for visit (textarea)
    - Medical history (checkboxes: heart condition, diabetes, etc.)
    - Insurance provider (select: Delta, Cigna, MetLife, None)
    - Upload insurance card photo (file upload → R2)
  → Client fills + clicks "Next".

Step 7: E-SIGN WAIVER
  Waiver text displayed: consent to treatment, privacy policy, financial responsibility.
  → "I have read and agree" checkbox.
  → Signature field: client draws signature on canvas.
  → Clicks "Sign & Confirm".

Step 8: CONFIRMATION
  → Green checkmark animation.
  → "Your appointment is confirmed!"
  → Details: Dr. Chen, Thu Jul 3 @ 10:00 AM, 30 min.
  → "Add to Calendar" links (.ics file download).
  → Email confirmation sent instantly.

Total time: ~90 seconds for returning client, ~3 minutes for new client.
```

### Flow 2: Admin Sets Up Business (Onboarding)

```
Step 1: CREATE BUSINESS PROFILE
  Business name, address, phone, logo upload, timezone, welcome message.

Step 2: ADD STAFF
  For each staff member:
    - Name, title, photo, bio (optional).
    - Default weekly hours (Mon 9-5, Tue 9-5, ...).
    - Buffer time between appointments (default 15 min).
    - Services they can perform (checkboxes).

Step 3: ADD SERVICES
  For each service:
    - Name, duration (min), price ($), category.
    - Description (optional).
    - Assigned staff (checkboxes).
    - Assigned intake form (dropdown).

Step 4: CONFIGURE INTAKE FORMS
  Form builder:
    - Drag fields from palette → canvas.
    - Edit field label, placeholder, required toggle.
    - "Save as template" for re-use.
  → Assign form to service(s).

Step 5: CONFIGURE REMINDER TIMING
  → Confirmation: always on.
  → Reminder 48h: toggle, default 48 hours before.
  → Reminder 24h: toggle, default 24 hours before.
  → Review request: toggle, default 2 hours after.

Step 6: SET BLACKOUTS / HOLIDAYS
  → Select date → "Closed all day" or "Closed 12-2 PM".
  → Recurring: "Every Sunday", "1st Monday of month".

Step 7: LAUNCH
  → "Copy booking link" button → share on website, email signature, social media.
  → Booking page goes live.

Setup time with templates: ~45 minutes for a basic profile.
```

### Flow 3: Admin Daily Operations

```
MORNING (8:00 AM)
  → Login → Dashboard.
  → "Today's Schedule" shows 12 appointments.
  → One client marked "New" (first visit) — orange badge.
  → Notes: "Client has insurance card photo uploaded."

CHECK-IN (Client Arrives)
  → Admin clicks "Check In" on appointment card.
  → If intake not yet completed, "Open Intake Form" button opens tablet mode.
  → Client verifies info, signs iPad.
  → Admin marks "Checked In".
  → If intake was completed pre-appointment, just confirm.

NO-SHOW HANDLING
  → 15 min after appointment start, admin marks "No Show".
  → System auto-sends "We missed you — reschedule here" email.
  → No-show logged for stats.

END OF DAY (5:00 PM)
  → Dashboard: "9 completed, 1 no-show, 2 cancelled."
  → No-show rate today: 10% (monthly avg: 8%).
  → Cost savings calculator: "You recovered $1,245 in prevented no-shows this month."
  → Review requests sent today: 9. Opened: 6. Clicked: 2.
```

---

## 7. Non-Functional Requirements

### 7.1 Accessibility (WCAG AA)

| Requirement | Standard |
|---|---|
| Color contrast ratio ≥ 4.5:1 for normal text | WCAG 1.4.3 |
| All form fields have visible labels | WCAG 1.3.1, 3.3.2 |
| Keyboard navigable (Tab, Enter, Escape) | WCAG 2.1.1 |
| Focus indicators visible | WCAG 2.4.7 |
| Error messages associated with fields via `aria-describedby` | WCAG 3.3.1 |
| Skip-to-content link on all pages | WCAG 2.4.1 |
| Screen-reader friendly: semantic HTML, proper heading hierarchy | WCAG 1.3.1 |

### 7.2 Responsive Design

| Breakpoint | Target |
|---|---|
| 390px – 480px | Mobile (primary booking audience) |
| 481px – 768px | Tablet / kiosk mode |
| 769px – 1024px | Small desktop / iPad landscape |
| 1025px – 1440px | Full desktop (admin dashboard) |

- Booking page must be mobile-first (most clients book from phone).
- Admin dashboard is desktop-primary but readable on tablet.

### 7.3 Performance

| Metric | Target |
|---|---|
| Lighthouse Performance score | ≥ 85 |
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |

- Booking page statically generated (or server-rendered) for instant load.
- Admin dashboard client-side rendered (Vite + React SPA).
- Images served via Cloudflare R2 with CDN caching.

### 7.4 Reliability

| Requirement | Implementation |
|---|---|
| No double bookings | DB-level `UNIQUE(staffId, startTime)` + application-level pessimistic lock via `SELECT ... FOR UPDATE` at transaction start |
| Zero SPOF in booking path | If Trigger.dev is down, fallback to direct Node.js `setTimeout` for reminder emails (best-effort). Booking engine is pure DB + API — no external dependencies. |
| Uptime SLA | Target 99.5% (commercial hosting with monitoring via Better Stack / healthchecks.io) |
| Data backup | Daily PostgreSQL dump to R2. Point-in-time recovery via WAL archiving. |

### 7.5 Security

| Requirement | Implementation |
|---|---|
| HTTPS everywhere | Cloudflare proxy + HSTS headers |
| E-sign audit trail | DB row: `signedAt`, `signerIp`, `signerUserAgent`, `waiverVersion` |
| File upload validation | MIME type check, file size limit (10MB), virus scan (ClamAV via API) |
| Rate limiting | 10 requests/min per IP on booking endpoints |
| SQL injection prevention | Prisma parameterized queries |
| CSRF protection | SameSite cookies + CSRF tokens on state-changing endpoints |

### 7.6 Booking Confirmation Time

- **Target:** < 2 seconds from "Sign & Confirm" click to confirmation page render.
- Booking transaction is: validate slots → create appointment → send confirmation email (fire-and-forget via queue) → return confirmation.
- Slow path: PDF generation (waiver) — if > 500ms, generate async and email PDF link separately.
- Measured via `Server-Timing` header and Datadog/R2 monitoring.

---

## 8. Constraints

### 8.1 Zero Paid API Dependencies (MVP)

| Need | Free Solution | Limitations |
|---|---|---|
| Email delivery | Gmail SMTP via Nodemailer | 500 emails/day free; queue to stay under limit |
| File/PDF storage | Cloudflare R2 (S3-compatible) | 10GB free; egress cost after 10GB/mo |
| Cron / async tasks | Trigger.dev (free tier) | 2 concurrent runs, 500 runs/mo free |
| SMS (V2) | Twilio (paid) | ~$0.0079/msg — client pays or included in $497/mo |
| Payments (V2) | Stripe (paid) | 2.9% + $0.30/transaction — passed to client or absorbed |

### 8.2 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS 3 + shadcn/ui |
| Backend | Node.js + Express (or Hono for edge) |
| Database | PostgreSQL (via Supabase or self-hosted on VPS) |
| ORM | Prisma |
| Scheduling Engine | Trigger.dev (cron + webhooks) |
| Email | Nodemailer + Gmail SMTP |
| File Storage | Cloudflare R2 (S3 API) |
| Hosting | VPS (DigitalOcean $12/mo or Railway) |
| Monitoring | Healthchecks.io (free) + Sentry (free tier) |

### 8.3 Agency Model

| Constraint | Detail |
|---|---|
| Setup fee | **$5,000** (one-time) — includes: subdomain setup, service catalog configuration, intake form creation, waiver template setup, staff onboarding, 1hr training call |
| Monthly fee | **$497/mo** — includes: hosting, all features, email delivery, storage, support (email + chat, response < 4h business hours) |
| Build time | **≤ 1 week per client** — timeboxed. Day 1: DB schema + deploy. Day 2: services + staff + forms. Day 3: booking page + intake flow. Day 4: e-sign + PDF. Day 5: email automation + QA + go-live. |
| Client responsibility | Business provides: logo, service list, staff list, hours, waiver text, Google/Yelp URLs. |

### 8.4 Non-Negotiables

- **No per-seat pricing.** Flat $497/mo regardless of staff count.
- **No long-term contracts.** Month-to-month. Client can cancel anytime.
- **No third-party login required for clients.** No "Sign in with Google" gate — booking should be frictionless.
- **No advertising or "Powered by" branding required.** BookSmart white-labels the booking page with the client's brand.

---

## Appendix A: Architecture Sketch (Logical)

```
Client Device (Mobile / Desktop / Tablet)
        │
        ▼
  ┌─────────────────┐
  │  Cloudflare DNS  │  (SSL termination, DDoS protection)
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  Vite + React   │  (Static SPA hosted on VPS / CDN)
  │  Tailwind CSS   │
  └────────┬────────┘
           │ (API calls /json)
  ┌────────▼────────┐
  │  Node.js API    │  (Express or Hono — REST endpoints)
  │  Prisma ORM     │
  └────┬────┬────┬──┘
       │    │    │
  ┌────▼┐ ┌▼───┐│┌───▼────┐
  │     │ │    │││        │
  │ PG  │ │ R2 │││Trigger │
  │ DB  │ │    │││ .dev   │
  │     │ │    │││        │
  └─────┘ └────┘│└───┬────┘
                │    │
                │ ┌──▼────┐
                │ │Gmail  │
                │ │ SMTP  │
                │ └───────┘
                │
                │ Email Queue (async)
                └─────────────────────────
```

## Appendix B: Key SQL Schema (Prisma Model Outline)

```prisma
model Business {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logoUrl   String?
  address   String?
  phone     String?
  timezone  String   @default("America/New_York")
  welcomeMsg String?
  googleReviewUrl String?
  yelpReviewUrl  String?
  createdAt DateTime @default(now())
  staff     Staff[]
  services  Service[]
  clients   Client[]
  intakeForms IntakeForm[]
  holidays  Holiday[]
  settings  BusinessSetting[]
}

model Staff {
  id        String   @id @default(cuid())
  businessId String
  business  Business @relation(fields: [businessId], references: [id])
  name      String
  title     String?
  photoUrl  String?
  bio       String?
  bufferMin Int      @default(15)
  hours     StaffHour[]
  bookings  Booking[]
  services  ServiceStaff[]
}

model Service {
  id         String   @id @default(cuid())
  businessId String
  business   Business @relation(fields: [businessId], references: [id])
  name       String
  duration   Int      // minutes
  price      Decimal  @db.Decimal(10,2)
  category   String?
  intakeFormId String?
  intakeForm IntakeForm? @relation(fields: [intakeFormId], references: [id])
  staff      ServiceStaff[]
  bookings   Booking[]
}

model Booking {
  id         String   @id @default(cuid())
  businessId String
  clientId   String
  staffId    String
  serviceId  String
  startTime  DateTime
  endTime    DateTime
  status     String   @default("confirmed") // confirmed | checked-in | no-show | cancelled | completed
  intakeData Json?    // submitted form answers
  waiverUrl  String?  // R2 PDF URL
  signedAt   DateTime?
  createdAt  DateTime @default(now())
  business   Business @relation(fields: [businessId], references: [id])
  client     Client   @relation(fields: [clientId], references: [id])
  staff      Staff    @relation(fields: [staffId], references: [id])
  service    Service  @relation(fields: [serviceId], references: [id])

  @@unique([staffId, startTime]) // no double-booking
  @@index([businessId, startTime])
  @@index([clientId, startTime])
}
```

*(Full schema expanded during implementation. This is the core booking + constraint model.)*
