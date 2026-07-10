# BookSmart — Offer Architecture & Pricing Document

**Agent**: Offer Strategist
**Product**: BookSmart — Unified Booking & Client Intake Platform
**Target Market**: Service-based businesses (dentists, chiropractors, salons, auto repair)
**Version**: 1.0

---

## 1. Offer Architecture

### Core Offer: BookSmart Launch Package

| Component | Detail |
|-----------|--------|
| **Setup Fee** | $5,000 (one-time) |
| **Monthly Retainer** | $497/mo |
| **Build Time** | 1 week |
| **Delivery** | White-glove setup, done-for-you configuration |

**What's Included:**

| Feature | Detail |
|---------|--------|
| Booking Page | Real-time availability synced to client calendar (Google / Outlook / iCal). Fully branded, mobile-responsive embeddable widget or standalone page. Client self-schedules, reschedules, cancels online. Automated timezone detection. Buffer/block times. |
| Intake Forms | Custom digital intake forms per appointment type (HIPAA-compliant for dental/medical). Conditional logic fields. Auto-attached to client profile upon submission. |
| Digital Waivers (E-Sign) | Legally binding e-signature on waivers, consent forms, treatment plans. Full audit trail with timestamps and IP logging. Signed documents stored permanently and downloadable. |
| Email Reminders | Automated confirmation, reminder (48h and 24h before), and follow-up sequences triggered by appointment status. Fully white-labeled from your domain. Configurable timing and messaging per appointment type. |
| Client Portal | Private login per client showing: upcoming/past appointments, completed forms, signed waivers, invoices/payment history, ability to rebook without re-entering info. |
| Review Request Automation | Post-appointment SMS/email sequence requesting Google/Facebook/Yelp review. Smart timing (sent 2h after appointment end). Direct deep-link to review page. Dashboard shows review volume trend. |
| Referral Tracking | Unique referral link/code per client. Tracks who referred whom. Reports: referrals sent, converted, reward status. |

**Delivery Milestones (1-Week Sprint):**

| Day | Milestone |
|-----|-----------|
| Day 1 | Account provisioning, calendar integration, business hours/config intake |
| Day 2 | Booking page build & branded theming |
| Day 3 | Intake forms & digital waivers configured per appointment type |
| Day 4 | Email reminder sequences configured, client portal activated |
| Day 5 | Review automation & referral tracking configured, QA pass, client training call |
| Day 6 | Go-live + staff onboarding walkthrough (60-min screen share) |
| Day 7 | Post-launch buffer & bug squash |

---

### Upsell Tier: BookSmart Grow (Multi-Location)

| Component | Detail |
|-----------|--------|
| **Setup Fee** | $7,500 (one-time) |
| **Monthly Retainer** | $797/mo |
| **Build Time** | 2 weeks |
| **Ideal For** | Practices with 2+ physical locations |

**Everything in Launch, plus:**

| Feature | Detail |
|---------|--------|
| Multi-Location Dashboard | Single login shows all locations. Unified calendar view or per-location toggle. Global settings propagate or per-location override. |
| Aggregate Reporting | Combined analytics: booking volume, no-show rate, revenue per location, form completion rate, review count. Exportable CSVs/PDFs. |
| Per-Location Drill-Down | Click any location to see its standalone metrics. Compare side-by-side (e.g., "Location A vs B no-show rate this month"). |
| Staff Cross-View | See all providers across all locations in one grid. Filter by role, location, availability. Swap coverage, view schedules overlapped. |

**Delivery Milestones (2-Week Sprint):**

| Week | Focus |
|------|-------|
| Week 1 | Core setup (same as Launch) × primary location + multi-location architecture |
| Week 2 | Onboard remaining locations, aggregate reporting build, staff cross-view, full QA, training call per location liaison |

---

### Bundled Offer: BookSmart + ReferralEngine

