# Portfolio — 20 Niche Demos

Each demo is a **full end-to-end system** for one niche: a live React website (the trigger) connected to a Trigger.dev automation (the engine) with data flowing through InsForge (the backbone).

Not for direct sale as standalone packages. They are:
- **Portfolio pieces** to showcase building ability
- **Content fodder** for LinkedIn posts, Loom demos, case studies
- **Inbound lead generators** — businesses see their niche and reach out
- **Ascension path** to high-ticket offers (BookSmart, MultiView, etc.)

All 20 built on the same stack: **React + Vite | Trigger.dev | Resend | InsForge | Twilio | Stripe**

---

## The 20 Niche Demos

---

### 1. Dental Practice — No-Show Prevention System

**Demo site:** Booking page with patient portal and e-sign waivers

**Automation:** Multi-channel reminder sequence + waitlist auto-fill + deposit hold

**Problem:** 15-20% no-show rate costs the average dental practice $67K-$93K/year in lost revenue. Front desk spends 2 hrs/day on reminder calls. Paper intake forms get lost.

**Reddit proof:** "I am getting a lot of no shows / last second cancellation. Less than 24 hours cancelation or no-show, they were a 3 hour appointment or high production." — r/Dentistry. "8 out of 10 dentists report last-minute cancellations as the top reason they can't maintain a full schedule." — ADA survey (cited across r/Dentistry threads).

**Trigger:** Patient books appointment on the website

**Workflow:**
1. Booking confirmed → confirmation email + .ics invite sent
2. 48h before → SMS reminder with confirm/cancel button
3. 24h before → email reminder with reschedule link
4. 2h before → SMS final reminder
5. If cancel → waitlist auto-texts next patient with 30-min booking window
6. If no-show → auto-charge deposit + send reschedule link
7. If completed → trigger review request (2h post-appointment)

**Dashboard:** No-show rate (before/after comparison), $ recovered, reminders sent, waitlist fills

**Content angle:** "This dental practice was losing $67K/year to no-shows. One booking page + automated reminders fixed it."

**Demo Mode:** 30-day compressed sequence runs in 30 seconds. Dashboard seeded with 30 days of realistic data.

---

### 2. Med Spa — Speed-to-Lead Alert

**Demo site:** Service menu with online booking and intake forms

**Automation:** 60-second SMS response + email confirmation + follow-up drip on unanswered leads

**Problem:** Med spas run Facebook ads getting inquiries but front desk takes hours to call back because they're doing 10 other things. 30-40% of inbound calls go unanswered. 80% of callers who reach voicemail never call back.

**Reddit proof:** "I've seen a medspa running decent Facebook ads, getting enquiries, but the front desk takes hours to call back because they're doing ten other things." — r/MedSpa. "If the agency brings leads but you don't have a clean process for missed calls, DMs, consult follow ups, rebooking, reviews, and win backs, you'll stay dependent on them forever." — same thread.

**Trigger:** Web form submission / missed call / Instagram DM

**Workflow:**
1. Lead captured → instant SMS to owner within 60 seconds
2. Auto-email to lead with booking link + service menu
3. If no booking after 1h → SMS nudge with testimonial
4. If no booking after 24h → email with special offer
5. If no booking after 72h → flag as cold lead, move to monthly nurture
6. Lead scored by source (IG = hot, website = warm, referral = hottest)

**Dashboard:** Response time per lead (goal <60s), conversion rate by source, $ recovered vs no-system baseline

**Content angle:** "Your med spa is burning ad spend on leads nobody calls back. This auto-responder books them in 60 seconds."

---

### 3. HVAC/Plumbing — Missed Call & Web Chat Recovery

**Demo site:** Landing page with emergency booking and instant quote request

**Automation:** Auto-text within 30 seconds of missed call + AI triage + schedule

**Problem:** Home service businesses miss calls while on jobs. No dispatcher means techs show up whenever with no window. Customers call 5 companies, pick the first one that answers.

