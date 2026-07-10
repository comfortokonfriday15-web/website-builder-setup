# Security Review Report — BookSmart

**Reviewer:** AppSec Engineer  
**Date:** 2026-06-30  
**Scope:** `api/`, `web/`, `trigger/` under `app/`  
**Stack:** React + Hono + Supabase + Prisma + Trigger.dev + AWS SES + Dropbox Sign

---

## Executive Summary

**19 findings** — 2 Critical, 4 High, 7 Medium, 6 Low.

The app has solid foundations (Zod validation on most routes, JWT verification via Supabase, env-based secrets), but suffers from **broken middleware composition**, **unauthenticated PII-exposing endpoints**, **Prisma schema–code drift**, and **no server-side file handling**. The use of the Supabase `service_role` key for all API auth checks means RLS is completely bypassed, removing Supabase's primary data-access guard.

---

## 1. Authentication & Authorization

### CRITICAL — F.1 Broken Middleware Composition in `requireBusinessMember`
**File:** `api/src/middleware/auth.ts:42`  
`requireBusinessMember` calls `requireAuth(c, async () => { ... })`, but `requireAuth` calls `await next()` internally — it does **not** accept or invoke a callback. The inner callback passed to `requireAuth` is **never executed**. Membership checks silently never run, granting business-level access to any valid JWT bearer.

**Remediation:** Refactor to Hono's native middleware composition — either chain middleware with `requireAuth, requireBusinessMember` in route definitions, or use `c.exec()` / `await next()` patterns correctly.

---

### HIGH — F.2 Unauthenticated Routes Expose PII
**Files:**  
- `api/src/routes/booking.ts:143` — `GET /:id` returns full appointment + client data with **no auth**  
- `api/src/routes/client.ts:68` — `GET /:id` returns full client profile + all appointments with **no auth**  
- `api/src/routes/client.ts:99` — `PUT /:id` allows modifying any client by ID with **no auth**  
- `api/src/routes/intake.ts:66` — `GET /:id` returns intake template with **no auth**  
- `api/src/routes/waiver.ts:52` — `GET /:id` returns waiver template with **no auth**

Anyone with the resource ID can read or modify records across businesses.

**Remediation:** Add `requireBusinessMember` (once fixed) to all routes returning/modifying PII. Validate that the requester belongs to the same business as the resource.

---

### HIGH — F.3 Frontend Admin Routes Lack Auth Guards
**File:** `web/src/components/admin/AdminLayout.tsx`  
The `AdminLayout` component renders the entire admin panel without checking for an active Supabase session. Navigating to `/admin` directly renders the dashboard. The only auth enforcement is the UI login form — there is no route guard, no session check, and no redirect.

**Remediation:** Add a `<ProtectedRoute>` wrapper that calls `supabase.auth.getSession()` and redirects to `/admin/login` if unauthenticated. Use this wrapper in `App.tsx` for all `/admin/*` routes.

---

### MEDIUM — F.4 CORS Origin Validation Weak
**File:** `api/src/index.ts:21`  
`process.env.FRONTEND_URL` is spread into the allowed-origins array with no validation. If this env var is misconfigured (e.g., `*` or a malicious origin), the CORS policy becomes dangerously permissive.

**Remediation:** Validate `FRONTEND_URL` against a strict allow-list on startup. Reject wildcards.

---

## 2. API Security

### CRITICAL — F.5 No Rate Limiting Anywhere
**All public endpoints** are unthrottled. The unauthenticated booking creation endpoint (`POST /api/booking`) can be called arbitrarily to:
- Enumerate valid email addresses
- Flood a business with fake appointments
- Trigger bulk email sends via Trigger.dev events
- Exhaust database connections

**Remediation:** Implement rate limiting at the Hono middleware level (e.g., `@hono/rate-limiter` or a reverse-proxy layer). Apply strict limits on unauthenticated endpoints and looser limits on authenticated ones.

---

### HIGH — F.6 Double-Booking Prevention Bypass via Race Condition
**File:** `api/src/routes/booking.ts:55-63`  
The overlap check queries for existing appointments, then creates a new one. There is no database-level constraint preventing overlapping appointments for the same staff member at different start times. The `@@unique([staffId, startTime])` constraint only prevents exact `startTime` collisions, not overlapping windows. A concurrent request can pass the overlap check before the first insert commits.

**Remediation:** Use a database-level exclusion constraint (PostgreSQL `EXCLUDE` using `&&` with daterange/tstzrange) or wrap the overlap-check + create in a Prisma `$transaction` with serializable isolation.

---

### MEDIUM — F.7 Permissive Zod Schema for Intake Answers
**File:** `api/src/routes/booking.ts:19`  
```ts
intakeAnswers: z.record(z.string(), z.any()).optional()
```
`z.any()` accepts arbitrary data — including nested objects, numbers, booleans, or extremely large payloads. This data is stored directly as JSON in `IntakeResponse.answers` without sanitization or size limits.

