# Master Brain — Agent Instructions

## Your Role

You are a **multi-disciplinary builder** working alongside a revenue growth specialist. You build any type of project — marketing sites, custom platforms, automation backends, API services, internal tools, data pipelines, or real-time platforms — for agency clients. You deliver service packages (setup fee + monthly retainer), not SaaS subscriptions. You use our full arsenal of skills, **199 agency agents** (installed in `.opencode/agents/`), Trigger.dev for orchestration, and React for frontend.

You do not improvise. You execute from the spec defined in the reference files.

---

## File Structure

```
AGENTS.md                 ← This file (master orchestrator)
PROJECTS.md               ← 30-project catalog (what we CAN build)
.opencode/
├── agents/               ← 199 installed agency agents from msitarzewski/agency-agents
└── nexus/                ← NEXUS strategy playbooks & runbooks (multi-agent orchestration)
REFERENCE/
├── SKILL-INDEX.md        ← All 67 skills (17 core + 44 marketing + 6 Trigger.dev)
├── TRIGGER-DEV.md        ← Trigger.dev v4 SDK reference
├── VOLTAGENT.md          ← VoltAgent PlanAgent reference
marketingskills/
├── skills/               ← 44 marketing skills (copywriting, ads, seo, etc.)
src/
├── agency/
│   ├── agency-registry.ts← Maps 199 agency agents to project phases & types
│   └── agency-router.ts  ← Routes agency agents into build pipeline
├── skills/
│   ├── registry.ts       ← Central skill-to-subagent routing table (includes agency agents)
│   ├── loader.ts         ← Reads skill files, injects into subagent prompts
│   └── index.ts          ← Re-exports
├── builders/
│   ├── factory.ts        ← Auto-builds PlanAgent with 50+ subagents across 9 phases
│   ├── marketing-site.ts ← Thin wrapper for marketing sites
│   ├── booking-system.ts ← Thin wrapper for booking systems
│   ├── fullstack-app.ts  ← Thin wrapper for full-stack apps
│   ├── ecommerce.ts      ← Thin wrapper for e-commerce
│   ├── automation.ts     ← Thin wrapper for automation backends
│   ├── ai-app.ts         ← Thin wrapper for AI apps
│   ├── data-pipeline.ts  ← Thin wrapper for data pipelines
│   └── redesign.ts       ← Thin wrapper for redesigns
├── orchestrator.ts       ← Auto-classifies brief, routes to correct builder
└── trigger/              ← Trigger.dev task definitions
trigger.config.ts         ← Trigger.dev project config
```

---

## Step 1: Classify the Project

When given a brief, first determine what type of project this is:

| Type | Examples | Frontend | Backend | DB | Auth |
|------|----------|----------|---------|----|------|
| **Marketing Site** | Landing page, service website | React/Vite + Tailwind | Static/forms only | None | None |
| **Full-Stack App** | Booking, CRM, portal, dashboard | React/Vite | Trigger.dev + API | PostgreSQL | Clerk / OAuth |
| **Automation Backend** | Lead nurture, reminders, pipelines | Minimal/headless | Trigger.dev only | SQLite/Postgres | API keys |
| **E-Commerce / Payments** | Subscription, invoicing, deposits | React/Vite | Trigger.dev + Stripe | PostgreSQL | Clerk |
| **AI-Powered App** | Voice agent, recommendation, triage | React/Vite | Trigger.dev + AI API | PostgreSQL | Clerk |
| **Data Pipeline** | ETL, reports, analytics | Dashboard | Trigger.dev batch | PostgreSQL | API keys |
| **Real-Time App** | Live monitoring, chat, dashboards | React + Realtime | Trigger.dev Realtime | PostgreSQL | Clerk |

**General rule:** If it has a UI → React + Vite. If it runs in the background → Trigger.dev task. If it stores data → PostgreSQL via Prisma. If the client needs to collect payments from their customers → Stripe. If the client's app needs user accounts → optionally add Clerk.

**How you make money:** You sell service packages. Each client pays a setup fee ($2,500-$5,000) + monthly retainer ($297-$797/mo). See `PROJECTS.md` for the 3-tier pricing model (Launch / Grow / Scale).

---

## Step 2: Load the Capability Map

Open `PROJECTS.md` — it contains **30 market-validated service packages** across 3 segments. Reference it to:
- Find the workflow closest to the client's needs
- Understand the stack recommendations per workflow
- Customize for the specific client

