# BookSmart — Database Schema Document

> **Stack:** Supabase (PostgreSQL) · Prisma ORM · Row-Level Security  
> **Tenancy:** Multi-tenant via `businessId` on every tenant-scoped table  
> **Auth:** Supabase Auth (magic link + Google OAuth) — `auth.users` → `public.users` (Profiles) join  
> **Email:** AWS SES · **E-sign:** Dropbox Sign · **Payments:** Stripe · **Files:** Cloudflare R2  

---

## Table of Contents

1. [Prisma Schema (Full)](#1-prisma-schema-full)
2. [Indexing Strategy](#2-indexing-strategy)
3. [Row-Level Security Policies](#3-row-level-security-policies)
4. [Query Performance Notes](#4-query-performance-notes)
5. [Migrations Strategy](#5-migrations-strategy)

---

## 1. Prisma Schema (Full)

```prisma
// ###########################################################################
// GENERATOR & DATASOURCE
// ###########################################################################

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  schemas   = ["public", "auth"]
}

// ###########################################################################
// ENUMS
// ###########################################################################

enum Role {
  OWNER
  ADMIN
  STAFF
}

enum AppointmentStatus {
  CONFIRMED
  CHECKED_IN
  NO_SHOW
  CANCELLED
  COMPLETED
}

enum SubscriptionTier {
  STARTER
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
}

enum EmailType {
  CONFIRMATION
  REMINDER_48H
  REMINDER_24H
  REVIEW_REQUEST
}

enum EmailDeliveryStatus {
  SENT
  DELIVERED
  BOUNCED
  OPENED
  CLICKED
}

enum RewardStatus {
  PENDING
  EARNED
  REDEEMED
}

// ###########################################################################
// AUTH (mirrors supabase.auth.users — READ-ONLY via Prisma)
// ###########################################################################

/// @schema auth
model AuthUser {
  id                 String   @id @default(uuid()) @map("id")
  email              String?  @unique @map("email")
  phone              String?  @map("phone")
  emailConfirmedAt   DateTime? @map("email_confirmed_at")
  lastSignInAt       DateTime? @map("last_sign_in_at")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  profile            Profile?
  businessMembers    BusinessMember[]
  clients            Client[]

  @@map("users")
}

// ###########################################################################
// CORE BUSINESS
// ###########################################################################

/// Extended user profile — one per auth user.
model Profile {
  id        String   @id @default(uuid())
  authUid   String   @unique @map("auth_uid")
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  avatarUrl String?  @map("avatar_url")
  phone     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  auth      AuthUser @relation(fields: [authUid], references: [id], onDelete: Cascade)

  @@map("profiles")
}

/// A business entity (dental practice, salon, etc.).
model Business {
  id                String             @id @default(uuid())
  name              String
  slug              String             @unique
  logoUrl           String?            @map("logo_url")
  address           String?
  phone             String?
  timezone          String             @default("America/New_York")
  stripeCustomerId  String?            @unique @map("stripe_customer_id")
  subscriptionTier  SubscriptionTier   @default(STARTER) @map("subscription_tier")
  googleReviewUrl   String?            @map("google_review_url")
  yelpReviewUrl     String?            @map("yelp_review_url")
  settings          Json               @default("{}")
  createdAt         DateTime           @default(now()) @map("created_at")
  updatedAt         DateTime           @updatedAt @map("updated_at")

  members           BusinessMember[]
  services          Service[]
  staff             Staff[]
  holidays          Holiday[]
  appointments      Appointment[]
  clients           Client[]
  intakeTemplates   IntakeTemplate[]
  waiverTemplates   WaiverTemplate[]
  reviewRequests    ReviewRequest[]
  businessSettings  BusinessSetting[]
  subscriptions     Subscription[]
  payments          Payment[]
  referralCodes     ReferralCode[]

  @@index([slug])
  @@index([stripeCustomerId])
  @@map("businesses")
}

/// Join table: which users belong to which businesses and in what role.
model BusinessMember {
  id         String   @id @default(uuid())
  accountId  String   @map("account_id")
  businessId String   @map("business_id")
  role       Role     @default(STAFF)
  joinedAt   DateTime @default(now()) @map("joined_at")

  account    AuthUser @relation(fields: [accountId], references: [id], onDelete: Cascade)
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@unique([accountId, businessId])
  @@index([accountId])
  @@index([businessId])
  @@map("business_members")
}

// ###########################################################################
// BOOKING
// ###########################################################################

/// A service offered by a business (e.g., "New Patient Exam", "Teeth Cleaning").
model Service {
  id          String   @id @default(uuid())
  businessId  String   @map("business_id")
  name        String
  durationMin Int      @map("duration_min")
  price       Decimal  @db.Decimal(10, 2)
  category    String?
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  business    Business      @relation(fields: [businessId], references: [id], onDelete: Cascade)
  staff       ServiceStaff[]
  appointments Appointment[]

  @@index([businessId, isActive])
  @@index([businessId, category])
  @@map("services")
}

/// A staff member (dentist, hygienist, receptionist).
model Staff {
  id         String   @id @default(uuid())
  businessId String   @map("business_id")
  name       String
  title      String?
  photoUrl   String?  @map("photo_url")
  bio        String?
  email      String?
  phone      String?
  color      String?  @default("#4F46E5") // calendar event colour
  bufferMin  Int      @default(0) @map("buffer_min")
  isActive   Boolean  @default(true) @map("is_active")
  sortOrder  Int      @default(0) @map("sort_order")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  business       Business       @relation(fields: [businessId], references: [id], onDelete: Cascade)
  services       ServiceStaff[]
  hours          StaffHour[]
  appointments   Appointment[]
  blockedSlots   BlockedSlot[]

  @@index([businessId, isActive])
  @@map("staff")
}

/// Many-to-many: which staff can perform which services.
model ServiceStaff {
  serviceId String @map("service_id")
  staffId   String @map("staff_id")

  service   Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  staff     Staff   @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@id([serviceId, staffId])
  @@map("service_staff")
}

/// Regular weekly hours for a staff member.
model StaffHour {
  id        String   @id @default(uuid())
  staffId   String   @map("staff_id")
  dayOfWeek Int      @map("day_of_week") // 0=Sun … 6=Sat
  startTime String   @map("start_time")  // "09:00"
  endTime   String   @map("end_time")    // "17:00"
  isActive  Boolean  @default(true) @map("is_active")

  staff     Staff    @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@unique([staffId, dayOfWeek])
  @@map("staff_hours")
}

/// Date-specific business closures or reduced hours.
model Holiday {
  id         String    @id @default(uuid())
  businessId String    @map("business_id")
  date       DateTime  @date          // date only (time ignored)
  isFullDay  Boolean   @default(true) @map("is_full_day")
  startTime  String?   @map("start_time") // "09:00" — null if full day
  endTime    String?   @map("end_time")
  reason     String?
  createdAt  DateTime  @default(now()) @map("created_at")

  business   Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@unique([businessId, date])
  @@index([businessId, date])
  @@map("holidays")
}

/// An appointment booking.
model Appointment {
  id         String            @id @default(uuid())
  businessId String            @map("business_id")
  clientId   String?           @map("client_id")  // nullable for walk-ins / guest bookings
  staffId    String            @map("staff_id")
  serviceId  String            @map("service_id")
  startTime  DateTime          @map("start_time")
  endTime    DateTime          @map("end_time")
  status     AppointmentStatus @default(CONFIRMED)
  notes      String?
  isGuest    Boolean           @default(false) @map("is_guest") // not-yet-registered client
  guestEmail String?           @map("guest_email")
  guestName  String?           @map("guest_name")
  createdAt  DateTime          @default(now()) @map("created_at")
  updatedAt  DateTime          @updatedAt @map("updated_at")

  business       Business            @relation(fields: [businessId], references: [id], onDelete: Cascade)
  client         Client?             @relation(fields: [clientId], references: [id])
  staff          Staff               @relation(fields: [staffId], references: [id])
  service        Service             @relation(fields: [serviceId], references: [id])
  intakeResponses IntakeResponse[]
  signedWavers   SignedWaiver[]
  emailLogs      EmailLog[]
  reviewRequests ReviewRequest[]
  payments       Payment[]
  referrals      Referral[]          // referrals *from* this appointment
  referredBy     Referral[]          // referrals *created by* this appointment

  @@unique([staffId, startTime])   // no double-booking at the same time
  @@index([businessId, startTime])
  @@index([businessId, status])
  @@index([clientId])
  @@index([staffId, startTime, status])
  @@map("appointments")
}

/// Manually blocked time slots (lunch, training, personal).
model BlockedSlot {
  id        String   @id @default(uuid())
  staffId   String   @map("staff_id")
  startTime DateTime @map("start_time")
  endTime   DateTime @map("end_time")
  reason    String?
  createdAt DateTime @default(now()) @map("created_at")

  staff     Staff    @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@index([staffId, startTime])
  @@map("blocked_slots")
}

// ###########################################################################
// CLIENT
// ###########################################################################

/// A client / patient who books appointments.
model Client {
  id         String   @id @default(uuid())
  businessId String   @map("business_id")
  authUid    String?  @unique @map("auth_uid") // null for guest / portal-invited
  name       String
  email      String
  phone      String?
  address    String?
  dob        DateTime? @date
  notes      String?
  tags       String[]  // e.g. ["new-patient", "anxious", "insurance-a"]
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime  @updatedAt @map("updated_at")

  business         Business       @relation(fields: [businessId], references: [id], onDelete: Cascade)
  auth             AuthUser?      @relation(fields: [authUid], references: [id])
  appointments     Appointment[]
  referralCodes    ReferralCode[]
  referralsGiven   Referral[]     @relation("Referrer")
  referralsReferred Referral[]    @relation("Referred")

  @@unique([businessId, email])
  @@index([businessId])
  @@index([businessId, tags]) // GIN index — see indexing section
  @@map("clients")
}

// ###########################################################################
// INTAKE & WAIVER
// ###########################################################################

/// A form template (e.g., "New Patient Medical History").
model IntakeTemplate {
  id         String   @id @default(uuid())
  businessId String   @map("business_id")
  name       String
  fields     Json     @default("[]") // [{key, type, label, required, options?, ...}]
  isActive   Boolean  @default(true) @map("is_active")
  sortOrder  Int      @default(0) @map("sort_order")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  business   Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)
  responses  IntakeResponse[]

  @@index([businessId, isActive])
  @@map("intake_templates")
}

/// A completed intake form tied to an appointment.
model IntakeResponse {
  id           String    @id @default(uuid())
  appointmentId String   @map("appointment_id")
  templateId   String    @map("template_id")
  answers      Json      @default("{}") // {fieldKey: value, ...}
  completedAt  DateTime? @map("completed_at")
  createdAt    DateTime  @default(now()) @map("created_at")

  appointment  Appointment    @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  template     IntakeTemplate @relation(fields: [templateId], references: [id])

  @@unique([appointmentId, templateId])
  @@index([appointmentId])
  @@map("intake_responses")
}

/// A waiver / consent form template.
model WaiverTemplate {
  id         String   @id @default(uuid())
  businessId String   @map("business_id")
  name       String   // e.g. "COVID-19 Consent", "Treatment Waiver"
  content    String   // markdown or HTML
  isActive   Boolean  @default(true) @map("is_active")
  sortOrder  Int      @default(0) @map("sort_order")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  business   Business       @relation(fields: [businessId], references: [id], onDelete: Cascade)
  signatures SignedWaiver[]

  @@index([businessId, isActive])
  @@map("waiver_templates")
}

/// A signed waiver tied to an appointment.
model SignedWaiver {
  id               String    @id @default(uuid())
  appointmentId    String    @map("appointment_id")
  waiverTemplateId String    @map("waiver_template_id")
  signerName       String    @map("signer_name")
  signerEmail      String    @map("signer_email")
  signedAt         DateTime  @default(now()) @map("signed_at")
  signatureRequestId String? @map("signature_request_id")  // Dropbox Sign
  signedPdfUrl     String?   @map("signed_pdf_url")        // Cloudflare R2
  ipAddress        String?   @map("ip_address")
  userAgent        String?   @map("user_agent")
  createdAt        DateTime  @default(now()) @map("created_at")

  appointment      Appointment    @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  waiverTemplate   WaiverTemplate @relation(fields: [waiverTemplateId], references: [id])

  @@unique([appointmentId, waiverTemplateId])
  @@index([signatureRequestId])
  @@map("signed_wavers")
}

// ###########################################################################
// EMAIL & AUTOMATION
// ###########################################################################

/// Email delivery log per appointment.
model EmailLog {
  id                String              @id @default(uuid())
  appointmentId     String              @map("appointment_id")
  type              EmailType
  recipient         String              // email address
  status            EmailDeliveryStatus @default(SENT)
  sentAt            DateTime            @default(now()) @map("sent_at")
  openedAt          DateTime?           @map("opened_at")
  clickedAt         DateTime?           @map("clicked_at")
  providerMessageId String?             @map("provider_message_id") // AWS SES message ID
  errorMessage      String?             @map("error_message")
  createdAt         DateTime            @default(now()) @map("created_at")

  appointment       Appointment         @relation(fields: [appointmentId], references: [id], onDelete: Cascade)

  @@index([appointmentId])
  @@index([appointmentId, type])
  @@index([status])
  @@map("email_logs")
}

/// Review requests sent post-appointment.
model ReviewRequest {
  id             String    @id @default(uuid())
  appointmentId  String    @unique @map("appointment_id")
  businessId     String    @map("business_id")
  type           String    @default("google") // "google" | "yelp"
  url            String?   // direct review link
  sentAt         DateTime  @default(now()) @map("sent_at")
  openedAt       DateTime? @map("opened_at")
  clickedAt      DateTime? @map("clicked_at")
  createdAt      DateTime  @default(now()) @map("created_at")

  appointment    Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  business       Business    @relation(fields: [businessId], references: [id])

  @@index([businessId, sentAt])
  @@map("review_requests")
}

/// Flexible key-value settings per business (reminder timing, review timing, etc.).
model BusinessSetting {
  id         String   @id @default(uuid())
  businessId String   @map("business_id")
  key        String
  value      Json
  updatedAt  DateTime @updatedAt @map("updated_at")

  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@unique([businessId, key])
  @@map("business_settings")
}

// ###########################################################################
// SUBSCRIPTION & PAYMENTS
// ###########################################################################

/// Subscription record per business.
model Subscription {
  id                   String             @id @default(uuid())
  businessId           String             @unique @map("business_id")
  stripeSubscriptionId String             @unique @map("stripe_subscription_id")
  tier                 SubscriptionTier   @default(STARTER)
  status               SubscriptionStatus @default(ACTIVE)
  currentPeriodStart   DateTime           @map("current_period_start")
  currentPeriodEnd     DateTime           @map("current_period_end")
  cancelAtPeriodEnd    Boolean            @default(false) @map("cancel_at_period_end")
  createdAt            DateTime           @default(now()) @map("created_at")
  updatedAt            DateTime           @updatedAt @map("updated_at")

  business             Business           @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([stripeSubscriptionId])
  @@index([status])
  @@map("subscriptions")
}

/// Payment / transaction record.
model Payment {
  id                    String   @id @default(uuid())
  businessId            String   @map("business_id")
  stripePaymentIntentId String   @unique @map("stripe_payment_intent_id")
  stripeCustomerId      String?  @map("stripe_customer_id")
  amount                Int               // cents
  currency              String   @default("usd")
  status                String   // Stripe status: requires_payment_method, succeeded, etc.
  appointmentId         String?  @map("appointment_id") // nullable — deposits, packages
  description           String?
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  business              Business     @relation(fields: [businessId], references: [id], onDelete: Cascade)
  appointment           Appointment? @relation(fields: [appointmentId], references: [id])

  @@index([businessId, createdAt])
  @@index([appointmentId])
  @@map("payments")
}

// ###########################################################################
// REFERRAL ENGINE
// ###########################################################################

/// A client's unique referral code.
model ReferralCode {
  id             String   @id @default(uuid())
  clientId       String   @map("client_id")
  code           String   @unique
  discountPercent Int     @default(10) @map("discount_percent")
  maxUses        Int      @default(10) @map("max_uses")
  usedCount      Int      @default(0) @map("used_count")
  isActive       Boolean  @default(true) @map("is_active")
  createdAt      DateTime @default(now()) @map("created_at")

  client         Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([clientId])
  @@index([code])
  @@map("referral_codes")
}

/// A referral event linking referrer → referral → appointment.
model Referral {
  id               String       @id @default(uuid())
  referrerClientId String       @map("referrer_client_id")
  referredClientId String       @map("referred_client_id")
  appointmentId    String       @map("appointment_id")
  rewardStatus     RewardStatus @default(PENDING) @map("reward_status")
  createdAt        DateTime     @default(now()) @map("created_at")
  updatedAt        DateTime     @updatedAt @map("updated_at")

  referrer         Client       @relation("Referrer", fields: [referrerClientId], references: [id])
  referred         Client       @relation("Referred", fields: [referredClientId], references: [id])
  appointment      Appointment  @relation(fields: [appointmentId], references: [id])

  @@unique([referrerClientId, referredClientId, appointmentId])
  @@index([referrerClientId])
  @@index([referredClientId])
  @@index([rewardStatus])
  @@map("referrals")
}
```

---

## 2. Indexing Strategy

### `businesses`
| Index | Type | Why |
|-------|------|-----|
| `slug` | Unique B-tree | URL-safe lookups — every public booking page resolves by slug |
| `stripe_customer_id` | Unique B-tree | Stripe webhook handler needs O(1) lookup |

### `business_members`
| Index | Type | Why |
|-------|------|-----|
| `(account_id, business_id)` | Composite unique | Enforce one membership per user per business |
| `account_id` | B-tree | RLS check: "which businesses does this user belong to?" |
| `business_id` | B-tree | Load all members of a business (permissions UI) |

### `profiles`
| Index | Type | Why |
|-------|------|-----|
| `auth_uid` | Unique B-tree | O(1) join from `auth.users` → profile on every authenticated request |

### `services`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, is_active)` | Composite B-tree | Staff-picker & booking widget show only active services |
| `(business_id, category)` | Composite B-tree | Category-filtered browse in booking flow |

### `staff`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, is_active)` | Composite B-tree | Booking flow loads active staff only |

### `staff_hours`
| Index | Type | Why |
|-------|------|-----|
| `(staff_id, day_of_week)` | Composite unique | One hours-row per staff per day; fast availability lookup |

### `holidays`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, date)` | Composite unique + B-tree | Fast closure lookup for a given date range |

### `appointments` ← **hottest table**
| Index | Type | Why |
|-------|------|-----|
| `(staff_id, start_time)` | **Composite unique** | **Primary constraint** — prevents double-booking at the engine level |
| `(business_id, start_time)` | Composite B-tree | **Primary dashboard query**: "all appointments today/this week" |
| `(business_id, status)` | Composite B-tree | Aggregate queries: no-show count, checked-in count, cancel rate |
| `client_id` | B-tree | Client history view: "all appointments for client X" |
| `(staff_id, start_time, status)` | Composite B-tree | Availability query: find slots where status != 'cancelled' for a staff+date |

### `blocked_slots`
| Index | Type | Why |
|-------|------|-----|
| `(staff_id, start_time)` | Composite B-tree | Availability query — fast exclusion of blocked ranges |

### `clients`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, email)` | **Composite unique** | Enforce unique email per business; O(1) lookup on booking |
| `business_id` | B-tree | Load all clients for a business (CRM view) |
| `business_id` + `tags` | **GIN** (on array column) | Filter by tag: "all 'new-patient' clients" — array columns require GIN |

> **Note on GIN:** Prisma does not natively support GIN indexes. You must add a raw migration:
> ```sql
> CREATE INDEX "clients_tags_gin" ON "clients" USING GIN ("tags");
> ```

### `intake_responses`
| Index | Type | Why |
|-------|------|-----|
| `appointment_id` | B-tree | Load all responses for an appointment (check-in tablet view) |
| `(appointment_id, template_id)` | Composite unique | One response per template per appointment |

### `signed_wavers`
| Index | Type | Why |
|-------|------|-----|
| `signature_request_id` | B-tree | Dropbox Sign webhook lookup (callback identifies by request ID) |
| `(appointment_id, waiver_template_id)` | Composite unique | One signature per waiver per appointment |

### `email_logs`
| Index | Type | Why |
|-------|------|-----|
| `appointment_id` | B-tree | Load full email history for an appointment |
| `(appointment_id, type)` | Composite B-tree | "Has the 48h reminder already been sent?" — dedup check |
| `status` | B-tree | SES bounce/SNS notification sweep: find all `BOUNCED` to suppress |

### `review_requests`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, sent_at)` | Composite B-tree | Dashboard: "review requests sent this month" |
| `appointment_id` | Unique B-tree | One review request per appointment |

### `business_settings`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, key)` | Composite unique | Fast settings lookup by key |

### `subscriptions`
| Index | Type | Why |
|-------|------|-----|
| `stripe_subscription_id` | Unique B-tree | Stripe webhook identity |
| `status` | B-tree | Cron: sweep `PAST_DUE` subscriptions for dunning |

### `payments`
| Index | Type | Why |
|-------|------|-----|
| `(business_id, created_at)` | Composite B-tree | Revenue reports by date range |
| `stripe_payment_intent_id` | Unique B-tree | Stripe webhook identity |
| `appointment_id` | B-tree | "Was a deposit collected for this appointment?" |

### `referral_codes`
| Index | Type | Why |
|-------|------|-----|
| `code` | Unique B-tree | Referral link resolution |
| `client_id` | B-tree | Load all codes for a client |

### `referrals`
| Index | Type | Why |
|-------|------|-----|
| `(referrer_client_id, referred_client_id, appointment_id)` | Composite unique | No duplicate referral credit |
| `referrer_client_id` | B-tree | "How many people has this client referred?" |
| `referred_client_id` | B-tree | "Who referred this client?" |
| `reward_status` | B-tree | Cron: sweep `PENDING` → `EARNED` after appointment completion |

---

## 3. Row-Level Security Policies

Supabase RLS is **enabled on every table** except `auth.users` (managed by Supabase).  
The policy pattern is:

> **`business_id` = current user's business membership**

All policies rely on a helper function:

```sql
-- Returns array of business IDs the current user belongs to
CREATE OR REPLACE FUNCTION public.user_business_ids()
RETURNS TEXT[]
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    ARRAY_AGG(business_id),
    '{}'::TEXT[]
  )
  FROM public.business_members
  WHERE account_id = auth.uid();
$$;
```

### 3.1 `businesses`

```sql
-- SELECT: user can read businesses they belong to
CREATE POLICY "members_select"
  ON public.businesses FOR SELECT
  USING (id = ANY(public.user_business_ids()));

-- INSERT/UPDATE/DELETE: only the OWNER of the business
CREATE POLICY "owner_all"
  ON public.businesses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = businesses.id
        AND account_id = auth.uid()
        AND role = 'OWNER'
    )
  );
```

### 3.2 `profiles`

```sql
-- SELECT: users can read their own profile; owners can read profiles in their business
CREATE POLICY "self_or_owner_select"
  ON public.profiles FOR SELECT
  USING (
    auth_uid = auth.uid()
    OR
    auth_uid IN (
      SELECT account_id FROM public.business_members
      WHERE business_id = ANY(public.user_business_ids())
        AND role IN ('OWNER', 'ADMIN')
    )
  );

-- UPDATE: only the profile owner
CREATE POLICY "self_update"
  ON public.profiles FOR UPDATE
  USING (auth_uid = auth.uid())
  WITH CHECK (auth_uid = auth.uid());
```

### 3.3 `business_members`

```sql
-- SELECT: user can see memberships for businesses they belong to
CREATE POLICY "member_select"
  ON public.business_members FOR SELECT
  USING (business_id = ANY(public.user_business_ids()));

-- INSERT: only OWNER can invite new members
CREATE POLICY "owner_insert"
  ON public.business_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = business_members.business_id
        AND account_id = auth.uid()
        AND role = 'OWNER'
    )
  );

-- DELETE: only OWNER can remove members
CREATE POLICY "owner_delete"
  ON public.business_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = business_members.business_id
        AND account_id = auth.uid()
        AND role = 'OWNER'
    )
  );
```

### 3.4 `services`, `staff`, `staff_hours`, `holidays`, `blocked_slots`

```sql
-- Pattern: SELECT if user belongs to the business; OWNER/ADMIN can write
CREATE POLICY "member_select"
  ON public.services FOR SELECT
  USING (business_id = ANY(public.user_business_ids()));

CREATE POLICY "owner_admin_all"
  ON public.services FOR INSERT/UPDATE/DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = services.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
  );
```

*Apply the same pattern to `staff`, `staff_hours`, `holidays`, `blocked_slots`.*

### 3.5 `appointments` — **critical for staff access**

```sql
-- SELECT: owners/admins see all; staff see only their own appointments;
--         clients see their own appointments (via client portal)
CREATE POLICY "appointment_select"
  ON public.appointments FOR SELECT
  USING (
    -- Owner / Admin
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = appointments.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
    OR
    -- Staff member assigned
    staff_id IN (
      SELECT id FROM public.staff
      WHERE business_id = appointments.business_id
        AND id IN (
          SELECT staff_id FROM public.business_members -- if staff maps to user
        )
    )
    OR
    -- Client via portal (auth_uid matches client.auth_uid)
    client_id IN (
      SELECT id FROM public.clients
      WHERE auth_uid = auth.uid()
    )
    OR
    -- Guest using token-based access (handled via application layer)
    FALSE
  );

-- INSERT: any staff or owner can create
CREATE POLICY "appointment_insert"
  ON public.appointments FOR INSERT
  WITH CHECK (business_id = ANY(public.user_business_ids()));

-- UPDATE: owners/admins can update any; staff can update status on own
CREATE POLICY "appointment_update"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = appointments.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
    OR
    (staff_id IN (
      SELECT id FROM public.staff WHERE email = auth.email()
    ))
  );
```

### 3.6 `clients`

```sql
-- SELECT: owners/admins can see all; clients can see their own record
CREATE POLICY "clients_select"
  ON public.clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = clients.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
    OR
    auth_uid = auth.uid()
  );

-- INSERT/UPDATE/DELETE: owners/admins only
CREATE POLICY "clients_write"
  ON public.clients FOR INSERT
  WITH CHECK (business_id = ANY(public.user_business_ids()));

CREATE POLICY "clients_update"
  ON public.clients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = clients.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
  );

CREATE POLICY "clients_delete"
  ON public.clients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = clients.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
  );
```

### 3.7 `intake_templates` & `intake_responses`

```sql
-- Templates: owners/admins CRUD
CREATE POLICY "templates_select"
  ON public.intake_templates FOR SELECT
  USING (business_id = ANY(public.user_business_ids()));

CREATE POLICY "templates_write"
  ON public.intake_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = intake_templates.business_id
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Responses: owners read all; clients write own (via appointment ownership)
CREATE POLICY "responses_select"
  ON public.intake_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = (
        SELECT business_id FROM public.appointments WHERE id = intake_responses.appointment_id
      )
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
    OR
    appointment_id IN (
      SELECT id FROM public.appointments
      WHERE client_id IN (
        SELECT id FROM public.clients WHERE auth_uid = auth.uid()
      )
    )
  );

CREATE POLICY "responses_insert"
  ON public.intake_responses FOR INSERT
  WITH CHECK (
    appointment_id IN (
      SELECT id FROM public.appointments
      WHERE client_id IN (
        SELECT id FROM public.clients WHERE auth_uid = auth.uid()
      )
    )
  );
```

### 3.8 `email_logs`, `review_requests`, `business_settings`

```sql
-- All: owners/admins read
CREATE POLICY "member_select"
  ON public.email_logs FOR SELECT
  USING (appointment_id IN (
    SELECT id FROM public.appointments WHERE business_id = ANY(public.user_business_ids())
  ));

-- Insert only via server-side (service role key), not from client
-- No INSERT/UPDATE policies for client roles
```

### 3.9 `subscriptions`, `payments`

```sql
-- These are sensitive financial records.
-- Only OWNER can read; only server-side (service role) can write.

CREATE POLICY "owner_select"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = subscriptions.business_id
        AND account_id = auth.uid()
        AND role = 'OWNER'
    )
  );

-- Same pattern for payments
```

### 3.10 `referral_codes`, `referrals`

```sql
-- Clients can see their own referral codes; owners see all
CREATE POLICY "codes_select"
  ON public.referral_codes FOR SELECT
  USING (
    client_id IN (SELECT id FROM public.clients WHERE auth_uid = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM public.business_members
      WHERE business_id = (SELECT business_id FROM public.clients WHERE id = referral_codes.client_id)
        AND account_id = auth.uid()
        AND role IN ('OWNER', 'ADMIN')
    )
  );
```

---

## 4. Query Performance Notes

### 4.1 Availability Query

The core availability query — "find all free 30-min slots for staff X on date Y" — is the most performance-sensitive in the system.

**Algorithm:**

```
1. Generate all 30-min slots for staff_hours on that dayOfWeek
2. Subtract blocked_slots ranges
3. Subtract holiday (full or partial) if business is closed
4. Subtract existing appointments where status != 'cancelled'
```

**SQL sketch:**

```sql
WITH times AS (
  SELECT generate_series(
    date '2026-07-15' + '09:00'::time,
    date '2026-07-15' + '17:00'::time - '30 min'::interval,
    '30 min'::interval
  ) AS slot_start
),
booked AS (
  SELECT start_time, end_time
  FROM appointments
  WHERE staff_id = 'abc'
    AND start_time::date = '2026-07-15'
    AND status != 'CANCELLED'
),
blocked AS (
  SELECT start_time, end_time
  FROM blocked_slots
  WHERE staff_id = 'abc'
    AND start_time::date = '2026-07-15'
)
SELECT times.slot_start
FROM times
WHERE NOT EXISTS (
  SELECT 1 FROM booked
  WHERE times.slot_start < booked.end_time
    AND times.slot_start + '30 min'::interval > booked.start_time
)
AND NOT EXISTS (
  SELECT 1 FROM blocked
  WHERE times.slot_start < blocked.end_time
    AND times.slot_start + '30 min'::interval > blocked.start_time
);
```

**Critical index for this query:**

```sql
CREATE INDEX idx_appointments_staff_start_status
  ON public.appointments (staff_id, start_time, status)
  WHERE status != 'CANCELLED';
```

This **partial index** only contains rows relevant to availability, keeping it small and fast.

**Performance expectation:** With the partial index, a single staff+date availability query runs in **<5ms** on a table with 500K+ appointments.

### 4.2 Dashboard Aggregate Queries

Common dashboard queries that scan many rows:

| Query | Approach |
|-------|----------|
| "Today's appointment count" | `SELECT count(*) WHERE business_id=$1 AND start_time::date = CURRENT_DATE` — uses `[business_id, start_time]` index |
| "This month's no-show rate" | `SELECT status, count(*) ... GROUP BY status` — uses `[business_id, status]` index |
| "Revenue this month" | `SELECT SUM(amount) FROM payments WHERE business_id=$1 AND created_at >= $2` — uses `[business_id, created_at]` index |
| "Top 5 referrers" | `SELECT referrer_client_id, count(*) ... GROUP BY referrer_client_id` — sequentially scanned at small scale |

**For MVP**, direct aggregate queries are acceptable (<50K appointments per business).  
**For scale**, consider:

```sql
-- Materialized view: daily rollup
CREATE MATERIALIZED VIEW mv_daily_business_stats AS
SELECT
  business_id,
  start_time::date AS date,
  COUNT(*) FILTER (WHERE status = 'CONFIRMED')  AS confirmed,
  COUNT(*) FILTER (WHERE status = 'NO_SHOW')    AS no_shows,
  COUNT(*) FILTER (WHERE status = 'COMPLETED')  AS completed,
  COUNT(*)                                       AS total
FROM appointments
GROUP BY business_id, start_time::date
WITH DATA;

CREATE UNIQUE INDEX ON mv_daily_business_stats (business_id, date);
```

Refresh via pg_cron or Supabase Edge Function scheduler:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_business_stats;
```

### 4.3 Client Search

When searching clients by name/email/phone:

```sql
-- Use pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_clients_name_trgm ON public.clients USING GIN (name gin_trgm_ops);
CREATE INDEX idx_clients_email_trgm ON public.clients USING GIN (email gin_trgm_ops);
```

Query:

```sql
SELECT * FROM clients
WHERE business_id = $1
  AND (name % $2 OR email % $2)
ORDER BY similarity(name, $2) DESC
LIMIT 20;
```

> **Note:** Add `pg_trgm` extension and these indexes via a raw migration — Prisma does not support GIN/trgm natively.

### 4.4 N+1 Guard: Eager Loading Checklist

When fetching the appointment list, always include:

```prisma
const appointments = await prisma.appointment.findMany({
  where: { businessId, startTime: { gte: dayStart, lt: dayEnd } },
  include: {
    client:   true,   // client name, phone
    staff:    true,   // staff name, photo, color
    service:  true,   // service name, duration, price
  },
  orderBy: { startTime: 'asc' },
});
```

Never lazy-load client/staff/service per appointment row — that's the classic N+1.

### 4.5 Pagination Strategy

For client lists, appointment history, etc.:

```prisma
// Cursor-based (preferred for infinite scroll / load-more)
const page = await prisma.client.findMany({
  take: 20 + 1, // fetch 1 extra to detect "has more"
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' },
  where: { businessId },
});
const hasMore = page.length > 20;
const nodes = hasMore ? page.slice(0, 20) : page;
```

Cursor-based pagination scales to **any page depth** without the offset drift problem.

---

## 5. Migrations Strategy

### 5.1 Prisma Migrate Workflow

```bash
# 1. Edit schema.prisma
# 2. Generate migration
npx prisma migrate dev --name add_service_sort_order

# 3. Review generated SQL in prisma/migrations/<timestamp>_add_service_sort_order/
# 4. Apply (dev)
npx prisma migrate dev

# 5. Apply (prod)
npx prisma migrate deploy
```

### 5.2 Seed File

`prisma/seed.ts` — used for demo / local development:

```typescript
import { PrismaClient, Role, SubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a demo business
  const business = await prisma.business.create({
    data: {
      name: 'Lumina Dental Studio',
      slug: 'lumina-dental',
      timezone: 'America/New_York',
      subscriptionTier: 'PRO',
      settings: {
        reminder48h: true,
        reminder24h: true,
        reviewRequest: true,
        defaultAppointmentDuration: 30,
        bufferTime: 5,
      },
    },
  });

  // 2. Create services
  const services = await Promise.all([
    prisma.service.create({ data: { businessId: business.id, name: 'New Patient Exam', durationMin: 60, price: 150 } }),
    prisma.service.create({ data: { businessId: business.id, name: 'Teeth Cleaning', durationMin: 30, price: 120 } }),
    prisma.service.create({ data: { businessId: business.id, name: 'Consultation', durationMin: 30, price: 0, category: 'free' } }),
  ]);

  // 3. Create staff
  const staff = await prisma.staff.create({
    data: {
      businessId: business.id,
      name: 'Dr. Sarah Chen',
      title: 'Lead Dentist',
      color: '#4F46E5',
      bufferMin: 10,
      services: {
        create: services.map(s => ({ serviceId: s.id })),
      },
      hours: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '16:00' },
        ],
      },
    },
  });

  // 4. Create a demo client
  const client = await prisma.client.create({
    data: {
      businessId: business.id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0100',
      tags: ['new-patient'],
    },
  });

  // 5. Create intake template
  await prisma.intakeTemplate.create({
    data: {
      businessId: business.id,
      name: 'New Patient Medical History',
      fields: [
        { key: 'fullName', type: 'text', label: 'Full Name', required: true },
        { key: 'dob', type: 'date', label: 'Date of Birth', required: true },
        { key: 'allergies', type: 'text', label: 'Allergies', required: false },
        { key: 'medications', type: 'textarea', label: 'Current Medications', required: false },
        { key: 'reason', type: 'select', label: 'Reason for Visit', required: true, options: ['Checkup', 'Pain', 'Cosmetic', 'Other'] },
      ],
    },
  });

  // 6. Create referral code
  await prisma.referralCode.create({
    data: {
      clientId: client.id,
      code: 'JOHN10',
      discountPercent: 10,
    },
  });

  console.log('Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:

```bash
npx prisma db seed
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 5.3 Handling Schema Changes Across Tenants

**MVP Rule: Additive changes only.**

| Type | Allowed? | Example |
|------|----------|---------|
| New table | ✅ | `CREATE TABLE referrals...` |
| New column (nullable / default) | ✅ | `ALTER TABLE clients ADD COLUMN tags TEXT[] DEFAULT '{}'` |
| New index | ✅ | `CREATE INDEX ...` |
| Rename column | ❌ | Use additive pattern: add new, backfill, drop old in separate deploy |
| Drop column | ❌ | `ALTER TABLE ... DROP COLUMN` — blocks reads during migration on large tables |
| NOT NULL on existing column | ❌ | Requires backfill → causes long exclusive lock |

**Safe rename pattern:**

```bash
# Deploy 1: Add new column + dual-write
ALTER TABLE clients ADD COLUMN full_name TEXT;
-- Application code writes to both `name` and `fullName`

# Deploy 2: Backfill
UPDATE clients SET full_name = name WHERE full_name IS NULL;

# Deploy 3: Drop old column (off-peak)
ALTER TABLE clients DROP COLUMN name;
```

**For Supabase (managed Postgres):**

- Prisma migrate runs against a direct DB connection (port 6543 for session mode, or connection pooling via Supavisor on port 6543).
- **WARNING:** Prisma migrations use `ALTER TABLE ... ALTER COLUMN ... SET NOT NULL` which requires `ACCESS EXCLUSIVE LOCK`. Run these during maintenance windows for businesses with >10K rows.
- Consider wrapping high-risk migrations in `pg_net` or a Supabase Edge Function for async execution.

### 5.4 Migration Checklist for Production

```markdown
## Pre-deployment Checklist

- [ ] Migration is **additive-only** (no drops, no renames, no NOT NULL on populated columns)
- [ ] Run `npx prisma migrate dev` locally, review SQL output
- [ ] Test on staging with a copy of production data
- [ ] Run seed on staging to verify no regressions
- [ ] Create a Supabase backup before applying
- [ ] Apply: `npx prisma migrate deploy`
- [ ] Verify: `npx prisma db push --accept-data-loss --dry-run` shows no drift
- [ ] Monitor pg_stat_activity for long-running locks
```

### 5.5 Supabase-Specific Setup

```sql
-- Run this once to enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- Enable RLS on all tables
ALTER TABLE public.businesses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_hours      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiver_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signed_wavers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals        ENABLE ROW LEVEL SECURITY;

-- Create the helper function used by all RLS policies
CREATE OR REPLACE FUNCTION public.user_business_ids()
RETURNS TEXT[]
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    ARRAY_AGG(business_id),
    '{}'::TEXT[]
  )
  FROM public.business_members
  WHERE account_id = auth.uid();
$$;

-- Apply all policies from Section 3 above
```

---

## Appendix A: Entity Relationship Summary

```
AuthUser (auth.users)
  │
  ├── Profile (1:1)
  │
  ├── BusinessMember (M:N with Business)
  │     └── Business ──── Subscription (1:1)
  │           │               Payment (1:N)
  │           ├── Service (1:N)
  │           ├── Staff (1:N) ── StaffHour (1:N)
  │           │                  BlockedSlot (1:N)
  │           │                  ServiceStaff (M:N with Service)
  │           ├── Holiday (1:N)
  │           ├── Appointment (1:N) ── IntakeResponse (1:N)
  │           │     │                   SignedWaiver (1:N)
  │           │     │                   EmailLog (1:N)
  │           │     │                   ReviewRequest (1:1)
  │           │     │                   Payment (1:N)
  │           │     │                   Referral (1:N from appointment)
  │           │     └── Client (M:1) ── ReferralCode (1:N)
  │           │                              Referral (1:N as referrer)
  │           │                              Referral (1:N as referred)
  │           ├── IntakeTemplate (1:N)
  │           ├── WaiverTemplate (1:N)
  │           ├── ReviewRequest (1:N)
  │           └── BusinessSetting (1:N)
  │
  └── Client (1:N per business)
```

## Appendix B: TypeScript Types (for frontend consumption)

```typescript
// Generated from Prisma — but here are the key enums/shapes for reference

type Role = 'OWNER' | 'ADMIN' | 'STAFF';
type AppointmentStatus = 'CONFIRMED' | 'CHECKED_IN' | 'NO_SHOW' | 'CANCELLED' | 'COMPLETED';
type SubscriptionTier = 'STARTER' | 'PRO' | 'ENTERPRISE';
type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
type EmailType = 'CONFIRMATION' | 'REMINDER_48H' | 'REMINDER_24H' | 'REVIEW_REQUEST';
type EmailDeliveryStatus = 'SENT' | 'DELIVERED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
type RewardStatus = 'PENDING' | 'EARNED' | 'REDEEMED';

interface IntakeField {
  key: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox' | 'file';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface BusinessSettings {
  reminder48h: boolean;
  reminder24h: boolean;
  reviewRequest: boolean;
  defaultAppointmentDuration: number;
  bufferTime: number;
  allowGuestBooking: boolean;
  requireIntakeForms: boolean;
  requireWaiver: boolean;
}
```
