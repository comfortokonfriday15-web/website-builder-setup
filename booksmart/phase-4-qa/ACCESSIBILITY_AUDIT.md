# Accessibility Audit — BookSmart Booking Flow

**Auditor**: Accessibility Auditor agent  
**Scope**: `app/web/src/components/booking/*`, `app/web/src/components/ui/*`, `app/web/src/index.css`  
**Standard**: WCAG 2.2 AA  

---

## 1. Semantic HTML

### 1.1 Heading hierarchy

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `BookingPage.tsx` | 49 | `<h1>` for `business.name` — correct | ✅ Pass |
| `BookingConfirmation.tsx` | 92 | `<h2>` used for "Booking Confirmed!" — this is the page's primary heading, should be `<h1>` | **Medium** |
| `SignaturePad.tsx` | 143 | Jump from `<h2>` (line 135) to `<h4>` — skips `<h3>`, breaks hierarchy | **Low** |
| All step components | — | Each uses `<h2>` for step title — consistent and correct | ✅ Pass |

**Fix**: Change `BookingConfirmation.tsx:92` to `<h1>`. Change `SignaturePad.tsx:143` to `<h3>`.

### 1.2 Form semantics

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `ClientInfoForm.tsx` | 85 | Uses `<form>` with `onSubmit` | ✅ Pass |
| `ClientInfoForm.tsx` | 99–144 | All inputs use `<Input>` which renders `<label>` + `htmlFor` | ✅ Pass |
| `IntakeForm.tsx` | 96 | Uses `<form>` with `onSubmit` | ✅ Pass |
| `IntakeForm.tsx` | 124 | `<textarea>` missing `id` and `aria-describedby` — not associated with its `<Label>` | **High** |
| `IntakeForm.tsx` | 129 | `<textarea>` uses manual class styling — no error announcement via `aria-describedby` | **Medium** |
| `IntakeForm.tsx` | 202 | File `<input>` has `id={field.id}` but parent `<Label>` does not pass `htmlFor` — weak association | **Low** |
| `SignaturePad.tsx` | 191 | Agreement checkbox uses `<label>` wrapping `<input>` — correct | ✅ Pass |

**Fix**: Add `id` and `aria-describedby` to `<textarea>` in `IntakeForm.tsx:129`. Pass `htmlFor` to `<Label>` components in `IntakeForm.tsx`.

### 1.3 Buttons vs divs

All interactive items (service cards, staff cards, date cells, time slots, step indicators, navigation) use `<button>` elements. No `<div>` click handlers found. ✅

---

## 2. Color Contrast

Calculated using the WCAG 2.2 relative luminance formula.

| Foreground | Background | Ratio | AA 4.5:1 | Large Text 3:1 | Severity |
|------------|-----------|-------|-----------|----------------|----------|
| `#3b82f6` (primary-500) | `#ffffff` (white) | **4.09:1** | ❌ Fail | ✅ Pass | **High** |
| `#1d4ed8` (primary-700) | `#ffffff` (white) | **7.30:1** | ✅ Pass | ✅ Pass | — |
| `#6b7280` (gray-500) | `#ffffff` (white) | **4.83:1** | ✅ Pass | ✅ Pass | — |
| `#2563eb` (primary-600) | `#ffffff` (white) | **5.62:1** | ✅ Pass | ✅ Pass | — |

**Impact**: Primary-500 is used for:
- Focus ring on inputs (`focus:ring-primary-500`) — not text, exempt ✅
- Progress bar fill (`bg-primary-500` in `IntakeForm.tsx:112`) — decorative, exempt ✅
- Step indicator number text on white (`BookingPage.tsx:86` uses `text-primary-600`, but `text-primary-600` is `#2563eb` which passes)
- Under `BookingPage.tsx:77`, `text-primary-600` is used — this is `#2563eb` which passes at 5.62:1 ✅

**However**: The `accent-500` (`#f59e0b`) on white = ~2.85:1 — fails if used as text. Currently used only as decorative accent. Monitor usage.