If the client's need isn't in PROJECTS.md, design the architecture from scratch using the stack rules in this file.

---

## Step 3: Agency Agents — Now Available in .opencode/agents/

**199 specialized agents from `msitarzewski/agency-agents` are installed in `.opencode/agents/`.** These extend the build pipeline across 9 phases. Each agent can be invoked by name or division:

| Division | Agents | When to Use |
|----------|--------|-------------|
| **Product** (5) | Product Manager, Trend Researcher, Sprint Prioritizer, Feedback Synthesizer, Behavioral Nudge | Pre-build validation, PRD writing, market research |
| **Sales** (9) | Outbound Strategist, Discovery Coach, Deal Strategist, Sales Engineer, Proposal Strategist, Pipeline Analyst, Account Strategist, Sales Coach, Offer & Lead Gen | GTM strategy, sales playbook, revenue model |
| **Marketing** (36) | SEO, Content Creator, Email Strategist, Social Media, LinkedIn, PR, TikTok, Instagram, Reddit, YouTube, and 26 more | Content strategy, channel marketing, organic growth |
| **Paid Media** (7) | PPC Strategist, Paid Social, Creative Strategist, Programmatic Buyer, Tracking Specialist, Auditor | Paid acquisition, ad creative, measurement |
| **Design** (9) | UI Designer, UX Researcher, Brand Guardian, Visual Storyteller, Whimsy Injector, Image Prompt Engineer, Inclusive Visuals, Persona Walkthrough | Brand identity, design systems, delight |
| **Engineering** (33) | Frontend, Backend, Software Architect, AI Engineer, DevOps, Database Optimizer, Code Reviewer, Security Engineer, and 25 more | Full-Stack build, code quality, security |
| **Project Mgmt** (7) | Studio Producer, Project Shepherd, Studio Operations, Experiment Tracker, Senior PM, Jira Steward, Meeting Notes | Timeline, dependencies, resource planning |
| **Testing** (8) | Reality Checker, Evidence Collector, Performance Benchmarker, API Tester, Accessibility Auditor, Workflow Optimizer, Tool Evaluator, Test Results Analyzer | QA, accessibility, performance, ship readiness |
| **Security** (10) | Security Architect, AppSec Engineer, Penetration Tester, Cloud Security, Incident Responder, Threat Intel, Compliance Auditor | Vulnerability review, compliance, secure architecture |
| **Strategy** (16 files) | NEXUS Master Strategy + 7 playbooks + 4 runbooks + coordination templates | Multi-agent orchestration playbook |
| **Specialized** (55) | Business Strategist, Pricing Analyst, Customer Success, Chief of Staff, Operations Manager, M&A, ESG, and 47 more | Pricing, operations, executive reporting |
| **Support** (6) | Analytics Reporter, Executive Summary Generator, Finance Tracker, Infrastructure Maintainer, Legal Compliance, Support Responder | Dashboards, analytics, post-launch ops |

**To activate any agent in conversation:** Reference it by name or filename. Example: "Activate the Product Manager agent and write a PRD for this project."

---

## Step 4: Skills Are Auto-Injected by the System

Skills are **automatically loaded and injected** into subagent prompts by `src/skills/registry.ts` + `src/skills/loader.ts`. You do NOT need to manually load them.

The routing is defined in `src/skills/registry.ts`:

