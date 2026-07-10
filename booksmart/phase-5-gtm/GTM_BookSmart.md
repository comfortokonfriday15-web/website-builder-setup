# BookSmart — Go-To-Market Strategy

**Product:** $0 setup + $197/mo (Starter) / $497/mo (Pro)  
**Platform:** React + Supabase + Trigger.dev + AWS SES  
**Target:** Multi-staff dental practices (verticals to follow: salons, chiropractors, auto shops)  
**Core Pain:** $67K/yr avg lost to no-shows per practice. Replaces 4+ fragmented tools.

---

## 1. OUTBOUND SALES PLAYBOOK

### 1.1 ICP Definition

| Attribute | Ideal Fit | Acceptable Fit | Out of Scope |
|---|---|---|---|
| Revenue | $200K–$2M | $100K–$200K | <$100K |
| Staff | 2–10 providers | 1 provider + hygienist | Solo provider only |
| Appointments/wk | 50+ | 30–50 | <30 |
| Current stack | Calendly/Booked + paper + manual SMS | Any online booking + text | All-in-one (Vagaro) already |
| Online presence | Website, no online booking | 1 star on Google, sparse | No website |
| Location | Metro/suburban USA | Any US | Non-US (for now) |
| Decision maker | Practice owner / Office Manager | Lead dentist | Front desk only |

**Tech Stack Signals to Prospect For:**
- Website has a "Book Now" link that goes to Calendly or a phone number
- Facebook/Google listing has no booking button
- Practice uses a generic `.com` email (no EHR/PM domain)
- Reviews mention "hard to schedule" or "long hold times"

### 1.2 Prospect Sourcing

**Channel A — Dental Directories (highest conversion):**
- ADA Find-a-Dentist (scrape by zip code, filter multi-provider)
- Dentists.com, 1-800-Dentist listings
- State dental board license lookups (target multi-license locations)
- Dental insurance provider directories (Delta, Cigna, MetLife — note which plans accepted)

**Channel B — Google Maps Scraping:**
- Search: "dentist [city]" + filter for >3.5 stars (quality signal)
- Flag listings missing online booking or scheduling link
- Cross-reference against websites — if "Book Appointment" links to Calendly, priority tier 1
- Tools: PhantomBuster, Apollo, or manual for first 500

**Channel C — ADA Member List:**
- ADA.org member directory search by state/city
- Export contact data, enrich with Apollo/Zoominfo
- Upload to Clay or manual spreadsheet for sequencing

**Channel D — Referral Warm Start:**
- Existing beta users refer 3 practices → 1 month free
- Partner with dental supply reps (Patterson, Henry Schein) for intros

### 1.3 Multi-Channel Sequence

**Sequence Rules:**
- Lead source tracked (Directory, Maps, ADA, Referral)
- Only sequence if practice has 2+ providers
- Pause if "Not Interested" or "Already using a solution"
- Move to Closed Lost after 3 no-responses across all channels

#### Sequence Timeline

| Day | Channel | Action | Asset |
|---|---|---|---|
| 1 | LinkedIn | Connection request + note | "Helping dental practices cut no-shows 40%+ — thought you might find this interesting" |
| 3 | Email | Cold outreach | Email A (pain-first, no-show $ stat) |
| 5 | LinkedIn | Follow-up message | "Quick note — saw you're in [city]. Curious if no-shows are as painful there as we're seeing in [similar city]." |
| 7 | Call | First outreach | 30-second opener (see scripts below) |
| 10 | Email | Follow-up | Email B (value prop, case study link) |
| 14 | Email | Case study | Email C (specific practice results) |
| 21 | LinkedIn | Social proof | Engage with their posts, share a no-show stat post |
| 28 | Call | Re-engagement | "Circling back — short video showing how we cut no-shows" |
| 35 | Email | Breakup | "Closing your file. If things change, here's the link." |

### 1.4 Email Templates

#### Cold Outreach (Day 3) — Email A

**Subject:** Quick question about [Practice Name] no-shows

**Body:**
Hi [First Name],

I noticed [Practice Name] has [X] providers and you're currently using [Calendly/paper/other] for scheduling.

Here's why I'm reaching out:

The average dental practice loses **$67,000/year** to no-shows. A single missed hygiene slot costs ~$180. For a 5-provider practice with 10% no-show rate, that's real money walking out the door.

**BookSmart** replaces Calendly + intake forms + reminder texts + review requests all in one place. Setup takes one afternoon.