| Component | BookSmart Launch Alone | ReferralEngine Alone | **Bundle** |
|-----------|----------------------|---------------------|------------|
| Setup Fee | $5,000 | $5,000 | **$8,500** (save $1,500) |
| Monthly | $497/mo | $497/mo | **$797/mo** (save $197/mo) |

**Total Year-1 Savings: $1,500 setup + $2,364 annual = $3,864**

ReferralEngine is a standalone referral marketing platform: automated referral links, reward tracking, referral contest campaigns, SMS/email referral requests, leaderboard, and analytics dashboard. Bundled with BookSmart, referral data flows seamlessly — referred clients auto-populate into the booking system and both tools share the same client database.

---

### Enterprise Tier (Custom)

| Component | Detail |
|-----------|--------|
| **Setup Fee** | $15,000 (one-time) |
| **Monthly Retainer** | $1,497/mo |
| **Build Time** | 4-6 weeks |
| **Ideal For** | 10+ locations, franchises, or enterprise chains with custom workflow requirements |

**Everything in Grow, plus:**
- Custom API integrations (existing PMS, EHR, or legacy CRM)
- Dedicated success manager
- Custom branding/themes per location
- SSO / SAML
- Advanced reporting (data warehouse connector, custom dashboards)
- SLA guarantee (99.9% uptime, 4hr response)
- Multi-currency / multi-language
- White-label mobile app (iOS + Android)

---

## 2. Pricing Justification

### Competitive Landscape

| Tool Category | Example | Monthly Cost | Missing |
|--------------|---------|-------------|---------|
| Online Booking | Calendly Pro | $16/mo | No waivers, no forms, no referral tracking |
| E-Signature | DocuSign Standard | $45/mo | No booking, no reminders, no portal |
| Review Automation | Birdeye / Podium | $299+ / mo | No booking, no waivers, overpriced for small biz |
| Intake Forms | JotForm (HIPAA) | $39/mo | No booking, no esign, no reminders |
| Referral Tracking | ReferralRock | $119/mo | No booking, no intake |
| **Ala Carte Total** | | **$518/mo** | None of these tools share data |
| **BookSmart Launch** | | **$497/mo** | Everything in one system, one login, shared data |

**Why $497/mo is Justified:**

1. **Replaces 4+ tools** — Calendly ($16) + DocuSign ($45) + JotForm ($39) + review tool (~$299) = ~$399/mo minimum, and nothing integrates. BookSmart costs ~$98/mo more but eliminates integration headaches, duplicate data entry, and tech sprawl.

2. **Integrated data** — When a client books, their intake form is auto-assigned. When they sign a waiver, the booking confirmation fires. When the appointment ends, review request + referral link auto-send. This data flow is impossible with separate tools.

3. **No per-seat pricing** — Every staff member, receptionist, provider, and admin gets full access at no extra cost. Calendly Pro is $16/seat. A practice with 4 staff paying Calendly alone would spend $64/mo just on seats.

4. **Agency-level support** — You get a dedicated implementation specialist (not a chatbot) who configures everything. One email or call and changes are made same-day. This is concierge service, not self-serve SaaS.

5. **Custom setup** — Every form, waiver, reminder, and workflow is hand-configured for your specific appointment types, not generic templates.

6. **Hosted & maintained** — No servers, no security patches, no uptime monitoring. We handle compliance (HIPAA readiness, data encryption, backups). You focus on patients.

### No-Show ROI Calculator

**Inputs (example: single-dentist practice):**

| Metric | Value |
|--------|-------|
| Average appointment value | $250 |
| Appointments per day | 12 |
| Business days per month | 22 |
| Typical industry no-show rate | 12% |
| BookSmart reduction target | 58% (to ~5%) |

**Calculation:**

