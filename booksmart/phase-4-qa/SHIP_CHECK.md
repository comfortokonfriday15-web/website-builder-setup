# SHIP_CHECK.md — BookSmart QA Report

**Reality Checker:** Comprehensive review of booking flow, admin dashboard, API edge cases & general quality.

---

## 🔴 BLOCKERS (Must fix before ship)

### 1. Prisma Schema / API field name mismatch — ALL ROUTES BROKEN
**Severity:** CRITICAL  
**File:** `api/prisma/schema.prisma` vs `api/src/routes/*.ts` vs `web/src/lib/api.ts`

The Prisma schema defines model relations as `hours` (StaffHour[]), `staff` (ServiceStaff[]), but the API routes query `weeklyHours` and `staffAssignments` everywhere:

- `availability.ts:58-61` — `include: { weeklyHours: true }` — schema field is `hours`
- `business.ts:32-34` — `include: { weeklyHours: true }` — schema field is `hours`
- `business.ts:81-83` — `include: { staffAssignments: true }` — schema field is `staff`
- `service.ts:37-39, 65-67, 95-98` — `include: { staffAssignments: true }` — schema field is `staff`

**Additionally:** The frontend types (`api.ts`) use `snake_case` (e.g. `business_id`, `start_time`, `client_name`), but the API returns raw Prisma objects in `camelCase`. There is no response transformer. Every single API response will have `undefined` for all snake_case fields on the frontend.

**Fix:** Either align the schema to match the API code, or rewrite all API responses with a transform layer.

### 2. Availability endpoint: frontend calls wrong URL pattern
**Severity:** CRITICAL  
**File:** `web/src/hooks/useAvailability.ts:15-20` calls `/api/availability?staff_id=...&date=...&duration_minutes=...`  
**File:** `api/src/routes/availability.ts:52` expects `GET /api/:staffId?date=...`

The frontend builds query params `staff_id`, `date`, `duration_minutes` and calls `GET /availability?...`. The API defines the route as `GET /:staffId?date=...` (singular param). The frontend URL has no `staffId` path segment. This will 404 or return unexpected data.

**Fix:** Align the frontend call with the API route: `get(\`/availability/${staffId}?date=${date}&duration_minutes=${serviceDuration}\`)`.

### 3. Business route mismatch — frontend calls /businesses/slug/:slug, API serves /:slug
**Severity:** CRITICAL  
**File:** `web/src/hooks/useBusiness.ts:23-25` — calls `/businesses/slug/${slug}`  
**File:** `api/src/index.ts:35` — `app.route("/api", business)` → API serves `GET /api/:slug`

The frontend path includes `/businesses/slug/` prefix that doesn't match the API's route pattern at all. Every business lookup will return 404 at runtime.

**Fix:** Update frontend calls to match API routes: `get(\`/${slug}\`)` or add a route `/businesses/slug/:slug` on the API side.

### 4. Past-time booking not prevented
**Severity:** HIGH  
**File:** `api/src/routes/booking.ts:52-53` — No validation that `startTime` is in the future  
**File:** `web/src/components/booking/DateTimePicker.tsx:48-51` — Only disables past DATES, not past TIMES on the current day

A user can book an appointment at 9:00 AM when it's currently 2:00 PM on the same day.

**Fix API:** Add validation: `if (startTime <= new Date()) return c.json({ error: "Cannot book in the past" }, 400);`  
**Fix Frontend:** Filter out time slots that are already past for the current date.

### 5. No error boundary anywhere in the React tree
**Severity:** HIGH  
**File:** `web/src/App.tsx:14-33`

The entire app has zero error boundaries. A crash in any component (e.g., `BookingPage`, `SchedulePage`) will unmount the whole React tree, showing a white screen.

**Fix:** Wrap `<Routes>` in an `<ErrorBoundary>` with a fallback UI. Add route-level error boundaries for admin and booking sections.

---

## 🟠 BOOKING FLOW ISSUES

### 6. Empty state: no services → silent empty grid
**Severity:** MEDIUM  
**File:** `web/src/components/booking/ServiceSelection.tsx:18`

When `state.services` is empty, the grid simply renders nothing. The heading "Select a Service" still displays but below it is blank.

**Fix:** Add `if (state.services.length === 0) return <EmptyState message="No services available." />` before the grid.

### 7. Empty state: no staff → silent empty grid
**Severity:** MEDIUM  
**File:** `web/src/components/booking/StaffSelection.tsx:10,22`

When `availableStaff` is empty (all inactive or none exist), the grid is blank. Same problem.

**Fix:** Add empty state check before mapping.

### 8. Double-booking race condition (no transaction wrapping)
**Severity:** MEDIUM  
**File:** `api/src/routes/booking.ts:55-78`

The overlap check (lines 55-62) and appointment creation (lines 77-93) are NOT wrapped in a Prisma transaction. Two concurrent requests could both clear the overlap check and create overlapping appointments.