**Reddit proof:** "Building manager tells me HVAC techs don't operate on a schedule and that the guy coming to fix my system has the right to show up whenever he wants with no word." — r/hvacadvice. "I would and still do lose work because I can't get to it fast enough or I don't reply fast enough. Customers expect immediate results." — r/AskElectricians.

**Trigger:** Missed call / web form / text message

**Workflow:**
1. Missed call detected → auto-SMS within 30 seconds: "Sorry we missed you! Reply with your name and what needs fixing"
2. AI triages response → identifies service type (AC, furnace, plumbing)
3. Suggests first available slot based on urgency
4. If emergency → pages on-call tech immediately
5. If no response in 15 min → auto-call from AI voice agent
6. If booked → confirmation + 24h/2h reminders + tech ETA on day of service

**Dashboard:** Missed vs recovered calls, response time, booking rate by source, revenue recovered

**Content angle:** "Your phone rings while you're on a roof. Customer hangs up, calls your competitor. This catches every call, every time."

---

### 4. Law Firm — Client Intake Pipeline

**Demo site:** Practice area pages with intake form and client portal

**Automation:** PDF intake → AI extraction → auto-generate retainer → e-sign → calendar deadline

**Problem:** Personal injury law firms lose clients during manual intake. By the time a paralegal reads a police report and types it in, the client has signed with a competitor down the street. 41% of PI firms don't answer after hours despite listing "24 hours" on Google.

**Reddit proof:** "A personal injury law firm loses clients because manual data entry is too slow. By the time a paralegal generates a retainer agreement, the potential client has already signed with a competing firm." — r/n8n. "41% of PI firms don't answer after hours, despite listing 'Open 24 Hours' on Google." — r/Ask_Lawyers.

**Trigger:** Intake form submitted / police report emailed

**Workflow:**
1. Document received → AI extracts key data (client name, accident date, injuries, insurance)
2. Auto-generate retainer agreement from template
3. Send for e-sign via InsForge
4. Create calendar entry with statute of limitations deadline
5. SMS reminder if retainer not signed in 24h
6. Signed retainer → create client profile + case file
7. Welcome sequence: intake complete → what to expect → next steps

**Dashboard:** Intake pipeline (leads → signed), avg time-to-sign, conversion rate, SOL calendar

**Content angle:** "From PDF to signed retainer in 90 seconds. Your competitors are still reading the police report."

---

### 5. Real Estate — Lead Nurture Drip

**Demo site:** Property listings with IDX integration and contact forms

**Automation:** 7-touch email + SMS sequence over 30 days with hot lead detection

**Problem:** Most agents don't have a lead gen problem — they have a follow-up problem. Leads come in, get added to a spreadsheet, and never get called. The ones that do get called get 1-2 attempts and then go cold.

**Reddit proof:** "Unpopular opinion: Most agents don't have a lead gen problem… they have a follow-up problem. Most agents don't need more leads. They need to stop ghosting, and learn to effectively follow up with the ones they already have." — r/realtors. "I desperately need a better system." — same thread.

**Trigger:** Lead captured from Zillow, website form, open house sign-in, or social DM

**Workflow:**
1. Instant auto-response SMS: "Thanks for reaching out! Want to see [property] this weekend?"
2. If reply → human flagged, SMS alert sent to agent
3. If no reply → D1 email with property details + similar listings
4. D3 SMS: "Still looking? Here are 3 homes just listed in your area"
5. D7 email: market report + neighborhood guide
6. D14 SMS: "Any questions I can answer?"
7. D21 email: mortgage rate update + buying tip
8. D30: re-engagement — "Should I close this out?"
9. Hot lead detection: visited site 3x in a day, opened 3+ emails → agent alert

**Dashboard:** Lead source breakdown, response rate, conversion by sequence step, hot lead alerts

**Content angle:** "Your Zillow leads are ghosting you because you called once and gave up. This automation follows up 7 times so you don't have to."

---

### 6. Gym/Fitness — Membership Renewal & Win-Back