| Line Item | Amount |
|-----------|--------|
| Monthly appointments | 12 × 22 = 264 |
| No-shows at 12% | 31.7 appointments/mo |
| Revenue lost to no-shows | 31.7 × $250 = **$7,920/mo** |
| No-shows at 5% (after BookSmart) | 13.2 appointments/mo |
| Revenue lost after | 13.2 × $250 = **$3,300/mo** |
| **Monthly savings from reduced no-shows** | **$4,620/mo** |
| BookSmart retainer | -$497/mo |
| **Net gain to practice** | **+$4,123/mo** |

**Result:** The practice nets $4,123/mo after paying for BookSmart. Even if no-shows only drop to 8% (a conservative 33% reduction), savings are still $2,640/mo — a 5.3× return on the $497 investment.

At $150 avg appointment value (auto repair or salon): savings drop to ~$2,475/mo at 12%→5% reduction. Still a 5× return.

### Price Anchoring

| Tier | True Value (Anchored) | Actual Price | You Save |
|------|---------------------|-------------|----------|
| Launch | $1,497/mo | **$497/mo** | $1,000/mo (67% off) |
| Grow | $2,497/mo | **$797/mo** | $1,700/mo (68% off) |
| Enterprise | $3,997/mo | **$1,497/mo** | $2,500/mo (63% off) |

The "Value" column represents what it would cost to get equivalent functionality if purchased separately from enterprise-grade vendors with dedicated support, custom integration, and hosted compliance. We anchor high so $497 feels like a deployment of force rather than "just another SaaS subscription."

---

## 3. Lead Magnet — "No-Show Cost Calculator"

### Placement
Embedded on the landing page hero section or directly below the fold. No form to fill — just three sliders and an instant output.

### Design & UX

```
┌─────────────────────────────────────────────────────┐
│  📊   How Much Are No-Shows Costing You?            │
│                                                      │
│  Average Appointment Value                           │
│  ═══════●═══════════════════  $250                   │
│         $25              $500                        │
│                                                      │
│  Appointments Per Day                                │
│  ═══════●═══════════════════  12                     │
│         1                20                           │
│                                                      │
│  Current No-Show Rate                                │
│  ═══════●═══════════════════  12%                    │
│         0%              30%                           │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  You're losing $7,920/mo to no-shows.       │     │
│  │  $95,040/year — gone.                       │     │
│  │                                             │     │
│  │  [See How Much You're Saving →]             │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  *No email required. Results in real-time.           │
└─────────────────────────────────────────────────────┘
```

### Logic

```
monthlyLoss = avgApptValue × apptsPerDay × 22 × (noShowRate / 100)
yearlyLoss  = monthlyLoss × 12
```

### After Click ("See How Much You're Saving →")

Calculator slides to show a second state:

```
┌─────────────────────────────────────────────────────┐
│  With BookSmart, you'd cut no-shows by ~60%.         │
│                                                      │
│  📉   Before:  $7,920/mo lost                        │
│  ✅   After:   ~$3,300/mo lost                       │
│  💰   You save: $4,620/mo                            │
│                                                      │
│  That's $55,440/year back in your pocket.            │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Book a Free Strategy Call  →               │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  *Takes 15min. No obligation. We'll calculate YOUR   │
│   actual numbers together.                           │
└─────────────────────────────────────────────────────┘
```

### Lead Qualification Logic

The calculator doubles as a qualification filter:
- **< $1,000/mo loss** → Show: "You're doing well! When you're ready to automate, we're here."
- **$1,000–$3,000/mo loss** → Show standard CTA for a call.
- **$3,000+/mo loss** → Show urgent CTA + optional "Send me this report" email capture (nurture sequence fires).
- **$5,000+/mo loss** → Automatically flag as hot lead in CRM. Trigger SMS notification to sales team.

### Distribution

1. **Landing page hero** — Primary placement
2. **Social ads** (Facebook, Instagram, LinkedIn) — "Calculate your no-show cost in 10 seconds" ad creative
3. **Email signature** — Every team member's email signature links to the calculator
4. **Google Ads** — "No-show cost calculator [city]" keyword target
5. **YouTube pre-roll** — 10-second teaser leading to calculator page
6. **Printed QR cards** — Leave on front desk counter: "Scan to see what no-shows cost you"