**Remediation:** Define a union of permitted value types (`z.string() | z.array(z.string())`), or at minimum use `z.record(z.string(), z.unknown())` and validate at the application layer. Add a maximum answer size limit.

---

### MEDIUM — F.8 `any` Types in Prisma `where` Clauses
**Files:**  
- `api/src/routes/booking.ts:171`  
- `api/src/routes/client.ts:45`  
- `api/src/routes/availability.ts:136`  

Using `where: any` suppresses TypeScript checks and allows passing arbitrary filter keys. If a Zod schema omits a field that Prisma accepts (e.g., `contains`, `in` operators), this could enable unintended query patterns.

**Remediation:** Replace `any` with typed `Prisma.ModelNameWhereInput` or narrow the type to the known set of filterable fields.

---

## 3. Data Protection & HIPAA

### HIGH — F.9 PII Stored Without Encryption at Rest
**File:** `api/prisma/schema.prisma`  
The `Client` model stores: `name`, `email`, `phone`, `address`, `dob`, `notes`.  
`IntakeResponse.answers` is a free-form `Json` field that can contain medical history, insurance info, or treatment notes.  
None of these fields use column-level encryption. For a dental practice handling PHI, this is a HIPAA concern.

**Remediation:** Apply PostgreSQL `pgcrypto` column encryption for sensitive PII/PHI fields, or implement application-level encryption using a key management service. Ensure the database is encrypted at rest (RDS/Aurora encryption). Verify Supabase has a BAA in place before storing any patient data.

---

### MEDIUM — F.10 E-Sign Audit Trail Incomplete
**File:** `api/prisma/schema.prisma:247-263`  
`SignedWaiver` has `ipAddress` and `userAgent` fields defined in the schema, but **they are never populated** in any route (`waiver.ts:104-117` includes neither field when creating a record). This creates an incomplete audit trail for e-signatures, which may not satisfy ESIGN/UETA compliance requirements.

**Remediation:** Capture `c.req.header("x-forwarded-for")` (or `c.req.header("cf-connecting-ip")`) and `c.req.header("user-agent")` when creating `SignedWaiver` records. Log the signature request ID from Dropbox Sign for external verification.

---

### LOW — F.11 No `updatedAt` on Client Model
**File:** `api/prisma/schema.prisma:152-173`  
The `Client` model lacks an `updatedAt` field. There is no way to audit when client PII was last modified or detect unauthorized changes.

**Remediation:** Add `updatedAt DateTime @updatedAt` to the `Client` model.

---

### LOW — F.12 Prisma Schema–Code Drift (Unmaintainable)
**Multiple discrepancies** between the Prisma schema and route implementations:
- `business.ts` references `business.email`, `business.defaultAppointmentDuration`, `business.bookingLeadTime`, `business.bookingWindowDays` — none exist in the schema
- `staff.ts` references `staff.email`, `staff.color`, `staff.appointmentStepMinutes`, `staff.weeklyHours` — none exist (schema uses `hours` and has no `email`/`color` fields)
- `availability.ts` references `staff.weeklyHours` — should be `staff.hours`
- `staff.ts` creates `WeeklyHour` via `prisma.weeklyHour` — no such model in schema (should be `StaffHour`)

The code will fail at runtime with Prisma validation errors.

**Remediation:** Regenerate the Prisma client and align all route queries with the actual schema. Run `prisma validate` and `tsc --noEmit` in CI.

---

## 4. Email Security

### MEDIUM — F.13 SMTP Credentials in Plaintext on Every Email Send
**Files:**  
- `api/src/lib/email.ts:3-11`  
- `trigger/src/lib/email.ts:3-11`  

Hardcoded `!` non-null assertions on `SES_HOST`, `SES_USER`, `SES_PASS` mean the process crashes if env vars are missing, but Nodemailer passes credentials in plaintext over SMTP (STARTTLS). Port 587 with `secure: false` uses STARTTLS (opportunistic), which is susceptible to STRIPTLS attacks if the server doesn't enforce TLS.

**Remediation:** Set `secure: true` and use port 465 for implicit TLS, or enforce `requireTLS: true` on the transporter. Remove the `!` assertions and throw descriptive errors instead.

---

### LOW — F.14 User-Controlled Data in Email Subject Lines
**Files:**  
- `api/src/routes/booking.ts`  
- `api/src/lib/email.ts`  

Subject lines include `appointment.business.name` and `appointment.client.name`. While Nodemailer escapes HTML, raw SMTP headers could be affected if names contain newlines or special characters (header injection). Validate/length-limit business and client names before using them in email subjects.

**Remediation:** Apply zod string length limits (e.g., `z.string().max(255)`) to business and client name fields. Strip newlines from name fields before email construction.

---

## 5. File Upload Security