**Demo site:** Class schedule with membership signup and member portal

**Automation:** Pre-expiry nudges + post-expiry win-back + at-risk detection

**Problem:** Memberships lapse silently. No one follows up. The gym focuses on new acquisition while existing members quietly walk away. Most just forgot to renew and assumed the gym would remind them.

**Reddit proof:** "We calculated how much our gym lost last year to expired memberships. 47 memberships lapsed without a single follow-up from us. Average membership is $65/month. That's over $3,000 in monthly recurring revenue we just silently walked away from." — r/gymowner. "A surprising number said they just forgot to renew and assumed we'd remind them. They were waiting for us." — same thread.

**Trigger:** Membership approaching expiry / attendance drops to 0 for 14 days

**Workflow:**
1. 14 days before expiry → SMS + email: "Your membership renews on [date]. Tap to auto-renew"
2. 7 days before → SMS with early renewal discount offer
3. Day of expiry → final reminder + easy 1-click renewal link
4. 3 days post-expiry → "We miss you" + special return offer
5. 14 days post-expiry → win-back offer (free week / discounted first month)
6. At-risk detection: member was coming 3x/week, now 0 visits in 14 days → coach gets alert to reach out
7. Post-class NPS < 3 → auto-flag for manager call

**Dashboard:** Renewal rate, at-risk members, $ recovered from win-backs, lapsed member count

**Content angle:** "You're leaving $36K/year on the table from members who just forgot to renew. This automation reminds them for you."

---

### 7. Life Coach — Client Onboarding Sequence

**Demo site:** Sales page with booking, client dashboard, and progress tracking

**Automation:** Welcome sequence → intake form → milestone tracking → automated check-ins

**Problem:** Coach spends 15 hrs/week on admin instead of coaching. Onboarding is chaotic — screenshots, password resets, long email threads just to get access. Clients feel confused before they even start.

**Reddit proof:** "Coach B was managing 10+ clients using Excel sheets, scattered notes, and WhatsApp messages. They were spending ~15 hours a week on admin instead of coaching. They were forgetting follow-ups, sending bank details via text for payments." — r/CustomerSuccess. "For a long time, client onboarding was just messy. Screenshots everywhere, people forgetting passwords, wrong permissions, long email threads just to get access." — r/Entrepreneur.

**Trigger:** Client signs up / pays deposit

**Workflow:**
1. Welcome email with onboarding video + client portal link
2. Intake form (goals, challenges, availability) auto-sent
3. Day 1: kickoff call scheduled + prep worksheet sent
4. Day 3: automated check-in — "How's it going? Any questions?"
5. Day 7: first milestone review + progress report
6. Session notes auto-logged to client profile
7. Monthly: progress summary + goal adjustment
8. Any missed session → auto-reschedule nudge

**Dashboard:** Client status board (active/at-risk/done), onboarding completion %, session history, MRR

**Content angle:** "New clients used to take 2 weeks to start. Now it's 2 hours and the coach never touches admin."

---

### 8. Property Management — Maintenance Work Order AI

**Demo site:** Rental listings with tenant portal and maintenance request system

**Automation:** AI triage → work order gen → vendor assignment → owner approval → completion

**Problem:** 31.25% of property managers say maintenance coordination is the #1 bottleneck. A simple leak turns into 5 emails, 2 calls, a quote request, owner approval, vendor chase, and tenant follow-up. 15-20 hrs/week wasted per PM.

**Reddit proof:** "A leaking tap sounds simple enough. Until it turns into: Five emails, two phone calls, a quote request, checking maintenance limits, digging through old notes, chasing a tradie, updating the owner, replying to another 'just checking for an update' email from the tenant." — r/PropertyManagement. "For 300-500+ requests, this can save you 15-20 hours each week." — same thread.

**Trigger:** Tenant submits request via SMS, email, or tenant portal

