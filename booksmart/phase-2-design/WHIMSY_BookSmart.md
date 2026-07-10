# Whimsy & Delight — BookSmart Micro-Interaction & Motion Design

> **Brand tone:** Professional but warm. Stripe-level polish meets a friendly front desk receptionist.  
> **Target audience:** Dentists, salons, auto shops — service businesses that want reliable software that *feels* good.  
> **Guiding principle:** Every interaction should whisper, "we thought of everything."

---

## Table of Contents

1. [Micro-Interaction Inventory](#1-micro-interaction-inventory)
   - [Booking Page](#booking-page)
   - [Admin Dashboard](#admin-dashboard)
2. [Loading & Skeleton States](#2-loading--skeleton-states)
3. [Empty States](#3-empty-states)
4. [Success & Celebration States](#4-success--celebration-states)
5. [Error States (Without Being Scary)](#5-error-states-without-being-scary)
6. [Sound Design (Optional V2)](#6-sound-design-optional-v2)
7. [Easter Eggs (Subtle)](#7-easter-eggs-subtle)
8. [Motion Design Principles](#8-motion-design-principles)

---

## 1. Micro-Interaction Inventory

### Booking Page

#### Service Card Hover

| Property | Value |
|---|---|
| **Trigger** | `mouseenter` / `hover` on `.service-card` |
| **Effect** | Gentle lift + shadow depth increase |
| **Transform** | `translateY(-2px)` |
| **Shadow** | `box-shadow: 0 8px 24px rgba(0,0,0,0.08)` (from `0 2px 8px rgba(0,0,0,0.04)`) |
| **Duration** | 200ms |
| **Easing** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — ease-out quadratic |
| **Implementation** | CSS `:hover` transition on `.service-card`. Use `will-change: transform` to avoid paint jank. |
| **Reduced motion** | Remove transform, keep shadow change only |

```css
.service-card {
  transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 200ms ease-out;
  will-change: transform;
}
.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
@media (prefers-reduced-motion: reduce) {
  .service-card:hover {
    transform: none;
  }
}
```

#### Selected Service Card

| Property | Value |
|---|---|
| **Trigger** | `click` on `.service-card` |
| **Effect** | 2px brand-colored border + subtle scale bump + checkmark icon fades in |
| **Transform** | `scale(1.01)` |
| **Border** | `border-color: var(--color-brand)` with `ring: 0 0 0 3px rgba(brand, 0.15)` |
| **Duration** | 200ms |
| **Easing** | spring(tension: 280, friction: 20) or `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Implementation** | Toggle `.service-card--selected` class. Checkmark icon uses `opacity: 0→1` + `scale(0.8→1)` with 100ms delay after border transition. |

#### Time Slot Selection

| Property | Value |
|---|---|
| **Trigger** | `click` on `.time-slot` |
| **Effect** | Slot fills with brand color + adjacent slots shift 4px apart to acknowledge selection |
| **Duration** | 150ms |
| **Easing** | spring(tension: 400, friction: 25) |
| **Implementation** | CSS classes `.time-slot--selected` and `.time-slot--adjacent`. Adjacent slots use `margin-left: 4px` via sibling selector `.time-slot--selected ~ .time-slot--adjacent`. Use FLIP technique if animating layout — wrap slots in a flex container with `gap` transition. |
| **Note** | The "shift apart" is subtle — think of it like seats on a bus slightly adjusting when someone sits down. Creates spatial awareness. |

```css
.time-slot--selected {
  background: var(--color-brand);
  color: white;
  transform: scale(1.02);
  transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 150ms ease-out;
}
.time-slot--adjacent {
  margin-left: 4px;
  transition: margin-left 150ms ease-out;
}
```

#### Progress Stepper

| Property | Value |
|---|---|
| **Trigger** | Step completion on `.progress-step` |
| **Effect** | SVG circle checkmark draws in via stroke-dasharray. Current step has gentle pulse ring. Completed steps get a micro-sparkle (two small dots that arc outward). |
| **Duration** | Checkmark: 300ms. Pulse: 2s infinite loop. Sparkle: 400ms. |
| **Easing** | Checkmark: `ease-in-out`. Pulse: `ease-in-out` infinite. |
| **Implementation** | SVG `<path>` with `stroke-dasharray="0 100"` → `stroke-dasharray="100 100"`. Pulse uses `@keyframes pulse-ring` with `transform: scale(1) opacity(0.6)` → `scale(1.3) opacity(0)`. Sparkle uses absolutely-positioned pseudo-elements with `@keyframes sparkle-burst`. |

```css
/* Checkmark draw-in */
.progress-step__checkmark-path {
  stroke-dasharray: 0 100;
  transition: stroke-dasharray 300ms ease-in-out;
}
.progress-step--completed .progress-step__checkmark-path {
  stroke-dasharray: 100 100;
}

/* Current step pulse */
.progress-step--current::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--color-brand);
  animation: pulse-ring 2s ease-in-out infinite;
}
@keyframes pulse-ring {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.3); opacity: 0; }
}
```

#### Date Navigation (Mobile)

| Property | Value |
|---|---|
| **Trigger** | Touch swipe left/right on `.date-carousel` |
| **Effect** | Week transitions with horizontal slide. Current week slides out, next week slides in. |
| **Duration** | 300ms |
| **Easing** | `cubic-bezier(0.4, 0, 0.2, 1)` — standard ease-in-out |
| **Implementation** | Use Framer Motion `AnimatePresence` with `animate={{ x: 0, opacity: 1 }}` / `exit={{ x: direction > 0 ? 100 : -100, opacity: 0 }}`. Track swipe via `onTouchStart/onTouchEnd` delta. Desktop arrow buttons trigger same animation. |

```tsx
// Framer Motion approach
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={weekOffset}
    custom={direction}
    initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  >
    {weekDays}
  </motion.div>
</AnimatePresence>
```

#### Intake Form Fields

| Property | Value |
|---|---|
| **Trigger 1** | `focus` on `.form-field__input` |
| **Effect 1** | Label floats up and scales down to 0.85x. Border color shifts to brand. |
| **Duration 1** | 200ms |
| **Easing 1** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| **Trigger 2** | Valid input (`onBlur` with valid value) |
| **Effect 2** | Subtle green border glow (`box-shadow: 0 0 0 3px rgba(34,197,94,0.15)`) that fades after 1.5s |
| **Duration 2** | 300ms glow-in, 800ms fade-out |
| **Trigger 3** | Invalid input (`onBlur` with invalid value) |
| **Effect 3** | Gentle horizontal shake + red border + inline error message appears below |
| **Duration 3** | Shake: 400ms (3 oscillations). Error message: `opacity 200ms ease-out` + `translateY(-4px→0)` |

```css
/* Floating label */
.form-field__label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
  transform-origin: left center;
}
.form-field__input:focus ~ .form-field__label,
.form-field__input:not(:placeholder-shown) ~ .form-field__label {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  color: var(--color-brand);
}

/* Valid input glow */
.form-field__input--valid {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  animation: glow-fade 1.5s ease-out forwards;
}
@keyframes glow-fade {
  0%   { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
```

#### Signature Pad

| Property | Value |
|---|---|
| **Trigger** | `pointermove` on `.signature-canvas` |
| **Effect** | Ink trail with 8px delay at trail end (natural pen feel — like the ink is still flowing for a split second after the pen lifts). Line has subtle opacity falloff at edges for pen-like texture. |
| **Implementation** | Use Canvas 2D API. Store last N points, render with `lineCap: 'round'`, `lineJoin: 'round'`, `lineWidth: 2`. Trail delay: after `pointerup`, continue drawing from buffer for 1-2 more frames via `requestAnimationFrame`. |
| **Trigger** | Click `.signature-clear` |
| **Effect** | Button shakes left-right 3 times (like it's asking "are you sure?") unless canvas is already empty |
| **Duration** | 400ms |
| **Easing** | `cubic-bezier(0.36, 0.07, 0.19, 0.97)` — sharp overshoot |
| **Implementation** | CSS `@keyframes shake` applied on click if canvas has strokes. On second click (or same click if canvas empty), clear immediately. |

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-4px); }
  40%      { transform: translateX(4px); }
  60%      { transform: translateX(-3px); }
  80%      { transform: translateX(3px); }
}
.signature-clear--confirming {
  animation: shake 400ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
```

#### Confirmation Page

| Property | Value |
|---|---|
| **Trigger** | Booking successfully created |
| **Effect** | Large checkmark SVG draws in via stroke-dasharray animation. Card scales in from `scale(0.95)` + `opacity(0)` → `scale(1)` + `opacity(1)`. Details stagger in: appointment time (0ms), provider name (50ms), location (100ms), notes (150ms). CTA buttons appear after 500ms delay with `translateY(8px→0)` + `opacity(0→1)`. |
| **Duration** | Checkmark: 400ms. Card: 300ms. Staggered details: 50ms offset each, 200ms per item. CTA: 500ms delay, 300ms fade-in. |
| **Easing** | Checkmark: `ease-in-out`. Card: `cubic-bezier(0.34, 1.56, 0.64, 1)` (springy scale-in). Details: `ease-out`. |
| **No confetti** | This is a dental practice. Instead, the card has a very subtle gradient border animation (warm gold/teal sweep over 3s, once) — like a premium certificate. |

```tsx
// Staggered detail reveal
<div className="confirmation-details">
  {details.map((item, i) => (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + i * 0.05, duration: 0.2, ease: 'easeOut' }}
    >
      <span className="confirmation-details__label">{item.label}</span>
      <span className="confirmation-details__value">{item.value}</span>
    </motion.div>
  ))}
</div>

// CTA buttons with delayed entrance
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.9, duration: 0.3, ease: 'easeOut' }}
>
  <Button onClick={addToCalendar}>Add to Calendar</Button>
  <Button variant="secondary" onClick={reschedule}>Reschedule</Button>
</motion.div>
```

```css
/* Subtle gradient border animation on confirmation card */
.confirmation-card {
  position: relative;
  border: 1px solid transparent;
  background-clip: padding-box;
}
.confirmation-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #f59e0b, #14b8a6, #f59e0b);
  background-size: 200% 200%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: border-shimmer 3s ease-in-out 1;
}
@keyframes border-shimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

#### Add to Calendar

| Property | Value |
|---|---|
| **Trigger** | Click `.btn-add-calendar` |
| **Effect** | Calendar icon springs open — icon scales from 1→1.15→1 with a slight rotation bounce. .ics file downloads after animation completes. |
| **Duration** | 250ms |
| **Easing** | spring(tension: 400, friction: 15) |
| **Implementation** | Icon wraps in `<motion.span>` with `whileTap={{ scale: 0.9 }}` and `animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}`. Trigger file download on animation complete via `onAnimationComplete`. |

---

### Admin Dashboard

#### Sidebar Navigation

| Property | Value |
|---|---|
| **Trigger** | `hover` on `.sidebar__item` |
| **Effect (hover)** | Icon scales to 1.1x. Background shifts to a subtle tint. |
| **Duration** | 150ms |
| **Easing** | `ease-out` |
| **Trigger** | `.sidebar__item--active` |
| **Effect (active)** | A 3px brand-colored left border slides in from top → full height. Icon fills with brand color. |
| **Duration** | 250ms |
| **Easing** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |

```css
.sidebar__item--active {
  background: var(--color-brand-subtle, rgba(99, 102, 241, 0.08));
}
.sidebar__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--color-brand);
  transform: scaleY(0);
  transform-origin: top;
  animation: slide-indicator 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
@keyframes slide-indicator {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
.sidebar__item:hover .sidebar__icon {
  transform: scale(1.1);
  transition: transform 150ms ease-out;
}
```

#### Today's Schedule — Staggered Load

| Property | Value |
|---|---|
| **Trigger** | Page load / date change |
| **Effect** | Appointment cards fade in top-to-bottom with stagger |
| **Duration** | 30ms stagger per card, 250ms per card animation |
| **Easing** | `ease-out` |
| **Implementation** | Framer Motion `staggerChildren: 0.03`. Each card animates `opacity: 0→1` + `y: -8→0`. |

```tsx
const scheduleVariants = {
  visible: {
    transition: { staggerChildren: 0.03 }
  }
};
const cardVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};
```

#### Appointment Status Change

| Property | Value |
|---|---|
| **Trigger** | Admin changes status (confirmed → checked-in, checked-in → completed, etc.) |
| **Effect** | Status badge performs a 3D flip — front face scales to 0 on Y, back face scales to 1. Status icon morphs (crossfade). |
| **Duration** | 200ms |
| **Easing** | `ease-in-out` |
| **Implementation** | Use CSS `transform: rotateX(90deg)` mid-point. Two `.badge__face` elements (front/back), toggled via `.badge--flipped` class. `backface-visibility: hidden`. |

```css
.badge__inner {
  perspective: 200px;
}
.badge__face {
  backface-visibility: hidden;
  transition: transform 200ms ease-in-out;
}
.badge__face--front {
  transform: rotateX(0deg);
}
.badge__face--back {
  position: absolute;
  inset: 0;
  transform: rotateX(90deg);
}
.badge--flipped .badge__face--front {
  transform: rotateX(-90deg);
}
.badge--flipped .badge__face--back {
  transform: rotateX(0deg);
}
```

#### Stat Cards — Count-Up

| Property | Value |
|---|---|
| **Trigger** | Stat card enters viewport (first load / page mount) |
| **Effect** | Number counts up from 0 to final value at variable speed (slower near the end). Comma formatting ticks into place. |
| **Duration** | 800–1500ms depending on magnitude (< 100: 800ms, < 1000: 1000ms, >= 1000: 1500ms) |
| **Easing** | `ease-out` (decelerates as it approaches target) |
| **Implementation** | Use `useCountUp` from `react-countup` or custom hook with `requestAnimationFrame`. Use `easingFn: (t) => 1 - Math.pow(1 - t, 3)` for ease-out cubic. |

```tsx
// react-countup approach
<CountUp
  end={appointmentCount}
  duration={appointmentCount < 100 ? 0.8 : 1.5}
  easingFn={(t, b, c, d) => c * (1 - Math.pow(1 - t / d, 3)) + b}
  separator=","
>
  {({ countUpRef }) => <span ref={countUpRef} />}
</CountUp>
```

#### Client Search

| Property | Value |
|---|---|
| **Trigger 1** | User types `.search-input` |
| **Effect 1** | Results panel expands smoothly from 0 to full height. Results fade in with stagger (20ms). |
| **Duration** | 200ms |
| **Easing** | `ease-out` |
| **Trigger 2** | Input has value |
| **Effect 2** | Clear button (X icon) fades in from `opacity(0) scale(0.8)` → `opacity(1) scale(1)` |
| **Duration** | 150ms |
| **Trigger 3** | Clear button clicked |
| **Effect 3** | Input clears, results collapse back to 0 height. Clear button fades out. |

```css
.search-results {
  overflow: hidden;
  max-height: 0;
  transition: max-height 200ms ease-out;
}
.search-results--open {
  max-height: 500px; /* or use grid-template-rows for variable height */
}
.search-clear {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
  pointer-events: none;
}
.search-input:not(:placeholder-shown) ~ .search-clear {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
```

#### Chart Animations (No-Show Stats)

| Property | Value |
|---|---|
| **Trigger** | Chart enters viewport on scroll |
| **Effect** | Bar chart bars grow from `scaleY(0)` at bottom to their final height. Each bar staggers by 30ms. Axis labels fade in after bars. |
| **Duration** | 400ms per bar, 30ms stagger |
| **Easing** | `cubic-bezier(0.34, 1.56, 0.64, 1)` — slight overshoot at top |
| **Implementation** | Use Framer Motion `whileInView`. Bars use `transform-origin: bottom`. For non-Framer: IntersectionObserver + CSS transition triggered by class. |

```tsx
<motion.div
  initial={{ scaleY: 0 }}
  whileInView={{ scaleY: 1 }}
  viewport={{ once: true, margin: '-50px' }}
  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.03 }}
  style={{ transformOrigin: 'bottom' }}
/>
```

#### Empty States

Each empty state follows this pattern:
- **Illustration** — simple inline SVG (2-3 colors, brand palette). Not a broken image placeholder.
- **Heading** — 16px semibold, neutral-700
- **Body** — 14px regular, neutral-500
- **CTA** — Primary button with gentle `translateY(-1px)` hover lift
- **Container** — `.empty-state` with `padding: 48px 24px`, centered flex column

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
}
.empty-state__illustration {
  width: 120px;
  height: 120px;
  color: var(--color-neutral-300);
}
.empty-state__heading {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-neutral-700);
}
.empty-state__body {
  font-size: 14px;
  color: var(--color-neutral-500);
  max-width: 320px;
}
.empty-state__cta {
  margin-top: 8px;
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}
.empty-state__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
```

---

## 2. Loading & Skeleton States

### Principle

No spinners unless the wait exceeds 2 seconds. Use skeleton layouts that mirror the content structure.

### Booking Flow Skeleton

Three stages, each a shimmer skeleton:

| Stage | Layout | Elements |
|---|---|---|
| **Service selection** | 3-column grid of cards | Each card: 32x32 circle (icon placeholder) + 2 bars (title, duration/price). Aspect ratio ~3:2. |
| **Time slots** | 2-row x 4-column grid of pill-shaped slots | Each: 80x32 rounded rectangle. |
| **Intake form** | Stacked vertical fields | 5 field rows: 24px label bar + 40px input bar. 1 textarea row: 80px tall. |

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: var(--color-neutral-100);
  }
}
```

**Booking skeleton HTML structure:**
```html
<div class="booking-skeleton" aria-label="Loading booking options" role="status">
  <!-- Step indicator skeleton -->
  <div class="booking-skeleton__steps">
    <div class="skeleton" style="width: 60px; height: 4px;"></div>
    <div class="skeleton" style="width: 60px; height: 4px;"></div>
    <div class="skeleton" style="width: 60px; height: 4px;"></div>
  </div>
  <!-- Service cards skeleton -->
  <div class="booking-skeleton__grid">
    <div class="booking-skeleton__card">
      <div class="skeleton" style="width: 32px; height: 32px; border-radius: 50%;"></div>
      <div class="skeleton" style="width: 80%; height: 16px; margin-top: 12px;"></div>
      <div class="skeleton" style="width: 50%; height: 12px; margin-top: 8px;"></div>
    </div>
    <!-- repeat 3x -->
  </div>
</div>
```

### Admin Dashboard Skeleton

| Section | Layout | Elements |
|---|---|---|
| **Stat cards** | 4-column grid | Each: 120x80 card with 1 short bar (label) + 1 medium bar (value) |
| **Schedule rows** | Stacked list | 6 rows, each: 40x40 circle (avatar) + 3 bars (name, time, service). Alternating widths for visual rhythm. |

### Long Load (> 3s)

After 3 seconds, replace skeleton with a rotating tip/fact carousel:

```tsx
const tips = [
  'Did you know? Automated reminders reduce no-shows by 60%.',
  'Patients who book online are 3x more likely to show up.',
  'Same-day bookings have the highest conversion rate.',
  'Review requests within 1 hour get 40% more responses.',
];
// Rotate every 4 seconds with crossfade
// Display in a .loading-tip container below a subtle spinner
```

```css
.loading-tip {
  font-size: 14px;
  color: var(--color-neutral-500);
  text-align: center;
  animation: tip-fade 4s ease-in-out infinite;
}
@keyframes tip-fade {
  0%, 100% { opacity: 0; transform: translateY(4px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
}
```

---

## 3. Empty States

### No Upcoming Appointments

```
┌──────────────────────────────────┐
│          [Gentleman SVG]         │
│                                  │
│  Your schedule is clear.         │
│  Time to send review requests    │
│  to recent clients?              │
│                                  │
│  [Send Review Requests ▸]        │
└──────────────────────────────────┘
```

- **Illustration:** A stylized gentleman in a chair, relaxed posture, tea/coffee cup nearby. Neutral warm tones (#94a3b8, #cbd5e1).
- **CTA:** "Send Review Requests" — navigates to review requests page.

### No Clients Yet

```
┌──────────────────────────────────┐
│         [Building SVG]           │
│                                  │
│  No clients yet.                 │
│  Your client list will appear    │
│  here once bookings start.       │
│  Share your booking link to      │
│  get started.                    │
│                                  │
│  [Copy Booking Link ▸]           │
└──────────────────────────────────┘
```

- **Illustration:** A simple building/office with a "coming soon" sign. Line-art style.
- **CTA:** "Copy Booking Link" — copies to clipboard with a brief "Copied!" tooltip (200ms checkmark).

### No Intake Forms

```
┌──────────────────────────────────┐
│         [Clipboard SVG]          │
│                                  │
│  No intake forms yet.            │
│  Create your first intake form   │
│  to collect client info before   │
│  appointments.                   │
│                                  │
│  [Create Form ▸]                 │
└──────────────────────────────────┘
```

- **Illustration:** A clipboard with a blank page and a pen hovering. Line-art.
- **CTA:** "Create Form" — navigates to form builder.

### No Review Requests Sent

```
┌──────────────────────────────────┐
│        [Star/Heart SVG]          │
│                                  │
│  No review requests sent yet.    │
│  Automated review requests help  │
│  you get more Google reviews     │
│  without lifting a finger.       │
│                                  │
│  [Set Up Automation ▸]           │
└──────────────────────────────────┘
```

- **Illustration:** A 5-star rating with automation gear icon. Line-art.
- **CTA:** "Set Up Automation" — navigates to automation settings.

---

## 4. Success & Celebration States

### New Booking Confirmed

**Sequence of events:**

1. **Page transitions to confirmation** — 200ms crossfade
2. **Large checkmark SVG draws in** — 400ms, stroke-dasharray from 0→100
3. **Confirmation card scales in** — 300ms, `scale(0.95) opacity(0)` → `scale(1) opacity(1)`, spring easing
4. **Details stagger in** — each row: 50ms delay offset, 200ms fade-in
   - Row 1: Service name + staff name
   - Row 2: Date + time
   - Row 3: Location (if applicable)
   - Row 4: Notes or prep instructions
5. **CTA buttons appear** — 500ms delay after card, `translateY(8px) opacity(0)` → `translateY(0) opacity(1)`, 300ms

### Client Signs Waiver

**Effect:** Signature "stamps" onto the document — the signature renders with a brief scale-up (0.8→1) and the paper gets a subtle circular ink-blot ripple at the signature origin point. A small "Signed and sealed!" toast appears for 2.5s.

```css
.signature-stamp {
  animation: stamp-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes stamp-in {
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.ink-blot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand);
  opacity: 0.15;
  animation: ink-spread 600ms ease-out forwards;
}
@keyframes ink-spread {
  0%   { transform: scale(0); opacity: 0.25; }
  100% { transform: scale(40); opacity: 0; }
}
```

### Review Submitted

- Page shows a warm thank-you card with a checkmark.
- "Thank you! Your feedback helps [Business] improve."
- Card has the same gradient border shimmer as the booking confirmation (3s, once).
- No confetti — a simple, warm acknowledgment. The [Business] name is pulled from settings.

### Admin Completes Setup

- "Your booking page is live!" heading with a small sparkle icon (SVG, 4-point star).
- URL displayed in a prominent callout box with a copy button.
- The callout has a subtle pulse animation on the border for 3 seconds (draws attention).

```css
.setup-success__url-callout {
  border: 1px solid var(--color-brand);
  animation: pulse-shadow 3s ease-in-out 1;
}
@keyframes pulse-shadow {
  0%   { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3); }
  50%  { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}
```

---

## 5. Error States (Without Being Scary)

### No Availability

**Don't show:** Red error banner.  
**Show:** A gentle yellow/amber notice with suggested alternatives.

```
┌──────────────────────────────────┐
│ ⚠  Hmm, looks like Dr. Smith    │
│    is fully booked on Jun 30.    │
│                                  │
│  How about:                      │
│  • Wed, Jul 2 — 2:00 PM         │
│  • Wed, Jul 2 — 3:30 PM         │
│  • Thu, Jul 3 — 10:00 AM        │
│                                  │
│  [See Full Schedule ▸]           │
└──────────────────────────────────┘
```

**Implementation:**
- Background: `var(--color-amber-50)` (#fffbeb)
- Border: `var(--color-amber-300)` (#fcd34d)
- Icon: Clock or calendar with exclamation, 20px, amber-500
- Suggested times: Fetched from nearest-availability endpoint
- No shake, no red. Feels like a helpful redirect, not a dead end.

### Form Validation Error

- Field border turns red-500
- Field gets gentle shake animation (same as [Intake Form Fields](#intake-form-fields))
- Inline error message appears below the field: `color: var(--color-red-600)`, `font-size: 13px`, `margin-top: 4px`
- Error message fades in: `200ms ease-out`, `translateY(-4px→0)`
- No blocking modal. No page-level error banner unless it's a server error.
- Focus is set to the first invalid field.

### Payment Failure (Future)

```
┌──────────────────────────────────┐
│ Something didn't go through.     │
│ No worries — your appointment    │
│ is still reserved for [time].    │
│                                  │
│  [Retry Payment ▸]               │
│  [I'll Pay Later]                │
└──────────────────────────────────┘
```

- **Tone:** Reassuring. The appointment is explicitly still held (reduces anxiety).
- **Visual:** Neutral info banner (blue-50 bg), not red.
- **CTA:** "Retry Payment" is primary. "I'll Pay Later" is secondary link.
- **Timeout:** Held for 15 minutes (backend configurable).

### Network Error

- A small snackbar-style banner at the bottom of the page.
- Background: `var(--color-warning-50)` (yellow), not red.
- Icon: Signal bars with an X (SVG).
- Message: "We lost connection for a moment. Your progress is saved."
- As soon as connection restores (detected via `navigator.onLine` or periodic ping), the banner updates to "Back online!" with a green checkmark for 2s, then dismisses.
- Form data is stored in `localStorage`/`sessionStorage` and restored on reconnection.

```tsx
const [isOnline, setIsOnline] = useState(navigator.onLine);
useEffect(() => {
  const goOnline = () => setIsOnline(true);
  const goOffline = () => setIsOnline(false);
  window.addEventListener('online', goOnline);
  window.addEventListener('offline', goOffline);
  return () => {
    window.removeEventListener('online', goOnline);
    window.removeEventListener('offline', goOffline);
  };
}, []);

return (
  <AnimatePresence>
    {!isOnline && (
      <motion.div
        className="network-snackbar"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
      >
        We lost connection for a moment. Your progress is saved.
      </motion.div>
    )}
  </AnimatePresence>
);
```

---

## 6. Sound Design (Optional V2)

### Booking Page (Client-Facing)

- **No sounds.** Clients may be in public/quiet spaces.
- Exception: If audio is ever added, it must be opt-in with a toggle.

### Admin Dashboard

| Sound | Trigger | File | Duration | Volume |
|---|---|---|---|---|
| **New booking** | Real-time booking received | `pop-notification.wav` | 150ms | 50% |
| **Check-in** | Staff clicks "Check In" | `ding-confirm.wav` | 300ms | 40% |

- Both sounds are **configurable** in Settings → Notifications → Sounds.
- Default: **off** (opt-in).
- Use Web Audio API `AudioContext` for low-latency playback (no preloading giant files).
- Files: ~8-16kbps mono MP3 or OGG, < 10KB each.
- Never play sounds on page load (user must interact first — browser policy).

```tsx
// Sound manager hook
function useSound(enabled: boolean) {
  const play = useCallback((url: string, volume = 0.5) => {
    if (!enabled) return;
    const ctx = new AudioContext();
    const source = ctx.createBufferSource();
    // fetch + decode
    source.connect(ctx.destination);
    source.start(0);
  }, [enabled]);
  return { play };
}
```

---

## 7. Easter Eggs (Subtle)

### No Services Configured — Empty Booking Page

When a booking page has zero services configured (admin hasn't set up yet), show:

> "Nothing to book yet. Time to add your first service!"

With the settings gear icon doing a slow, gentle rotation. Not frantic — just a slight 10-degree wobble back and forth over 3s. Signals "needs configuration" without being annoying.

```css
.empty-services__gear {
  animation: gear-wobble 3s ease-in-out infinite;
}
@keyframes gear-wobble {
  0%, 100% { transform: rotate(0deg); }
  50%      { transform: rotate(10deg); }
}
```

### 100th Appointment — Admin Dashboard

When the admin dashboard loads and the total booking count crosses 100, show a small badge next to the booking stat:

- **Badge:** A small ribbon or star icon with "100+" tooltip
- **Duration:** Appears with a subtle pop-in (`scale: 0.8→1`, 200ms)
- **Message on hover:** "You've booked 100 appointments! 🎉" (tooltip)
- **Note:** Only shows once per business. Persist `hasSeen100Badge: true` in settings.
- Not a modal. Not a banner. Just a tiny, earned badge.

### "Help" in Empty Search

When the user types "help" (case-insensitive) into any empty search input:

```tsx
const [searchValue, setSearchValue] = useState('');
const showHelpTip = searchValue.toLowerCase() === 'help';

{showHelpTip && (
  <div className="search-help-tip">
    🔍 Try searching for a client name or service
  </div>
)}
```

- Appears below the search input after a 100ms delay (to avoid flicker during typing of "help" as substring).
- Fades in with `opacity: 0→1`, `translateY: -4px→0`, 200ms.
- Disappears when the user continues typing past "help" or clears.
- Class: `.search-help-tip` — `font-size: 13px`, `color: var(--color-neutral-500)`.

### Midnight Greeting (Admin Dashboard)

If the admin loads their dashboard between 12:00 AM and 5:00 AM local time, the greeting changes from "Good morning" to:

> "Up late? Your booking page never sleeps."

- Appears only once per session (stored in `sessionStorage`).
- No special animation — just the text change. Feels like a knowing nod, not a gimmick.

```tsx
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) return "Up late? Your booking page never sleeps.";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
```

### Keyboard Shortcut Hints

When the user presses `?` on the admin dashboard, show a small keyboard shortcut cheat sheet (modal or dropdown). Not a real Easter egg, but a power-user delight that makes the app feel "pro."

| Shortcut | Action |
|---|---|
| `n` | New booking |
| `s` | Focus search |
| `d` | Go to today's schedule |
| `?` | Show shortcuts |

- Slides in from the right: 250ms, `ease-out`.
- Dismiss on `Escape` or clicking outside.

---

## 8. Motion Design Principles

### Duration Guidelines

| Context | Duration | Examples |
|---|---|---|
| Micro-interactions | 150–300ms | Hover states, click feedback, focus animations |
| Transitions (same page) | 300–500ms | Tab switches, accordion expand, modal open |
| Page transitions | 200–400ms | Route changes, step navigation |
| Loading skeletons | 1.5s loop | Shimmer animation cycle |
| Count-up numbers | 800–1500ms | Stat cards on dashboard |
| Stagger delays | 20–50ms | List appearance, card grids |

### Easing Curves

| Curve | Cubic Bezier | Used For |
|---|---|---|
| **Ease-out (standard)** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Most UI micro-interactions, hover states, focus |
| **Ease-in-out (standard)** | `cubic-bezier(0.4, 0, 0.2, 1)` | Page transitions, slide animations |
| **Spring-like** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Scale bounces, checkmark pop-in, stamp effect |
| **Sharp shake** | `cubic-bezier(0.36, 0.07, 0.19, 0.97)` | Error shake, clear-button shake |
| **Decelerate (count-up)** | `t → 1 - (1 - t)³` | Number count-up (custom easing function) |

### Reduced Motion

**All animations must be disabled when the user prefers reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Additionally:** For Framer Motion, check `useReducedMotion()` and conditionally set `initial={false}`, `animate={{}}`, and `transition={{ duration: 0 }}`.

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
    />
  );
}
```

### Framework Decisions

| Complexity | Technique |
|---|---|
| **Simple transitions** (1-2 properties) | CSS transitions |
| **Keyframe animations** (loops, multiple steps) | CSS `@keyframes` |
| **Layout animations** (FLIP, AnimatePresence) | Framer Motion |
| **Drag/gesture** (swipe, reorder) | Framer Motion |
| **Staggered children** | Framer Motion `staggerChildren` |
| **Scroll-triggered** | Framer Motion `whileInView` or IntersectionObserver |
| **Canvas animations** (signature, charts) | Canvas 2D API + requestAnimationFrame |

### Performance Rules

1. **Prefer `transform` and `opacity`** — these are composited by the GPU and don't trigger layout/paint. Never animate `width`, `height`, `top`, `left`, `margin`, `padding`.
2. **Use `will-change` sparingly** — only on elements that animate frequently (e.g., hover cards). Remove after animation completes if possible.
3. **Avoid animating too many elements simultaneously** — max 8-10 concurrent animations. Batch with `will-change: transform` and layer promotion.
4. **Keep stagger delays low** — 20-50ms is enough for perceptual smoothness. > 100ms feels sluggish.
5. **No motion on initial page load** — wait for user's first interaction (`click`, `focus`, `touchstart`). This prevents jarring "everything flies in" experiences.

### Initial Load vs Post-Interaction

**First visit (no cache):**
- Page content appears instantly (no entrance animations)
- Only skeleton while loading
- After data loads, content appears (no stagger, no fade-in)
- Exception: Stat count-up on admin dashboard (feels like data coming in, not decoration)

**Subsequent interactions:**
- Full micro-interactions active
- Staggered reveals for new data (search results, appointments)
- Transitions between steps

**Reason:** Users coming to a booking page want to see availability *now*, not watch a 2-second animation. Reserve motion for interactions that benefit from feedback (click confirmation, state changes, navigation).

---

## Implementation Checklist

| Priority | Item | Section |
|---|---|---|
| P0 | Service card hover lift | 1.1 |
| P0 | Time slot selection feedback | 1.2 |
| P0 | Progress stepper checkmark animation | 1.3 |
| P0 | Form field float label | 1.5 |
| P0 | Confirmation checkmark + stagger | 1.7 |
| P0 | Skeleton loading states | 2.0 |
| P0 | `prefers-reduced-motion` global reset | 8.4 |
| P1 | Admin sidebar nav indicator | 1.9 |
| P1 | Schedule staggered load | 1.10 |
| P1 | Status badge flip | 1.11 |
| P1 | Stat card count-up | 1.12 |
| P1 | Empty state illustrations | 3.0 |
| P1 | "No availability" alternative suggestions | 5.1 |
| P1 | Form validation shake | 5.2 |
| P1 | Signature ink trail + clear shake | 1.6 |
| P2 | Date navigation swipe | 1.4 |
| P2 | Add to calendar icon bounce | 1.8 |
| P2 | Search results expand | 1.13 |
| P2 | Chart bar grow on scroll | 1.14 |
| P2 | Valid input green glow | 1.5 |
| P2 | Network error snackbar | 5.4 |
| P2 | Gradient border shimmer on success card | 4.1 |
| P2 | Signature stamp effect | 4.2 |
| P2 | Long-load rotating tips | 2.2 |
| P3 | 100th appointment badge | 7.2 |
| P3 | "Help" search tip | 7.3 |
| P3 | Midnight greeting | 7.4 |
| P3 | Keyboard shortcut sheet (`?`) | 7.5 |
| P3 | Sound effects (opt-in) | 6.0 |
| P3 | No services gear wobble | 7.1 |

---

*"People will forget what you said, people will forget what you did, but people will never forget how you made them feel." — often attributed to Maya Angelou*

*BookSmart should feel like arriving at a practice where the front desk already knows your name, has your coffee ready, and genuinely wants you to have a great day. Every pixel, every microsecond of motion, every carefully chosen word — all of it communicates: "We're glad you're here."*