---

## 4. Sales Script — Core Pitch Framework

### The Hook (First 10 Seconds)

**"How much did no-shows cost you last month?"**

> Wait for response. If they don't know: "Most practice owners don't track it — but I ran the numbers based on your appointment volume and it's probably around $X. Want me to show you exactly?"

Alternative hooks (A/B test):
- "How many tools do you use to book a single patient?"
- "What happens when a patient needs to fill out a form AND sign a waiver AND book a follow-up?"

### The Pain (30 Seconds)

**"You're using 4 tools that don't talk to each other."**

> "You've got Calendly for booking, DocuSign for waivers, some form tool for intake, and a separate thing for reviews. None of them share data. So your front desk is manually copying patient info between systems. Forms get lost. Waivers get missed. No-shows slip through because reminders go to spam. And you're paying for 4 subscriptions anyway."

### The Vision (30 Seconds)

**"One page. One login. Booking, forms, waivers, reminders, reviews, referrals."**

> "Imagine a patient goes to your booking page. They pick a time, fill their intake form, and e-sign your waiver — all before they step foot in your office. The system sends confirmations and reminders automatically. After the appointment, it asks for a review and gives them a referral link to share with friends. Every piece of data lives in one place. Your staff logs into ONE portal to see everything."

### The Proof (20 Seconds)

**"Clients cut no-shows by 60% in 30 days."**

> "We've done this for [similar practice type]. They went from 12% no-shows to 5% in the first month. That saved them $4,600/mo — more than 9× what they pay us. Their front desk stopped spending 8 hours a week on reminder calls. Patients love being able to book at 2am."

### The Offer (15 Seconds)

**"Here's what I'd recommend for you:"**

> "We set everything up in one week. $5,000 setup, $497/mo. Full booking page, intake forms, e-sign waivers, automated reminders, client portal, review requests, and referral tracking. We configure it, train your team, and hand it over. No contracts — cancel anytime."

### The Objection Handlers

| Objection | Verbatim Response |
|-----------|-------------------|
| **"Too expensive"** | "I get it — $497 feels like a lot for booking software. But you're already paying ~$64/mo for tools that don't talk AND losing ~$5,500/mo to no-shows. BookSmart saves you $4,600/mo minimum. If it didn't save you money, I'd tell you to pass. But can I show you the math on your actual numbers?" |
| **"I'll think about it"** | "Totally fair. What specifically gives you hesitation? Is it the price, the timing, or something else? If I can address that right now, would you want to move forward?" |
| **"Can I just use Calendly?"** | "Calendly is great for scheduling. But can Calendly e-sign a waiver? Can it send an intake form before the appointment? Can it auto-request a review after? Can it track referrals? It does one thing well. We do the whole patient journey — and it all talks to each other." |

---