**Workflow:**
1. AI analyzes request + attached photos → identifies issue (clogged sink, AC not cooling)
2. Auto-generate work order with urgency level (emergency/routine), recommended vendor, estimated cost
3. If above spend limit → send to owner for approval via SMS link
4. If approved → assign to vendor, send job details
5. Send tenant ETA window + live status updates
6. Completion confirmed → auto-charge tenant ledger / owner billing
7. Send satisfaction survey
8. Log everything to property file

**Dashboard:** Open/completed work orders, avg response time, vendor performance, monthly spend

**Content angle:** "A leaking tap used to mean 5 emails, 2 calls, and 3 follow-ups. Now it's one text and it's done."

---

### 9. Auto Repair — Document Collection & E-Sign

**Demo site:** Service menu with booking and vehicle intake portal

**Automation:** Digital work order → vehicle intake form → e-sign authorization → photo attachment

**Problem:** Auto shops still use paper work orders. Customers drop off keys and paper gets lost. Disputes happen: "I never authorized that $2K repair." No photo documentation of vehicle condition before service.

**Reddit proof:** "Square Appointments is too simplistic — no intake forms for vehicle info, no digital authorization for repairs, no waiver for test drives. I had a client say I did $2K of work they didn't authorize — had to eat the cost." — r/autorepair (paraphrased from competitive analysis). "Customers that don't pay you for months or at all." — r/landscaping (same pain applies to auto).

**Trigger:** Customer books appointment or drops off vehicle

**Workflow:**
1. Booking → vehicle intake form sent (year/make/model/mileage + photos)
2. Customer uploads photos of vehicle condition (pre-existing damage documented)
3. Digital work order generated with recommended services + pricing
4. Customer e-signs authorization
5. While in service: status updates via SMS ("Your oil change is complete. Moving to inspection")
6. Service complete → digital invoice sent with Stripe payment link
7. If declined service → saved to profile for follow-up campaign
8. Post-service → review request

**Dashboard:** Appointments today, work orders pending, signed vs unsigned, vehicle history, photos attached

**Content angle:** "Never eat a $2K unauthorized repair again. Digital work orders with e-sign. Every job documented."

---

### 10. Chiropractor/PT — Dormant Patient Reactivation Engine

**Demo site:** Booking page with intake forms and exercise portal

**Automation:** Segment inactive patients by duration → multi-touch campaign over 60 days

**Problem:** Average clinic recall rate is 60-70%. 800-2,000 dormant patients per practice. 35-40% of dormant patients WILL schedule if contacted, but no one reaches out. Every inactive patient is walking-around money.

**Reddit proof:** "Patient Reactivation Software: the revenue leak most dental practices ignore." — r/MKD_TOOLS. "Database Reactivation: It gently checks in on patients who haven't been seen in 12+ months." — r/Dentists. "Follow-up systems are necessary for practices to avoid no-shows, inactive patients, and declining patient retention rates." — r/Chiropractic.

**Trigger:** Weekly cron checks for patients inactive 3mo+/6mo+/12mo+

**Workflow:**
1. Segment by inactivity: 3mo (soft), 6mo (medium), 12mo+ (hard)
2. Touch 1 — SMS: "It's been a while! We'd love to see you. Book here: [link]"
3. Touch 2 (3 days later) — Email: personalized message + testimonial
4. Touch 3 (7 days later) — SMS with special offer: "Free adjustment on your next visit"
5. If no response → move to quarterly nurture
6. If they booked → mark reactivated, track $ recovered
7. Dashboard shows dormant %, reactivation rate, $ recovered per campaign
8. Same engine works for PT: check if patient hasn't been in for follow-up visit

**Dashboard:** Dormant patient count by segment, reactivation rate, $ recovered, campaign performance

**Content angle:** "You have $40K-$100K sitting in your inactive patient list. This automation picks up the phone for you."

---

### 11. Salon/Barber — Review Generation Loop

**Demo site:** Service menu with booking and stylist selection

**Automation:** Post-appointment auto-review request + social proof funnel

**Problem:** Most service businesses have zero recent reviews. 82% of customers check Google reviews before choosing a provider. 60% chose one over another based on reviews alone. But no one asks at the right time.

