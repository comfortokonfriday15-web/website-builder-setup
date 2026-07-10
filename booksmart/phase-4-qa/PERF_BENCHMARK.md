# Performance Benchmark — BookSmart Web

**Benchmarker**: Performance Benchmarker agent  
**Scope**: `app/web/src/` — bundle, rendering, network, images  
**Date**: 2026-06-30  

---

## 1. Bundle Analysis

### 1.1 Route-Level Code Splitting

App.tsx imports **all 12 components statically** — no `React.lazy()` or dynamic imports anywhere.

```ts
// App.tsx — all components eagerly loaded
import { BookingPage } from "@/components/booking/BookingPage";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/components/admin/AdminLogin";
// ... 7 more admin pages
```

| Route | Currently Loaded | Should Be |
|-------|-----------------|-----------|
| `/book/:slug` | BookingPage + all 7 admin pages | Lazy: BookingPage only |
| `/book/:slug/success` | BookingConfirmation + all admin pages | Lazy: BookingConfirmation only |
| `/admin/*` | All admin pages + all booking pages | Lazy: admin chunk |
| `/admin/login` | All pages | Lazy: AdminLogin only |
| Admin sub-routes | All 6 admin pages | Lazy per-route or per-section |

**File**: `App.tsx:2-11`  
**Severity**: **High** — a user visiting `/book/dentist` downloads the entire admin bundle (DashboardPage, SchedulePage, ClientsPage, ServicesPage, StaffPage, SettingsPage).

**Fix**: Replace static imports with `React.lazy()`:

```ts
const BookingPage = lazy(() => import("@/components/booking/BookingPage"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
// ... etc.
```

Wrap `<Routes>` in `<Suspense>`.

### 1.2 Large Dependency Audit

| Package | Est. Size (gzip) | Usage | Tree-Shakable? |
|---------|-----------------|-------|----------------|
| `framer-motion` | ~30 KB | AnimatePresence, motion.div in 4 files | Partially — only `motion.div` + `AnimatePresence` used, but bundler can't shake frames |
| `date-fns` | ~13 KB (treeshaken) | `format`, `parseISO`, `addDays`, `isSameDay`, etc. | ✅ Yes — only imported functions end up in bundle |
| `@supabase/supabase-js` | ~25 KB | Auth headers only (`api.ts:11`) | ❌ Overkill — imports full client just for `getSession()` |
| `react-router-dom` | ~20 KB | Routes, Route, useNavigate, useParams | ❌ Fixed cost |
| `lucide-react` | ~30 KB (all icons) | ~20 icon imports across 11 files | ✅ — Vite tree-shakes unused icons |
| `@radix-ui/*` (8 packages) | ~3–5 KB each | UI primitives | ✅ — Radix is modular |
| `zod` | ~8 KB | ClientInfoForm validation | ✅ — used only in one component |

**Key finding**: `@supabase/supabase-js` is imported solely for `getSession()` in `api.ts:11`. This pulls in the entire Supabase client (real-time, storage, Realtime channels) when only auth is needed. A lighter alternative (`@supabase/auth-js` or `@supabase/ssr` alone) can serve the same purpose.

**Severity**: **Medium**  
**Fix**: Replace `supabase.auth.getSession()` with `@supabase/auth-js` (~5 KB) or read the cookie directly with `@supabase/ssr`.

### 1.3 Import Cost per Booking Page Component

```
BookingPage.tsx (entry)
├── framer-motion                          ~30 KB
├── booking-store                           ~4 KB
├── constants                               ~1 KB
├── useBusiness                             ~1 KB + api ~25 KB (supabase)
├── ServiceSelection                        ~2 KB
├── StaffSelection                          ~2 KB
├── DateTimePicker + useAvailability        ~5 KB + date-fns ~13 KB
├── ClientInfoForm                          ~4 KB + zod ~8 KB
├── IntakeForm                              ~4 KB
├── SignaturePad + useBooking               ~5 KB
├── BookingConfirmation                     ~4 KB
├── ui/* (Button, Card, Input, etc.)        ~15 KB combined
├── tailwind-merge, clsx, cva              ~4 KB
└── Total (first load)                     ~120+ KB gzip
```

Booking page alone is ~120 KB gzipped. With code splitting, the initial load could drop to ~60 KB (core booking chunk) with admin chunk deferred.

---

## 2. Rendering Performance

### 2.1 Missing Memoization