## 5. Pricing Page Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔷 BOOKSMART  │  Features  │  Pricing  │  Calculator  │  Log in   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Stop losing patients (and money) to no-shows.               │  │
│  │                                                              │  │
│  │  One platform. Booking, intake, waivers, reminders,          │  │
│  │  reviews, and referrals — all in one place.                  │  │
│  │                                                              │  │
│  │               [Book a Free Strategy Call →]                   │  │
│  │                                                              │  │
│  │  ★★★★☆ "Cut our no-shows by 60% in 30 days." — Dr. Sarah    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │
│  │   ★ LAUNCH    │  │   ★ GROW      │  │   ★ ENTERPRISE│           │
│  │               │  │               │  │               │           │
│  │  $5,000 setup │  │  $7,500 setup │  │  $15,000 setup│           │
│  │  $497/mo      │  │  $797/mo      │  │  $1,497/mo    │           │
│  │               │  │               │  │               │           │
│  │  Best for     │  │  Best for     │  │  Best for     │           │
│  │  single-loc   │  │  multi-loc    │  │  10+ loc      │           │
│  │               │  │               │  │               │           │
│  │  Build: 1 wk  │  │  Build: 2 wks │  │  Build: 4-6wk │           │
│  │               │  │               │  │               │           │
│  │  ┌─────────┐  │  │  ┌─────────┐  │  │  ┌─────────┐  │           │
│  │  │ Get Start│  │  │  │ Get Start│  │  │  │Contact Us│  │           │
│  │  └─────────┘  │  │  └─────────┘  │  │  └─────────┘  │           │
│  └───────────────┘  └───────────────┘  └───────────────┘           │
│                                                                      │
│  Feature Comparison:                                                 │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │ Feature                      │ Launch │ Grow │ Enterprise │      │
│  ├────────────────────────────────────────────────────────────┤      │
│  │ Online booking page          │   ✅   │  ✅  │     ✅     │      │
│  │ Real-time availability sync  │   ✅   │  ✅  │     ✅     │      │
│  │ Digital intake forms         │   ✅   │  ✅  │     ✅     │      │
│  │ E-sign waivers               │   ✅   │  ✅  │     ✅     │      │
│  │ Email reminders              │   ✅   │  ✅  │     ✅     │      │
│  │ Client portal                │   ✅   │  ✅  │     ✅     │      │
│  │ Review automation            │   ✅   │  ✅  │     ✅     │      │
│  │ Referral tracking            │   ✅   │  ✅  │     ✅     │      │
│  │ Multi-location dashboard     │   —    │  ✅  │     ✅     │      │
│  │ Aggregate reporting          │   —    │  ✅  │     ✅     │      │
│  │ Per-location drill-down      │   —    │  ✅  │     ✅     │      │
│  │ Staff cross-view             │   —    │  ✅  │     ✅     │      │
│  │ Custom API integrations      │   —    │  —   │     ✅     │      │
│  │ Dedicated success manager    │   —    │  —   │     ✅     │      │
│  │ SSO / SAML                   │   —    │  —   │     ✅     │      │
│  │ White-label mobile app       │   —    │  —   │     ✅     │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  💰 ROI CALCULATOR — See how much you'll save                │  │
│  │                                                              │  │
│  │  [Appt Value: $___] [Appts/Day: ___] [No-Show Rate: ___%]    │  │
│  │                                                              │  │
│  │  You're losing: $7,920/mo  →  With BookSmart: $3,300/mo      │  │
│  │  You save: $4,620/mo                                         │  │
│  │                                                              │  │
│  │  [See It On A Strategy Call →]                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Social Proof Bar (scrollable logos):                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  [SmileCare Dental]  [Precision Chiropractic]  [Luxe Salon] │   │
│  │  [City Auto Repair]  [Bright Smiles Ortho]  [The Nail Loft] │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Testimonials:                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  "We went from 14% to 4% no-shows in the first month.       │   │
│  │  The ROI was immediate." — Dr. Mark T., Dentist             │   │
│  │                                                              │   │
│  │  "My front desk saves 10 hours a week on reminder calls."   │   │
│  │  — Jessica R., Salon Owner                                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Trust Signals:                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  🔒 HIPAA-ready   │  🔄 Cancel anytime   │  💳 No contracts │   │
│  │  30-day money-back guarantee on setup fee                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  FAQ Section:                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Q: Do I need to sign a long-term contract?                  │   │
│  │  A: No. Month-to-month after launch. Cancel anytime.         │   │
│  │                                                              │   │
│  │  Q: How fast can I get started?                              │   │
│  │  A: We build Launch in 1 week. Pay 50% today, go live in 7  │   │
│  │     days.                                                    │   │
│  │                                                              │   │
│  │  Q: Do you offer SMS reminders?                              │   │
│  │  A: Yes — SMS add-on is $49/mo for 500 messages.            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Sticky Footer CTA:                                                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Stop losing $7,920/mo to no-shows.  [Book a Strategy Call] │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Revenue Projections