The DB has `@@unique([staffId, startTime])` which only prevents identical start times, not overlapping time ranges.

**Fix:** Wrap the check + create in `prisma.$transaction()`.

### 9. Intake form: required fields not enforced
**Severity:** MEDIUM  
**File:** `web/src/components/booking/IntakeForm.tsx:70-74`

`handleSubmit` skips all validation. Required fields are marked visually with a `*` but nothing stops the user from clicking Continue with empty required fields.

**Fix:** Iterate `filteredFields`, check `field.required && !answers[field.id]`, show validation errors, and prevent submission.

### 10. Signature pad: empty canvas bypass
**Severity:** MEDIUM  
**File:** `web/src/components/booking/SignaturePad.tsx:105-109`

`getSignatureData()` returns a non-empty string even if the user just clicked (not dragged) on the canvas. The data URL will be of a blank white canvas. The only guard is `hasDrawn` which is set to `true` on `mousedown`/`touchstart` regardless of actual stroke length.

**Fix:** Track pixel count or check if any non-white pixels exist before allowing submission.

### 11. Signature pad: iOS touch events may be ignored
**Severity:** MEDIUM  
**File:** `web/src/components/booking/SignaturePad.tsx:169-171`

React's synthetic event delegation means `onTouchStart`/`onTouchMove` may be passive by default in modern Chrome/Safari. The `e.preventDefault()` call at line 71/82 will be ignored for passive listeners, causing the page to scroll while drawing.

**Fix:** Use `useEffect` to add native `touchstart`/`touchmove` listeners with `{ passive: false }` on the canvas ref.

### 12. User refresh mid-flow loses all progress
**Severity:** MEDIUM  
**File:** `web/src/lib/booking-store.tsx:45-58` — Initial state is hard-coded, no persistence

A user refreshing the page at step 4 (Client Info) loses everything and returns to step 0.

**Fix:** Persist booking state to `sessionStorage` (or `localStorage`) with hydration on mount.

### 13. Confirmation redirect has stale navigation guard
**Severity:** LOW  
**File:** `web/src/components/booking/BookingConfirmation.tsx:43-47`

`useEffect` with empty deps navigates away if state is incomplete, but the state could be async-loaded. If step 6 is rendered before state hydration, it redirects prematurely.

**Fix:** Add a `useEffect` dependency or check `state.business` exists before redirecting.

### 14. Service-staff assignment not validated on booking
**Severity:** MEDIUM  
**File:** `api/src/routes/booking.ts:42-50`

The API validates that the `serviceId` belongs to the business, and that `staffId` belongs to the business. It does NOT verify the staff member is actually assigned to that service (via `ServiceStaff` join table).

**Fix:** Check `prisma.serviceStaff.findUnique({ where: { serviceId_staffId: { serviceId, staffId } } })`.

---

## 🟠 ADMIN DASHBOARD ISSUES

### 15. Status state machine not enforced — can check-in a no-show or cancel a completed appointment
**Severity:** HIGH  
**File:** `web/src/components/admin/SchedulePage.tsx:270-291`

All status action buttons are shown regardless of current status. Only the current status button is disabled (line 285). You can mark a completed appointment as "no-show" or check-in a cancelled one.

**Fix:** Define a valid state machine transition map:
```
pending → [confirmed, cancelled]
confirmed → [checked_in, cancelled]
checked_in → [in_progress, no_show, cancelled]
in_progress → [completed]
completed → []
no_show → []
cancelled → []
```

### 16. API error handling: silent catches everywhere
**Severity:** MEDIUM  
**File:** `web/src/components/admin/DashboardPage.tsx:47-49`, `SchedulePage.tsx:66-68`, `ClientsPage.tsx:42-44`

All admin pages catch API errors and only `console.error`. The user sees stale/misleading empty states.

**Fix:** Show a toast to the user: "Failed to load data. Pull to refresh or try again."

### 17. Timezone: availability uses hardcoded UTC for staff-less query
**Severity:** MEDIUM  
**File:** `api/src/routes/availability.ts:165` — `const timezone = "UTC";` (hardcoded in `generateStaffSlots`)

The `generateSlots` helper at line 35 correctly reads `staff.business.timezone`, but the `generateStaffSlots` helper (used for the `/business/:slug` endpoint at line 129) hardcodes `timezone = "UTC"`. Slot times will be wrong for non-UTC businesses.

**Fix:** Pass staff's business timezone as a parameter.

### 18. Email templates use server timezone (toLocaleDateString)
**Severity:** MEDIUM  
**File:** `api/src/lib/email.ts:43-44`

`appointment.startTime.toLocaleDateString()` and `toLocaleTimeString()` use the **server's** timezone. For a business in "America/Los_Angeles" with a server in UTC, email times will be wrong.