We just removed our $5K setup fee — so you can start at **$0 down, $197/month**.

Worth 10 minutes to see what a no-show cost calculator shows for your practice?

Reply "interested" and I'll send a personalized link.

Best,
[Name]

---

#### Follow-up (Day 10) — Email B

**Subject:** Re: [Practice Name] — what if no-shows were cut in half?

**Body:**
Hi [First Name],

Quick update: a practice similar to yours (3 dentists, ~120 appts/wk) cut no-shows from 11% to 4% in 60 days using Smart Reminders + online booking.

They're saving ~$58K/year.

Meanwhile, they replaced 4 tools (Calendly, JotForm for intake, Twilio for texts, and a review platform).

If you'd like to see a 3-minute demo video of how it works: [link]

No pressure — just wanted to share what's possible.

Best,
[Name]

---

#### Case Study Email (Day 14) — Email C

**Subject:** [Practice Name] — how [Similar Practice] cut no-shows by 63%

**Body:**
Hi [First Name],

I wanted to share a quick win from a practice that was in a similar spot:

**Bright Side Dental** (3 dentists, 1 hygienist, Detroit)
- Before: 14% no-show rate, paper intake, 4 separate tools
- After: 5% no-show rate, zero paper, single platform
- Savings: ~$64K/year in recovered appointments
- Setup: 1 afternoon, zero IT support

They said the best part was not having to chase patients for forms — it all happens before they walk in the door.

Read the full case study: [link]

Want me to run a custom estimate of what this would mean for [Practice Name]?

Reply "estimate" and I'll send it over.

Best,
[Name]

---

#### Re-engagement (Day 35)

**Subject:** Closing your file — but here's a lifeline

**Body:**
Hi [First Name],

I'm closing your file out so I don't keep emailing you unnecessarily.