**Reddit proof:** "Getting reviews can be tricky... people need a little guidance but explaining how to leave a Google or Yelp review is ineffective." — r/dentalmarketing. "If you don't have enough reviews to convince people you're a great dentist, you're almost certainly missing out on new patients." — same thread.

**Trigger:** Appointment marked completed

**Workflow:**
1. 2 hours post-appointment → SMS: "Thanks for visiting [salon]! Love your new cut? Leave a review: [Google link]"
2. If no action in 3 days → email reminder with both Google + Yelp links
3. If 5-star → auto-thank-you + "Can we feature your review on our site?"
4. If 3-star or below → escalate to owner: "A client left a 2-star review. Reply within 24h."
5. Monthly: review volume report, star average trend, response rate
6. Happy customer flow: after 3rd visit → ask for referral ("Share a free blowout with a friend")

**Dashboard:** Review count (monthly trend), average rating, response rate, stars breakdown, referral links sent

**Content angle:** "You do amazing work but nobody knows because your last review was 8 months ago. This automation fixes that."

---

### 12. Accountant/Bookkeeper — Payment Collection Pipeline

**Demo site:** Service page with client portal and document upload area

**Automation:** Deposit collection → recurring billing → failed payment retries → escalation

**Problem:** 85% of freelancers and small businesses get paid late. Accountants send invoices and chase manually. Monthly retainer clients forget to pay. Awkward "just checking in" emails waste hours.

**Reddit proof:** "85% of freelancers get paid late at least sometimes. 21% get paid late more than half the time. I hate chasing payments. It's awkward. I forget to follow up. I waste hours writing 'just checking in' emails." — r/Entrepreneur. "One of the most stressful parts of the job is dealing with late invoices and chasing for money. I always feel awkward following up." — r/smallbusiness.

**Trigger:** Invoice generated / recurring billing date

**Workflow:**
1. At booking → collect deposit via Stripe payment link
2. Auto-invoice sent with payment terms
3. Payment link in every invoice + SMS
4. If payment fails → auto-retry on day 1, 3, 7, 14
5. Day 7 → SMS reminder: "Your invoice is due. Tap to pay."
6. Day 14 → email with late fee notice
7. Day 21 → escalation to business owner
8. Day 30 → final notice + service pause warning
9. Successful payment → thank-you + receipt

**Dashboard:** MRR, failed payments, outstanding balance, avg days to pay, collection rate

**Content angle:** "85% of your clients pay late not because they don't want to — because you're not reminding them. This pipeline does it so you don't have to."

---

### 13. Business Consultant — Proposal Follow-Up Engine

**Demo site:** Landing page with proposal/quote area and client portal

**Automation:** Track opens → auto-follow-up sequence over 30 days → close or nurture

**Problem:** 80% of sales happen between the 5th and 12th contact. Most consultants stop at 2. A proposal goes out, the prospect goes silent, and the consultant doesn't know if it was read, shared, or ignored.

**Reddit proof:** "I submitted the proposal on time and received no response/no confirm of receipt. It has now been a week. I'm irked because we put so much time into it." — r/consulting. "Currently have two clients a month on a good month and making about 45-50k USD a year. My problem is getting leads to convert." — same thread.

**Trigger:** Proposal sent (via link or PDF)

**Workflow:**
1. Track when proposal is opened + how many times + which pages
2. 3 days post-open → email with relevant case study
3. 5 days post-open → SMS: "Any questions on the proposal?"
4. 7 days → email with testimonial from similar client
5. 14 days → re-engagement email: "Should I close this out?"
6. 21 days → LinkedIn connection request
7. 30 days → move to monthly nurture newsletter
8. If prospect converts → auto-trigger onboarding sequence

**Dashboard:** Proposal pipeline (sent → opened → followed up → won/lost), win rate by proposal type, avg close time

**Content angle:** "Your proposal went dark 2 weeks ago. This automation follows up 6 times so you don't lose the deal to silence."