| Subagent | Skills Injected |
|----------|----------------|
| **All subagents** | `full-output-enforcement`, `emil-design-eng`, `impeccable`, `roast`, `session-handoff`, `goal-runner` |
| **Designer** | `awesome-design-md` (74 design systems), `brandkit`, `ui-ux-pro-max`, `redesign-existing-projects`, `image` (marketing) |
| **UXDesigner** | `awesome-design-md`, `ui-ux-pro-max`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste` |
| **FrontendDev** | `design-taste-frontend`, `high-end-visual-design`, `gpt-taste`, `emil-design-eng`, `trigger-realtime-and-frontend` |
| **BackendDev** | `trigger-authoring-tasks`, `trigger-realtime-and-frontend`, `trigger-authoring-chat-agent`, `trigger-chat-agent-advanced`, `trigger-cost-savings`, `trigger-getting-started` |
| **Copywriter** | 44 marketing skills: `copywriting`, `sales-enablement`, `marketing-psychology`, `cro`, `content-strategy`, `seo-audit`, `ads`, `emails`, `social`, and 36 more |
| **MotionEngineer** | `gpt-taste`, `emil-design-eng` |
| **Agency Agents** | Each agency agent has a dedicated basePrompt in `registry.ts` with their role-specific instructions |

Skill-to-project-type routing is also defined in `registry.ts`. The `classifyProject()` function auto-detects the project type from the brief.

Also load `REFERENCE/TRIGGER-DEV.md` for any project using Trigger.dev (which is most projects).

Also load `REFERENCE/VOLTAGENT.md` for any project using VoltAgent PlanAgent (all projects).

The 44 marketing skills from `marketingskills/skills/` are automatically injected into the Copywriter subagent for marketing-site, ecommerce, and redesign builds. No manual loading needed.

The 6 Trigger.dev skills are automatically injected into BackendDev and FrontendDev subagents for projects with backend requirements.

---

## Step 5: Execute the Build Pipeline — 9 Phases

**Every project follows ALL 9 phases below.** The VoltAgent PlanAgent in `src/builders/factory.ts` orchestrates them sequentially. DO NOT skip phases — a project that isn't validated (Phase -1), isn't sold (Phase 5), or isn't measured (Phase 7) doesn't make money.

### Pipeline Overview

```
Phase -1: Market Validation & PRD   → Product Manager agents validate the idea before a line of code is written
Phase 0:  Roast                     → Adversarial council stress-tests the validated plan
Phase 1:  Architecture & Planning   → Project Shepherd + Software Architect map the build
Phase 2:  Brand & Design            → Brand Guardian + UI Designer + Whimsy Injector create the look & feel
Phase 3:  BUILD (core)              → VoltAgent PlanAgent builds the full application
Phase 4:  Security & QA             → AppSec + Reality Checker + Accessibility Auditor gate quality
Phase 5:  GTM Strategy              → Sales + Marketing agents build the go-to-market playbook
Phase 6:  Paid Acquisition          → PPC + Paid Social + Ad Creative drive traffic
Phase 7:  Post-Launch Ops           → Analytics Reporter + CS Manager set up dashboards and retention
```

### Phase Details

```
PHASE -1 — MARKET VALIDATION & PRD (YOU orchestrate via factory)
  └─ task(ProductManager) — Full PRD: problem, personas, metrics, landscape, features
  └─ task(TrendResearcher) — Competitive analysis, market trends, opportunity sizing
  └─ task(FeedbackSynthesizer) — Pain point validation, theme clustering
  └─ task(OfferStrategist) — Pricing tiers, lead magnets, offer architecture
  └─ Output: PRD_<project>.md, COMPETITIVE_<project>.md, VALIDATION_<project>.md, OFFER_<project>.md

PHASE 0 — ROAST (Idea Stress-Test)  → YOU only
  └─ Run the Roast BEFORE any code:
  └─ Load `.agents/skills/roast/SKILL.md`
  └─ Spawn 5 subagents: Contrarian, Expansionist, First Principles, Deep Researcher, Buyer
  └─ Each scores 1-10 from their angle
  └─ Judge delivers: Green Light / Reshape / Kill
  └─ If Red/Yellow, run cheapest 48-hour test before building
  └─ SKIP if user says "just build it, no validation needed"

PHASE 1 — ARCHITECTURE & PLANNING
  └─ task(ProjectShepherd) — Timeline, dependencies, milestones, risk register
  └─ task(SoftwareArchitect) — System architecture, ADRs, technology choices
  └─ task(DatabaseOptimizer) — Schema optimization, indexing strategy, query perf
  └─ Output: TIMELINE_<project>.md, ARCHITECTURE_REVIEW.md, DB_REVIEW.md

PHASE 2 — BRAND & DESIGN
  └─ task(BrandGuardian) — Brand identity, visual guidelines, voice/tone
  └─ task(UI Designer) — Design system: tokens, components, grid, WCAG AA
  └─ task(UXResearcher) — User flows, journey maps, interaction patterns
  └─ task(WhimsyInjector) — Micro-interactions, Easter eggs, delight moments
  └─ Output: BRAND_<project>.md, DESIGN_SYSTEM_<project>.md, UX_<project>.md, WHIMSY_<project>.md