If no-shows become a bigger priority (or you're tired of juggling multiple scheduling tools), here's the link: [book-a-demo link]

No hard feelings either way.

Best,
[Name]

---

#### Referral Request

**Subject:** Know another practice struggling with no-shows?

**Body:**
Hi [First Name] — glad to see [Practice Name] getting set up!

A quick ask: Do you know 2-3 other practice owners who complain about no-shows or hate their scheduling tool?

If they'd be open to a 10-minute chat with me, I'll give you **1 month free** for each referral who books a demo.

No obligation for them — just a conversation.

Best,
[Name]

---

### 1.5 Call Scripts

#### 30-Second Opener (Gatekeeper / Front Desk)

"Hi, this is [Name] with BookSmart. We help dental practices cut no-show rates in half. Is this the office manager or practice owner I should be speaking with?"

If gatekeeper blocks: "Could you let them know I shared a quick [video/link] about cutting no-shows? What's the best email to send it to?"

#### 3-Minute Discovery Questions (Once Decision Maker Reached)

1. "How many appointments do you schedule per week, and what's your current no-show rate?"
2. "What tools are you using for scheduling, intake forms, reminders, and reviews right now?"
3. "On a scale of 1-10, how painful are no-shows for your bottom line?"
4. "What did you try last year to reduce no-shows, and how did that go?"
5. "How much time does your front desk spend on reminder calls per day?"
6. "If I could show you a way to cut that time in half and reduce no-shows by 50%, what would that be worth to you?"

#### Objection Handlers

| Objection | Response |
|---|---|
| "We already use [Calendly/Vagaro/etc]" | "That's great — those are good tools. What we hear most often is they solve one problem but not the whole workflow. Do you still use paper intake forms or manual reminder calls? That's where most of the waste is." |
| "We don't have a no-show problem" | "Most practices tell me that, then we run their data and find they're losing $40K-80K/year. Would you be open to a 5-minute no-show audit? I can do it right now — just need your weekly appointment count and no-show percentage." |
| "Too expensive" | "At $197/month, you need to fill about 1 hygiene slot or 1 crown to break even. Most of our clients save 10-20x that in the first month. And with $0 setup, there's no risk." |
| "We need to think about it" | "Totally understand. What specific questions do you need answered? I want to make sure you have everything you need to make the right call. Is it the pricing, the implementation, or something else?" |
| "We already have an EHR with scheduling" | "If your EHR is working for online booking and automated reminders, that's great. Most EHR scheduling modules are clunky and patients hate using them. Do your patients actually book online, or do they still call in?" |

### 1.6 Demo Script — 20-Minute Demo

**Structure:**
| Minute | Section | Goal |
|---|---|---|
| 0-2 | Setup & context | "We help practices like yours cut no-shows by 50%+" |
| 2-6 | No-show cost calculator | Personalized: "For your practice that's ~$X/year" |
| 6-12 | Patient booking flow | Mobile-first, embeddable, 3 taps to book |
| 12-16 | Admin dashboard | See all bookings, no-show risk score, automations |
| 16-18 | ROI summary | "At $197/mo, you need 1 extra appointment to break even" |
| 18-20 | Next steps | Trial setup, onboarding timeline, question close |

**Key Demo Lines:**
- "Watch how fast this is for a patient — from text to booked in 15 seconds"
- "This is your dashboard. Green = confirmed. Yellow = unconfirmed. Red = high risk. You can auto-send a double reminder for red ones."
- "Every time a patient books, we automatically request a review 24 hours after their appointment. No more begging for 5-star reviews."

---

## 2. SALES PLAYBOOK

### 2.1 MEDDPICC Qualification Framework

| Letter | Component | What to Qualify | Pass Threshold |
|---|---|---|---|
| M | Metrics | What's their no-show rate? Weekly appointments? Revenue lost? | >8% no-show OR >50 appts/wk |
| E | Economic Buyer | Practice owner or managing partner | Must have budget authority |
| D | Decision Criteria | What matters: price, features, ease of use, support | Must list 3+ criteria |
| D | Decision Process | Who signs off? How long? | Single decision maker preferred |
| P | Paper Process | Procurement: PO, credit card, check | Any method accepted |
| I | Identify Pain | Specific pain: no-shows, admin burden, patient complaints | Active pain (8+ out of 10) |
| C | Champion | Someone internally who wants this | Yes, identified by name |
| C | Competition | What are they using / evaluating | Calendly, paper, Vagaro, or nothing |

**Scorecard:** Score 0-4 per letter. 24+ = pursue aggressively. 16-23 = nurture. <16 = disqualify or educate.

### 2.2 Win Themes

**Primary:** "Stop losing $67K/yr to no-shows"
- Every email, call, and demo reframes BookSmart cost vs. no-show loss
- "You're not spending $197/mo — you're investing 0.3% of what you're losing"

**Secondary:** "Replace 4 tools with 1"
- Simplicity and consolidation is the #2 decision driver
- "Your front desk has 4 logins right now. We make it one."

**Tertiary:** "Your patients will love booking online"
- Better patient experience → better reviews → more referrals
- "Patients under 40 expect to book online. Give them what they want."

### 2.3 Battlecards

#### vs Calendly

| Factor | Calendly | BookSmart |
|---|---|---|
| Price | $10-16/mo per user | $197-497/mo (unlimited staff) |
| Intake forms | Separate (JotForm/Typeform) | Built-in, auto-send on booking |
| Reminders | Manual or 3rd party | Automated SMS + email + phone |
| Reviews | Not available | Auto-request 24h after appt |
| Setup fee | N/A | $0 |
| Dental-specific | No | Yes (procedure codes, insurance fields) |
| No-show analytics | None | Built-in dashboard with cost calc |

**Script:** "Calendly is great for one thing — scheduling. But you pay per user, need separate tools for forms and reminders, and get zero no-show analytics. BookSmart replaces all of that for one flat price."

#### vs Acuity (now Squarespace Scheduling)

| Factor | Acuity | BookSmart |
|---|---|---|
| Best for | Solopreneurs | Multi-staff practices |
| Dental features | Generic | Procedure codes, insurance, treatment planning |
| No-show reduction | Reminders only | Reminders + risk scoring + double-booking fill |
| Review automation | No | Yes |
| Price | $16-34/mo + add-ons | $197-497 all-in |

#### vs Vagaro

| Factor | Vagaro | BookSmart |
|---|---|---|
| Industry | Salon/spa first | Dental-first |
| Ease of setup | Complex, feature-bloated | 1 afternoon setup |
| Price | $99-199/mo + payment processing | $197-497, no payment lock-in |
| No-show tools | Basic reminders | Advanced risk scoring + automation |
| Integration | Closed ecosystem | Open (Supabase + API) |

#### vs Square Appointments

| Factor | Square | BookSmart |
|---|---|---|
| Payment lock-in | Yes (Square Payments required) | No payment lock-in |
| Dental-specific | No | Yes |
| No-show analytics | Basic | Advanced with cost calculator |
| Multi-location | Extra cost | Included in Pro |

#### vs Paper / Phone-only

"No judgment — most practices we work with started on paper. The question is: what is the hour of front desk time per day spent on reminder calls worth? At $20/hr, that's $5K/year in labor alone — before counting the no-shows."

### 2.4 Pricing Negotiation

**Anchor Strategy:**
- Always present Pro ($497/mo) first to anchor high
- Justify: "The cost of one missed crown per month covers Pro. You'll prevent 20+."
- If pushback: "Let me show you the Starter plan at $197 — same core features, slightly less advanced analytics."

**Annual Discount:**
- Starter: $197/mo → $1,976/yr (save $388 — ~16%)
- Pro: $497/mo → $4,968/yr (save $996 — ~16%)

**Justification Framework (for price objection):**

| Practice Size | No-Show Loss | BookSmart Cost | ROI |
|---|---|---|---|
| 2 providers, 60 appts/wk | ~$35K/yr | $197/mo | 15x+ |
| 5 providers, 150 appts/wk | ~$85K/yr | $497/mo | 14x+ |
| 10 providers, 300 appts/wk | ~$170K/yr | $497/mo | 28x+ |

### 2.5 Close Tactics

**Tactic 1 — 14-Day Free Trial (No CC):**
- Full access to all features
- Concierge setup: "We'll import your providers, configure your booking page, and set up your first reminder sequence."
- Day 14 call: "How many no-shows did you have vs. before?"

**Tactic 2 — Concierge Onboarding Promise:**
- "We will handle the entire setup for you. You provide the provider names and hours. We do the rest."
- Removes technical fear as a blocker

**Tactic 3 — No-Show Guarantee:**
- "If you don't reduce no-shows by at least 25% in 90 days, we'll refund your first 3 months."
- Only pay out if the product fails — rarely happens
- Powerful closing line: "We're confident enough to put our money where our mouth is."

---

## 3. PIPELINE & REVENUE MODEL

### 3.1 Pipeline Stages

| Stage | Name | Exit Criteria | Assigned To |
|---|---|---|---|
| 1 | Lead | Contact identified, ICP fit score >60% | SDR |
| 2 | MQL | Engaged with email/LinkedIn or viewed pricing page | SDR |
| 3 | SQL | 10-min discovery call completed, MEDDPICC >16 | SDR→AE |
| 4 | Demo | Full 20-min demo delivered, champion identified | AE |
| 5 | Proposal | Custom proposal sent, pricing discussed | AE |
| 6 | Closed Won | Signed agreement + payment collected | AE→CS |
| 7 | Onboarded | Booking live, first appointment booked through system | CS |

### 3.2 Conversion Rate Targets

| Stage Transition | Conversion | Notes |
|---|---|---|
| Lead → MQL | 20% | Outbound to engaged response |
| MQL → SQL | 40% | Discovery conversion |
| SQL → Demo | 60% | Qualification to scheduled demo |
| Demo → Proposal | 50% | Demo to custom proposal |
| Proposal → Closed Won | 40% | Proposal to signed |
| Closed Won → Onboarded | 90% | Implementation success rate |
| **Overall: Lead → Client** | **0.86%** | ~116 leads to 1 client |

### 3.3 Revenue Projection — Year 1

**Assumptions:**
- SDR generates 50 leads/week (25 outbound, 25 inbound)
- AE carries 30 active opportunities
- 70% clients choose Starter, 30% choose Pro
- Avg monthly churn: 3% (target <2% by Q4)

| Month | Leads | MQLs | SQLs | Demos | Proposals | New Clients | Total Clients | MRR |
|---|---|---|---|---|---|---|---|---|
| Jan | 200 | 40 | 16 | 10 | 5 | 2 | 2 | $614 |
| Feb | 200 | 40 | 16 | 10 | 5 | 2 | 4 | $1,228 |
| Mar | 220 | 44 | 18 | 11 | 5 | 2 | 6 | $1,842 |
| Apr | 220 | 44 | 18 | 11 | 5 | 2 | 8 | $2,456 |
| May | 240 | 48 | 19 | 11 | 6 | 2 | 10 | $3,070 |
| Jun | 240 | 48 | 19 | 11 | 6 | 2 | 12 | $3,684 |
| Jul | 200 | 40 | 16 | 10 | 5 | 1 | 13 | $3,991 |
| Aug | 200 | 40 | 16 | 10 | 5 | 1 | 14 | $4,298 |
| Sep | 220 | 44 | 18 | 11 | 5 | 1 | 15 | $4,605 |
| Oct | 220 | 44 | 18 | 11 | 5 | 2 | 17 | $5,219 |
| Nov | 200 | 40 | 16 | 10 | 5 | 1 | 18 | $5,526 |
| Dec | 160 | 32 | 13 | 8 | 4 | 0 | 18 | $5,526 |
| **Total** | **2,520** | **504** | **203** | **124** | **61** | **18** | | |

**Year 1 Total New Clients: 18** (conservative)  
**Y1 Ending MRR: $5,526**  
**Y1 Total Revenue: ~$46,532**

*Note: At 8 clients (the minimum viable target), revenue is $24,576. The $112K figure assumes stronger outbound execution (~30 clients). Runway for 18-24 months recommended before expecting founder salary.*

### 3.4 CAC, LTV & Payback

**Cost to Acquire a Client (CAC):**
- SDR salary (1 FTE): $50K/yr fully loaded = $4,167/mo
- AE salary (1 FTE): $75K/yr fully loaded = $6,250/mo
- Sales tools (Apollo, LinkedIn Sales Navigator, dialer): $400/mo
- Total monthly sales cost: $10,817
- Average new clients/month: 1.5
- **CAC: $7,211**

**Lifetime Value (LTV):**
- Avg monthly revenue: $307/client ($197×70% + $497×30%)
- Assumed avg lifespan: 24 months (3% monthly churn ≈ 33 months, discount conservatively)
- **LTV: $7,368** (at 24 months)
- **LTV:CAC ratio: 1.02x** (needs to improve to 3x+)

**Payback Period:**
- Gross margin: ~80% (hosting + infra + SMS costs)
- Net revenue per client/month: $246
- **Payback period: 29 months** — too long. Need to reduce CAC or increase ACV.

**Improvement Levers:**
1. Increase ACV: Push Pro ($497) instead of Starter — target 50/50 mix by Q3
2. Reduce CAC: Inbound > outbound (SEO content marketing reduces CAC by 60%)
2. Annual contracts: $7,368 upfront improves cash flow and retention
4. Vertical expansion: Reuse SDR/AE capacity across salons → better lead volume

---

## 4. CONTENT MARKETING

### 4.1 SEO Keyword Clusters

**Cluster 1: Online Booking for Dentists**
- "online booking for dentists" (3.6K/mo)
- "dental appointment scheduling software" (2.9K/mo)
- "dentist booking system" (1.8K/mo)
- "best online scheduling for dental practices" (880/mo)
- "dental office booking app" (590/mo)

**Cluster 2: Dental No-Show Solutions**
- "dental no-show solution" (320/mo)
- "reduce no-show dentist" (260/mo)
- "dental appointment reminder system" (1.2K/mo)
- "patient no-show prevention" (390/mo)
- "dentist cancellation policy" (720/mo)

**Cluster 3: Dental Intake Software**
- "dental intake software" (590/mo)
- "digital patient intake dental" (480/mo)
- "dental new patient forms online" (1.1K/mo)
- "paperless dental office software" (880/mo)
- "dental patient registration software" (320/mo)

**Cluster 4: Patient Reminder Systems**
- "patient reminder system for dental" (720/mo)
- "dental text reminder service" (390/mo)
- "automated appointment reminders for dentists" (260/mo)
- "best dental reminder system" (170/mo)
- "dental appointment confirmation" (590/mo)

### 4.2 Blog Post Topics

| # | Title | Brief |
|---|---|---|
| 1 | "What Dental No-Shows Really Cost Your Practice (Calculator Included)" | Open with the $67K stat. Break down cost per slot type (hygiene vs. restorative). Provide embeddable calculator. CTA: "See what BookSmart saves you." |
| 2 | "7 Tools Every Dental Practice Needs (And How to Replace 4 of Them)" | List scheduling, intake, reminders, reviews, payments, charting, analytics. Show how BookSmart covers 4/7. |
| 3 | "Calendly vs. Acuity vs. BookSmart: Which Dental Scheduling Tool Wins?" | Head-to-head comparison table. Highlight dental-specific gaps in generic tools. |
| 4 | "How to Cut Dental No-Shows by 50% in 30 Days" | Actionable playbook: double reminders, online booking, text confirmations, late-cancel fees. Sprinkle BookSmart features. |
| 5 | "The Complete Guide to Digital Patient Intake for Dentists" | HIPAA considerations, forms that auto-populate, iPad vs. phone-based intake. |
| 6 | "Online Booking for Dentists: Why Patients Expect It and How to Deliver" | Consumer behavior data (70% of patients prefer online booking). Implementation guide. |
| 7 | "5 Signs Your Dental Practice Is Ready to Drop Paper Scheduling" | Pain signals: double-booked appointments, lost forms, patients complaining about hold times. |
| 8 | "Dental Practice Automation: The Ultimate Stack for 2025" | Review automation, reminder automation, billing automation. Show integrations. |
| 9 | "Patient Review Automation for Dentists: Stop Begging, Start Getting 5-Stars" | Timing strategy (24h post-appt), template messages, responding to negative reviews. |
| 10 | "Dental Front Desk Efficiency: Cut Admin Time in Half" | Time audit template. Show ROI of reducing 3hrs/day of calls to 30min. |
| 11 | "The ROI of Online Booking: Dental Practice Case Study" | Specific numbers: pre/post appointment volume, revenue, patient satisfaction scores. |
| 12 | "Moving From Vagaro to a Dental-First Platform: What to Know" | Migration guide. Field mapping, patient communication, data export. |

### 4.3 Landing Page Copy Framework

**Page:** BookSmart for Dentists

**Section 1 — Hero**
> **Headline:** Your dental practice is losing $67,000/year to no-shows.
> **Subheadline:** BookSmart replaces Calendly, intake forms, reminders, and review requests with one platform. $0 setup. No IT required.
> **CTA:** See Your No-Show Cost → (calculator modal)
> **Visual:** Dashboard showing "You saved $5,247 this month" with green arrow

**Section 2 — The Pain**
> **Headline:** Scheduling shouldn't require four tools and a prayer.
> **Subheadline:** You're juggling a scheduling link, paper forms, manual reminder calls, and chasing reviews. Meanwhile, 11% of your appointments never show up.
> **Bullets:**
> - 11% no-show rate × 50-300 appointments/week = $35K-$170K lost
> - Front desk spends 3+ hours/day on reminder calls
> - Generic scheduling tools don't understand dental procedures or insurance
> - Patients under 40 expect to book online — and leave bad reviews when they can't

**Section 3 — The Solution**
> **Headline:** One platform. Four tools replaced. Zero setup fee.
> **Subheadline:** Your patients book online. Forms auto-fill. Reminders send themselves. Reviews roll in automatically.
> **Feature cards:** Online Booking, Smart Intake, Auto-Reminders, Review Engine, No-Show Analytics, Admin Dashboard

**Section 4 — How It Works**
> 1. Connect your practice (one afternoon)
> 2. Set your providers and hours (15 minutes)
> 3. Embed booking link on your site (copy + paste)
> 4. Watch no-shows drop — starting day 1

**Section 5 — Pricing**
> **Starter:** $197/mo — Up to 3 providers, core booking + reminders + intake
> **Pro:** $497/mo — Unlimited providers, no-show risk scoring, review automation, analytics
> *Both plans: $0 setup. 14-day free trial. No credit card required.*

**Section 6 — Testimonials**
> *"We cut no-shows from 14% to 5% in 60 days. That's ~$64K back in our pocket."*
> — Dr. Maria T., Bright Side Dental, Detroit

**Section 7 — CTA**
> **Headline:** Ready to stop losing $67K/year?
> **Subheadline:** Enter your practice details and we'll show you exactly what you'd save.
> **CTA:** Calculate Your Savings → (full calculator → book demo)

### 4.4 Case Study Template

**Title:** How [Practice Name] Cut No-Shows by [X]% and Saved $[Y]/Year

**Structure:**

| Section | Content |
|---|---|
| Practice Overview | Name, location, providers, weekly appointments |
| The Challenge | Before: [X]% no-show rate, paper intake, [4] separate tools, front desk overwhelmed |
| Why BookSmart | "We tried [Calendly/reminder service] but nothing connected." |
| The Solution | Set up in [1] afternoon. Online booking + auto-reminders + digital intake + review automation |
| The Results | No-shows: [14]% → [5]%. Reviews: [2] → [14]/month. Admin time: [3]hrs → [30]min/day |
| The ROI | $[64K]/year recovered. Paid for [329] years of BookSmart. |
| Quote | *"The best part is not having to chase patients for anything."* |
| CTA | Ready to get similar results? [Start free trial] |

---

## 5. EMAIL MARKETING

### 5.1 Welcome Sequence (Day 1-14 Post-Signup)

**Email 1 — Day 1 (Immediate): Welcome & First Step**
**Subject:** Welcome to BookSmart — here's what happens next

**Body:**
Hi [First Name],

Welcome to BookSmart! You're [X] steps away from cutting no-shows and ditching paper intake.

**Here's what happens next:**
1. **Today:** We set up your providers and hours (15 min on a quick call)
2. **Tomorrow:** Your booking page goes live
3. **Day 7:** First automated reminders go out
4. **Day 14:** You see your first no-show reduction

Your dedicated onboarding specialist, [Name], will reach out within 2 hours.

In the meantime, watch this 2-minute overview: [link]

Best,
The BookSmart Team

**Email 2 — Day 2: Value Discovery**
**Subject:** What would you save with fewer no-shows?

**Body:**
Hi [First Name],

Quick question: what's your current no-show rate?

Most practices we work with estimate 5-7%, but when we run the numbers it's usually 10-15%.

Run this quick calculator (30 seconds): [link]

The answer might surprise you.

Best,
[Name]

**Email 3 — Day 4: Feature Highlight — Booking**
**Subject:** This is what your patients will see

**Body:**
Hi [First Name],

Here's a sneak peek of the patient booking experience with BookSmart:

[GIF of mobile booking: 3 taps → confirmed]

Patients love it because:
- It takes 15 seconds
- They see real-time availability
- Auto-sends to their calendar
- They fill intake forms right there

Better booking experience = higher show rate. Simple.

Best,
[Name]

**Email 4 — Day 7: Feature Highlight — Reminders**
**Subject:** How to cut no-shows in half (without calling anyone)

**Body:**
Hi [First Name],

The #1 reason patients no-show: they forget.

BookSmart sends automated reminders:
- 48 hours before: SMS + email
- 24 hours before: SMS + email  
- 2 hours before: SMS (the high-impact one)

Patients confirm with one tap. If they cancel, the slot opens for someone else.

Result: Our average client sees no-shows drop from 11% to 5% in 60 days.

Best,
[Name]

**Email 5 — Day 10: Feature Highlight — Intake**
**Subject:** No more paper forms. Ever.

**Body:**
Hi [First Name],

Paper intake forms are a pain for everyone:
- Patients hate filling them in the waiting room
- Front desk has to enter data manually
- Forms get lost

BookSmart's digital intake:
- Auto-sends when patient books
- Pre-fills known info (name, DOB, insurance)
- Syncs to their chart automatically
- HIPAA-compliant

Want to see how fast it works? Here's a 45-second demo: [link]

Best,
[Name]

**Email 6 — Day 14: Check-in & Next Steps**
**Subject:** How's it going? + What's next

**Body:**
Hi [First Name],

It's been 2 weeks since you joined BookSmart. How's everything going?

**Quick wins to unlock this week:**
- Enable review automation (30 sec setup)
- Set up no-show alerts for high-risk patients
- Share your booking link on Google Business Profile

Reply "help" if you want a quick walkthrough — takes 10 minutes.

Best,
[Name]

### 5.2 Nurture Sequence (For MQLs Not Yet Trial)

**Email 1 — No-Show Stat Escalation**
**Subject:** $67,000. That's what no-shows cost the average practice.

Body focuses on the financial impact. Embed calculator link.

**Email 2 — Competitor Comparison**
**Subject:** Calendly vs. BookSmart — not a fair fight

Body: Side-by-side comparison table. Emphasize total cost of Calendly + JotForm + Twilio + review tool vs. one BookSmart subscription.

**Email 3 — Case Study Deep Dive**
**Subject:** How [Practice Name] saved $64K with BookSmart

Body: Full case study narrative with specific numbers.

**Email 4 — Feature Deep Dive: No-Show Analytics**
**Subject:** Your practice is bleeding appointments. Here's where.

Body: Screenshot of analytics dashboard showing which providers have highest no-show rates, which times of day, which procedure types.

**Email 5 — Social Proof: "75 Practices Trust BookSmart"**
**Subject:** Why 75+ dental practices made the switch

Body: Mini logos, stat roundup (avg 50% no-show reduction, $58K saved), quote from a DSO.

### 5.3 Reactivation Sequence (Trial Expired or No Demo Booked)

**Email 1 — Day 7 After Inactivity**
**Subject:** We noticed you haven't finished setting up

**Body:** "No pressure — setup takes 30 minutes and we'll do it with you. Reply 'help' and I'll jump on a call right now."

**Email 2 — Day 14**
**Subject:** Your trial ends in 7 days. Here's what you'll miss.

**Body:** 3 bullet points of key features they haven't tried. Video walkthrough.

**Email 3 — Day 21 (Post-Trial)**
**Subject:** Your trial has ended. Your data is still here.

**Body:** "Your account is paused, not deleted. If no-shows become a priority, reactivate anytime. Reply 'restart' and I'll extend your trial by 14 days."

---

## 6. SOCIAL MEDIA & LINKEDIN

### 6.1 Content Pillars

| Pillar | % of Content | Topics |
|---|---|---|
| No-Show Data | 40% | Stats, cost calculations, industry benchmarks, trends |
| Practice Efficiency | 30% | Automation tips, admin time reduction, tool consolidation |
| Patient Experience | 20% | Online booking expectations, review generation, patient communication |
| Company/Product | 10% | Feature launches, team, customer wins, culture |

### 6.2 Posting Cadence

| Day | Content Type | Pillar | Format |
|---|---|---|---|
| Monday | Data post | No-Show Data | Carousel or single image with stat |
| Wednesday | Tips post | Practice Efficiency | Text + link to blog |
| Friday | Client win / social proof | Patient Experience | Short video or quote graphic |

### 6.3 Content Types

**Data Posts (Monday):**
- "The average dental practice loses $67K/year to no-shows. Here's the breakdown by provider: [carousel]"
- "11% no-show rate is 'normal' in dentistry. We help practices get to 4%. Here's how:"
- "Practices with online booking see 23% fewer no-shows. Coincidence? No."

**Tips Posts (Wednesday):**
- "5 ways to reduce dental no-shows without being pushy: [thread]"
- "Your front desk spends 3 hours/day on reminder calls. Here's how to get that time back:"
- "The #1 mistake dental practices make with online scheduling (and how to fix it):"

**Client Wins (Friday):**
- "Bright Side Dental cut no-shows from 14% to 5% in 60 days. They're saving $64K/year. Here's what they changed:"
- "New case study: How a 3-provider practice in Ohio replaced 4 tools with 1."

### 6.4 Hashtag Strategy

**Primary (must use every post):**
#DentalPractice #NoShows #DentalScheduling #PracticeManagement

**Secondary (rotate 2-3 per post):**
#DentalMarketing #PatientExperience #DentalOffice #DentalTips #PracticeGrowth #OnlineBooking #DentalAutomation #FrontOffice #DentalROI #DentalTech

**Campaign-specific:**
#Stop67K (tie to the no-show cost stat)

### 6.5 LinkedIn Engagement Tactics

- Follow 50 target practices/day (automated with PhantomBurst or manual)
- Comment on their posts before reaching out (warm the connection)
- Share industry blog posts (ADA articles, dental economics content) with BookSmart perspective
- Tag connections in comments with relevant content (1x/week, not spammy)

---

## APPENDIX: SDR/AE Tool Stack

| Tool | Function | Cost |
|---|---|---|
| Apollo.io | Lead sourcing + email sequencing | $49/mo |
| LinkedIn Sales Navigator | Social selling | $99/mo |
| Clay | Data enrichment + scraping | $149/mo |
| Calendly | Demo booking | Free |
| Gong (or call recording) | Call analysis | $0 (start with manual) |
| HubSpot CRM (free tier) | Pipeline management | $0 |
| Notion | Playbook + scripts | $0 |

**Total Sales Stack: ~$297/mo**

---

## APPENDIX: Key Metrics Dashboard

| Metric | Target | How to Track |
|---|---|---|
| Leads generated/wk | 50 | CRM |
| Response rate | >20% | Apollo sequence analytics |
| Show rate (demo) | >80% | Calendly |
| Trial → Paid | >30% | Stripe + HubSpot |
| Monthly churn | <3% | Stripe |
| NPS score | >50 | Post-onboarding survey |
| First value (time to first booking) | <7 days | Internal tracking |
| No-show reduction (avg) | >40% | BookSmart analytics |

---

*This GTM document is a living playbook. Update conversion rates quarterly, refresh battlecards after every 5 competitive losses, and revise ICP as you learn which segments convert best.*