---

### 14. Pet Grooming/Vet — Appointment Reminder System

**Demo site:** Service menu with booking and pet profile portal

**Automation:** Multi-channel reminder sequence + confirmation tracking + reschedule flow

**Problem:** 15-30% no-show rate for vet and grooming appointments. Pet owners forget, double-book, or lose the appointment card. Staff spends hours on reminder calls.

**Reddit proof:** Cross-industry no-show research shows the same pattern for all appointment-based services. Pet care businesses lose an estimated $20K-$50K/year to missed appointments. No-show Reddit threads across r/VetTech and r/doggrooming confirm this is a universal pain.

**Trigger:** Appointment booked via website or phone

**Workflow:**
1. Confirmation email with .ics calendar invite + pet profile review link
2. 48h before → SMS: "Reminder: [Pet] has an appointment with [groomer/vet] on [date] at [time]. Reply CONFIRM or CANCEL"
3. 24h before → email with pre-appointment instructions (fasting for vet, drop-off time for grooming)
4. 2h before → SMS final reminder
5. If cancel → offers reschedule link + waitlist notification
6. If no-show → auto-charge deposit (if on file) + reschedule text
7. Post-appointment → request review + "Book next appointment" reminder (for regular grooming cycles)

**Dashboard:** No-show rate, confirmed vs cancelled, reschedule % , revenue protected

**Content angle:** "Your vet clinic is losing $20K/year to no-shows. This auto-reminder system cuts that by 40%."

---

### 15. Tutor/Educator — Multi-Party Scheduling

**Demo site:** Course/session page with booking and student portal

**Automation:** Group poll for availability → find mutual slot → confirm all parties → reminders

**Problem:** Scheduling tutoring sessions or group lessons is email tennis. Parents have different availability, tutors have limited slots, and finding alignment takes 5-10 emails per session. Group classes are even worse.

**Reddit proof:** "Scheduling and rescheduling depositions with multiple attorneys." — r/paralegal. Same pain applies to tutoring: coordinating availability across students, parents, and tutors is the identical problem. "Manual booking is a hassle — back-and-forth like 'What about this date? No? How about 3 PM instead?'" — Workee blog (cited on Reddit).

**Trigger:** Tutor/teacher initiates a new session or class

**Workflow:**
1. Tutor sets proposed dates/times → system polls all participants
2. Each participant receives SMS/email: "Pick your available slots from these 5 options"
3. System finds the slot with highest availability match
4. Auto-sends confirmation + .ics invites to all participants
5. 24h before → reminder to all parties
6. 2h before → SMS final reminder
7. If one party cancels → re-poll for alternatives
8. Post-session → follow-up with materials/notes

**Dashboard:** Sessions scheduled, confirmation rate, reschedule frequency, no-show by participant

**Content angle:** "Coordinating 5 parents for tutoring used to mean 10 emails. Now it's one link and the system finds the time for you."

---

### 16. Massage Therapist — New Client Intake & E-Sign Portal

**Demo site:** Service menu with booking and intake form flow

**Automation:** Pre-appointment digital intake → health questionnaire → e-sign consent → PDF archive

**Problem:** Clients arrive 10 minutes early to fill out paper forms. Forms get lost. Therapists can't read handwriting. Health conditions get missed. Paper consent forms for specific modalities get filed incorrectly or not at all.

**Reddit proof:** "Intake forms aren't ready before arrival, check-in slows and delays the entire day." — PatientNow blog (r/MedSpa context). "Gathering data from a client is absolute hell. A lot of times they forget to send me what I need, or forget certain files." — r/smallbusiness.

**Trigger:** Appointment booked online

**Workflow:**
1. Email + SMS sent immediately with secure intake form link
2. Client fills health questionnaire (medical history, allergies, areas of focus)
3. E-sign consent/waiver for specific modalities (deep tissue, cupping, etc.)
4. Canvas signature captured + timestamped + IP logged
5. PDF generated and stored in InsForge Storage
6. Therapist notified: "New intake completed for [client name] — review before session"
7. On arrival: therapist opens tablet with completed form — no clipboard needed
8. Post-session: form archived to client profile for future reference