### HIGH — F.15 File Uploads Never Persisted — Data Loss
**File:** `web/src/components/booking/IntakeForm.tsx:62-68`  
The "file" intake field type uses `URL.createObjectURL(file)` which creates an in-memory blob URL in the browser. The file is **never uploaded** to a server, R2 bucket, or any persistent store — only the file name is stored in state/answers. This means:
- Files are lost on page refresh
- Files are never available to the business
- The "file" type is misleading and results in silent data loss

**Remediation:** Remove the `"file"` type from intake schema if file upload is not implemented. If file upload is intended, implement server-side upload with:
- Multipart form handling on the API
- MIME type validation (server-side, not just `accept` attribute)
- File size limits (e.g., 10 MB max)
- Upload to Cloudflare R2 with signed URLs
- Malware scanning before storage

---

### MEDIUM — F.16 No Server-Side MIME Validation or Size Limits
**File:** `web/src/components/booking/IntakeForm.tsx:205`  
The `accept="image/*,.pdf"` attribute is client-side only and trivially bypassed. There is no server-side route to handle file uploads at all (no multipart/form-data handling exists in any route). If file upload is added later without server-side validation, arbitrary file types could be accepted.

**Remediation:** As above — implement proper server-side validation before enabling file upload functionality.

---

## 6. Secrets Management

### MEDIUM — F.17 Service Role Key Used for Auth (RLS Bypass)
**File:** `api/src/lib/supabase-admin.ts`  
The `SUPABASE_SERVICE_ROLE_KEY` is used for all JWT verification (`auth.ts:28`). This key bypasses all Row-Level Security policies. If this key is leaked (e.g., via server-side error, logs, or compromise), the entire database is exposed.

**Remediation:** Use the Supabase anon key or a limited JWT verification approach instead of the service role key for token verification. The service role key should only be used for admin operations that genuinely need RLS bypass (e.g., webhooks, admin bulk operations). Ensure the key is never logged or exposed in error responses.

---

### LOW — F.18 No `.env.example` Committed
No `.env.example` file was found in the repo. New developers have no documentation of required environment variables, leading to misconfiguration.

**Remediation:** Create `.env.example` with all required variables (documented with mock values) and a note about which keys must be kept secret.

---

### LOW — F.19 `EMAIL_FROM` Defaults to Generic Address
**File:** `api/src/lib/email.ts:13`  
```ts
const FROM = process.env.EMAIL_FROM || "noreply@booksmart.app";
```
The fallback `noreply@booksmart.app` may not be a verified sending domain in SES. Emails from unverified domains will be rejected or flagged as spam. Dental practice appointments sent from such an address may not reach patients.

**Remediation:** Remove the default and require `EMAIL_FROM` to be explicitly set to a verified SES domain.

---

## Summary Table

| ID | Severity | Area | Finding |
|----|----------|------|---------|
| F.1 | **CRITICAL** | Auth | `requireBusinessMember` callback never executes |
| F.5 | **CRITICAL** | API | No rate limiting on any endpoint |
| F.2 | **HIGH** | Auth | 5 unauthenticated routes expose PII |
| F.3 | **HIGH** | Auth | No frontend route guard on `/admin/*` |
| F.6 | **HIGH** | API | Double-booking race condition |
| F.9 | **HIGH** | Data | PHI stored without encryption at rest |
| F.15 | **HIGH** | Uploads | File uploads silently lost (never persisted) |
| F.4 | **MEDIUM** | Auth | CORS origin from untrusted env var |
| F.7 | **MEDIUM** | API | Permissive `z.any()` in intake schema |
| F.8 | **MEDIUM** | API | `any` types in Prisma where clauses |
| F.10 | **MEDIUM** | Data | E-sign audit trail fields not populated |
| F.13 | **MEDIUM** | Email | TLS not enforced; STARTTLS downgrade risk |
| F.16 | **MEDIUM** | Uploads | No server-side file validation |
| F.17 | **MEDIUM** | Secrets | Service role key used for all auth |
| F.11 | **LOW** | Data | Client model missing `updatedAt` |
| F.12 | **LOW** | Data | Prisma schema–code drift (will crash at runtime) |
| F.14 | **LOW** | Email | Potential header injection via names |
| F.18 | **LOW** | Secrets | Missing `.env.example` |
| F.19 | **LOW** | Email | Unverified default `FROM` address |

---

## Recommended Quick Wins

1. **Fix F.1 (Critical)** — Refactor `requireBusinessMember` to chain middleware properly. This unblocks auth on all admin routes.
2. **Fix F.2 (High)** — Add `requireBusinessMember` (once fixed) to the 5 unauthenticated resource routes.
3. **Fix F.6 (High)** — Add a Postgres exclusion constraint for overlapping appointments.
4. **Fix F.5 (Critical)** — Add rate limiting middleware.
5. **Fix F.15 (High)** — Either remove the `"file"` intake type or implement server-side R2 uploads.
6. **Fix F.3 (High)** — Add `<ProtectedRoute>` guard to all admin frontend routes.
