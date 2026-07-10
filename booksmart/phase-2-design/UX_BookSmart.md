# UX & User Flows — BookSmart

| **Field** | **Detail** |
|---|---|
| **Product** | BookSmart — Unified Booking & Client Intake |
| **Phase** | 2 — Design |
| **Author** | UX Researcher |
| **Date** | 2026-06-30 |
| **Primary Vertical** | Dental (first-class), extensible to salon, auto, chiropractic |

---

## Table of Contents

1. [User Personas](#1-user-personas)
2. [Journey Maps](#2-journey-maps)
3. [Key Interaction Patterns](#3-key-interaction-patterns)
4. [Information Architecture](#4-information-architecture)
5. [Accessibility & Inclusive Design](#5-accessibility--inclusive-design)
6. [Conversion Optimization](#6-conversion-optimization)
7. [Error & Edge Case States](#7-error--edge-case-states)

---

## 1. User Personas

### Persona 1: Dr. Sarah Chen — Dental Practice Owner

| Attribute | Detail |
|---|---|
| **Background** | 45, DDS, owns Lumina Dental (3 chairs) in Phoenix, AZ. 15 years in practice. Migrated from paper to Curve Dental 3 years ago. |
| **Staff** | 2 hygienists (Rosa, Kevin), 1 front-desk manager (Maria), 1 office manager (David) |
| **Volume** | ~80 appointments/week (16/day): 40% cleanings, 30% fillings, 20% new-patient exams, 10% crowns/surgery |
| **Tech Comfort** | Moderate. Comfortable with Curve Dental and basic practice management software. Not a power user. Does not code, does not configure complex tools. Needs a "set it and forget it" system. Uses an iPhone 14 and a 2022 MacBook Air. |
| **Device Preference** | Desktop (iMac 27") for admin tasks. Phone for quick schedule checks. |

**UX Needs:**
- One-click "Today's Schedule" view that loads in under 2 seconds. She does not want to navigate menus during a packed day.
- Dashboard must show her **at-a-glance financial impact**: "You prevented $X in no-shows this month." This is her primary ROI language.
- Setup must be completable in under 60 minutes without reading a manual. If she needs to call support to configure anything, that's a failure.
- She needs to trust the system deeply before telling her patients to use it. A "Preview as Patient" mode where she can walk through the booking flow as if she were a client.
- Color-coded appointments by type (cleaning = green, filling = blue, new patient = orange, surgery = red) for instant visual parsing.
- She does not want to manage email templates. Default copy should be excellent. She edits nothing.

**Frustrations:**
- Curve Dental has gone down mid-day 3 times in 18 months, which means no access to patient records or schedule. She needs offline fallback or a local cache of today's schedule.
- Feels she overpays for software ($399/mo for Curve + $14/mo for Calendly + paper forms). Wants one bill, predictable.
- "My front desk spends 2 hours a day on reminder calls." She knows this is wasteful but sees no alternative.
- Gets anxious about patient data leaks. Needs clear HIPAA reassurance in onboarding.

**Goals:**
- Reduce no-shows from 14% to under 5% within 60 days
- Eliminate paper intake forms entirely ("I lost 3 forms last month in the shuffle")
- Have a booking link she can put on her Google Business Profile and website that works without staff
- Get more Google reviews automatically (she has 47 reviews; competitor Dr. Nguyen has 112)

**Decision-Making Pattern:**
- She needs to see the system work before paying. A 14-day free trial with full functionality, where her staff can test with dummy data.
- Her primary buying trigger: a day where 3+ patients no-show simultaneously (happens ~1x/month).
- Secondary trigger: another Curve outage. Each one makes her more willing to switch.
- She will ask her front desk manager (Maria) for a thumbs-up before signing any contract. Maria's opinion matters more than the price.

---

### Persona 2: Maria — Front Desk Manager

| Attribute | Detail |
|---|---|
| **Background** | 38, has worked at Lumina Dental for 6 years. Previously at a pediatrician's office running their scheduling. She is the daily operator of the system. |
| **Tech Comfort** | High for front-desk tools. Fast typer, good at multitasking. Not interested in learning new things unless they save her time. Uses both a Windows desktop at work and her personal Android phone. |
| **Device Preference** | Desktop (Windows 11, dual monitors) for most tasks. iPad mounted at the check-in counter for patient sign-in. |
| **Staff Relationship** | She manages the schedule for all 3 doctors/hygienists. She decides who gets booked where. She does not tolerate systems that make her look bad. |

**UX Needs:**
- **Speed is everything.** She processes 50+ phone calls a day asking about availability. She needs to see a 7-day view of all 3 chairs in under 1 second. Every second the page takes to load is a micro-failure.
- **Keyboard-first navigation.** She never uses a mouse when she can help it. Tab, Enter, Escape, keyboard shortcuts for common actions: `N` = new booking, `C` = check in, `S` = search clients, `T` = today. Every action must be available from keyboard.
- **Error prevention above all else.** She has been double-booked by bad software before (Vagaro, at a previous job). She needs clear visual signals when a slot is occupied. Red strikethrough for booked, yellow for pending, grey for blocked. No ambiguity.
- **Quick client search.** She types "smi" and gets "John Smith, Sarah Smithson, Dr. Smith" in 200ms. Fuzzy search across name, phone, email. Recent clients at the top of the dropdown.
- **Walk-in handling.** Someone walks in without an appointment. She needs to book them into the next available slot in 3 clicks: select service → see next open slot → confirm.
- **Noise reduction.** She does not need animations, transitions, or "delight" moments. Smooth is fine. Fancy is bad. She has 100 things to do.
- **Mobile check-ins.** When she steps away from the desk, she wants to see "who just arrived" on her phone. A simple push notification or a mobile-optimized check-in approval.

**Frustrations:**
- "Systems that make me click 4 times to do what I could do in 2." She notices every extra click.
- Software that hides the reschedule button or makes it a multi-step process. She reschedules 5-10 appointments/day.
- When the intake form link doesn't send and a patient shows up having not filled it out. She has to hand them an iPad and hold up the line.
- Systems that log her out too frequently. She enters a password maybe once a day, max.
- "When I have to explain to a patient how to use the booking page." The booking page must be so simple it needs zero explanation.

**Daily Routine:**
- 7:45 AM: Arrive, log in (ideally still logged in from yesterday). Pull up today's schedule on the left monitor.
- 8:00 AM: First patient checks in. She clicks "Check In." Looks at the patient's uploaded insurance card photo. Confirms details. That's it.
- Between patients: answers phones, handles reschedules, books new appointments. Each interaction should take under 20 seconds.
- 1:00 PM: Lunch lull. She reviews tomorrow's schedule, marks any incomplete intake forms, sends manual reminders for the 2-3 patients who didn't fill theirs out.
- 5:00 PM: End-of-day review. Prints tomorrow's schedule for Dr. Chen (she still likes paper). Logs out. (She'd actually prefer not to log out — have a "lock screen" mode that requires a PIN to resume.)

**Goals:**
- Reduce phone call time from 2 hours/day to 30 minutes/day
- Never manually enter patient data from a paper form again
- Never hear "I didn't get a reminder" from a patient
- Be able to train a temp in under 30 minutes

---

### Persona 3: Emily Chen (no relation) — New Client, First Appointment

| Attribute | Detail |
|---|---|
| **Background** | 32, marketing coordinator, moved to Phoenix 6 months ago. Needs a new dentist. Found Lumina Dental via Google Maps search "best dentist Phoenix." |
| **Tech Comfort** | High. Millennial digital native. Books everything online — Uber, flights, restaurant reservations. Expects the same experience for healthcare. Uses an iPhone 15, rarely touches a desktop. |
| **Emotional State** | Mildly anxious. She hasn't been to the dentist in 2 years. She's worried about: cost, pain, being judged for her dental hygiene, and having to share personal health information with a stranger. |
| **Device Preference** | Mobile-first. She will discover and book entirely from her phone, likely while sitting on her couch at 9 PM on a Tuesday. |

**UX Needs:**
- **Trust signals everywhere.** She found Lumina Dental on Google Maps. The booking page must immediately reinforce that this is a legitimate, professional practice. Show: Google star rating (4.8), number of reviews (200+), a real photo of the office, a short bio of Dr. Chen, a reassuring welcome message ("We're glad you're here").
- **No account creation.** She does not want to "sign up" or create a password. Email + phone is the only data she should provide. Magic link for portal access later is fine.
- **Anxiety-reducing copy.** The service description for "New Patient Exam" should say: "A gentle, comprehensive exam including X-rays, oral cancer screening, and a cleaning. Dr. Chen will review everything with you before any treatment. No pressure. No judgment." Not just "New Patient Exam — $89."
- **Progress indicator.** She needs to know "I'm step 3 of 5" and roughly how much time is left. If the flow takes more than 3 minutes of active filling, she'll abandon.
- **Price transparency.** She needs to see the cost before booking. No surprise charges. If insurance is accepted, show a banner: "We accept Delta, Cigna, MetLife."
- **Calendar familiarity.** The week/day picker should look like her phone calendar (iOS-style week view). She should not have to learn a new interaction pattern.
- **Confirmation clarity.** After booking, she needs: date, time, address (with a Google Maps link), what to bring (ID, insurance card), and what will happen at her visit. Text this to me, don't just email it.

**Frustrations:**
- Dentist booking pages that look like they were designed in 2008. If the page looks amateurish, she questions the quality of the practice.
- Forms that ask for the same information twice. "Why do I enter my name on the booking form AND again on the intake form?"
- "Call to confirm your appointment" — she specifically chose online booking to avoid a phone call.
- Booking flows that break when she switches between apps. If she's on step 4 of 6 and checks a text message, she should not lose her progress.
- Being asked for insurance details before she's even committed to coming. She doesn't know her policy number offhand. Make it optional at booking time.

**Conversion Drivers:**
- Same-week availability shown immediately ("Next appointment: Tomorrow at 10 AM")
- "7 appointments booked this week" — social proof counter
- Option to book a "quick intro visit" (15-min meet-and-greet) as a low-commitment entry point
- "Free consultation" badge on first visit
- A photo of Dr. Chen smiling. Real person, not a stock photo.

**Post-Booking Needs:**
- Reminder text the day before (not email — she ignores emails)
- Clear instructions: where to park, which door to enter, what floor
- A "What to expect" card with a 3-step visual: arrive → fill out forms (already done!) → see the dentist
- Day-of check-in link: "Let us know you're here" button in the reminder text

---

### Persona 4: James Mitchell — Returning Client, Regular Cleanings

| Attribute | Detail |
|---|---|
| **Background** | 58, retired high school principal. Has been seeing Dr. Chen for 8 years. Comes every 6 months for a cleaning. Has a crown on tooth #19 from 3 years ago. |
| **Tech Comfort** | Low-Moderate. Uses an iPad for email, Facebook, and reading news. Does not have a smartphone (uses a flip phone for calls). His wife manages most online tasks for the household. He does not use apps unless absolutely necessary. |
| **Device Preference** | Family-shared iPad at home. He can navigate to a website if the link is emailed to him. He will not download an app. |
| **Emotional State** | Calm, routine. This is his 16th cleaning. He is not anxious. He wants this to take as little time and thought as possible. |

**UX Needs:**
- **"Book my usual."** He should be able to book his standard 6-month cleaning with his standard hygienist in 2 clicks. A one-tap "Book Next Cleaning" button on the email reminder.
- **No repeated data entry.** The system should remember everything about him. He should never re-enter his address, phone, insurance info, or medical history unless something changed. Have a "Nothing changed since my last visit" checkbox at the start of the intake form. If checked, skip all medical history questions.
- **Large text, simple UI.** 18px minimum font size on the booking page for him. High contrast. Big buttons (at least 48px tall). No tiny links. No hover-dependent interactions (he uses a finger on iPad, not a mouse).
- **Clear, reassuring language.** Not "Intake form" — "Tell us about yourself." Not "Medical history update" — "Has anything changed with your health since your last visit?"
- **Phone as fallback.** He should be able to call the office and have Maria book for him. The system should never force digital-only interaction. Maria should be able to create a booking on his behalf in under 30 seconds.
- **Calendar invite.** After booking, he needs a `.ics` file that he can open in his iPad calendar. He will forget otherwise.
- **Simple cancellation.** He should be able to click "Cancel" in the email and confirm without any hoops. He doesn't want to log into a portal. One click, confirmed, done.

**Frustrations:**
- "Every time I go, they ask me the same questions. I've been going for 8 years. Don't you have my records?"
- Booking systems that require him to create a username and password. "I have 37 passwords. I don't need another one."
- Small fonts and cramped buttons. "I can't read this on my iPad."
- Being asked to download an app. "I don't want another app on my iPad. Just send me a link."
- When the reminder says "Your cleaning is tomorrow" but doesn't include the time. He has to call to check.

**Goals:**
- Book his next 6-month cleaning while he's still in the chair after this one. If Maria can send him a "Book your next visit" link at checkout, he'll book immediately.
- Receive reminders that work with his flip phone (SMS) or email (iPad). At least one must reach him.
- Never be asked "What's your address?" again.

---

## 2. Journey Maps

### 2.1 Client Booking Journey (End-to-End)

**Trigger:** Emily has a toothache. She searches "best dentist Phoenix" on Google Maps at 9:12 PM on a Tuesday.

| Stage | User Goal | Touchpoint | Emotional State | Friction Points | Success Metric |
|---|---|---|---|---|---|
| **1. Discovery** | Find a well-reviewed, nearby dentist that accepts my insurance | Google Maps → 4 reviews → website link | Anxious, skeptical. "Will this place be good or will they judge me?" | Mixed reviews (must have ≥4.5 stars to convert). Website doesn't show insurance accepted. No weekend hours. | CTR from Google Maps to booking page ≥ 12%. |
| **2. Landing** | Confirm this is a real, professional, welcoming practice | Booking page loads (subdomain or embedded) | Hopeful, scanning for trust signals. "Does this look legit?" | Page load > 2.5s (40% of users leave). No real photos of the office. No pricing shown. Old design. | Bounce rate < 35%. Time on page > 8 seconds. |
| **3. Service Selection** | Find "New Patient Exam" and understand what's included | Service catalog with categories | Curious, wants details. "What's included? Will this hurt?" | Service names are confusing ("Adult Prophylaxis"). No descriptions. No price shown. Too many options (analysis paralysis). | Service selection rate > 85%. Abandonment after step < 5%. |
| **4. Staff Selection** | Pick a provider who seems competent and kind | Staff grid with photos + titles | Slightly reassured by seeing real faces. "Can I pick the one with the kindest eyes?" | No staff photos. Staff listed by name only. No bios. "Any available" option hidden. | Staff selection rate > 90%. "Any available" use < 20% (means individual staff are compelling). |
| **5. Time Selection** | Find a time that works with my schedule without too much back-and-forth | Calendar week view → day view → time slots | Impatient. "Just show me what's open. I don't want to click 5 times." | Calendar loads only 1 week. Timezone wrong. 2 PM slot appears open but is actually a 3-hour block — can't book a 30-min cleaning there. No "next available" button. | Time selected on first calendar view > 70%. Abandonment at time picker < 10%. |
| **6. Client Info Entry** | Provide my details quickly without creating an account | Form: name, email, phone, DOB | Neutral, willing. "This is the stuff I have to do. Let me just type it and move on." | Too many fields (name, email, phone, address, city, state, zip, DOB, emergency contact, referral source). No autocomplete on browser. No "same as booking" for returning clients. | Completion rate > 90%. Time spent < 30 seconds. |
| **7. Intake Form** | Share medical info once and never repeat it | Multi-section intake form | Guarded, private. "Why do they need to know all this?" | 12+ fields. No progress bar. Asks about medications when patient has none. No "skip if not applicable." No way to save and come back. File upload for insurance card takes 30+ seconds on mobile. | Completion rate > 65% (industry average for healthcare intake is 55%). Abandonment rate < 15%. |
| **8. E-Sign Waiver** | Agree to terms without legal anxiety | Signature canvas + consent checkboxes | Distrustful. "What am I signing? Can I read this later?" | Waiver text is a wall of legalese. No option to download before signing. Signature canvas doesn't work on mobile (touch events not handled). No clear "This is just a standard consent form" reassurance. | Signature completion rate > 95% (highest conversion step — if they got this far, they'll finish). |
| **9. Confirmation** | Get clear, complete booking details and know what's next | Confirmation page + email + text | Relieved, satisfied. "Done. That was easy." | "Email confirmed" not visible — user wonders "did it go through?" No add-to-calendar button. No "what to bring" section. No address/map link. | Confirmation page views > 98%. Email open rate within 1 hour > 80%. |
| **10. Pre-Appointment** | Receive helpful, not annoying, reminders | Email 48h before + email 24h before | Calm if reminded, anxious if not. "I have it in my calendar but just in case." | Wrong timezone in reminder. No link to reschedule. Intake link in email re-sends even if already completed (confusing). SMS reminder too early (8 AM for 10 AM appointment). | Reminder open rate > 60%. No-show rate < 5%. |
| **11. Arrival & Check-In** | Let the office know I'm here, quickly | In-person + text check-in link | Neutral, ready. "I'm here. Let's get this over with." | Parking is confusing — no directions given. Can't find the entrance. Must fill paper form because mobile intake wasn't completed. Front desk is busy and doesn't acknowledge arrival for 3+ minutes. | Check-in self-service rate > 50% (via phone link tap). Wait time acknowledgment < 60 seconds. |
| **12. Service** | Have a painless, professional dental visit with clear communication | In the chair | Anxious (if new for treatment) or calm (if routine). | Dentist hasn't reviewed intake form answers — asks questions already answered. Procedure takes longer than expected. No clear communication about next steps. | NPS at service end ≥ 70. |
| **13. Post-Visit Review Request** | Share my experience if asked, but not nagged | Review email 2h after visit | Satisfied or neutral. "It was fine. I'll leave a review if they ask nicely." | Email arrives too early (before patient has left the building). No direct link to Google review (user must search). Asks for review before addressing any complaints. | Review request click rate > 15%. Review conversion rate > 8%. |

**Emotional Arc Summary:**

```
Positive ▲        ┌─ Confirmation
                /            └── Appointment
              /                     └── In-chair (hopefully good)
Discovery ───/                              └── Review (if good)
    │  Landing            Time Pick          └── Post-visit
    │    │  Service Select    │  Intake Form
    │    │    │  Staff        │    │  Signature
    ▼    ▼    ▼    ▼          ▼    ▼    ▼
Negative  (Mild anxiety throughout — trust signals at every step reduce it)
```

**Key Insight:** The biggest emotional drop-off is between **Steps 5-7** (time pick → intake form). This is where anxiety peaks (what if no time works? what if the form is too long?). The intake form is the single highest-friction step for new patients.

---

### 2.2 Admin Setup Journey

**Who:** Dr. Chen (approves) + Maria (configures) + BookSmart agency (builds)
**Target:** From "I just signed up" to "booking page is live" in under 60 minutes of admin effort.

| Step | User Action | System Response | Time | Drop-off Risk | Completion Checklist |
|---|---|---|---|---|---|
| **1. Create Account** | Enter email, name, password. Verify email via magic link. | Send verification email. Create business record. Show onboarding wizard. | 2 min | Low — email verification is standard. | ☐ Email verified |
| **2. Add Business Info** | Enter: business name, address, phone, timezone. Upload logo. Set welcome message. | Save to DB. Preview the profile card. Show "good to go" checkmark. | 5 min | Medium — logo upload may stall (need resize/crop). Logo dimensions unclear. | ☐ Name + address + phone ☐ Logo uploaded ☐ Timezone correct ☐ Welcome message set |
| **3. Add Staff** | For each staff: name, title, photo, bio. Set weekly hours per staff. Set buffer time. | Show staff card preview. Validate no hour overlaps. Default buffer 15 min. | 10 min per staff | Medium — setting hours per day-of-week can be tedious if hours vary. Copy from staff button would save time. | ☐ Dr. Chen added ☐ Rosa (hygienist) added ☐ Kevin (hygienist) added ☐ Hours set for each ☐ Buffer configured |
| **4. Add Services** | For each service: name, duration, price, category, description. Assign to staff. | Service catalog preview. Auto-calculate end time from duration. | 10 min | Low — service catalog is usually small (5-15 items). Risk: pricing confusion (show as $ or cents). | ☐ New Patient Exam ($89, 45 min) ☐ Adult Cleaning ($120, 60 min) ☐ Child Cleaning ($85, 45 min) ☐ Filling ($150-450, 60 min) ☐ Crown ($1,200, 90 min) |
| **5. Configure Intake Forms** | Drag fields from palette to canvas. Set labels, required, options. Assign form to service(s). | Live form preview. "Assign to service" dropdown. Save as template option. | 15 min | HIGH — form builder is the most complex UX in setup. Risk: too many fields, no hierarchy, overwhelming palette. | ☐ New Patient form created ☐ Fields: name, DOB, reason, medical history, insurance, upload card, signature ☐ Assigned to "New Patient Exam" |
| **6. Set Reminder Timing** | Toggle 48h reminder, 24h reminder, review request. Set hours-before for each. | Default values shown. "Recommended" badge on defaults. | 2 min | Very low — simple toggles. Risk: timezone confusion for "2h after" calculation. | ☐ 48h reminder ON ☐ 24h reminder ON ☐ Review 2h after ON |
| **7. Set Blackouts & Holidays** | Mark closed dates. Set recurring off days (Sunday). Add per-staff blackouts. | Calendar view with date picker. "Every Sunday" recurrence option. | 3 min | Low. Risk: forgetting to set recurring off-days. | ☐ Sunday closed ☐ July 4th closed ☐ Thanksgiving closed |
| **8. Preview & Launch** | Click "Preview My Booking Page" — see exactly what patients see. If happy, click "Launch." | Open preview in new tab. After launch, show booking link + embed code + QR code. | 2 min | Low — preview builds confidence. Risk: something looks wrong but admin doesn't catch it. | ☐ Preview approved ☐ Booking link copied ☐ Embed code copied |

**Total setup time (first time):** ~45-60 minutes if well-designed. With templates (reusing BookSmart's default dental setup), this should drop to 20 minutes.

**Onboarding Wizard Pattern:**
- Show a step-by-step checklist on the left: "Step 3 of 8 — Add Your Staff"
- Each step is skippable (can configure later from settings)
- "Save & Continue" button at bottom
- Progress percent in header: "43% done"
- At 100%, the "Launch" button appears. Until then, a "Preview as Patient" button is available but shows "coming soon" sections as greyed out.

---

### 2.3 Admin Daily Ops Journey

#### Morning (7:45 AM — Maria arrives)

| Action | UI Flow | Time | Notes |
|---|---|---|---|
| Open dashboard | Navigate to `dashboard.booksmart.app` → greeted by today's schedule | 2s | Maria was logged in from yesterday. If session expired, magic link or password. |
| Review schedule | See 12 cards for today. Each card: time, client name, service, staff, status badge. | 10s | Color-coded: green = confirmed, yellow = checked-in, red = no-show, grey = cancelled. |
| Check new bookings | "3 new bookings since yesterday" banner at top. Click to expand. | 5s | New bookings highlight with blue "NEW" badge for 4 hours. |
| Check intake completion | "2 of 12 intake forms not yet completed" banner. Click to see who. | 5s | Can click "Send Reminder" on each incomplete form — sends email with intake link. |
| Print schedule for Dr. Chen | Click "Print" → printer-friendly view with all details. | 30s | Paper backup for Dr. Chen's morning review. |

#### Midday (10 AM — 2 PM, patient flow active)

| Action | UI Flow | Time | Notes |
|---|---|---|---|
| Client walks in | Type name in search bar (or tap client name on iPad if in tablet mode) | 3s | Search returns results as she types. |
| Check in client | Click "Check In" button on the client's appointment card | 1 click | Status changes to "checked-in." A notification appears: "Client has arrived — notify staff." |
| Complete intake for walk-in | If intake not completed, click "Open Intake Form" → tablet mode → hand iPad to client | 30s | Tablet mode shows full-screen form with large buttons, signature at end. |
| Handle no-show | 15 min past appointment time, click "Mark No Show" → confirmation dialog | 2 clicks | System auto-sends "We missed you — reschedule here" email. Stats update. |
| Handle reschedule call | Open client's appointment → click "Reschedule" → pick new time | 20s | Old slot freed. New time set. Confirmation email sent to client automatically. |
| Book over phone | Click "New Booking" → select staff → service → date/time → enter client info | 30s | Quick-booking form: minimal fields (name, phone, email). Can look up existing client. |

#### Evening (4:30 PM — 5:00 PM, wrap-up)

| Action | UI Flow | Time | Notes |
|---|---|---|---|
| End-of-day review | Dashboard shows: "9 completed, 1 no-show, 2 cancelled" | 5s | Each count clickable to see list. |
| No-show stats | Click on no-show count → see no-show rate for today (10%) vs monthly trend (8%) | 10s | Line chart showing daily no-show rate over 30 days. "You saved $X vs last month" metric. |
| Review stats sent | "Review requests sent today: 9. Opened: 6. Clicked: 2." | 5s | Conversion funnel: sent → opened → clicked → reviewed. |
| Tomorrow's prep | Toggle to "Tomorrow" view. Check for issues: "3 clients haven't completed intake." | 10s | Send reminders from here. |
| Log out / lock | Click lock icon → screen locks with PIN unlock. No full logout. | 1 click | Lock screen shows: time, today's appointment count, "tap to unlock." |

**Key UX Decision:** The dashboard should default to **today's schedule** on every load. Not a landing page. Not an analytics overview. Today's schedule. Maria opens the app to see today. Analytics are one click away, not the default.

---

## 3. Key Interaction Patterns

### 3.1 Booking Flow (Detailed)

#### Step-by-Step Screen Descriptions

**Screen 1: Welcome / Business Introduction**
- Layout: Hero with business logo, name, Google rating (stars + count), "Book an Appointment" headline.
- Below: a welcoming message from the practice. A photo of the office or team.
- Trust bar: "Over 5,000 appointments booked" / "Serving Phoenix since 2010" / "4.8 stars on Google."
- CTA: "Book Now" — large, high-contrast, sticky at bottom on mobile.
- Secondary: "Call us instead" with phone number in smaller text.

**Screen 2: Service Selection**
- Layout: Service cards grouped by category tabs (e.g., "General Dentistry," "Cosmetic," "Emergency," "New Patients").
- Each card: service name, duration, price. Optional: brief description (expandable), "most popular" badge.
- Default: "New Patient Exam" highlighted if referral source indicates new patient.
- Search bar at top for filtering services by name.
- "I'm not sure — help me choose" link opens a 2-question modal ("What brings you in?" → recommended service).
- Selection: tap card → checkmark appears → "Next: Pick Your Provider" button active.

**Screen 3: Staff Selection**
- Layout: Horizontal scroll of staff cards on mobile, grid on desktop.
- Each card: photo (150×150, rounded), name, title, "Next Available: Tomorrow @ 10 AM" micro-text.
- "Any Available" option as the first card — shows combined availability.
- Staff cards show a short specialty badge ("Fillings & Crowns," "Cleanings," "All Services").
- Selection: tap → card fills with highlight border → "Next: Pick a Time" button active.
- If only one staff does this service, auto-skip to time picker with a subtle "With Dr. Sarah Chen" label.

**Screen 4: Date & Time Selection**
- Layout: 
  - Top: Selected service + staff (editable chip).
  - Middle: Week strip showing next 14 days (horizontal scroll). Days are rectangular buttons. Today is highlighted. Greyed-out days are unavailable (no slots or closed).
  - Bottom (after day selection): Time grid. Times are 30-min interval pill buttons. AM/PM separated by a divider line.
- States:
  - Empty state (no slots available that day): "No openings on this day" + show next available date as a suggestion.
  - Morning/afternoon grouping: "Morning" / "Afternoon" section headers.
  - Selected time: pill button fills with primary color.
  - Past time slots (before current time): greyed out with "Past" label.
- "Next Available" quick-select button: auto-picks the soonest open slot.
- Edge case — timezone: Show "All times are in Mountain Time (Phoenix)" below the picker. If client's device timezone differs, show a subtle banner: "Converted to your timezone (your-time). All times are in practice's timezone."

**Screen 5: Your Information**
- Layout: Simple vertical form, single column.
- Fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, validated on blur — "Looks good!" or "Please enter a valid email")
  - Phone (required, formatted as (555) 123-4567 as they type)
  - Date of Birth (optional, date picker)
  - Address (optional, collapsed under "Add my address")
- "I'm a returning patient" toggle: clicking it shows "Enter your email or phone to pull up your info" → auto-fill saved details.
- CAPTCHA/honeypot for bot prevention (invisible — no checkbox).
- "Already have an account? Sign in" link (opens magic link flow in a modal).
- CTA: "Next: Complete Your Form" button.

**Screen 6: Intake Form**
- See Section 3.2 below for full detail.

**Screen 7: Review & Sign**
- Layout: Summary card at top (service, staff, date, time, total cost).
- Below: Waiver text in a scrollable container (max height 300px on mobile, larger on desktop). "Please read and agree to our treatment consent, privacy policy, and financial responsibility."
- Checkbox: "I have read and agree to the terms above." (required)
- Signature label: "Please sign below."
- Signature canvas: 300×120px on mobile, 400×150px on desktop. Light grey background with "Sign here" watermark text. "Clear" button beside it.
- "Draw with your finger or mouse" instructional text below the canvas.
- CTA: "Confirm & Book Appointment" button. Disabled until checkbox checked + signature drawn.
- Payment section (if deposit required): "A $25 deposit is required to secure this time." Stripe Checkout opens after confirmation.

**Screen 8: Confirmation**
- Layout: Large green checkmark icon with "You're all set!" headline.
- Details card:
  - Service: New Patient Exam — Dr. Sarah Chen
  - Date: Thursday, July 3, 2026
  - Time: 10:00 AM — 10:45 AM (MST)
  - Location: 1234 Main St, Phoenix, AZ 85001 (with Google Maps link)
  - What to bring: ID, insurance card, list of current medications
- Add to Calendar buttons: Google Calendar, Apple Calendar, Outlook, Download .ics
- "What to expect" accordion: Arrival → Check-in → Meet Dr. Chen → Exam → Treatment plan
- "Text me these details" button (collects phone if not already provided)
- "Cancel or reschedule" link in small text
- Email confirmation has already been sent — show "Check your inbox" with email preview mock
- Social share: "Share with a friend" links

#### Error States

**Error: No Availability**
- Scenario: Client selects a date with no available slots for the chosen staff × service combination.
- UI: Time grid shows a friendly message instead of empty pills: "Sorry, there are no openings on this day for a New Patient Exam with Dr. Chen."
- Recovery: "See next available" button → scrolls to first available date. "Try a different staff member" link → goes back to staff selection. "Try a different service" link → goes back to services.

**Error: Double-Book Attempt**
- Scenario: Two clients book the same staff + time simultaneously. Second client's request fails DB-level unique constraint.
- UI: Loading spinner stays on "Confirm & Book" for a moment, then a toast notification: "Sorry, this time was just booked by someone else. Please select another time."
- Recovery: Automatically scroll back to time picker with the conflicted slot greyed out. Show "Next available" suggestion.

**Error: Timezone Mismatch**
- Scenario: Client's device is in EST but the practice is in MST. Client selects 10 AM thinking it's their local time.
- UI: A persistent info bar below the time picker: "You're browsing in Eastern Time. Dr. Chen's practice operates in Mountain Time (Phoenix). If you pick 10 AM ET, your appointment will be at 8 AM in Phoenix." 
- Better: Always display times in the practice's timezone with a subtle note: "All times shown in Mountain Time (Phoenix time)."

**Error: Session Timeout During Booking**
- Scenario: Client leaves the booking page open for 30+ minutes, then tries to submit. The slot is no longer available (or the booking session token expired).
- UI: "Your session has expired for security. Don't worry — we saved your info." → Refresh page, pre-fill known fields, reset to step 4 (time picker).
- Recovery: All data up to the intake form is saved in localStorage. Client just needs to re-verify the time slot.

#### Edge Cases

**Walk-In Booking**
- Flow: Front desk opens "New Booking" → selects "Walk-in" flag → picks service → sees next available slot → enters minimal info → confirms. No intake form required (shown on iPad).
- The booking is marked as "walk-in" in the system for stats differentiation.

**Reschedule Flow**
- Initiation: From email link ("Reschedule") or client portal or admin dashboard.
- Flow: Same time picker UI, but shows current booking time as a "Current Appointment" label on the calendar.
- Rules: If within cancellation window (e.g., < 4 hours), show warning: "You're within 4 hours of your appointment. Please call the office to reschedule."
- If rescheduling, the old slot is held until new time is confirmed (10-minute hold with countdown timer).

**Cancellation Flow**
- Initiation: From email link ("Cancel") or client portal.
- Flow: "Cancel your appointment?" confirmation dialog with reason selection: "Conflict in schedule," "Not feeling well," "Forgot," "Other."
- If within cancel window, show: "You're outside the free cancellation window. A $25 fee may apply."
- On confirm: booking status → cancelled. Old slot freed. Cancellation email sent to client + notification to practice.
- "Book again" CTA shown after cancellation.

**Returning Client Flow (James)**
- Initiation: James clicks "Book Next Cleaning" in his 6-month reminder email.
- Flow: System recognizes email → pre-fills all known info → "Welcome back, James! Same as last time?" → one-click booking.
- Intake form: "Has anything changed since your last visit?" If no, skip all medical questions. Only show signature step.
- Goal: James completes booking in under 30 seconds, 2 taps.

#### Mobile vs Desktop Behavior

| Element | Mobile (390px) | Desktop (1024px+) |
|---|---|---|
| Service selection | Vertical card stack, full width | 3-column grid of cards |
| Staff selection | Horizontal scroll | Grid with 3-4 columns |
| Date picker | Horizontal week strip, swipeable | Full month calendar grid with clickable dates |
| Time picker | Vertical scrollable list of pill buttons | Grid of pill buttons, 3-4 columns |
| Intake form | Single column, full width | Two-column layout (labels left, fields right) w/ wider fields |
| Signature canvas | 300×120px, full width | 400×150px, centered |
| Confirmation | Vertical stack, full-width buttons | Horizontal layout, inline calendar links |
| Navigation | "Back" at top + bottom CTA sticky | Side-panel progress + bottom CTA |
| Keyboard | Touch keyboard auto-type = email | Tab through fields |
| Tooltips | Expandable inline help | Hover tooltips |

---

### 3.2 Intake Form Completion

#### Form Progress Indicator
- Multi-step progress bar at top: "About You" → "Medical History" → "Insurance" → "Review & Sign"
- Each step label is clickable (can go back)
- Desktop: vertical step indicator on the left side
- Mobile: horizontal dots with current step label ("Step 2 of 4: Medical History")
- Percentage shown: "You're 50% done"

#### Field Validation (Real-Time)
- Each field validates on blur (when user leaves the field), not on keystroke (avoids annoying "still typing" errors).
- Validation patterns:
  - Email: regex check + DNS lookup (MX record). On fail: "Please enter a working email address."
  - Phone: format as user types + length check. On fail: "Please enter a 10-digit phone number."
  - DOB: validate age > 0 and < 120. On fail: "Please enter a valid date of birth."
  - Required fields: show red asterisk + "This field is required" on blur if empty.
- Success state: green checkmark to the right of the field. Label turns green briefly.
- Error state: red border + error message below field in 14px red text. Field label turns red.
- Conditional validation: "If you answered 'Yes' to heart condition, please describe" — field appears with animation.

#### File Upload UX (Insurance Card Photo)
- Button: "Upload Insurance Card" with camera icon.
- On tap: native file picker opens (accept="image/*" on mobile, image + PDF on desktop).
- While uploading: progress bar "Uploading..." with estimated time.
- Success: thumbnail preview (cropped to 4:3 ratio) with "Replace" and "Remove" buttons.
- Error: "Upload failed. Check file size (max 10MB) or try again." Retry button.
- Drag-and-drop zone on desktop: dashed border area with "Drop your insurance card here."
- Multiple uploads allowed: front + back of card. Two upload slots.
- Auto-orientation: EXIF rotation detection so photos don't show sideways.

#### Save Draft Functionality
- Auto-save every 30 seconds to localStorage.
- "Saved as draft" indicator in header: grey text with timestamp ("Last saved 2 min ago").
- If user closes browser and returns: "Welcome back! We saved your form. Continue where you left off?" button on the start screen.
- Draft expires after 7 days (clear localStorage + database draft).
- For logged-in users: draft persists across devices (saved to DB with `status: draft`).

#### Signature Interaction
- Canvas element with touch + mouse event handling:
  - `touchstart`, `touchmove`, `touchend` for mobile
  - `mousedown`, `mousemove`, `mouseup` for desktop
- Smooth curve rendering (not jagged dots) using quadratic bezier interpolation between points.
- Visual feedback: blue stroke on light grey background. Stroke width: 3px.
- "Clear" button: animated fade-out of the existing signature, canvas resets.
- "Accept" button: captures canvas as base64 PNG (200 DPI for print quality).
- Validation: canvas must have at least 10 non-white pixels. If too small: "Please draw your full signature."
- Accessibility: "Draw your signature in the box below. Use your mouse, finger, or stylus."
- Keyboard alternative: "Type your full name to sign" checkbox below the canvas. If checked, renders a script-font text version of the typed name with "(Electronic signature)" suffix.

---

### 3.3 Dashboard Interaction

#### Calendar Navigation (Day / Week / Month)

**Day View:**
- Layout: 24-hour timeline, left column time labels (7 AM — 7 PM visible by default, expandable).
- Each appointment is a colored block at the correct time position. Height proportional to duration.
- Block shows: time (left edge), client name (bold), service (smaller), staff initial.
- Click block → opens appointment detail modal.
- Scroll: smooth, inertial scrolling on touch devices.
- "Add Booking" float button at bottom right.

**Week View:**
- Layout: 7 columns (Mon-Sun). Each column shows the day's appointments stacked vertically.
- Current day highlighted with a subtle background tint.
- Scroll: vertical scroll per day. If the week is in the past, days are dimmed.
- Drag to reschedule: grab an appointment block, drag to a different day column or different time within the same day. Drop zone highlights when valid. Confirmation dialog: "Move John Smith's cleaning from Mon 10 AM to Wed 2 PM?" with Undo option.

**Month View:**
- Layout: Traditional calendar grid, 7×5. Each cell shows number + small dots indicating appointment count.
- Click a cell → shows mini-list of that day's appointments in a popover.
- Navigation: < > arrows for month. "Today" button jumps to current month.

**View Toggle:** Pill buttons at top right: "Day" | "Week" | "Month" with current view highlighted. Animated transition between views (cards rearrange smoothly).

#### Drag-to-Reschedule Appointments
- Only available from Week view (Day view is too granular, Month view is too sparse).
- Grab handle: a 6-dot grid icon on the left edge of the appointment block. Visible on hover (desktop) or always visible (mobile).
- While dragging: semi-transparent ghost of the block follows cursor. Original slot shows a dashed outline: "Will be freed."
- Drop zone validation: only valid slots (no conflicts, within staff hours, not on holidays) are highlighted green. Invalid slots are red.
- Conflict detection: if the target slot overlaps with an existing booking, show "Conflicts with [existing client name]. Choose a different time."
- Undo: "Appointment moved. Undo?" toast with 10-second undo window. After 10 seconds, the change is permanent.

#### Client Search (Fuzzy Search)
- Search bar at top of Clients page, also in the header of Dashboard.
- Search algorithm: term matching against name (first + last), email, phone. Partial matches allowed. Phonetic matching for names (e.g., "Smith" matches "Smyth").
- Results appear in a dropdown as the user types. Top 5 results shown with name, phone, last appointment date, and a "New" badge if first visit within 30 days.
- "No results" state: "No client found. Create a new client record?" button.
- Recent searches: below search bar (on focus), show last 5 searched clients with timestamps.
- Keyboard: down arrow to navigate results, Enter to select, Escape to close.

#### Batch Actions
- From the schedule view or client list, select multiple appointments via checkboxes (desktop: Ctrl+click, mobile: long-press).
- Batch action bar appears at bottom: "3 selected"
- Actions available:
  - **Mark No-Show**: Confirmation: "Mark 3 appointments as no-show?" → Yes → all 3 update, "We missed you" emails sent.
  - **Send Reminder**: "Send reminder to 3 clients?" → Yes → manual reminder triggered.
  - **Cancel**: "Cancel 3 appointments? Reason?" → dropdown with common reasons → confirm.
  - **Change Status**: dropdown: checked-in, completed, no-show, cancelled.
  - **Export**: "Export 3 selected as CSV" (with or without intake data toggle).
- After action, summary toast: "3 appointments marked as no-show. Undo?" with 5-second undo.

---

## 4. Information Architecture

### 4.1 Booking Page IA (Client-Facing)

```
Booking Page (business.booksmart.app/slug)
│
├── Header
│   ├── Business Logo
│   ├── Business Name
│   ├── Google Rating (stars + count)
│   └── Phone Number (secondary)
│
├── Booking Flow (multi-step, sequential)
│   ├── Step 1: Service Selection
│   │   ├── Category Tabs (General, Cosmetic, New Patients, Emergency)
│   │   ├── Service Cards (name, duration, price, description)
│   │   ├── Search Bar
│   │   └── "Not sure? Help me choose" Modal
│   │
│   ├── Step 2: Staff Selection
│   │   ├── "Any Available" Card
│   │   ├── Staff Cards (photo, name, title, next available, specialties)
│   │   └── "Back to Services" Link
│   │
│   ├── Step 3: Date & Time
│   │   ├── Week Strip (14 days, horizontal scroll)
│   │   ├── Time Grid (30-min intervals, AM/PM separated)
│   │   ├── "Next Available" Quick Button
│   │   └── Timezone Indicator
│   │
│   ├── Step 4: Your Information
│   │   ├── Name Fields (first, last)
│   │   ├── Email (validated)
│   │   ├── Phone (formatted)
│   │   ├── Date of Birth (optional)
│   │   └── Returning Client Toggle
│   │
│   ├── Step 5: Intake Form
│   │   ├── Progress Bar (steps 1-4)
│   │   ├── Form Sections (collapsible)
│   │   └── File Upload
│   │
│   ├── Step 6: Review & Sign
│   │   ├── Booking Summary Card
│   │   ├── Waiver Text (scrollable)
│   │   ├── Agreement Checkbox
│   │   └── Signature Canvas
│   │
│   └── Step 7: Confirmation
│       ├── Success Animation
│       ├── Booking Details Card
│       ├── Add to Calendar
│       ├── "Text Me Details"
│       └── What to Bring List
│
└── Footer
    ├── Privacy Policy Link
    ├── Terms of Service Link
    └── "Powered by BookSmart" (small, or removed for white-label)
```

### 4.2 Admin Dashboard IA

```
Dashboard (app.booksmart.app)
│
├── [Header] (persistent)
│   ├── BookSmart Logo (click → Dashboard)
│   ├── Global Search (clients, bookings)
│   ├── Notifications (bell icon, unread count)
│   ├── Settings Gear Icon
│   └── Profile Dropdown (account, logout)
│
├── [Sidebar Navigation] (collapsible on mobile)
│   ├── Dashboard              ← Default landing
│   ├── Schedule               ← Calendar views
│   ├── Clients                ← Client management
│   ├── Services               ← Service catalog
│   ├── Staff                  ← Staff management
│   ├── Intake Forms           ← Form builder + responses
│   ├── Analytics              ← Stats + reporting
│   └── Settings               ← Business profile, reminders, billing
│
├── [Dashboard — Default View]
│   ├── Today's Schedule (card list, filterable by staff)
│   │   ├── Appointment Card (time, client, service, staff, status badge)
│   │   └── Check In / No Show / Complete actions
│   ├── Stats Bar (today: booked, checked-in, completed, no-show, cancelled)
│   ├── Incomplete Intake Alert ("3 clients haven't completed forms" + Send Reminder)
│   ├── New Bookings Alert ("2 new bookings since yesterday" + view button)
│   └── Quick Actions
│       ├── New Booking Button
│       ├── Today's Schedule Print
│       └── Switch to Tomorrow View
│
├── [Schedule]
│   ├── View Toggle: Day | Week | Month
│   ├── Date Navigation (< Today >)
│   ├── Staff Filter (checkboxes)
│   ├── Status Filter (confirmed, checked-in, no-show, cancelled, completed)
│   └── Appointment Detail Modal (on click)
│       ├── Client Info (name, phone, email, DOB)
│       ├── Booking Details (service, staff, time, duration, price)
│       ├── Intake Form Response Link
│       ├── Signed Waiver Link (PDF)
│       ├── Status Change Dropdown
│       ├── Reschedule Button
│       └── Cancel Button (with reason)
│
├── [Clients]
│   ├── Search Bar (fuzzy, with recent clients dropdown)
│   ├── Client Table (name, phone, email, last visit, total visits, tags)
│   │   ├── Sortable columns
│   │   └── Paginated (50 per page)
│   └── Client Profile (on click)
│       ├── Personal Info (name, DOB, phone, email, address, notes)
│       ├── Appointment History (list, filterable by status)
│       │   └── Each: date, service, staff, status, intake link, waiver link
│       ├── Intake Form History (past submissions, printable)
│       ├── Waiver History (signed PDFs)
│       └── Tags (new, VIP, insurance flag, etc.)
│
├── [Services]
│   ├── Service List (name, duration, price, category, assigned staff, status)
│   │   └── Toggle Active/Inactive
│   └── Add/Edit Service Form
│       ├── Name, Duration (min), Price ($), Category (select/create)
│       ├── Description (textarea, optional)
│       ├── Staff Assignment (checkboxes)
│       ├── Intake Form Assignment (dropdown)
│       ├── Waiver Requirement Toggle
│       └── Active Toggle
│
├── [Staff]
│   ├── Staff List (name, title, active status, today's appointment count)
│   └── Staff Detail / Edit
│       ├── Name, Title, Photo, Bio
│       ├── Weekly Hours Grid (Mon-Sun, start/end time per day)
│       ├── Buffer Time (min between appointments, default 15)
│       ├── Service Assignment (checkboxes)
│       ├── Per-Staff Blackouts (list + add date/time range)
│       └── Active Toggle
│
├── [Intake Forms]
│   ├── Templates Tab
│   │   ├── Form List (name, assigned services, version, last updated)
│   │   └── Form Builder (drag-and-drop)
│   │       ├── Field Palette (text, textarea, select, checkbox, radio, file, date, signature)
│   │       ├── Canvas (drag fields to arrange)
│   │       ├── Field Editor (label, placeholder, required, options, conditional logic)
│   │       └── Save / Save as Template / Assign to Service
│   └── Responses Tab
│       ├── Search by client name or date
│       ├── Response List (client, date, form, completion status)
│       └── Response Detail (read-only view of filled form)
│
├── [Analytics]
│   ├── No-Show Stats
│   │   ├── Rate Chart (line, 30/60/90 day toggle)
│   │   ├── Cost Savings Calculator ("$X recovered this month")
│   │   └── By Staff Comparison (bar chart)
│   ├── Booking Stats
│   │   ├── Bookings Over Time (line chart, daily/weekly)
│   │   ├── Service Breakdown (pie chart)
│   │   └── Staff Utilization (bar chart, % of available hours booked)
│   ├── Intake Completion
│   │   ├── Completion Rate Gauge (% completed vs sent)
│   │   └── Average Completion Time (minutes)
│   └── Review Tracking
│       ├── Requests Sent (total, weekly)
│       ├── Open Rate (%)
│       ├── Click Rate (%)
│       └── Reviews Received (total, by platform)
│
└── [Settings]
    ├── Business Profile (name, address, phone, timezone, logo, welcome message)
    ├── Booking Settings (default booking window, cancellation window, min notice)
    ├── Reminder Timing (confirmation, 48h, 24h, review request toggle + hours before)
    ├── Review Links (Google Business URL, Yelp URL)
    ├── Payment Settings (Stripe connect, deposit amount, refund policy)
    ├── Notifications (email notifications for new bookings, cancellations, no-shows)
    ├── Staff Permissions (role-based access controls)
    └── Subscription & Billing (plan details, invoices, cancel)
```

---

## 5. Accessibility & Inclusive Design

### WCAG AA Compliance Targets

All booking pages and admin dashboard must meet WCAG 2.1 AA at minimum. The booking page targets WCAG AAA where feasible (it is a public-facing page with broad user demographics, including elderly patients).

### 5.1 Screen Reader Flows for Booking

**Flow: Book an Appointment (NVDA/JAWS with Firefox/Chrome)**

```
Page loads:
- Announce: "BookSmart booking page for Lumina Dental. Step 1 of 5: Select a service."
- Focus moves to first service category tab: "General Dentistry tab, selected. Use arrow keys to navigate categories."
- "New Patient Exam, 45 minutes, 89 dollars. Button."
- User presses Enter → service selected.
- "Step 2 of 5: Select a provider. Dr. Sarah Chen, next available tomorrow at 10 AM. Button."
- Tab through staff cards → "Any available provider" announced last.
- User selects Dr. Chen → "Step 3 of 5: Pick a date and time. Calendar view. Use arrow keys to navigate days."
- "Thursday July 3rd. Available times: 9 AM, 9:30 AM, 10 AM, 11 AM."
- User selects 10 AM → "Step 4 of 5: Your information." Form fields announced with labels.
- After form → "Step 5 of 5: Complete your intake form. Section 1 of 4: About You."
- All fields have proper `aria-label`, `aria-describedby` for errors, `aria-required="true"` for required fields.
- Form validation errors: "First name is required. Please enter your first name." Focus moves to the error field.
- Signature: "Signature field. Draw your signature using your mouse, finger, or stylus. Alternatively, check the checkbox below to type your name."
- Confirm: "Confirm and Book Appointment button." → "Appointment confirmed. You're all set."
```

**Implementation requirements:**
- All custom components (calendar, time picker, signature canvas, drag-and-drop form builder) must have ARIA roles and keyboard handlers.
- Calendar: `role="grid"`, `aria-label="Select a date"`, arrow key navigation, Enter to select.
- Signature canvas: `role="application"`, `aria-label="Signature field"`, `tabindex="0"`.
- Error summary: `role="alert"` with `aria-live="assertive"`.
- Progress indicator: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Status announcements: `aria-live="polite"` region for dynamic content updates.

### 5.2 Keyboard Navigation for Admin Dashboard

| Action | Shortcut | Context |
|---|---|---|
| Navigate sidebar | Tab / Shift+Tab | Any page |
| Go to Today | `T` | Dashboard, Schedule |
| New Booking | `N` | Dashboard, Schedule |
| Check In client | `C` | Appointment card focused |
| Mark No-Show | `M` | Appointment card focused |
| Search clients | `Ctrl+K` or `Cmd+K` | Any page |
| Open Settings | `S` then `S` | Any page (double-tap) |
| Cancel / Close modal | `Escape` | Modal open |
| Confirm action | `Enter` | Dialog open |
| Save form | `Ctrl+Enter` | Any form |
| Go to Schedule | `1` | Any page (sidebar shortcuts 1-7) |
| Go to Clients | `2` | Any page |
| Go to Services | `3` | Any page |
| Go to Staff | `4` | Any page |
| Go to Intake Forms | `5` | Any page |
| Go to Analytics | `6` | Any page |
| Go to Settings | `7` | Any page |

**Focus management:**
- Focus indicator: 3px solid outline with 2px offset (not just a color change — must be visible on any background).
- Focus order follows visual order (left-to-right, top-to-bottom).
- Modals trap focus (focus cycles within modal, closes on Escape).
- Tab panels: arrow keys to switch tabs.
- Dropdowns: arrow keys to navigate, Enter to select, Escape to close.

### 5.3 Color-Blind Friendly Status Indicators

The admin dashboard uses color + icon + text to indicate appointment status — never color alone.

| Status | Color | Icon | Text Badge |
|---|---|---|---|
| Confirmed | Blue (#3B82F6) | Calendar check | "Confirmed" |
| Checked In | Green (#22C55E) | User check | "Checked In" |
| In Progress | Yellow (#EAB308) | Clock | "In Progress" |
| Completed | Teal (#14B8A6) | Circle check | "Completed" |
| No-Show | Red (#EF4444) | User x | "No-Show" |
| Cancelled | Grey (#6B7280) | Circle slash | "Cancelled" |
| Pending Payment | Orange (#F97316) | Dollar sign | "Pending Payment" |

**Color-blind safe palette tested against:**
- Protanopia (red-blind): Red no-show → red-brown (#C2410C) as fallback, icon distinguishes.
- Deuteranopia (green-blind): Green checked-in → blue-green (#06B6D4) as fallback, icon distinguishes.
- Tritanopia (blue-blind): Blue confirmed → purple (#8B5CF6) as fallback, icon distinguishes.
- All status indicators have ≥ 3:1 contrast against the card background.

**Additional patterns:**
- Donut charts in Analytics: use patterns (dots, stripes, solid) in addition to color.
- Links: underlined (not just colored differently).
- Error states: icon + color + border + text message.

### 5.4 Font Size Adjustment Support

- Booking page: minimum 16px base font size. All text resizable up to 200% without loss of functionality.
- Admin dashboard: 14px base font size (dense data view), but all text uses `rem` units and respects browser zoom.
- Important: No text is truncated with ellipsis on the booking page. On dashboard, truncation is acceptable but the full value is visible on hover (tooltip).
- "Large Text" toggle in the booking page header: increases all text by 1.5× (no layout breakage). Uses CSS `font-size: 150%` on `<html>` with `@media (prefers-reduced-data)` consideration.
- Admin dashboard: no font toggle needed (Maria uses desktop with good eyesight), but respects OS-level font size settings.

### 5.5 Simplified Booking Mode for Elderly Patients

**Trigger:** Detect user agent contains "iPad" and age > 60 heuristic (not reliable — better to have an explicit toggle). A "Simple View" link in the booking page footer: "Need a simpler view? Click here."

**Simple View changes:**
- Single long scroll page (no multi-step wizard). All sections visible at once with large, clear headings.
- Font size: 22px base. Button height: 64px minimum.
- No horizontal scrolling anywhere. Everything stacked vertically.
- No calendar grid. Instead: "Pick a day" list (Mon, Tue, Wed, Thu, Fri, Sat as large pill buttons). After selecting day: "Pick a time" list (simple text list of available times: "9:00 AM", "10:00 AM", etc.).
- Service selection: large cards with icons (tooth for cleaning, tooth-with-star for new patient, etc.).
- Minimal form fields: name, phone, email only. Medical history is handled on paper or in-office tablet with staff assistance.
- Signature: large drawing area (full width, 200px height) with "Sign here" in large watermark text.
- Confirmation: big green checkmark, large text details, prominent "Add to Calendar" button with simple instructions.
- No animations, no transitions, no parallax, no carousels.
- Contrast ratio: minimum 7:1 (AAA) for all text.
- Touch targets: minimum 64×64px (WCAG recommends 44×44px minimum; elderly users benefit from larger).
- Session timeout: 60 minutes instead of 30 minutes (accounts for slower reading).
- Error messages in plain language: "The email you typed looks like it's missing the @ symbol. Please check it." Not "Invalid email format."

**Implementation:** A CSS class `.simple-mode` on the `<body>` that:
- Overrides all font sizes to 150% minimum
- Increases all touch targets to 64px minimum height
- Hides the calendar grid and shows the day-list version
- Increases spacing (padding, margins) by 1.5×
- Removes all animations (`animation: none`, `transition: none`)
- Shows simplified navigation (single page scroll instead of multi-step)

---

## 6. Conversion Optimization

### 6.1 Where Do Clients Drop Off?

Based on industry benchmarks (Calendly, Acuity internal data + BookingKit 2026 report):

| Step | Typical Abandonment Rate | Primary Cause | BookSmart Target |
|---|---|---|---|
| 1. Landing page | 35-50% | Slow load, no trust signals, confusing UI | < 30% |
| 2. Service selection | 5-8% | Unclear pricing, too many choices | < 4% |
| 3. Staff selection | 2-4% | No staff info, confusing "any available" | < 2% |
| 4. Time picker | 8-12% | No good times shown, too few days, timezone | < 6% |
| 5. Client info | 3-5% | Too many fields, asked to create account | < 2% |
| 6. Intake form | 15-25% | **HIGHEST DROP-OFF** — too long, asks for insurance before commitment | < 12% |
| 7. Signature | 1-3% | Technical issues with canvas, confusing legal text | < 1% |
| 8. Payment (future) | 5-10% | Unexpected deposit, card declined | < 5% |

**Critical insight:** The intake form is the #1 abandonment point. Every optimization effort should focus on Step 6.

### 6.2 Optimal Intake Form Design (7-Field Rule)

Research (Typeform, JotForm, HubSpot — all confirm the same pattern): **7 fields is the peak conversion threshold.** Each additional field beyond 7 reduces completion rate by 5-10%.

**BookSmart's intake form strategy:**
- Split into 4 micro-steps with progress indicator. Each step shows 2-3 fields.
- Total fields in Core (required): 7
- Optional fields collapsed under "Add more details" expanders.

**Core fields (all services):**
1. Reason for visit (textarea, 1 line) — "What brings you in today?"
2. Medical conditions (checkbox group: heart condition, diabetes, high blood pressure, bleeding disorder, pregnancy, none of the above)
3. Medications (textarea, optional) — "List any medications you're currently taking"
4. Allergies (text, optional) — "Do you have any allergies? (especially to latex or anesthetics)"
5. Insurance provider (select: Delta, Cigna, MetLife, Aetna, Blue Cross, Other, None / I'll pay out of pocket)
6. Insurance ID (text, optional) — appears only if insurance selected
7. Upload insurance card (file upload, optional)

**Conditional fields (shown only for specific services):**
- For "New Patient Exam": Additional field "Have you had X-rays in the last 12 months?" (Yes/No)
- For "Surgery / Crown": Additional fields "Are you pregnant?" and "Do you take blood thinners?"
- For "Child Cleaning": Additional fields "Parent/Guardian name" and "Is child under 18?"

**Progressive disclosure pattern:**
- Step 1: "About Your Visit" (Reason + checkbox: first time?)
- Step 2: "Medical History" (Conditions + Medications + Allergies) — 3 fields
- Step 3: "Insurance" (Provider + ID + Upload) — 3 fields, shown as "quick section"
- Step 4: "Review & Sign" — Summary of answers + signature

**Returning client optimization (James flow):**
- All steps collapsed into one screen: "Is anything new since your last visit on January 15, 2026?"
- If "Nothing changed": sign only. Total time: 15 seconds.
- If "Something changed": show only the medical fields, pre-filled with previous answers.

### 6.3 Trust Signals at Each Step

| Step | Trust Signal | Placement |
|---|---|---|
| Landing | Google rating (4.8 ★), review count (200+), real office photo | Hero section, above fold |
| Service selection | "Most popular" badge, number booked this week ("47 people booked this service this week") | Service card |
| Staff selection | Staff photo, credentials (DDS, 15 yrs exp), "200+ happy patients" | Below staff name |
| Time picker | "Only 2 spots left this week!" (scarcity, if true), "Free cancellation within 24h" | Above time grid |
| Client info | "Your information is encrypted and never shared" with padlock icon | Below form, persistent |
| Intake form | "HIPAA compliant — your data is protected by law" with badge, "Short form — only 7 questions" | Progress bar area |
| Signature | "This is a standard consent form used by all dental practices in Arizona" | Above signature canvas |
| Confirmation | "You're all set! A confirmation has been sent to emily@email.com" with checkmark animation | Hero |

**Social proof integration:**
- Live counter on booking page: "12 people are looking at this page right now" (or "3 appointments booked in the last hour")
- Recent booking feed: "Emily just booked a New Patient Exam for tomorrow at 10 AM" (anonymized) — shown as a subtle ticker in the corner
- Google review snippets: "Best dentist in Phoenix! — Sarah M." (3 rotating quotes, linked to Google profile)

### 6.4 Mobile Optimization for Booking

**68% of bookings come from mobile devices** (industry average, 2026). Booking page must be mobile-first.

| Element | Mobile Optimization |
|---|---|
| Page load | Target < 1.5s FCP on 3G. Pre-load booking widget assets. Lazy-load below-fold content. |
| Tap targets | All buttons ≥ 48px (Apple HIG). Service cards ≥ 64px tap height. |
| Form fields | Auto-focus first field. `inputmode="email"` for email (shows @ keyboard). `type="tel"` for phone (shows numeric keypad). `autocomplete` attributes on all fields. |
| Date picker | Native `input type="date"` as fallback for custom calendar. Custom calendar must support touch swipe for week navigation. |
| Sticky CTA | "Next" button sticky at bottom of viewport on all steps. Shows progress: "Next (Step 2 of 5)". |
| Back gesture | Swipe right to go back (mobile Safari gesture). Prevent accidental back during form fill with `beforeunload` warning. |
| Keyboard avoidance | Form scrolls up when keyboard opens. CTA button not hidden behind keyboard. |
| Signatures | Full-width canvas. "Rotate your phone to landscape for easier signing" prompt if portrait detected. Touch events smooth. |
| Confirmation | "Add to Calendar" opens native calendar app (iOS .ics, Google Calendar intent on Android). |

**Mobile-specific conversion patterns:**
- "Book Now" should be the ONLY primary CTA on mobile. Remove all navigation links, testimonials, footer links — everything except the booking flow.
- Consider a "Quick Book" flow for returning clients: email → magic link → one-tap booking (no calendar navigation).
- SMS confirmation after booking: "Text me the details" collects phone and sends an SMS summary immediately.
- Mobile notifications: if client returns to the booking page after abandoning, show "You were booking a New Patient Exam. Continue where you left off?" banner.

---

## 7. Error & Edge Case States

### 7.1 Service Fully Booked That Day

**Scenario:** It's 10 AM. A client tries to book a cleaning for today at 3 PM. All slots are taken.

**System behavior:**
- Time picker shows the day as available in the week strip (the day is not greyed out — there are other services available).
- Client selects the day → clicks "Cleaning" → time grid shows: "All cleaning appointments are fully booked today."
- Alternative suggestions appear below: "Next available cleaning: Tomorrow at 9 AM with Rosa" (clickable).
- "Try a different service" link: "Dr. Chen has openings today for a filling at 2 PM."
- "Try a different staff" link: "Kevin has a cleaning opening at 4 PM today."
- If truly nothing available: "We're fully booked today. See available times tomorrow." Scrolls calendar to tomorrow.

**Admin visibility:**
- Dashboard shows "Fully booked" badge on the day for that service.
- "Waitlist available" prompt if admin enabled the feature (V2).

### 7.2 Staff on Vacation

**Scenario:** Kevin the hygienist is on vacation July 1-7. His availability is blocked.

**System behavior:**
- During July 1-7, Kevin's staff card shows: "On vacation until July 8" instead of "Next available."
- Time picker for that week: Kevin's name is greyed out in the staff filter. Hover/tap: "Kevin is on vacation this week."
- If client had Kevin favorited (returning client), show: "Kevin is out July 1-7. Would you like to book with Rosa? Same service, same time."
- Admin: Kevin's schedule in the dashboard shows a "Vacation" banner across those days. Appointments are crossed out.

**Admin configuration:**
- Staff profile → Per-staff blackouts → Add date range → "Vacation" label.
- During blackout, Kevin does not appear in booking flow at all. No "any available" slots include him.
- Emergency override: admin can manually book a client with Kevin during his blackout (for VIP patients) — a yellow warning appears: "Kevin is on vacation. Continue anyway?"

### 7.3 Client Tries to Book Same Time Twice

**Scenario:** Emily books a New Patient Exam with Dr. Chen at 10 AM Thursday. She then goes back and tries to book another appointment at the same time (maybe she forgot, or double-tapped).

**System behavior:**
- **At booking time:** The slot shows as unavailable in the calendar (already booked). Emily cannot select it.
- **If two tabs open:** Both tabs show the slot as available. She submits Tab 1 (succeeds). Tab 2 submits → server returns 409 Conflict.
- Client sees: "It looks like you already have an appointment at this time. Check your email for confirmation details." With a link to view/cancel existing booking.
- **Admin side:** No action needed — handled by DB-level `@@unique([staffId, startTime])` constraint.

**Edge case — same client, different service:** If Emily books a cleaning with Rosa at 10 AM and then tries to book a filling with Dr. Chen at 10 AM (same time, different staff), this is allowed. She can be at two places at the same time only if different staff are involved. System should warn: "You already have an appointment at 10 AM with Rosa. Please confirm you can make both appointments."

### 7.4 Intake Form Expired / Timed Out

**Scenario:** Emily fills 50% of the intake form, leaves it open for 45 minutes, then comes back to submit.

**System behavior:**
- Auto-save to localStorage every 30 seconds. If Emily returns within 7 days, form loads with saved data: "Welcome back! We saved your progress from 2 days ago. Continue?"
- If >7 days since last edit: "Your form session has expired. Please start fresh." Clear saved data.
- If the form was linked to a specific booking time and that time has passed (e.g., form sent 48h before appointment, client opens it at appointment time): "Your appointment at [time] has passed. Please call the office to reschedule." Form is locked.

**Security:**
- Form submission token expires after 24 hours (prevents replay attacks).
- If token expired at submission: "Your form session expired. Please request a new form link from your confirmation email."

### 7.5 Signature Fails to Capture

**Scenario:** Client draws on the signature canvas but no strokes appear (touch events not firing on their specific device/browser combination).

**System behavior:**
- Canvas has a "Test your signature" validation: if canvas has < 10 non-white pixels after the client clicks "Sign & Confirm," show: "We couldn't capture your signature. Please try drawing again. Make sure you're drawing in the box."
- If fails twice: "Having trouble? You can type your name to sign instead." → shows typed-name input with: "By typing your name, you agree this is an electronic signature equivalent to a handwritten signature."
- Fallback: "Print and sign" option generates a PDF with the booking details + a blank signature line. Client can print, sign, and upload a photo.
- Admin can also mark "Signature waived in person" for phone bookings.

**Device-specific issues:**
- iOS Safari: handle `touchcancel` event (user may swipe to close a notification mid-draw, interrupting the stroke).
- iPad with Apple Pencil: handle pointer events (Safari on iPadOS uses pointer events for Pencil, not touch events).
- Android Chrome: some devices fire `touchstart` but not `touchmove` if scrolling — ensure `touch-action: none` CSS on the canvas.

### 7.6 Email Bounces

**Scenario:** Client enters "emily@gmal.com" (typo). Confirmation email bounces.

**System behavior:**
- Client-side validation: email format check (has `@` and a domain with at least one dot). This catches most typos but not all.
- Server-side: SES bounce notification comes through SNS webhook → `POST /api/webhooks/ses`.
- On bounce: Update booking record: `emailBounced: true`. No automatic retry (wrong address — retrying won't help).
- Admin dashboard: Notification badge: "1 email bounced today." Admin clicks → sees which client → can call to verify correct email.
- Inline in dashboard: "Emily Chen's confirmation email bounced. Email on file: emily@gmal.com. Correct email?" with edit button.
- If email bounces and no SMS reminder is set up (V2), the client gets no reminders — this is a critical failure path. Admin should call the client.

**Prevention:**
- Email validation on form: after user types email, check DNS MX record for the domain (e.g., "gmal.com" has no MX record). Show: "Hmm, that email domain doesn't seem to exist. Double-check it?"
- Double opt-in: send a "Confirm your email" link before the booking is fully confirmed. Not ideal UX but catches bounces before the appointment is a week away.

### 7.7 Payment Declines (Future Stripe Deposits)

**Scenario:** V2 feature — deposit required to book. Client enters card, Stripe declines (insufficient funds, expired card, fraud flag).

**System behavior:**
- Stripe Checkout returns `payment_intent.status = requires_payment_method`.
- Client sees: "Your card was declined. Please try a different payment method."
- Options shown: "Try another card," "Apple Pay," "Book without deposit (subject to availability)" — if admin allows deposit waiving.
- The booking slot is **held for 15 minutes** with a countdown timer: "This time is reserved for you for 15:00. Complete payment to confirm."
- After 15 minutes: slot released. Client gets email: "Your slot was released. Book again."
- If 3 consecutive declines: "There seems to be an issue with your payment. Please call the office to book."
- Admin sees: "Stripe decline" note on the booking attempt in the dashboard.

**Edge case — deposit waived for VIP:**
- Admin can mark a client as "VIP — no deposit required." The booking flow skips Stripe Checkout entirely for that client.
- Setting: Client Profile → Tags → "No Deposit Required."

---

## Appendix: UX Design Principles for BookSmart

### Principle 1: One Task Per Screen
Every screen in the booking flow has exactly one goal. The client should never ask "what am I supposed to do here?" If a screen asks the client to pick a service AND enter their name AND upload a file, it's wrong.

### Principle 2: The 3-Tap Rule for Front Desk
Any action Maria performs more than 3 times a day must be achievable in 3 taps or fewer: check in a client, reschedule an appointment, cancel a booking, search for a client. If any of these take more than 3 taps, redesign.

### Principle 3: Progress Visibility
The client should always know: "Where am I? How many steps are left? How long will it take?" The admin should always know: "How does my practice look today? What needs my attention?"

### Principle 4: Forgiving Input
Never lose data. Auto-save drafts. Pre-fill from previous visits. Accept multiple formats (phone with or without dashes, credit card with or without spaces). Validate gently and correct automatically where possible.

### Principle 5: Trust Through Transparency
Show the price before booking. Show the staff credentials. Show the cancellation policy. Show the HIPAA compliance badge. Surprises erode trust. Every piece of hidden information is a potential abandonment trigger.

### Principle 6: Mobile-First, Desktop-Full
Booking flow is designed for a 390px-wide screen first, then expanded to desktop. Admin dashboard is designed for a 1440px-wide screen first, then compressed to tablet. Never the same layout for both.

### Principle 7: Assume Variable Technical Literacy
A 58-year-old retired principal (James) and a 32-year-old marketing coordinator (Emily) must both complete the same booking flow successfully. The flow must work for both. This means: clear labels, large targets, forgiving validation, and no assumptions about device capabilities.

---

*End of UX & User Flows Document — BookSmart Phase 2 Design*