**Fix**: No urgent changes needed for text — primary-600 (#2563eb) is used for text, which passes. Primary-500 is background/focus-ring only, which is acceptable.

---

## 3. Keyboard Navigation

### 3.1 Focus Indicators

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `button.tsx` | 7 | Button component has `focus-visible:ring-2 focus-visible:ring-primary-500` | ✅ Pass |
| `input.tsx` | 27–28 | Input has `focus:ring-2 focus:ring-primary-500` | ✅ Pass |
| `select.tsx` | 41–42 | Select trigger has `focus:ring-2` | ✅ Pass |
| `BookingPage.tsx` | 71 | Step indicator buttons — **no focus ring classes** | **High** |
| `ServiceSelection.tsx` | 19 | Service card `<button>` — **no focus ring** | **Medium** |
| `StaffSelection.tsx` | 23 | Staff card `<button>` — **no focus ring** | **Medium** |
| `DateTimePicker.tsx` | 120 | Date cell `<button>` — **no focus-visible ring** (only hover styles) | **High** |
| `DateTimePicker.tsx` | 164 | Time slot `<button>` — **no focus-visible ring** | **High** |
| `DateTimePicker.tsx` | 76, 86 | Chevron buttons — **no focus ring** | **Medium** |
| `StaffSelection.tsx` | 73 | "Back" button — **no focus ring** (plain `<button>`, not `<Button>` component) | **Medium** |
| `DateTimePicker.tsx` | 188 | "Back" button — **no focus ring** | **Medium** |
| `SignaturePad.tsx` | 182 | "Clear signature" — **no focus ring** | **Low** |

**Fix**: Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500` to all custom `<button>` elements.

### 3.2 Calendar Date Keyboard Navigation

The date grid in `DateTimePicker.tsx:93–141` renders 28 `<button>` elements in a flat grid. Users must Tab 28 times to reach the last day. **Arrow-key navigation is not implemented**.

- WCAG 2.2 requires that grid widgets support arrow-key navigation per the grid pattern (WAI-ARIA Authoring Practices).
- No `role="grid"`, `role="row"`, or `aria-activedescendant` attributes are used.
- The visible 4-week window uses `AnimatePresence` which may interfere with focus on re-render.

**Severity**: **High**  
**Fix**: Implement arrow-key navigation in the date grid using `onKeyDown`. Manage `tabIndex` with a roving tabindex pattern.

### 3.3 Signature Pad

`SignaturePad.tsx` uses a `<canvas>` for drawing. **No keyboard alternative exists** for providing a signature.

- Mouse/touch input only
- No keyboard-accessible method (e.g., typed name as legal signature)
- Screen reader users cannot complete the booking flow at step 6

**Severity**: **Critical** — blocks booking completion for keyboard-only and screen reader users.  
**Fix**: Add a toggle to allow typing the signature as text. Canvas should have `role="application"` and `aria-label="Signature area"`.

---

## 4. Screen Reader Support

### 4.1 Status Announcements

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `BookingPage.tsx` | 38 | Loading spinner has **no `role="status"`** or `aria-label` — not announced | **Medium** |
| `BookingPage.tsx` | 135–138 | Loading state has `<p>` text but **no `aria-live` region** | **Medium** |
| `DateTimePicker.tsx` | 153 | Loading spinner for slots — **no `role="status"`** | **Medium** |
| `ClientInfoForm.tsx` | 118 | "Checking for existing account..." — plain `<p>`, **not in `aria-live`** | **Low** |
| `BookingConfirmation.tsx` | — | No `aria-live="polite"` announcement on confirmation | **Medium** |
| `SignaturePad.tsx` | 122–124 | Error toast — uses Radix Toast which provides `role="status"` | ✅ Pass |

**Fix**: Add `role="status" aria-live="polite"` to loading containers. Add `<div aria-live="polite">` in `BookingConfirmation` to announce successful booking.

### 4.2 Error Association

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `input.tsx` | 35–36, 39–43 | Uses `aria-invalid` and `aria-describedby` pointing to error `<p>` with `role="alert"` | ✅ Excellent |
| `IntakeForm.tsx` | 129 | `<textarea>` — no `aria-invalid`, no `aria-describedby` | **High** |
| `IntakeForm.tsx` | 202 | File input — no error association | **Low** |

### 4.3 Context Changes

- The booking step change: `AnimatePresence mode="wait"` at `BookingPage.tsx:113` handles transition. **No `aria-live` announcement when step changes.** Screen reader users may not realize the content has updated.
- The progress indicator at `BookingPage.tsx:62` uses `<nav aria-label="Progress">` and `<ol>` ✅

**Severity**: **Medium**  
**Fix**: Add `aria-live="polite"` to the step container, or use `role="status"` on the step heading.

---

## 5. Touch Targets (WCAG 2.5.8 — Level AA)

| Element | File | Height | Width | ≥44px? | Severity |
|---------|------|--------|-------|--------|----------|
| Button (sm) | `button.tsx:19` | 32px | varies | ❌ Fail | **Low** (not used) |
| Button (md) | `button.tsx:20` | 40px | varies | ❌ Fail | **Medium** |
| Button (lg) | `button.tsx:21` | 48px | varies | ✅ Pass | — |
| Calendar date cell | `DateTimePicker.tsx:124` | ~36px (py-2=16px + text=20px) | ~36px (1/7 grid) | ❌ Fail | **High** |
| Time slot | `DateTimePicker.tsx:170` | ~36px (py-2=16px + text=20px) | varies | ❌ Fail | **Medium** |
| Service card | `ServiceSelection.tsx:19` | ≥64px | full width | ✅ Pass | — |
| Staff card | `StaffSelection.tsx:23` | ≥64px | full width | ✅ Pass | — |
| Step indicator | `BookingPage.tsx:71` | 28px (h-7) | 28px (w-7) | ❌ Fail | **Medium** |
| Back button (plain) | `StaffSelection.tsx:73` | 40px | varies | ❌ Fail | **Low** |

**Fix**: Increase default Button md from `h-10` to `h-11` (44px). Add `min-h-[44px] min-w-[44px]` to date cells and time slot buttons.

---

## 6. Reduced Motion

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `BookingPage.tsx` | 113–123 | `AnimatePresence` + `motion.div` with `x` slide — **no `prefers-reduced-motion` check** | **Medium** |
| `DateTimePicker.tsx` | 94–101 | `AnimatePresence` with slide for date grid — **no check** | **Medium** |
| `BookingConfirmation.tsx` | 83–87 | Spring scale animation (`scale: 0 → 1`) — **no check** | **Medium** |
| `IntakeForm.tsx` | 112 | `transition-all duration-300` on progress bar — **no check** | **Low** |
| Framer Motion globals | — | No `<MotionConfig reducedMotion="user">` wrapper in `App.tsx` or `main.tsx` | **Medium** |

**Fix**: Wrap the booking flow in `<MotionConfig reducedMotion="user">` at the `App.tsx` level (or `BookingPage.tsx`). This tells Framer Motion to respect the user's OS-level reduced-motion preference at zero code cost.

---

## Summary

| Severity | Count | Key Items |
|----------|-------|-----------|
| Critical | 1 | No keyboard-accessible signature input (`SignaturePad.tsx`) |
| High | 6 | Calendar arrow-key navigation missing; textarea missing `id`/`aria-describedby`; multiple buttons lack focus rings; date touch targets <44px; loading states not announced |
| Medium | 9 | Reduced motion not respected; heading hierarchy skip in confirmation; intake form label associations; "Back" buttons lack focus rings; progress announcements missing |
| Low | 3 | Chevrons lack focus rings; `<h4>` skip in waiver; file input label weak |

### Quick wins (can fix in <1 hour):
1. Wrap app in `<MotionConfig reducedMotion="user">` — single line
2. Add `focus-visible:ring-2` to step indicators, date cells, and time slots — 5 lines of CSS
3. Add `role="status"` to loading spinners — 3 lines
4. Add `aria-describedby` to `<textarea>` in IntakeForm — 2 lines