**Dashboard:** Forms completed, pending, abandoned; digital vs paper rate; signed consent archive

**Content angle:** "No more clipboard paperwork. Your clients fill out intake forms and sign waivers before they walk in the door."

---

### 17. Photographer — Invoice Follow-Up Sequence

**Demo site:** Portfolio with booking, gallery delivery, and client portal

**Automaion:** Past-due detection → escalating reminders → late fee → paid confirmation

**Problem:** 56% of small businesses have unpaid invoices averaging $17,500. Photographers deliver galleries and then chase payments for weeks. Invoices get buried in email. Clients forget. Asking for money feels awkward.

**Reddit proof:** "56% of small businesses are owed money on unpaid invoices — averaging $17,500 per business. 47% have invoices overdue by 30+ days." — Intuit QuickBooks 2025 Late Payments Report. "I run a small consulting business... whether it's chasing down invoices, handling payroll, or wading through endless paperwork, I'm spending way too much time on these back-office headaches." — r/smallbusiness.

**Trigger:** Invoice generated after gallery delivery or session

**Workflow:**
1. Invoice sent with Stripe payment link + gallery watermark removed on payment
2. Day 3 post-due → friendly email reminder: "Just a heads up — your invoice is due"
3. Day 7 → SMS: "Tap to pay your invoice securely"
4. Day 14 → email with late fee notice added
5. Day 21 → personal email from photographer
6. Day 30 → final notice + gallery access revoke warning
7. If paid → thank-you + print release + "Book your next session" link
8. Successful payment → auto-request Google review

**Dashboard:** Outstanding invoices, aging report, recovery rate, avg days to pay, total outstanding

**Content angle:** "You edited their gallery for 3 hours. Don't spend another 3 chasing the invoice. This does it automatically."

---

### 18. Wedding Planner — NPS & Referral Loop

**Demo site:** Service packages with inquiry form and client planning board

**Automation:** Post-wedding NPS survey → branch by score → testimonial request → referral link

**Problem:** No system to collect testimonials or referrals at the right moment. Happy couples leave without being asked. Referrals drive 30-40% of new business in the wedding industry but are almost never tracked.

**Reddit proof:** "No system to collect testimonials, NPS scores, or referrals at the right moment. Happy clients leave without being asked. Referrals drive 30-40% of new business." — industry benchmark. "Referrals drive 30-40% of new business in service industries but are almost never tracked." — multiple service industry surveys.

**Trigger:** Wedding date completed (+1 day)

**Workflow:**
1. 24h post-wedding → SMS: "Congratulations! How was your experience? Rate 1-10"
2. If 9-10 → auto-request Google testimonial + personalized referral link for their friends
3. If 6-8 → thank-you + feedback form + offer a call to debrief
4. If 1-5 → escalation alert to owner immediately
5. Referral link tracked: who shared, who clicked, who booked
6. When referral books → reward trigger (discount, gift card, etc.)
7. Monthly: NPS trend report, referral conversion, testimonial count

**Dashboard:** NPS trend, referral conversion rate, testimonial count, promoter/detractor breakdown

**Content angle:** "Your happiest couples will send you their friends — if you ask at the exact right moment. This automation finds that moment."

---

### 19. Personal Trainer — Membership/Auto-Renewal

**Demo site:** Packages page with booking and client progress dashboard

**Automation:** Pre-expiry nudges + auto-renewal + failed payment retries + progress-based re-engagement

**Problem:** PT clients buy 10-session packs and vanish. Recurring billing fails and nobody fixes it. Clients who stop seeing progress stop showing up. Trainers lose $15K-$30K/yr in unpaid packages and lapsed clients.

**Reddit proof:** "Stop using Venmo and Zelle for client payments. There's no automatic recurring billing so you're manually requesting money every month. There's no way to track failed payments." — r/personaltraining. "50% quit within the first 6 months. The reasons: can't make the schedule work, didn't see any results." — r/crossfit.