### Per-Client Lifetime Value

| Tier | Setup | Monthly | Year 1 Total | Year 2+ (Annual) | 3-Year LTV |
|------|-------|---------|-------------|-------------------|------------|
| Launch | $5,000 | $497 | $10,964 | $5,964 | $22,892 |
| Grow | $7,500 | $797 | $17,064 | $9,564 | $36,192 |
| Enterprise | $15,000 | $1,497 | $32,964 | $17,964 | $68,892 |
| Bundle (Launch + Ref) | $8,500 | $797 | $18,064 | $9,564 | $37,192 |

### Year 1 Projection (8 Clients — Realistic Start)

| Client | Tier | Setup Revenue | Monthly Revenue | Year 1 Total |
|--------|------|-------------|----------------|-------------|
| Client 1 | Launch | $5,000 | $497 | $5,497* |
| Client 2 | Launch | $5,000 | $497 | $5,497* |
| Client 3 | Grow | $7,500 | $797 | $8,297* |
| Client 4 | Bundle | $8,500 | $797 | $9,297* |
| Client 5 | Launch | $5,000 | $497 | $10,964 |
| Client 6 | Grow | $7,500 | $797 | $17,064 |
| Client 7 | Bundle | $8,500 | $797 | $18,064 |
| Client 8 | Enterprise | $15,000 | $1,497 | $32,964 |
| **Total** | | **$62,000** | | **$112,112** |

*\*Partial year for clients 1-4 (assume 1 month of retainer in year 1)*

**Monthly Recurring Revenue at End of Year 1:**
$497 + $497 + $797 + $797 + $497 + $797 + $797 + $1,497 = **$5,676 MRR**

**Average MRR Per Client:** $5,676 / 8 = **$709.50**

### Path to $200K Annual Revenue

| # Clients | Avg MRR/Client | Total MRR | Annualized + Setup | Annual Revenue |
|-----------|---------------|-----------|-------------------|----------------|
| 8 | $710 | $5,676 | $62,000 + $68,112 | $130,112 |
| 10 | $710 | $7,100 | $77,500 + $85,200 | $162,700 |
| 12 | $710 | $8,520 | $93,000 + $102,240 | $195,240 |
| **15** | **$710** | **$10,650** | **$116,250 + $127,800** | **$244,050** |

**To hit $200K, you need 12-15 clients** depending on mix. At 15 clients with a 70/30 Launch/Grow split:

| Client Type | Count | Setup | Monthly | Annual Setup Rev | Annual MRR | Total |
|-------------|-------|-------|---------|-----------------|-----------|-------|
| Launch | 10 | $5,000 | $497 | $50,000 | $59,640 | $109,640 |
| Grow | 4 | $7,500 | $797 | $30,000 | $38,256 | $68,256 |
| Enterprise | 1 | $15,000 | $1,497 | $15,000 | $17,964 | $32,964 |
| **Total** | **15** | | | **$95,000** | **$115,860** | **$210,860** |

### Scaling Levers

1. **Increase average tier** — Converting 2 Launch clients to Grow adds $6,000/yr.
2. **Bundle attach rate** — Every 3 bundles add ~$24,000/yr vs selling Launch standalone.
3. **Referral revenue** — Bundle clients tend to refer. A single referral saves $1,500 in customer acquisition.
4. **Annual prepay discount** — Offer 2 months free if paid annually: $497/mo → $4,970/yr. Improves cash flow and reduces churn.

---

## 7. Objection Handling Document — Top 7 Objections

### Objection 1: "We already use Calendly"

**Context:** They think they've already solved booking. They haven't solved the rest.