**Fix:** Accept a `timezone` parameter and use `Intl.DateTimeFormat` with the business's IANA timezone.

### 19. Pagination: no loading indicator between page changes
**Severity:** LOW  
**File:** `web/src/components/admin/ClientsPage.tsx:30-51,169-191`

When clicking "Next" page, there's no spinner or skeleton. The `loading` state IS set to `true`, but the table still shows stale data until the new page loads.

**Fix:** Show skeleton rows or overlay a subtle spinner during page transitions.

---

## 🟠 API EDGE CASES

### 20. Email failure: silent swallowing, no retry, no user feedback
**Severity:** MEDIUM  
**File:** `api/src/routes/booking.ts:130-138`

The confirmation email send is wrapped in `try/catch` with a comment "Trigger.dev not configured — skip". If email fails, the booking is still created with no way to retry. No email log entry for failures.

**Fix:** Write a failed email log entry and expose a "Resend confirmation" button in admin.

### 21. Client merge endpoint: no ownership validation
**Severity:** MEDIUM  
**File:** `api/src/routes/client.ts:114-152`

The merge endpoint doesn't verify that the source/target clients belong to the same business. Also, merging requires a `sourceClientIds` array but the admin dialog accepts a single `source_id`.

**Fix:** Add `businessId` validation for both target and source clients.

### 22. Staff delete is soft-delete but no isActive filter in all queries
**Severity:** LOW  
**File:** `api/src/routes/staff.ts:118-121` — soft-deletes by setting `isActive: false`

But some queries don't filter by `isActive`. The availability endpoint at `availability.ts:56-63` finds staff by ID without checking `isActive`.

**Fix:** Add `isActive: true` to all staff find queries where relevant.

---

## 🟡 GENERAL

### 23. Console: select.tsx exports conflicting SelectGroup
**Severity:** LOW  
**File:** `web/src/components/ui/select.tsx:20`

```tsx
const SelectGroup = SelectGroup; // self-referencing re-declaration
```

This shadows the Radix import and exports a broken re-export. The grouped `Select` components may not work correctly.

**Fix:** Remove line 20 and rename the re-export of `SelectGroup` from Radix.

### 24. No loading state in ServiceSelection, StaffSelection for initial data fetch
**Severity:** LOW  
**File:** `web/src/components/booking/BookingPage.tsx:27-33`

The `BookingFlow` component sets business data in a `useEffect` that depends on `services.length > 0`. Until then, `state.services` is empty → blank grid. No skeleton or loading indicator between business loaded and data set.

**Fix:** Show a skeleton grid until `state.services.length > 0`.

### 25. .ics download may fail on iOS Safari
**Severity:** LOW  
**File:** `web/src/components/booking/BookingConfirmation.tsx:56-74`

iOS Safari blocks `blob:` URL downloads for files other than images. The `.ics` file may open inline or fail silently.

**Fix:** Use `navigator.share` as a fallback on iOS, or use a data URI approach.

### 26. Appointment status constant mismatch
**Severity:** MEDIUM  
**File:** `api/src/routes/booking.ts:24` — uses `"checked-in"` (kebab)  
**File:** `web/src/lib/constants.ts:6` — defines `"checked_in"` (snake)  
**File:** `web/src/components/admin/SchedulePage.tsx:29` — uses `"checked_in"` (snake)

The API status `"checked-in"` won't match the frontend constants/labels. All admin status badges for checked-in appointments will show no matching color/label.

**Fix:** Standardize on one format (snake_case throughout).

---

## ✅ WHAT'S ALREADY GOOD
- **Intake form empty state** (`IntakeForm.tsx:76-93`) — handles zero fields gracefully
- **Business not found** (`BookingPage.tsx:144-155`) — proper error screen
- **No time slots** (`DateTimePicker.tsx:155`) — shows "No available times" message
- **No appointments today** (`DashboardPage.tsx:124`) — clean empty state
- **Loading states** — spinner on all fetch operations (Booking, Dashboard, Schedule, Clients)
- **`ApiError` class** — typed error handling in the request layer
- **Cancellation guard** — `RESET` action preserves `businessSlug` on full reset
- **Debounced email lookup** — client email search debounces at 500ms

---

## 📊 SCORE

| Category | Rating | Notes |
|----------|--------|-------|
| Booking Flow | **4/10** | Missing empty states, no refresh persistence, past-time not prevented |
| Admin Dashboard | **5/10** | Status state machine missing, silent error handling, timezone bugs |
| API Edge Cases | **4/10** | No past-time validation, transaction gap, route mismatches |
| General Quality | **5/10** | No error boundaries, Prisma/schema mismatch throughout |

**Ship decision: DO NOT SHIP.** Items #1, #2, #3 (route/schema mismatches) will cause immediate runtime failures. Items #4, #5, #15 are high-severity UX/data-integrity issues. Fix all 🔴 blockers and 🟠 items before release.