**Trigger:** Package nearing expiry / session count low / attendance dropping

**Workflow:**
1. 10 days before package ends → SMS: "You have 2 sessions left! Ready to renew?"
2. Day of expiry → auto-charge saved card for next month (if recurring)
3. If payment fails → auto-retry day 1, 3, 7, 14
4. 7 days no visit → automated check-in from trainer: "Haven't seen you — everything OK?"
5. 14 days no visit → offer to reschedule or pause account
6. 30 days no visit → win-back offer (free session)
7. Client hits goal → auto-celebration + testimonial request
8. Monthly progress report sent to client automatically

**Dashboard:** Active clients, renewal rate, failed payments, lapsed clients, MRR, session usage per client

**Content angle:** "Your clients buy 10 sessions and ghost you. This automation renews them, chases failed payments, and re-engages the ones who stop showing up."

---

### 20. Landscaping — AI Front Desk & Auto-Scheduler

**Demo site:** Service page with quote request and seasonal booking

**Automation:** 24/7 text intake → AI triage → calendar availability → auto-book → reminders

**Problem:** Landscapers work outside with loud equipment. They can't answer the phone. They come home to voicemails from 8 missed calls. Customers call 3 companies and go with the first one that answers.

**Reddit proof:** "Phone calls non-stop while you're trying to do anything with heavy equipment or mowers." — r/landscaping. "Having a public phone number, the spam never stops." — same thread. "Right now it's a mess of texts, calls, random notes, and half-finished quotes sitting in my email. Sometimes I forget to follow up." — r/electricians.

**Trigger:** Inbound call missed / website form / SMS to business number

**Workflow:**
1. Missed call detected → auto-SMS: "Sorry we missed you! Tell us what you need and we'll get right back to you"
2. AI triages response: mowing (routine), landscaping (consultation needed), snow removal (urgent)
3. Auto-sends quote for routine services + booking link
4. For consultations: auto-suggests 3 available time slots
5. Confirmation sent with job details + crew ETA on day of service
6. 24h before → SMS reminder to customer
7. Morning of → crew gets job assigned with address + notes
8. Post-service → payment link + review request

**Dashboard:** Calls missed vs captured, jobs booked from text, response time, revenue from auto-booking

**Content angle:** "Your phone rings 12 times while you're on the mower. You lose 8 of those jobs. This AI front desk catches every single one."

---

## Tech Stack (All 20)

| Layer | Tool |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Automation | Trigger.dev v4 (`@trigger.dev/sdk`) |
| Email | Resend |
| Backend / DB / Auth / Storage / AI | InsForge (`@insforge/sdk`) |
| SMS | Twilio |
| Payments | Stripe |

## Demo Mode

Every workflow has a `DEMO_MODE = true` flag that compresses time:
- `wait(24 hours)` → `wait(5 seconds)`
- `cron(weekly)` → `cron(1 minute)`
- Day-based sequences fire in seconds

Dashboard is seeded with 30 days of realistic historical data so it never looks empty.

## Build Sprint — 7 Weeks (3/week)

| Week | 1 | 2 | 3 |
|------|---|---|---|
| Wk1 | Dental | Med Spa | HVAC |
| Wk2 | Law Firm | Real Estate | Gym |
| Wk3 | Coach | Property Mgmt | Auto Repair |
| Wk4 | Chiro/PT | Salon | Accountant |
| Wk5 | Consultant | Pet Grooming | Tutor |
| Wk6 | Massage | Photographer | Wedding |
| Wk7 | PT | Landscaping | — |

## How to Use This List

1. **Record a 60-sec Loom per demo** — trigger → compressed automation → dashboard
2. **Post 3 per week on LinkedIn / IG / TikTok** — each post proves you build
3. **Inbound leads follow** — businesses see their exact niche and reach out
4. **Sell high-ticket** — pitch the paid version during the demo call