> "That's fair — Calendly does scheduling well. But here's what Calendly doesn't do: it doesn't collect intake forms before an appointment, it doesn't e-sign waivers, it doesn't send automated review requests, and it doesn't track referrals. So you're still piecing together 3 or 4 other tools. Our clients who switched tell us the biggest win wasn't the booking — it was having every patient touchpoint in one place. Your front desk doesn't have to copy data between systems anymore. That alone saves them 8-10 hours a week."

> *Follow-up:* "Also, we keep your existing calendar. We sync with Google/Outlook just like Calendly does — so your team doesn't have to learn a new calendar. The only difference is everything else happens automatically."

---

### Objection 2: "That's expensive for booking software"

**Context:** They're comparing to $10-20/mo tools without understanding scope.

> "You're right — if we were just a booking page, $497 would be a lot. But we're not a booking page. We're a booking page + intake forms + e-sign waivers + automated reminders + client portal + review requests + referral tracking — all in one system. If you bought those separately, you'd pay $518/mo minimum and they wouldn't share data. We charge less than that and it all works together."

> *ROI pivot:* "More importantly, let's look at what no-shows cost you. If you're losing $7,920/mo to no-shows and we cut that by 60%, you save $4,620/mo. Subtract $497 and you're up $4,123/mo. Can Calendly do that math?"

---

### Objection 3: "Can I see it work first?"

**Context:** They're risk-averse and need proof before committing.

> "Absolutely. Let me show you a live demo of a practice just like yours. I'll walk through the full patient journey — booking, intake, waiver signature, reminder sequence, review request, referral link. You'll see the staff dashboard and the client portal. Takes 15 minutes."

> *Alternative:* "Better yet — I can spin up a sandbox with your branding in 24 hours. You'll get a live link to click around yourself. No commitment. If you like it, we build the real thing in a week. If not, no harm done."

> *Risk reversal:* "And if you do move forward, your setup fee is backed by a 30-day money-back guarantee. If you're not seeing results in 30 days, we'll refund your setup fee and you owe nothing else."

---

### Objection 4: "What if I want to cancel?"

**Context:** They've been burned by long-term contracts.

> "You can cancel anytime. No contract. No early termination fee. We're month-to-month after launch. If you cancel, you keep your client data — we'll export everything as CSV/PDF within 48 hours. We want you to stay because we deliver value, not because we locked you in."

> *Why they won't cancel:* "That said, our average client has been with us for 18+ months. Once your team is used to having everything in one place, going back to 4 separate tools feels like a downgrade. But the door is always open."

---

### Objection 5: "Do I own the software?"

**Context:** They're worried about vendor lock-in and IP.

> "You own your data — 100%. Patient records, forms, signed waivers, booking history — all yours. We'll export it anytime, no questions asked. The platform itself is our SaaS, so you're licensing the software, but your data is portable."

> *Clarify:* "Think of it like Gmail. You don't own Gmail, but you own every email you've sent and can download them anytime. Same here. You own the content; we provide the system that makes it work."

---

### Objection 6: "I need SMS reminders too"

**Context:** Email-only isn't enough for their client base.

> "We've got you covered. SMS is an add-on — $49/mo for 500 messages. That's about 16 reminders per day, which covers most single-location practices. Messages are auto-personalized with the patient's name, provider, time, and a booking link."

> *Upsell:* "If you need more volume — say you're doing 40+ appointments a day — we have a $99/mo tier with 1,200 messages. Still cheaper than Twilio alone, and it's built right into the platform. No separate SMS tool needed."

---

### Objection 7: "My staff won't adopt new software"

**Context:** Fear of internal resistance.

> "That's actually the most common concern we hear, and here's why it's not an issue: your staff doesn't have to learn much. The booking page is for patients — they use it themselves. Intake forms and waivers are filled out by patients before they arrive. Reminders, review requests, and referral links all fire automatically. Your staff's job actually gets easier."

> *Staff training:* "We include a 60-minute training session for your whole team. We show them the dashboard (one screen, very simple) and the client portal. Most front desk staff are proficient after 15 minutes. And your team will love it — no more manual reminder calls, no more chasing paperwork."