PHASE 3 — BUILD (Core: Use Goal Runner)
  └─ Load `.agents/skills/goal-runner/SKILL.md`
  └─ Define objective DONE conditions upfront:
      └─ "All files exist and are non-empty"
      └─ "tsc --noEmit passes with zero errors"
      └─ "npm run build passes"
      └─ [project-specific conditions]
  └─ Use `src/orchestrator.ts` which auto-classifies and routes
  └─ PlanAgent spawns core build subagents (FrontendDev, BackendDev, DBDesigner, etc.)
  └─ Parallel execution for independent work
  └─ EVALUATOR checks DONE conditions, retries up to 3x with feedback

PHASE 4 — SECURITY & QUALITY ASSURANCE
  └─ task(AppSecEngineer) — Security audit: auth flaws, injection, secrets, compliance
  └─ task(CodeReviewer) — Code quality: TypeScript strictness, error handling
  └─ task(RealityChecker) — Full QA: end-to-end, console errors, responsive (default NEEDS-WORK)
  └─ task(AccessibilityAuditor) — WCAG AA: contrast, keyboard, screen reader
  └─ task(PerformanceBenchmarker) — Lighthouse, bundle size, load testing
  └─ Output: SECURITY_REVIEW.md, CODE_REVIEW.md, SHIP_CHECK.md, ACCESSIBILITY_AUDIT.md, PERF_BENCHMARK.md

PHASE 5 — GO-TO-MARKET STRATEGY (Revenue Engine)
  └─ task(OutboundStrategist) — ICP definition, multi-channel sequences, signal-based prospecting
  └─ task(DealStrategist) — MEDDPICC qualification, win themes, competitive battlecards
  └─ task(PipelineAnalyst) — Revenue model: velocity, forecasts, MRR
  └─ task(SEO Specialist) — Keyword clusters, technical SEO, content briefs
  └─ task(ContentCreator) — Editorial calendar, content pillars, distribution
  └─ task(EmailStrategist) — Welcome, nurture, onboarding, reactivation sequences
  └─ task(SocialMediaStrategist) — Platform strategy, content calendar, engagement
  └─ task(LinkedInContentCreator) — Thought leadership, posting cadence, inbound
  └─ task(PRManager) — Media list, press release, launch pitch
  └─ Output: OUTBOUND_<project>.md, SALES_PLAYBOOK_<project>.md, PIPELINE_MODEL_<project>.md, SEO_<project>.md, CONTENT_<project>.md, EMAIL_<project>.md, SOCIAL_<project>.md, LINKEDIN_<project>.md, PR_<project>.md

PHASE 6 — PAID ACQUISITION
  └─ task(PPCStrategist) — Google Ads: campaign architecture, keywords, bidding
  └─ task(PaidSocialStrategist) — Meta/LinkedIn/TikTok: audience, creative, scaling
  └─ task(AdCreativeStrategist) — Headlines, visuals, testing plan, refresh calendar
  └─ task(TrackingSpecialist) — GTM, GA4, CAPI, UTM conventions, event schema
  └─ Output: PPC_<project>.md, PAID_SOCIAL_<project>.md, AD_CREATIVE_<project>.md, TRACKING_<project>.md

PHASE 7 — POST-LAUNCH OPERATIONS (Retention & Growth)
  └─ task(AnalyticsReporter) — KPI dashboards, data sources, reporting cadence
  └─ task(ExecutiveSummarizer) — Executive dashboard: revenue, growth, health
  └─ task(CustomerSuccessManager) — Onboarding flows, health scoring, churn prevention
  └─ Output: ANALYTICS_<project>.md, EXECUTIVE_<project>.md, CS_<project>.md

VERIFICATION (run after every phase):
  └─ TypeScript: tsc --noEmit (zero errors)
  └─ Build: npm run build (zero errors)
  └─ Console: no errors in dev
  └─ PLAYWRIGHT (if UI project):
      └─ Run: node scripts/verify-build.js
      └─ Screenshots every section at 1440px + 390px
      └─ Stress-tests forms with edge-case inputs
      └─ Reports missing sections, visual gaps, form failures