| File | Line(s | Issue | Severity |
|------|--------|-------|----------|
| `DateTimePicker.tsx` | 39, 41–46 | `weekDays` and `visibleWeeks` recreated on every render. `getDatesForWeek` is a closure redefined each render | **Medium** |
| `IntakeForm.tsx` | 23–35 | `visibleFields` is a `useCallback` that returns a **new array** every render. Should use `useMemo` | **Medium** |
| `IntakeForm.tsx` | 38–45 | `completedFields` and `progressPercent` computed on every render — trivial cost, but could be memoized | **Low** |
| `BookingConfirmation.tsx` | 18–36 | `generateIcsContent` is recreated on every render and only called on button click — acceptable | ✅ Pass |
| `BookingPage.tsx` | 121 | `<StepComponent />` renders the current step — every state change re-renders the entire step container via `AnimatePresence` | **Low** |

**Fix**: 
- `DateTimePicker.tsx:41-46`: Wrap in `useMemo`
- `IntakeForm.tsx:23-35`: Change `useCallback` to `useMemo`
- Consider wrapping step components in `React.memo` — they only change when `state.currentStep` changes

### 2.2 Calendar Re-Renders

The date grid in `DateTimePicker.tsx` re-renders the full 28-day grid whenever:
- `currentWeekStart` changes (nav click) ✅ expected
- `selectedDate` changes ✅ expected
- `state.staff` or `state.service` changes (line 29–37 effect) — **triggers `fetchAvailability` and loading state** ✅ expected

However, the grid re-renders on **every key press in any unrelated field** because `DateTimePicker` consumes `useBookingContext()` which updates on any dispatch. The `AnimatePresence` wrapper (line 94) ensures the old grid exits, but the new grid re-renders all 28 `<button>` elements.

**Severity**: **Low** — 28 buttons is trivial. No issue here in practice.

### 2.3 Effect Dependencies

| File | Line(s) | Finding | Severity |
|------|---------|---------|----------|
| `BookingPage.tsx` | 29–33 | Effect deps: `[business, services, staffList, setBusinessData]` — `setBusinessData` is stable (useCallback([])) ✅ | ✅ Pass |
| `ClientInfoForm.tsx` | 31–56 | Effect deps include `form.email, state.client?.email, setMatchingClient` — missing `form.email` would cause stale closure, but it's included ✅ | ✅ Pass |
| `SignaturePad.tsx` | 20–52 | Canvas setup with empty deps `[]` — runs once on mount | ✅ Pass |
| `DateTimePicker.tsx` | 29–37 | Effect deps: `[state.staff, selectedDate, state.service?.duration_minutes, fetchAvailability]` — deps correctly scoped | ✅ Pass |

All effect dependencies are correctly specified. No over- or under-specification found. ✅

### 2.4 Unnecessary Re-Renders from Context

The `BookingProvider` context (booking-store.tsx) causes **all step components to re-render when any state changes**. This is the standard Context API behavior — there's no selector pattern or `useContextSelector`.

| Component | Re-renders when | Impact |
|-----------|----------------|--------|
| `ServiceSelection` | email typed (step 3) | Wasted — doesn't consume `state.client` |
| `StaffSelection` | canvas drawn (step 5) | Wasted — doesn't consume `state.signature` |
| `DateTimePicker` | service selected (step 0) | Wasted — doesn't consume `state.service` (actually it does via `state.service?.duration_minutes`) |

**Severity**: **Low** — component trees are shallow (<10 elements). Context re-renders are not a bottleneck here.

**Fix** (if scaling up): Split context into sub-contexts (BookingStepContext, BookingDataContext) or use `useContextSelector` from `use-context-selector`.

---

## 3. Network Performance

### 3.1 Initial Booking Page Load

On visiting `/book/:slug`:

```
1. GET /api/businesses/slug/:slug           (useBusiness.ts:22)
2. GET /api/businesses/slug/:slug/services  (useBusiness.ts:23) ┐ parallel
3. GET /api/businesses/slug/:slug/staff     (useBusiness.ts:24) ┘
```

These three requests fire **in parallel** via `Promise.all` on mount. ✅

**Total**: 3 HTTP requests on load.

### 3.2 Subsequent Requests

```
4. GET /api/clients?email=...    (ClientInfoForm.tsx:36) — on email blur after 500ms debounce
5. GET /api/availability?...     (DateTimePicker.tsx via useAvailability) — on staff + date selection
6. POST /api/appointments        (SignaturePad.tsx via useBooking) — on final submit
```

### 3.3 Opportunities

| Finding | File | Severity | Recommendation |
|---------|------|----------|----------------|
| No request deduplication | — | **Medium** | If user navigates back and forth between steps, `fetchAvailability` is called again. Add a simple in-memory cache keyed by `staffId + date` |
| No `AbortController` on email check | `ClientInfoForm.tsx:36` | **Medium** | If user types quickly, multiple `/clients?email=` requests fire. Previous requests are not aborted — could cause stale results or flash of wrong data |
| Debounce on email is only 500ms | `ClientInfoForm.tsx:33` | **Low** | Consider 300ms for better UX, or use `AbortController` |
| No optimistic UI for booking submit | `SignaturePad.tsx:119` | **Low** | Booking submit blocks UI with spinner. Could show optimistic confirmation immediately |

**Fix**: Add a simple request cache in `useAvailability`. Pass an `AbortSignal` to `fetchAvailability` and abort stale requests.

### 3.4 API Response Size

The `/staff` endpoint returns `Staff` objects which include `weekly_hours` (7-day object), `blackout_dates` (array), and `buffer_minutes`. This is fine for the booking page. However, the admin pages may benefit from field limiting (`?fields=id,name,photo_url`).

**Severity**: **Low**

---

## 4. Image Optimization

### 4.1 Staff Photos via Avatar

`Avatar` component in `avatar.tsx:26-54` renders staff photos from `staff.photo_url`.

```ts
// Avatar.tsx:45
<img src={src} alt={alt || name || "Avatar"} className="h-full w-full object-cover" />
```

| Finding | File | Detail | Severity |
|---------|------|--------|----------|
| No width/height attributes | `avatar.tsx:45` | Missing `width` and `height` — causes layout shift on image load | **Medium** |
| No Cloudflare R2 transforms | — | URLs are used as-is. If stored in Cloudflare R2, no `?width=80&format=auto` params | **Medium** |
| No lazy loading | `avatar.tsx:45` | `loading="lazy"` attribute not set — staff photos on booking page should defer | **Low** |
| No `srcSet` | — | Single resolution — mobile devices download desktop-sized images | **Low** |
| No WebP/AVIF format negotiation | — | JPEG/PNG only — no `format=auto` or `<picture>` element | **Low** |

### 4.2 Uploaded File Previews

In `IntakeForm.tsx:213-215`, user-uploaded files are previewed using `URL.createObjectURL()`:

```tsx
<img src={uploadedFiles[field.id]} alt="Uploaded file preview" className="mt-2 max-h-32 rounded-lg border object-cover" />
```

- Missing `width` / `height` attributes — may cause layout shift
- No `loading="lazy"`
- No size limiting — a 20MB photo creates a full-resolution `blob:` URL in the DOM

**Severity**: **Low** — user-generated content in intake forms is typically small.

### 4.3 Recommendations

1. Add Cloudflare Image Resizing transform parameters to `photo_url`:
   ```ts
   const optimizedUrl = staff.photo_url?.includes("r2.cloudflarestorage.com")
     ? `${staff.photo_url}?width=80&height=80&format=auto`
     : staff.photo_url;
   ```

2. Add `width` and `height` to Avatar img element:
   ```tsx
   <img src={src} alt={...} width={40} height={40} loading="lazy" />
   ```

3. For service icons / decorative images — none are used currently → no issue.

---

## 5. Bundle Size Estimate (Summary)

| Chunk (if code-split) | Current Size (est. gzip) | After Splitting |
|----------------------|------------------------|-----------------|
| Booking flow (6 steps + confirmation) | ~120 KB | ~80 KB |
| Admin dashboard | — | ~50 KB |
| Admin schedule | — | ~30 KB |
| Admin clients | — | ~25 KB |
| Admin services | — | ~20 KB |
| Admin staff | — | ~20 KB |
| Admin settings | — | ~15 KB |
| Shared (ui/*, lib/*, framer-motion, supabase, etc.) | — | ~50 KB |

**First-visit savings with lazy routes**: User on `/book/slug` saves **~160 KB** (all admin pages not loaded).

---

## Summary Table

| Category | Finding | Severity | Effort |
|----------|---------|----------|--------|
| Bundle | No `React.lazy()` code splitting | **High** | 1 day |
| Bundle | `@supabase/supabase-js` overkill for auth-only use | **Medium** | 2 hours |
| Rendering | `visibleWeeks` in DateTimePicker not memoized | **Low** | 15 min |
| Rendering | `visibleFields` in IntakeForm returns new array on every render | **Low** | 15 min |
| Rendering | Context triggers full-step-tree re-renders | **Low** | — |
| Network | No request deduplication for availability | **Medium** | 1 hour |
| Network | No AbortController for email lookup | **Medium** | 30 min |
| Network | Parallel API calls on initial load | ✅ Good | — |
| Images | No width/height on `<img>` — layout shift | **Medium** | 30 min |
| Images | No R2 transform params for thumbnails | **Low** | 1 hour |
| Images | No `loading="lazy"` on staff photos | **Low** | 5 min |

### Quick wins (can fix in <2 hours):
1. Add `width={40} height={40} loading="lazy"` to Avatar img (`avatar.tsx:45`)
2. Add request cache to `useAvailability.ts`
3. Add AbortController to email lookup in `ClientInfoForm.tsx`
4. Memoize `visibleWeeks` and `visibleFields`
5. Add R2 query params for staff photos in the `Avatar` component
