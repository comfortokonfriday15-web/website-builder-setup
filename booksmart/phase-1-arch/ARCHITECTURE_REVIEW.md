# BookSmart — System Architecture Document

**Version:** 1.0  
**Status:** Approved  
**Author:** Software Architect  
**Last Updated:** 2026-06-30

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [Multi-Tenant Data Model](#3-multi-tenant-data-model)
4. [API Design](#4-api-design)
5. [Key Architectural Decisions (ADRs)](#5-key-architectural-decisions-adrs)
6. [Security Architecture](#6-security-architecture)
7. [Performance Considerations](#7-performance-considerations)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Appendix: Database Schema](#9-appendix-database-schema)

---

## 1. Technology Stack

| Layer | Choice | Rationale | Alternatives Considered |
|-------|--------|-----------|------------------------|
| **Frontend** | React 18 + Vite + Tailwind + shadcn/ui | Fastest dev iteration with HMR, mature ecosystem, shadcn provides accessible unstyled primitives we own (no lock-in). Tailwind keeps CSS bundle tiny via purge. | Next.js (overkill — we don't need SSR for an SPA dashboard), Chakra UI (heavier, opinionated styling) |
| **Backend** | Node.js + Hono (edge-ready) | Ultra-lightweight (14KB), TypeScript-native first-class, runs on Vercel Edge Functions or Node seamlessly. Request/response transform pattern maps cleanly to our RESTful domain boundaries. | Express (heavier, no native edge support, callback-based middleware), Fastify (more verbose, fewer edge adapters) |
| **Database** | Supabase (PostgreSQL 15) | Managed Postgres with point-in-time recovery, built-in auth (GoTrue), real-time subscriptions via replication slots, and storage layer. Eliminates separate auth server. | Self-hosted PG (ops overhead, no built-in auth/realtime), PlanetScale (MySQL — no row-level security, no real-time) |
| **ORM** | Prisma 5 | Type-safe queries, declarative migrations, Supabase-compatible via `supabase` connection pooler. Auto-generated types flow into Hono route handlers. | Drizzle (younger ecosystem, fewer adapters), Kysely (raw SQL builder — no migrations) |
| **Auth** | Supabase Auth (magic link + Google OAuth) | Zero-config JWT issuance, RLS integration out of the box, refresh token rotation built in. Passwordless reduces phishing surface. | Clerk (expensive at scale, external dependency), Auth0 (over-engineered for our needs, $0 tier too restrictive) |
| **Email** | AWS SES (production) / SendGrid fallback | SES gives 62,000 emails/month free on EC2, sub-$0.10/1000 after. Production SES requires domain verification + SNS bounce handling. SendGrid as secondary provider for templated marketing sequences. | Gmail SMTP (500/day cap, flagged as spam, no analytics), Resend (newer, fewer compliance docs for HIPAA) |
| **Async Jobs** | Trigger.dev | First-class TypeScript SDK, auto-retry with exponential backoff, cron scheduling, webhook signature verification. Deployless — jobs run on their infra. | In-process cron (`node-cron` — no persistence, no retries, lost on restart), BullMQ (requires Redis server) |
| **File Storage** | Cloudflare R2 | S3-compatible API, zero egress fees, 10GB free. Cache via Cloudflare CDN edge. Presigned URLs for direct upload from browser (no server bottleneck). | AWS S3 (egress costs at scale), Supabase Storage (limited to 100GB free but tighter vendor lock-in) |
| **E-sign** | Dropbox Sign (HelloSign) API | Compliant with ESIGN Act + UETA, full audit trail (IP, timestamp, browser fingerprint), embedded signing iFrame for white-label UX. Embedded requests via `client_id` + template pattern. | Raw HTML Canvas (zero legal enforceability, trivial to forge), DocuSign (more expensive, heavier API) |
| **Payments** | Stripe (Checkout + Connect) | Checkout Sessions for one-time deposits/subscriptions, Payment Intents for custom flows, Connect for future multi-provider payout splitting. Webhook signature verification on `/api/webhooks/stripe`. | Braintree (fewer subscription features), Paddle (higher fee, no Connect equivalent) |
| **Hosting** | Vercel (frontend) + Railway (API) | Vercel: instant rollbacks, preview deployments per branch. Railway: simple Docker deploy, native Postgres proxy, $5/mo start. | Render (slower deploy times), Fly.io (complex networking setup) |
| **Monitoring** | Sentry (free) + Healthchecks.io (free) | Sentry: source-mapped error tracking, performance tracing. Healthchecks.io: cron job heartbeat monitoring (free 20 checks). | Datadog (prohibitively expensive for startup), Better Stack (paid uptime) |

### Stack Visual Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend SPA)                    │
│  React 18 + Vite + Tailwind + shadcn/ui + react-router 6   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  @booksmart/sdk (TypeScript client to Hono API)    │    │
│  │  @supabase/supabase-js (RLS-aware queries)         │    │
│  │  @stripe/stripe-js (Checkout redirect)             │    │
│  │  @dropbox/sign-embedded (iFrame e-sign)            │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / Supabase JWT
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Railway (Hono API — Node.js 20 LTS)               │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Middleware: auth (JWT verify), rate-limit, Zod    │    │
│  │  Routers: /api/bookings, /api/business, /api/...  │    │
│  │  Prisma ORM → Supabase Pooler (PgBouncer)         │    │
│  │  Trigger.dev SDK (job enqueue)                     │    │
│  └────────────────────────────────────────────────────┘    │
└──────┬──────────┬──────────┬──────────┬─────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐
│Supabase │ │Stripe   │ │Dropbox  │ │Cloudflare   │
│Postgres │ │API      │ │Sign API │ │R2 (files)   │
│ + Auth  │ │         │ │         │ │             │
│ +Realtime│ │Webhooks │ │Webhooks │ │Presigned    │
└─────────┘ └─────────┘ └─────────┘ │URL upload   │
       │                             └─────────────┘
       ▼
┌─────────┐
│Trigger  │
│.dev     │
│(jobs)   │
│  → AWS  │
│  SES    │
└─────────┘
```

---

## 2. System Architecture Diagram

```
                          ┌───────────────────┐
                          │   Cloudflare DNS   │
                          │  (www.booksmart   │
                          │   .app CNAME →    │
                          │   Vercel)         │
                          └────────┬──────────┘
                                   │ A
                                   ▼
                    ┌──────────────────────────┐
                    │   Vercel (React SPA)     │
                    │   • Static assets (CDN)  │
                    │   • `_rewrites` to API   │
                    │   • Preview deploys      │
                    └───────────┬──────────────┘
                                │ /api/* → Railway
                                ▼
            ┌───────────────────────────────────────┐
            │         Railway (Hono API)            │
            │  ┌─────────────────────────────────┐ │
            │  │  Rate Limiter (upstash-redis)   │ │
            │  │  Auth Middleware (JWT verify)   │ │
            │  │  Zod Validation Middleware      │ │
            │  │  Domain Routers (8 modules)     │ │
            │  │  CORS (Vercel origin only)      │ │
            │  └─────────────────────────────────┘ │
            └───┬──────┬──────┬──────┬──────┬──────┘
                │      │      │      │      │
         ┌──────┘      │      │      │      └──────────┐
         ▼             ▼      ▼      ▼                 ▼
   ┌──────────┐  ┌────────┐ ┌──────┐ ┌──────┐ ┌────────────┐
   │Supabase  │  │ Redis  │ │Stripe│ │Drop  │ │Cloudflare  │
   │(PG+Auth+ │  │(Upstash│ │API   │ │Box   │ │R2          │
   │Realtime+ │  │ Rate   │ │      │ │Sign  │ │(PDF/files) │
   │Storage)  │  │ Limit) │ │      │ │API   │ │            │
   └──────────┘  └────────┘ └──────┘ └──────┘ └────────────┘
        │                                            ▲
        │ async jobs                                 │ presigned URLs
        ▼                                            │
   ┌──────────────────────────────────────────────┐
   │            Trigger.dev (Jobs)                │
   │  • booking:confirmation-email                │
   │  • booking:reminder-24h                      │
   │  • intake:send-form                          │
   │  • waiver:request-signature                  │
   │  • waiver:check-complete                     │
   │  • business:daily-report                     │
   │  • webhook:stripe-process                    │
   └────┬─────────────────────────────────────────┘
        │
        ▼
   ┌──────────┐
   │ AWS SES  │
   │ (email)  │
   └──────────┘
```

### Data Flow — Booking Lifecycle (Example)

```
1. Client visits business booking page
   → React queries GET /api/business/:slug/availability
   → Prisma queries Supabase for staff × service × slot join
   → Returns ISO 8601 availability windows (7 days)

2. Client selects time, fills intake form, pays deposit
   → POST /api/bookings (Zod validated body)
   → Hono inserts booking + intake response in Supabase TX
   → Stripe Checkout Session created → client redirected
   → Stripe webhook → POST /api/webhooks/stripe
   → Booking status → confirmed
   → Trigger.dev enqueues confirmation-email job
   → AWS SES sends confirmation to client + business

3. 24h before appointment
   → Trigger.dev cron fires reminder-24h
   → AWS SES sends reminder with intake form link if uncompleted

4. Post-appointment
   → Waiver e-sign request via Dropbox Sign API
   → Dropbox Sign webhook → POST /api/webhooks/dropbox
   → Signed PDF saved to Cloudflare R2
   → Booking status → completed
```

---

## 3. Multi-Tenant Data Model

### Isolation Strategy: Row-Level Security (RLS)

Each row in every tenant-scoped table carries a `business_id` column (UUID, FK to `businesses.id`). Supabase RLS policies enforce that `business_id` must match the authenticated user's business membership.

This is chosen over schema-per-tenant (separate Postgres schemas per business) because:
- **Shared connection pooling** — PgBouncer works with a single schema; schema-per-tenant requires one pool per tenant or dynamic search_path switching (both problematic at scale)
- **Cross-tenant analytics** — easier with all data in one schema (with RLS filters)
- **Migration cost** — one set of migrations vs N migrations in a loop
- **RLS is benchmarked** — Supabase reports <1ms overhead per query with well-indexed policies

### Auth Flow

```
Supabase auth.users (managed by GoTrue)
       │ (FK via trigger)
       ▼
public.users (id = auth.users.id, email, name, avatar_url)
       │ (JOIN via business_members)
       ▼
public.business_members (user_id, business_id, role ['owner','admin','staff'])
       │ (RLS uses this to derive current business_id)
       ▼
public.businesses (the tenant root)
```

### RLS Policy Pattern (applied to every business-scoped table)

```sql
-- Example: bookings table
CREATE POLICY "business_owner_access" ON bookings
  FOR ALL
  USING (
    business_id IN (
      SELECT business_id FROM business_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "client_own_access" ON bookings
  FOR SELECT
  USING (
    client_email = auth.email()  -- portal access for clients
  );
```

### Core Table Relationships

```
businesses
  ├── id (UUID, PK)
  ├── slug (VARCHAR, UNIQUE)     — URL identifier
  ├── name, email, phone, address
  ├── vertical (VARCHAR)         — 'dental' | 'salon' | 'spa' | etc.
  ├── subscription_tier          — 'trial' | 'basic' | 'pro'
  ├── stripe_customer_id
  ├── stripe_subscription_id
  ├── hipaa_enabled (BOOLEAN)    — gates audit logging + encryption at rest
  ├── settings (JSONB)           — booking window, cancellation policy, etc.
  └── created_at, updated_at

business_members
  ├── id (UUID, PK)
  ├── business_id (UUID, FK → businesses)
  ├── user_id (UUID, FK → users)
  ├── role (ENUM: 'owner', 'admin', 'staff')
  └── permissions (JSONB)        — granular feature flags

staff_members
  ├── id (UUID, PK)
  ├── business_id (UUID, FK)
  ├── user_id (UUID, FK → users, nullable)
  ├── name, email, phone, color_hex
  ├── active (BOOLEAN)
  └── settings (JSONB)           — notification prefs, max_daily_bookings

staff_availability
  ├── id (UUID, PK)
  ├── staff_id (UUID, FK → staff_members)
  ├── day_of_week (INT)          — 0=Sunday
  ├── start_time (TIME)
  ├── end_time (TIME)
  ├── date_override (DATE)       — nullable, for specific-date exceptions
  └── is_available (BOOLEAN)

services
  ├── id (UUID, PK)
  ├── business_id (UUID, FK)
  ├── name, description, duration_minutes, price_cents
  ├── category_id (UUID, FK → service_categories)
  ├── requires_intake (BOOLEAN)  — gates intake form requirement
  ├── requires_waiver (BOOLEAN)  — gates e-sign requirement
  └── active (BOOLEAN)

bookings
  ├── id (UUID, PK)
  ├── business_id (UUID, FK)
  ├── staff_id (UUID, FK → staff_members)
  ├── service_id (UUID, FK → services)
  ├── client_name, client_email, client_phone
  ├── start_time (TIMESTAMPTZ)
  ├── end_time (TIMESTAMPTZ)     — computed: start + service.duration
  ├── status (ENUM)              — 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ├── deposit_amount_cents (INT, nullable)
  ├── deposit_status (ENUM)      — 'unpaid' | 'paid' | 'refunded'
  ├── stripe_session_id (VARCHAR, nullable)
  ├── notes (TEXT)
  └── metadata (JSONB)

intake_forms
  ├── id (UUID, PK)
  ├── business_id (UUID, FK)
  ├── name (VARCHAR)
  ├── service_id (UUID, FK → services, nullable)  — null = global
  ├── fields (JSONB)             — array of field definitions (see below)
  ├── active (BOOLEAN)
  └── version (INT)

intake_responses
  ├── id (UUID, PK)
  ├── booking_id (UUID, FK → bookings)
  ├── form_id (UUID, FK → intake_forms)
  ├── responses (JSONB)          — field_id → value map
  ├── completed_at (TIMESTAMPTZ)
  └── ip_address (INET)

waivers
  ├── id (UUID, PK)
  ├── business_id (UUID, FK)
  ├── name (VARCHAR)
  ├── content (TEXT)             — markdown / HTML of the waiver text
  ├── active (BOOLEAN)
  └── version (INT)

waiver_signatures
  ├── id (UUID, PK)
  ├── waiver_id (UUID, FK → waivers)
  ├── booking_id (UUID, FK → bookings)
  ├── signer_name, signer_email
  ├── dropbox_signature_request_id (VARCHAR)
  ├── signed_pdf_url (TEXT)      — R2 presigned URL
  ├── status (ENUM)              — 'pending' | 'signed' | 'declined' | 'expired'
  ├── signed_at (TIMESTAMPTZ)
  ├── ip_address (INET)
  ├── user_agent (TEXT)
  └── audit_trail (JSONB)       — full Dropbox Sign audit events
```

### Subscription Tier Gating (via RLS + Application Check)

```sql
-- Example: Pro-tier features check
-- Applied as a PostgreSQL SECURITY DEFINER function
CREATE OR REPLACE FUNCTION check_feature_access(biz_id UUID, feature TEXT)
RETURNS BOOLEAN AS $$
  SELECT CASE
    WHEN feature = 'multiple_staff' THEN
      (SELECT subscription_tier FROM businesses WHERE id = biz_id) IN ('basic', 'pro')
    WHEN feature = 'intake_forms' THEN
      (SELECT subscription_tier FROM businesses WHERE id = biz_id) = 'pro'
    WHEN feature = 'waivers' THEN
      (SELECT subscription_tier FROM businesses WHERE id = biz_id) = 'pro'
    WHEN feature = 'analytics' THEN
      (SELECT subscription_tier FROM businesses WHERE id = biz_id) IN ('basic', 'pro')
    ELSE FALSE
  END;
$$ LANGUAGE SQL STABLE;
```

At the API layer, every gated route also runs an application-level check:

```typescript
// Hono middleware pattern
const requireTier = (tier: 'basic' | 'pro') => async (c, next) => {
  const { businessId } = c.var.auth;
  const biz = await db.business.findUnique({ where: { id: businessId } });
  const tiers = { trial: 0, basic: 1, pro: 2 };
  if (tiers[biz.subscriptionTier] < tiers[tier]) {
    return c.json({ error: 'upgrade_required' }, 402);
  }
  await next();
};
```

---

## 4. API Design

### Base URL

```
Production:  https://api.booksmart.app/v1
Staging:     https://api-staging.booksmart.app/v1
Local:       http://localhost:3001/api/v1
```

### Authentication

All endpoints (except public booking pages and webhooks) require a Bearer JWT in the `Authorization` header:

```
Authorization: Bearer <supabase_access_token_JWT>
```

The JWT contains:
- `sub`: Supabase user UUID
- `aud`: `authenticated`
- `role`: Supabase role
- `business_id`: injected via custom claim from Supabase Auth hook
- `business_role`: `owner | admin | staff`

### Common Response Envelope

```typescript
// Success
{
  "data": T,
  "meta": {
    "page": number,
    "per_page": number,
    "total": number
  }  // only for paginated endpoints
}

// Error
{
  "error": {
    "code": string,        // e.g. "booking_conflict"
    "message": string,     // human-readable
    "details": unknown     // Zod validation errors, etc.
  }
}
```

### Rate Limiting

- **100 req/min** per authenticated user
- **20 req/min** per IP for public booking endpoints
- **200 req/min** for webhook endpoints (IP-whitelisted)
- Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- 429 response: `Retry-After` header with seconds
- Backend: Upstash Redis (serverless HTTP-based, no connection pool issues)

### Endpoint Reference

#### `/api/v1/business` — Business Profile & Settings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/business` | JWT | Get current user's business profile |
| PATCH | `/business` | JWT (owner) | Update business name, address, settings |
| GET | `/business/:slug` | None | Public business profile (for booking page) |
| GET | `/business/:slug/services` | None | Public services list |
| GET | `/business/:slug/staff` | None | Public staff list |
| GET | `/business/:slug/availability` | None | Available slots (query: `?date=&staff_id=&service_id=`) |
| POST | `/business/upload-logo` | JWT | Upload logo to R2 → return URL |

#### `/api/v1/staff` — Staff Management

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/staff` | JWT | List staff for business |
| POST | `/staff` | JWT (admin+) | Create staff member |
| PATCH | `/staff/:id` | JWT (admin+) | Update staff details |
| DELETE | `/staff/:id` | JWT (owner) | Deactivate staff |
| GET | `/staff/:id/availability` | JWT | Get staff schedule |
| PUT | `/staff/:id/availability` | JWT (admin+) | Bulk set weekly schedule |

#### `/api/v1/services` — Service Management

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/services` | JWT | List services (query: `?category_id=&active=`) |
| POST | `/services` | JWT (admin+) | Create service |
| PATCH | `/services/:id` | JWT (admin+) | Update service |
| DELETE | `/services/:id` | JWT (owner) | Deactivate service |
| GET | `/services/categories` | JWT | List categories |
| POST | `/services/categories` | JWT (admin+) | Create category |

#### `/api/v1/bookings` — Booking CRUD & Availability

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/bookings` | JWT | List bookings (query: `?status=&date=&staff_id=`) |
| GET | `/bookings/:id` | JWT | Single booking detail |
| POST | `/bookings` | None | Create booking (public) |
| PATCH | `/bookings/:id` | JWT | Update booking (reschedule, cancel) |
| DELETE | `/bookings/:id` | JWT (admin+) | Cancel booking |
| GET | `/bookings/:id/intake` | JWT | Get associated intake responses |
| POST | `/bookings/:id/confirm` | JWT | Manually confirm (waive deposit) |
| POST | `/bookings/:id/cancel` | JWT | Cancel with reason |
| POST | `/bookings/check-availability` | None | Check slot availability (body: `{staff_id, service_id, date}`) |

**Availability Algorithm:**
```
1. Load staff_availability for given staff_id + day_of_week
2. Load any date_overrides for the specific date
3. Load existing bookings for that date (confirmed + pending)
4. For each block, subtract booked slot durations
5. Return remaining windows in ISO 8601 intervals
```

#### `/api/v1/clients` — Client Management & Portal

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/clients` | JWT | List clients (query: `?search=&phone=&email=`) |
| GET | `/clients/:id` | JWT | Single client with booking history |
| PATCH | `/clients/:id` | JWT | Update client notes |
| POST | `/clients/portal/login` | None | Send magic link to client email |
| GET | `/clients/portal/bookings` | JWT (client) | Client's own bookings |

#### `/api/v1/intake` — Intake Forms

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/intake/forms` | JWT | List intake forms |
| POST | `/intake/forms` | JWT (pro) | Create form |
| GET | `/intake/forms/:id` | JWT | Get form with fields |
| PATCH | `/intake/forms/:id` | JWT (pro) | Update form |
| DELETE | `/intake/forms/:id` | JWT (pro) | Archive form |
| POST | `/intake/forms/:id/submit` | None | Submit intake response (requires booking ref) |
| GET | `/intake/responses/:bookingId` | JWT | Get responses for a booking |

**Intake Field Schema (stored in `intake_forms.fields` JSONB):**
```typescript
type IntakeField = {
  id: string;             // UUID
  type: 'text' | 'textarea' | 'select' | 'multi_select' | 'date' | 'phone' | 'email'
      | 'file' | 'signature' | 'checkbox' | 'radio' | 'address';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];     // for select/multi_select/radio
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;     // regex
  };
  conditional?: {
    fieldId: string;
    value: string;
  };
  order: number;
};
```

#### `/api/v1/waivers` — E-sign Flow

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/waivers` | JWT | List waiver templates |
| POST | `/waivers` | JWT (pro) | Create waiver template |
| PATCH | `/waivers/:id` | JWT (pro) | Update waiver content |
| POST | `/waivers/:id/request` | JWT | Request signature for a booking |
| GET | `/waivers/signatures/:bookingId` | JWT | Get signature status + signed PDF URL |
| POST | `/waivers/webhook/dropbox` | None | Dropbox Sign callback (signature completed) |

**E-sign Flow Steps:**
```
1. Business creates waiver template (markdown → rendered PDF via Puppeteer or API)
2. POST /waivers/:id/request → calls Dropbox Sign API signature_request.create_embedded
3. Returns sign_url → frontend opens Dropbox Sign iFrame
4. Client signs → Dropbox Sign webhook POSTs to /waivers/webhook/dropbox
5. API validates webhook HMAC signature, downloads signed PDF to R2
6. Updates waiver_signatures record with status + PDF URL + full audit trail
```

#### `/api/v1/webhooks` — Third-party Webhooks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/webhooks/stripe` | Stripe signature | Payment confirmations, subscription events |
| POST | `/webhooks/dropbox` | Dropbox signature | Signature request completed/declined |
| POST | `/webhooks/ses` | SNS notification | Bounce, complaint, delivery |

**Webhook security:**
- Stripe: `stripe-webhook-signature` verification with `stripe.webhooks.constructEvent()`
- Dropbox Sign: HMAC-SHA256 signature verification
- SES: SNS subscription confirmation + topic ARN allowlist
- All webhook handlers return 200 immediately, enqueue Trigger.dev job for processing

#### `/api/v1/admin` — Dashboard & Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/stats` | JWT | Booking counts, revenue, conversion (query: `?period=7d|30d|90d`) |
| GET | `/admin/revenue` | JWT | Revenue breakdown by service, staff |
| GET | `/admin/analytics/intake-completion` | JWT | Intake form completion rates |
| GET | `/admin/audit-log` | JWT (owner) | Recent activity within business |

### Error Handling Conventions

```typescript
// Standardized error codes used across all endpoints
const ERROR_CODES = {
  VALIDATION_ERROR:     { status: 400, code: 'validation_error' },
  UNAUTHORIZED:         { status: 401, code: 'unauthorized' },
  FORBIDDEN:            { status: 403, code: 'forbidden' },
  NOT_FOUND:            { status: 404, code: 'not_found' },
  BOOKING_CONFLICT:     { status: 409, code: 'booking_conflict' },
  RATE_LIMITED:         { status: 429, code: 'rate_limited' },
  UPGRADE_REQUIRED:     { status: 402, code: 'upgrade_required' },   // tier gating
  STRIPE_ERROR:         { status: 502, code: 'stripe_error' },
} as const;

// Hono error handler middleware
app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({ error: { code: 'validation_error', message: 'Invalid request', details: err.errors } }, 400);
  }
  if (err instanceof BookingConflictError) {
    return c.json({ error: { code: 'booking_conflict', message: err.message } }, 409);
  }
  // ... sentry.captureException(err) in production
  return c.json({ error: { code: 'internal_error', message: 'Something went wrong' } }, 500);
});
```

---

## 5. Key Architectural Decisions (ADRs)

---

### ADR-001: Supabase over Self-Hosted PostgreSQL

**Status:** Accepted  
**Context:** Need a managed database with auth, file storage, and real-time capabilities.

**Decision:** Use Supabase (managed PostgreSQL 15) as the primary data store.

**Consequences:**
- **Positive:** Built-in user management (GoTrue) eliminates a separate auth service. Row-Level Security is enforced at the database level, not just the application layer. Real-time subscriptions via Postgres replication slots remove the need for a separate WebSocket server for live availability updates. Daily automated backups with point-in-time recovery are included.
- **Negative:** Vendor lock-in risk — if Supabase goes down, we lose auth + DB + real-time simultaneously. Connection pooling via PgBouncer can cause issues with prepared statements (solved by using `?pgbouncer=true` connection string and avoiding session-level features).
- **Mitigation:** Schema is plain PostgreSQL — we can migrate to any Postgres provider (RDS, Aurora, Neon) with minimal changes. Auth uses standard JWTs we could issue ourselves.

**Alternatives Rejected:**
- Self-hosted PostgreSQL on a VPS: ~$20–40/mo for comparable specs but requires manual patching, backup config, replication setup, and we'd need a separate auth server (Supabase Auth, Auth0, or Clerk).
- Neon: Serverless Postgres with branching — excellent for preview deploys, but no built-in auth or storage layer.

---

### ADR-002: Hono over Express

**Status:** Accepted  
**Context:** Need a TypeScript-native HTTP framework that can run on both Node.js and edge runtimes (for future Vercel Edge Function migration of specific routes).

**Decision:** Use Hono (v4.x) as the HTTP framework for the API layer.

**Consequences:**
- **Positive:** 14KB bundle size vs Express's 200KB+. First-class TypeScript support (inferring path params, query strings). Runs identically on Node.js, Vercel Edge, Cloudflare Workers, and Deno — future-proofing edge deployment. Built-in JWT middleware, CORS, and request validation patterns. `c.json()` is typesafe without manual typing.
- **Negative:** Smaller ecosystem than Express — fewer community middleware packages. Some Express patterns (e.g., `req.user`) don't translate directly; must use `c.set('user', ...)`.
- **Mitigation:** Since we control all middleware, we don't need community middleware. Our auth middleware is straightforward JWT verification.

**Alternatives Rejected:**
- Express: Heavily callback-based, requires manual TypeScript wrappers, no edge runtime support without `@vercel/functions` adapter boilerplate.
- Fastify: Faster than Express, but plugin system is verbose, and edge runtime support is limited.

---

### ADR-003: Dropbox Sign API over Raw HTML Canvas E-sign

**Status:** Accepted  
**Context:** E-signatures must be legally enforceable under ESIGN Act and UETA.

**Decision:** Use Dropbox Sign (HelloSign) API for all e-signature functionality.

**Consequences:**
- **Positive:** Full legal compliance — Dropbox Sign provides IP tracking, timestamping, browser fingerprint, and cryptographic audit trail. Embedded signing via iFrame gives a white-label experience. API handles PDF generation from templates, signature field placement, and signature request lifecycle. Webhook callbacks for real-time status updates.
- **Negative:** $15/month minimum (API plan, 5 signature requests included). API rate limit of 10 req/sec on standard plan.
- **Mitigation:** E-sign is a Pro-tier feature ($497/mo) — the cost is absorbed by the subscription price. For businesses sending <50 signatures/month, the API plan cost is negligible.

**Alternatives Rejected:**
- **Raw HTML Canvas e-signature:** A user drawing their name on a `<canvas>` element. Zero legal enforceability — anyone can forge a signature pixel-for-pixel with browser DevTools. No audit trail, no timestamping, no IP tracking. Would be rejected in any legal proceeding. **This is a hard no.**
- DocuSign: More expensive ($40+/mo), heavier API surface, longer integration time.

---

### ADR-004: AWS SES over Gmail SMTP

**Status:** Accepted  
**Context:** Need reliable email delivery for booking confirmations, reminders, and marketing. Cannot risk emails landing in spam or being capped at 500/day.

**Decision:** Use AWS SES (production) as primary email provider with SendGrid as fallback.

**Consequences:**
- **Positive:** 62,000 emails/month free when sending from EC2 (Railway will need to configure SMTP credentials with SES). Sub-$0.10/1000 after the free tier. High deliverability — SES has direct relationships with major ISPs. Dedicated IP pool available for high-volume senders. Bounce and complaint handling via SNS webhooks (we handle these in `/api/webhooks/ses`).
- **Negative:** Requires domain verification + DKIM setup (TXT records). Sandbox mode limits to verified emails only until production access is granted (must submit SES Sending Limit Increase request). No built-in email templates — we must manage our own (via SendGrid template API or React Email for Trigger.dev rendering).
- **Mitigation:** We request SES production access during week 1 of the build. For early development, SendGrid free tier (100 emails/day) suffices. Email templates are built with React Email (JSX → HTML) and stored in the repo.

**Alternatives Rejected:**
- **Gmail SMTP:** 500 emails/day cap, quickly triggers Google's spam detection for bulk sending, no bounce processing API, no sending analytics. Would fail at any scale beyond a single-location dental practice.
- Resend: Novel but lacks HIPAA BAA (business associate agreement) for dental vertical.

---

### ADR-005: Trigger.dev over In-Process Cron

**Status:** Accepted  
**Context:** Need reliable background job processing for email reminders, webhook handling, and scheduled reports. Cannot lose jobs on server restart.

**Decision:** Use Trigger.dev (managed job queue) for all asynchronous and scheduled tasks.

**Consequences:**
- **Positive:** Jobs are persisted to Trigger.dev's Postgres and retried with exponential backoff on failure. TypeScript SDK allows us to write jobs in the same repo with full type safety. Cron scheduling is declarative. Webhook signature verification built in. Free tier includes 1000 job runs/month.
- **Negative:** External dependency — if Trigger.dev is down, we can't process emails or reminders. Cold start on free tier (~500ms). Premium tier costs $30/mo for higher concurrency.
- **Mitigation:** We run a health check to Trigger.dev's API. For critical path (booking confirmation emails), we add a fallback: if Trigger.dev enqueue fails, we send the email synchronously (with a performance warning logged). On failure, we store the job in a `failed_jobs` table for manual retry.

**Alternatives Rejected:**
- **In-process cron with `node-cron`:** No persistence — jobs are lost on process restart. No retry logic. No visibility into job status. Would require building a job queue from scratch (Redis + worker pattern).
- BullMQ: Requires Redis server — additional infrastructure cost. More complex job definition than Trigger.dev's declarative approach.

---

### ADR-006: Multi-Tenant RLS over Schema-Per-Tenant

**Status:** Accepted  
**Context:** Must isolate tenant data while keeping operational complexity low. Need clean cross-tenant analytics in future.

**Decision:** Single shared schema with `business_id` on every row + Supabase RLS for row-level isolation.

**Consequences:**
- **Positive:** Single set of migrations. PgBouncer connection pooling works natively (no dynamic `search_path` switching). Cross-tenant queries (admin analytics, aggregate reporting) are straightforward — just omit the RLS filter. Adding a new tenant is creating a row in `businesses`, not a new schema.
- **Negative:** RLS policy performance depends on index coverage — every query must filter by `business_id` (ensure it's indexed). One misconfigured RLS policy could leak data across tenants. Harder to physically separate tenant data for compliance (e.g., if a tenant requires deletion, we must cascade-delete by `business_id`).
- **Mitigation:** Every table has a composite index on `(business_id, id)`. RLS policies are tested in CI via Supabase local development. Deletion scripts are parameterized by `business_id` and tested in staging.

**Alternatives Rejected:**
- **Schema-per-tenant:** Each tenant gets their own Postgres schema (`business_abc123.bookings`). Requires dynamic `search_path` switching per request (problematic with PgBouncer transaction pooling). Migrations must be applied N times (or looped). Cross-tenant queries require `UNION ALL` across schemas. Operational complexity does not scale for our target of 50–100 initial tenants.
- Separate database per tenant: Extreme isolation but impossible to manage at our scale. Connection pool exhaustion risk.

---

### ADR-007: Stripe Checkout over Custom Payment Flow

**Status:** Accepted  
**Context:** Need a secure, PCI-compliant way to collect deposits and manage subscriptions.

**Decision:** Use Stripe Checkout Sessions for all payment flows. Use Stripe Connect as the future platform model.

**Consequences:**
- **Positive:** PCI SA A compliance is handled entirely by Stripe — we never touch raw card numbers. Checkout handles all payment methods (cards, Apple Pay, Google Pay, Link) automatically. Built-in email receipts, refunds, and dispute handling. Subscription management with proration and dunning emails is built in. Session mode allows differentiating between `payment` (one-time deposit) and `subscription` (SaaS billing).
- **Negative:** Redirect to Stripe's hosted checkout page creates a UX boundary (user leaves our app during booking). Less control over the UI compared to Stripe Elements. Webhook events must be idempotent (Stripe may deliver the same event multiple times).
- **Mitigation:** Checkout `return_url` returns the user to our booking confirmation page after payment. We style the Checkout page with `brand_color` and `logo` via Stripe's branding settings. Webhook handlers use Stripe's `Idempotency-Key` header to deduplicate processing. Future migration to Stripe Elements or Payment Element is possible if we need a fully embedded flow, but Checkout is the safest starting point.

**Alternatives Rejected:**
- **Custom payment flow with Stripe Elements:** Requires more frontend complexity, full PCI SA A compliance scope, and we must handle 3D Secure authentication ourselves. Better for subscription checkouts but not worth the compliance burden at launch.
- **Lemon Squeezy:** Simpler but fewer payment method options, no Connect equivalent for future marketplace features.

---

## 6. Security Architecture

### 6.1 HTTPS & TLS

- All traffic enforces TLS 1.3 via Cloudflare (edge termination) and Vercel/Railway.
- HSTS header: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- API hosted on Railway with auto-provisioned SSL via `*.railway.app` or custom domain with Let's Encrypt.

### 6.2 Authentication & Authorization

```
Request Flow:
─────────────
1. User logs in via Supabase Auth (magic link or Google OAuth)
2. Supabase issues JWT with custom claims (business_id, role)
3. Every API request includes: Authorization: Bearer <JWT>
4. Hono middleware verifies JWT:
   - Signature validation via Supabase JWKS endpoint
   - Expiration check (JWT expires in 1 hour, refresh token rotation)
   - business_id claim extraction → c.set('businessId', ...)
5. Prisma queries implicitly filtered by business_id via middleware
6. Supabase RLS acts as defense-in-depth (DB-level enforcement)
```

### 6.3 Row-Level Security (Defense in Depth)

All business-scoped tables have RLS enabled. Policies are tested in CI:

```sql
-- Every migration includes RLS policy tests:
BEGIN;
  -- Set up test context
  SELECT set_config('request.jwt.claims', '{"sub":"test-user-id"}', TRUE);

  -- Should succeed: user is member of business A
  INSERT INTO bookings (business_id, ...) VALUES ('business-a', ...);

  -- Should fail: user is not member of business B
  INSERT INTO bookings (business_id, ...) VALUES ('business-b', ...); -- ERROR

ROLLBACK;
```

### 6.4 API Rate Limiting

| Endpoint Type | Limit | Burst | Backend |
|---------------|-------|-------|---------|
| Authenticated API | 100 req/min | 150 | Upstash Redis (sliding window) |
| Public booking | 20 req/min per IP | 30 | Upstash Redis |
| Webhooks (Stripe, Dropbox) | 200 req/min per IP | 300 | IP allowlist + rate limit |
| Intake form submission | 10 req/min per IP | 15 | Upstash Redis |

### 6.5 Input Validation

Every mutation endpoint uses Zod schemas for request body validation:

```typescript
const createBookingSchema = z.object({
  businessId: z.string().uuid(),
  staffId: z.string().uuid(),
  serviceId: z.string().uuid(),
  startTime: z.string().datetime(),
  clientName: z.string().min(1).max(100).trim(),
  clientEmail: z.string().email().toLowerCase(),
  clientPhone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/),
  notes: z.string().max(1000).optional(),
});

// In Hono route
app.post('/api/v1/bookings', zodValidator(createBookingSchema), async (c) => {
  const body = c.req.valid('json');
  // body is fully typed
});
```

### 6.6 E-sign Security (Dropbox Sign)

- Audit trail captured on every signature:
  - Signer IP address, user agent, browser language
  - Timestamp of every event (opened, viewed, signed)
  - Cryptographic hash of signed document
- PDF stored in Cloudflare R2 with server-side encryption at rest
- Signed PDF URL is a presigned URL with 1-hour expiry — never public
- Dropbox Sign webhooks verified via HMAC-SHA256 signature header

### 6.7 HIPAA Considerations (Dental Vertical)

For businesses in the `dental` vertical, the following additional measures apply:

1. **Business Associate Agreement (BAA):** Required with all sub-processors:
   - Supabase (offers BAA on Pro plan)
   - Cloudflare R2 (enterprise BAA available)
   - Stripe (BA available)
   - AWS (BA available via AWS Artifact)
   - Railway (BA available on request)
2. **Audit logging:** All access to PHI (patient health information) is logged to `audit_log` table:
   ```sql
   CREATE TABLE audit_log (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     business_id UUID REFERENCES businesses(id),
     actor_id UUID REFERENCES users(id),
     action VARCHAR(50),           -- 'read', 'create', 'update', 'delete'
     table_name VARCHAR(50),
     record_id UUID,
     old_values JSONB,
     new_values JSONB,
     ip_address INET,
     user_agent TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. **Encryption at rest:** Supabase encrypts data at rest via AWS EBS encryption (all plans). Cloudflare R2 uses AES-256 server-side encryption.
4. **Encryption in transit:** TLS 1.3 enforced across all services.
5. **Data access controls:** Strict RLS + role-based access within the business (owner vs admin vs staff). Staff cannot view PHI of clients they aren't assigned to.
6. **Data retention:** Automated purge of PHI after configurable retention period (default: 7 years per HIPAA, configurable per business).
7. **Session timeout:** Automatic logout after 30 minutes of inactivity for HIPAA-enabled businesses.

### 6.8 Secret Management

- No secrets in code. All secrets stored in Railway environment variables.
- Supabase connection string includes session-level session variables for RLS.
- Stripe API keys, Dropbox Sign API keys, SES SMTP credentials — all env vars.
- Trigger.dev API key stored as Railway secret.
- Rotations performed via Railway dashboard with zero-downtime redeploy.

---

## 7. Performance Considerations

### 7.1 Booking Availability Queries

The availability query is the most performance-critical path — it runs on every booking page load.

**Naive approach (slow):**
```sql
-- Load all staff, services, existing bookings, availability rules
-- Combine in application memory
SELECT * FROM staff_members WHERE business_id = $1;
SELECT * FROM staff_availability WHERE staff_id IN (...);
SELECT * FROM bookings WHERE business_id = $1 AND date = $2;
```
This loads significant data and does slot math in Node.js — O(n²) for each staff-service combo.

**Optimized approach (implemented):**
```sql
-- Single query with lateral join computes available slots in-database
SELECT
  s.id AS staff_id,
  ser.id AS service_id,
  avail.start_time,
  avail.end_time
FROM staff_members s
CROSS JOIN services ser
CROSS JOIN LATERAL (
  SELECT sa.start_time, sa.end_time
  FROM staff_availability sa
  WHERE sa.staff_id = s.id
    AND sa.day_of_week = EXTRACT(DOW FROM $2::date)
    AND (sa.date_override IS NULL OR sa.date_override = $2::date)
    AND sa.is_available = true
) avail
WHERE s.business_id = $1
  AND ser.business_id = $1
  AND ser.id = $3  -- specific service
  AND s.active = true
  AND NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.staff_id = s.id
      AND b.business_id = $1
      AND b.date = $2::date
      AND b.status IN ('confirmed', 'pending')
      AND b.start_time < avail.end_time
      AND b.end_time > avail.start_time
  );
```

**Caching strategy:**
- **No stale cache** — availability changes in real time (a booking could be made while the client is browsing). However, we cache the staff + availability data (which changes infrequently) in Redis with a 5-minute TTL.
- **Materialized view for read-heavy schedules:** For businesses with high booking volume (>50/day), we optionally create a materialized view of availability blocks refreshed every 60 seconds. Triggered via `pg_cron` or a Trigger.dev scheduled job.
- **Supabase Realtime** subscribes to `bookings` INSERT/DELETE on the current date for live slot updates during active booking flow.

### 7.2 N+1 Query Prevention

Prisma's `include` and `select` are used to batch-load relations:

```typescript
// ❌ N+1
const bookings = await prisma.booking.findMany({ where: { businessId } });
for (const b of bookings) {
  const service = await prisma.service.findUnique({ where: { id: b.serviceId } });
}

// ✅ Single query
const bookings = await prisma.booking.findMany({
  where: { businessId },
  include: {
    service: true,
    staff: true,
    client: true,
    intakeResponse: true,
  },
});
```

For list endpoints, we use **Prisma's `select` to fetch only needed columns** and **batch loading** via DataLoader for nested queries:

```typescript
// DataLoader pattern for resolving business members
const memberLoader = new DataLoader(async (businessIds: string[]) => {
  const members = await prisma.businessMember.findMany({
    where: { businessId: { in: [...businessIds] } },
  });
  return businessIds.map(id => members.filter(m => m.businessId === id));
});
```

### 7.3 Database Indexing Strategy

```sql
-- Core indexes (applied in initial migration)
CREATE INDEX idx_bookings_business_date ON bookings(business_id, start_time);
CREATE INDEX idx_bookings_staff_date ON bookings(staff_id, start_time);
CREATE INDEX idx_bookings_client_email ON bookings(client_email);
CREATE INDEX idx_bookings_status ON bookings(business_id, status);

CREATE INDEX idx_staff_availability_staff_day ON staff_availability(staff_id, day_of_week);
CREATE INDEX idx_staff_availability_override ON staff_availability(staff_id, date_override);

CREATE INDEX idx_services_business ON services(business_id, active);
CREATE INDEX idx_services_category ON services(category_id);

CREATE INDEX idx_business_members_user ON business_members(user_id);
CREATE INDEX idx_business_members_business ON business_members(business_id);

CREATE INDEX idx_intake_responses_booking ON intake_responses(booking_id);
CREATE INDEX idx_waiver_signatures_booking ON waiver_signatures(booking_id, status);

CREATE INDEX idx_business_slug ON businesses(slug);

-- Partial index for active bookings only (query optimization)
CREATE INDEX idx_active_bookings ON bookings(business_id, start_time)
  WHERE status IN ('pending', 'confirmed');
```

### 7.4 Image & Asset Optimization

- **Logos & business images:** Uploaded to Cloudflare R2 → transformed via Cloudflare Images (resize to 400×400, WebP format, auto-quality).
- **Booking page:** Static assets (React bundle, Tailwind CSS) served via Vercel CDN edge. Cache headers: `Cache-Control: public, max-age=31536000, immutable` for hashed file names.
- **Fonts:** Self-hosted via Vercel to avoid external font loading delay.
- **Lazy loading:** Routes code-split via `React.lazy()` + `Suspense`. Booking widget (the most performance-sensitive page) is loaded synchronously for instant interaction.

### 7.5 API Response Optimization

- **Pagination:** All list endpoints use cursor-based pagination (`cursor` + `limit`) instead of offset-based, avoiding the "OFFSET drift" problem on high-traffic tables.
- **Compression:** Railway API enables Brotli compression (accept-encoding: br) — ~70% reduction in JSON response size.
- **Partial responses:** Clients can request specific fields via `?fields=id,name,email` query parameter (implemented via a `selectFields` utility that maps to Prisma `select`).

```typescript
// Cursor pagination pattern
app.get('/api/v1/bookings', async (c) => {
  const { cursor, limit, status } = c.req.query();
  const bookings = await prisma.booking.findMany({
    take: parseInt(limit || '20') + 1,  // fetch +1 to detect next page
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { startTime: 'desc' },
    where: { businessId: c.var.businessId, status },
    include: { service: true },
  });
  const hasMore = bookings.length > parseInt(limit || '20');
  const items = hasMore ? bookings.slice(0, -1) : bookings;
  return c.json({
    data: items,
    meta: {
      nextCursor: hasMore ? items[items.length - 1].id : null,
      hasMore,
    },
  });
});
```

---

## 8. Deployment Architecture

### 8.1 Environment Strategy

| Environment | Domain | Vercel Project | Railway Project | DB (Supabase) | Purpose |
|-------------|--------|----------------|-----------------|---------------|---------|
| **dev** | `dev.booksmart.app` | `booksmart-dev` | `api-dev` | `sb-dev` | Developer daily builds |
| **staging** | `staging.booksmart.app` | `booksmart-staging` | `api-staging` | `sb-staging` | QA + client demos |
| **prod** | `app.booksmart.app` | `booksmart-prod` | `api-prod` | `sb-prod` | Production |

Each environment has:
- Isolated Supabase project (separate PG instance)
- Separate Stripe test/prod keys
- Separate AWS SES (sandbox/production)
- Separate Cloudflare R2 bucket
- Separate Dropbox Sign API plan

### 8.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, staging, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint              # ESLint + Prettier
      - run: npm run typecheck          # tsc --noEmit
      - run: npm run test               # Vitest

  deploy-api:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railway/action@v4
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api-${{ github.ref_name }}

  deploy-frontend:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        # Different project per branch via Vercel CLI

  migrate-db:
    needs: deploy-api
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets[format('DATABASE_URL_{0}', github.ref_name)] }}
```

### 8.3 Database Migration Strategy

```bash
# Development — create migration from schema changes
npx prisma migrate dev --name add_intake_forms

# CI — apply migrations in order
npx prisma migrate deploy

# Emergency rollback
npx prisma migrate resolve --rolled-back <migration_name>
```

**Migration safety practices:**
- All migrations are reviewed in PR (SQL is visible in the `migrations/` directory)
- Destructive operations (DROP, ALTER COLUMN TYPE) require explicit approval
- Staging migrations are applied first, verified, then promoted to production
- Zero-downtime deploys: Prisma runs `CREATE TABLE CONCURRENTLY` pattern for new tables, `CREATE INDEX CONCURRENTLY` to avoid lock contention
- Deployments: API pods are upgraded one at a time (Railway health check grace period: 30s)

### 8.4 Backup & Disaster Recovery

| Component | Backup Strategy | RPO | RTO |
|-----------|----------------|-----|-----|
| Supabase PG | Automated daily backups (7-day retention) + PITR (30 days on Pro plan) | 5 min (WAL archiving) | 30 min |
| Business assets (logos) | Cloudflare R2 versioning enabled | Real-time | 5 min |
| Signed PDFs | Cloudflare R2 versioning + cross-region replication (PROD only) | Real-time | 5 min |
| Environment variables | Railway dashboard encrypted export | Manual (on change) | 15 min |
| Git repository | GitHub with branch protection | Real-time | 5 min |

**Disaster recovery playbook:**
1. Database corruption: Restore from Supabase PITR to new project, update `DATABASE_URL` env var, redeploy.
2. Full region outage: Deploy frontend to alternate region (Vercel auto-global), spin up API on Railway US/EU region, point Supabase to cross-region read replica.
3. Third-party API outage (Stripe/Dropbox/SES): Graceful degradation — booking still works without payments (mark as `pending_deposit`), intake forms work without e-sign (mark as `signature_pending`).

### 8.5 Supabase Backup to R2 (Daily)

A Trigger.dev cron job exports the database to R2:

```typescript
// Trigger.dev job: db-backup
import { cron } from '@trigger.dev/sdk';

cron({
  id: 'daily-db-backup',
  schedule: '0 3 * * *', // 3 AM daily
  run: async () => {
    const { execa } = await import('execa');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `backups/${timestamp}-booksmart.sql.gz`;

    // pg_dump to stdout → gzip → upload to R2
    const dump = execa('pg_dump', [
      '--no-owner',
      '--no-acl',
      '--format=custom',
      process.env.DATABASE_URL,
    ]);

    const upload = await fetch(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/booksmart-backups/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `AWS4-HMAC-SHA256 ...`,  // Signed via @aws-sdk/client-s3
        'Content-Type': 'application/octet-stream',
      },
      body: dump.stdout,
    });

    // Cleanup: delete backups older than 30 days
    await cleanupOldBackups();
  },
});
```

---

## 9. Appendix: Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  relationMode = "foreignKeys"
}

// ─── Auth / Users ───────────────────────────────────────────

model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String   @unique
  name      String?
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  memberships BusinessMember[]
  bookings    Booking[]         @relation("BookingClient")

  @@map("users")
}

// ─── Multi-Tenant ──────────────────────────────────────────

model Business {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  slug                String   @unique
  name                String
  email               String?
  phone               String?
  address             String?
  vertical            String   @default("general") // dental, salon, spa, general
  subscriptionTier    String   @default("trial")   // trial, basic, pro
  stripeCustomerId    String?  @unique @map("stripe_customer_id")
  stripeSubscriptionId String? @map("stripe_subscription_id")
  hipaaEnabled        Boolean  @default(false) @map("hipaa_enabled")
  settings            Json?    @default("{}")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  members       BusinessMember[]
  staff         StaffMember[]
  services      Service[]
  bookings      Booking[]
  intakeForms   IntakeForm[]
  waivers       Waiver[]
  auditLogs     AuditLog[]

  @@map("businesses")
}

model BusinessMember {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId String   @map("business_id")
  userId     String   @map("user_id")
  role       String   @default("staff") // owner, admin, staff
  permissions Json?   @default("{}")
  createdAt  DateTime @default(now()) @map("created_at")

  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([businessId, userId])
  @@map("business_members")
}

// ─── Staff ─────────────────────────────────────────────────

model StaffMember {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId String   @map("business_id")
  userId     String?  @map("user_id")
  name       String
  email      String
  phone      String?
  colorHex   String?  @map("color_hex")
  active     Boolean  @default(true)
  settings   Json?    @default("{}")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  business     Business            @relation(fields: [businessId], references: [id], onDelete: Cascade)
  availability StaffAvailability[]
  bookings     Booking[]

  @@map("staff_members")
}

model StaffAvailability {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  staffId     String   @map("staff_id")
  dayOfWeek   Int      @map("day_of_week") // 0=Sunday
  startTime   DateTime @map("start_time")  // TIME stored as DateTime
  endTime     DateTime @map("end_time")
  dateOverride DateTime? @map("date_override") // specific date exception
  isAvailable Boolean  @default(true) @map("is_available")

  staff StaffMember @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@index([staffId, dayOfWeek])
  @@index([staffId, dateOverride])
  @@map("staff_availability")
}

// ─── Services ──────────────────────────────────────────────

model Service {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId      String   @map("business_id")
  name            String
  description     String?
  durationMinutes Int      @map("duration_minutes")
  priceCents      Int      @map("price_cents")
  categoryId      String?  @map("category_id")
  requiresIntake  Boolean  @default(false) @map("requires_intake")
  requiresWaiver  Boolean  @default(false) @map("requires_waiver")
  active          Boolean  @default(true)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  business Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)
  category ServiceCategory? @relation(fields: [categoryId], references: [id])
  bookings Booking[]
  intakeForms IntakeForm[]

  @@index([businessId, active])
  @@map("services")
}

model ServiceCategory {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId String   @map("business_id")
  name       String
  order      Int      @default(0)
  createdAt  DateTime @default(now()) @map("created_at")

  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  services Service[]

  @@unique([businessId, name])
  @@map("service_categories")
}

// ─── Bookings ──────────────────────────────────────────────

model Booking {
  id                String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId        String    @map("business_id")
  staffId           String    @map("staff_id")
  serviceId         String    @map("service_id")
  clientName        String    @map("client_name")
  clientEmail       String    @map("client_email")
  clientPhone       String?   @map("client_phone")
  startTime         DateTime  @map("start_time")
  endTime           DateTime  @map("end_time")
  status            String    @default("pending") // pending, confirmed, cancelled, completed, no_show
  depositAmountCents Int?     @map("deposit_amount_cents")
  depositStatus     String?   @default("unpaid")  // unpaid, paid, refunded
  stripeSessionId   String?   @map("stripe_session_id")
  notes             String?
  metadata          Json?     @default("{}")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  business       Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)
  staff          StaffMember      @relation(fields: [staffId], references: [id])
  service        Service          @relation(fields: [serviceId], references: [id])
  client         User?            @relation("BookingClient", fields: [clientEmail], references: [email])
  intakeResponse IntakeResponse[]
  waiverSignatures WaiverSignature[]

  @@index([businessId, startTime])
  @@index([staffId, startTime])
  @@index([clientEmail])
  @@index([businessId, status])
  @@map("bookings")
}

// ─── Intake Forms ──────────────────────────────────────────

model IntakeForm {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId String   @map("business_id")
  name       String
  serviceId  String?  @map("service_id")
  fields     Json     @default("[]") // Array<IntakeField>
  active     Boolean  @default(true)
  version    Int      @default(1)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  business Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  service  Service?  @relation(fields: [serviceId], references: [id])

  @@map("intake_forms")
}

model IntakeResponse {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  bookingId   String   @map("booking_id")
  formId      String   @map("form_id")
  responses   Json     @default("{}") // Map<fieldId, value>
  completedAt DateTime @map("completed_at")
  ipAddress   String?  @map("ip_address") @db.Inet

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  form    IntakeForm @relation(fields: [formId], references: [id])

  @@unique([bookingId, formId])
  @@map("intake_responses")
}

// ─── Waivers & E-sign ──────────────────────────────────────

model Waiver {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId String   @map("business_id")
  name       String
  content    String   // markdown/HTML waiver text
  active     Boolean  @default(true)
  version    Int      @default(1)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  business   Business          @relation(fields: [businessId], references: [id], onDelete: Cascade)
  signatures WaiverSignature[]

  @@map("waivers")
}

model WaiverSignature {
  id                       String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  waiverId                 String    @map("waiver_id")
  bookingId                String    @map("booking_id")
  signerName               String    @map("signer_name")
  signerEmail              String    @map("signer_email")
  dropboxSignatureRequestId String?  @map("dropbox_signature_request_id")
  signedPdfUrl             String?   @map("signed_pdf_url") // R2 presigned URL
  status                   String    @default("pending")    // pending, signed, declined, expired
  signedAt                 DateTime? @map("signed_at")
  ipAddress                String?   @map("ip_address") @db.Inet
  userAgent                String?   @map("user_agent")
  auditTrail               Json?     @map("audit_trail")    // Dropbox Sign audit events
  createdAt                DateTime  @default(now()) @map("created_at")

  waiver  Waiver  @relation(fields: [waiverId], references: [id], onDelete: Cascade)
  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([bookingId, status])
  @@map("waiver_signatures")
}

// ─── Audit Log ─────────────────────────────────────────────

model AuditLog {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId String   @map("business_id")
  actorId    String   @map("actor_id")
  action     String   // read, create, update, delete
  tableName  String   @map("table_name")
  recordId   String?  @map("record_id")
  oldValues  Json?    @map("old_values")
  newValues  Json?    @map("new_values")
  ipAddress  String?  @map("ip_address") @db.Inet
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId, createdAt])
  @@map("audit_log")
}
```

---

## Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-06-30 | 1.0 | Software Architect | Initial architecture document |

---

*This document represents the agreed-upon architecture for BookSmart Phase 1. Any deviation requires a new ADR and approval.*