> *Champion strategy:* "If you want, I can set up a 10-minute call with the office manager at [reference client] who had the same worry. She'll tell you her staff was fully onboard by day 3."

---

## 8. Payment Terms

### Setup Fee Payment Schedule

| Milestone | Percentage | Amount (Launch) | Amount (Grow) | Amount (Bundle) | Amount (Enterprise) |
|-----------|-----------|----------------|---------------|----------------|--------------------|
| **Upon signing** (start build) | 50% | $2,500 | $3,750 | $4,250 | $7,500 |
| **On launch date** | 25% | $1,250 | $1,875 | $2,125 | $3,750 |
| **30 days post-launch** | 25% | $1,250 | $1,875 | $2,125 | $3,750 |
| **Total** | **100%** | **$5,000** | **$7,500** | **$8,500** | **$15,000** |

### Monthly Retainer Billing

| Term | Detail |
|------|--------|
| **Billing date** | 1st of each month (in advance) |
| **First invoice** | Prorated from launch date to end of month, plus full next month |
| **Payment method** | ACH (preferred) or credit card (2.9% fee applies) |
| **Invoice delivery** | PDF via email + accessible in client portal billing section |

### Payment Terms for Businesses

| Term | Detail |
|------|--------|
| **Net terms** | Net-15 — payment due within 15 days of invoice date |
| **Preferred payment** | ACH bank draft (no processing fee) |
| **Credit card** | Visa, MC, Amex, Discover accepted (2.9% + $0.30 fee) |
| **Check** | Accepted but delays launch — processing time adds 5-7 business days |

### Late Payment & Suspension Policy

| Day | Action |
|-----|--------|
| **Day 15** | Payment reminder sent — friendly email with invoice PDF attached |
| **Day 20** | Second notice — email + phone call to practice owner/billing contact |
| **Day 30** | **5% late fee** applied to outstanding balance. Service continues. |
| **Day 45** | Final notice — 15-day suspension warning sent via certified email. All features remain active. |
| **Day 60** | **Service suspension** — Booking page disabled, client portal locked, reminder sequences paused. Data preserved for 90 days. Reactivation fee: $250. |
| **Day 90** | **Data deletion** — All client data permanently purged. Cannot be recovered. |

### Refund Policy

| Scenario | Policy |
|----------|--------|
| **Cancel during build (before launch)** | Setup fee refunded minus 25% for work completed. If 50% milestone (Day 3+) is passed, no refund. |
| **Cancel within 30 days of launch** | Full setup fee refunded. Monthly retainer is non-refundable (service was rendered). |
| **Cancel after 30 days** | No setup refund. Final month's retainer is non-refundable. Data export provided within 48 hours. |
| **Chargeback** | Immediate account suspension. Legal escalation for amounts > $1,000. |

### Discounts & Incentives

| Incentive | Offer | Conditions |
|-----------|-------|------------|
| **Annual prepay** | 2 months free | Pay $4,970 (Launch) upfront instead of $5,964. Saves $994/yr. |
| **Referral credit** | $500 off next month | Refer a client who signs. Applied after their setup fee is paid. |
| **Nonprofit** | 20% off monthly | 501(c)(3) status verified. Setup fee unchanged. |
| **Bundle discount** | See Section 1 | BookSmart + ReferralEngine combined. |
| **Multi-year lock** | 10% off monthly | 2-year commitment. Early exit: 3 months' fees penalty. |

### Payment Collection

All recurring payments are processed through Stripe (PCI Level 1 compliant). Invoices are generated automatically via the billing system and emailed to the client's billing contact. Clients can also view and pay invoices through their admin portal. Failed payments trigger automatic retry on days 3, 7, and 14 before human intervention.

---

*Document prepared by Offer Strategist agent. All pricing in USD. Terms subject to change with 30 days' written notice to active clients.*