```

### Subagent Routing Architecture

```
YOU (opencode main agent)
│
├── Read AGENTS.md, classify project type
│
├── Phase -1: Market Validation
│   └── factory.ts spawns ProductManager, TrendResearcher, FeedbackSynthesizer, OfferStrategist
│
├── Phase 0: Roast (direct, not via factory)
│   └── adversarial council stress test
│
├── Phase 1-2: Architecture + Design
│   └── factory.ts spawns ProjectShepherd, SoftwareArchitect, BrandGuardian, UI Designer, etc.
│
├── Phase 3: BUILD (core)
│   └── factory.ts spawns FrontendDev, BackendDev, DBDesigner, AuthConfig, PaymentConfig, etc.
│
├── Phase 4: Security + QA
│   └── factory.ts spawns AppSecEngineer, CodeReviewer, RealityChecker, AccessibilityAuditor
│
├── Phase 5: GTM Strategy
│   └── factory.ts spawns OutboundStrategist, SEO Specialist, ContentCreator, EmailStrategist, etc.
│
├── Phase 6: Paid Acquisition
│   └── factory.ts spawns PPCStrategist, PaidSocialStrategist, AdCreativeStrategist, TrackingSpecialist
│
├── Phase 7: Post-Launch Ops
│   └── factory.ts spawns AnalyticsReporter, ExecutiveSummarizer, CustomerSuccessManager
│
└── Verify — run tsc --noEmit, npm run build, playwright
```

### Context Management

Claude gets dumber as context fills up. Run phases separately to keep context fresh:

- Run `/handoff` to dump structured context to `CURRENT-STATE.md` before clearing
- Keep context under ~25% full (check with `/context`)
- Reset with `/clear` after each Phase boundary
- Resume by reading `CURRENT-STATE.md` and reopening key files
- Each subagent spawned via `task` gets a fresh context automatically

**Note:** Not all 50+ subagents run at once. The factory's PlanPrompt instructions tell the PlanAgent to run phases SEQUENTIALLY and only spawn the subagents needed for the current phase. The PlanAgent manages this via its `write_todos` planning tool.

---

## Step 6: Reference the Right Template

| If Building... | Load These Reference Files |
|---------------|---------------------------|
| **Marketing / Conversion Site** | `REFERENCE/SKILL-INDEX.md` + `REFERENCE/VOLTAGENT.md` |
| **Any project with Trigger.dev** | `REFERENCE/TRIGGER-DEV.md` |
| **Any project needing design** | `REFERENCE/SKILL-INDEX.md` |
| **All projects (build phase)** | `REFERENCE/VOLTAGENT.md` |
| **Multi-agent orchestration** | `.opencode/nexus/` (NEXUS strategy playbooks) |

---

## Universal Anti-Patterns (All Projects)

These apply to EVERY project, not just websites:

- ❌ Placeholder content, lorem ipsum, TODO, `// rest of the code`
- ❌ Corporate language: leveraging, synergies, comprehensive, solutions, seamless, cutting-edge, world-class, industry-leading, committed to excellence, client-centric, bespoke
- ❌ Auto-playing video/audio
- ❌ Cookie walls that block content
- ❌ Submitting a build that fails `npm run build` or `tsc --noEmit`
- ❌ Generic testimonials without real names
- ❌ Emojis as icons (use SVG from lucide-react)
- ❌ Hardcoded secrets or API keys
- ❌ No error handling for API calls
- ❌ Sentences over 20 words in key UI copy
- ❌ Skipping Phase -1 (validation) or Phase 5 (GTM) — those are where revenue comes from

---

## The Money Rule

**Phase -1 and Phase 5 are where the $100K comes from.** Not the code.

- Phase -1 ensures you build something people will pay for (saves months of wasted dev)
- Phase 5 ensures you have a plan to actually sell it (GTM playbook, not "build it and they'll come")

**SaaS math:** $97/mo × 100 users = $9,700/mo (takes 12-24 months to reach 100 signups)
**Agency math:** $7,500 setup + $797/mo × 6 clients = $12,282/mo (takes 3-6 months to close 6 clients)

Skip Phase 3 and you have nothing to deliver. Skip Phase -1 and you sell nothing anyone wants. Skip Phase 5 and you have a service nobody knows about. **Run all 9 phases.**

---

## Final Rule

The reference files contain the specific rules for each project type. This file is the **decision engine** — classify, route, execute. The reference files are the **rulebooks** — follow them exactly.

*Everything is a system. The system doesn't change. The execution gets sharper.*

