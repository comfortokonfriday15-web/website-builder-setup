# Skill Index — Full Arsenal

**199 agency agents + 70 skills** organized by discipline (17 core + 44 marketing + 6 Trigger.dev + 3 upgrades). Skills are auto-injected into subagent prompts by `src/skills/registry.ts`. Agency agents are installed in `.opencode/agents/` and routed per phase via `src/agency/agency-registry.ts`.

---

## Design Intelligence & Systems

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `ui-ux-pro-max` | UXDesigner, Designer | 67 styles, 96 palettes, 57 font pairings. Run `python3 search.py "<industry> <keywords>" --design-system -p "Project Name"` for a complete design system |
| `awesome-design-md` | Designer, UXDesigner | 74+ pre-made DESIGN.md files from real brands (Apple, Stripe, Linear, etc.). Auto-picks via brief keywords. See `pickDesignVibe()` |
| `brandkit` | Designer | Premium brand identity image generation — logos, mood boards, identity decks |

## Visual Direction

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `image` | Designer | Marketing image generation — infographics, social graphics, ad creative (from marketingskills) |

## Frontend Craft

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `design-taste-frontend` | FrontendDev, Designer | Anti-slop frontend — reads brief, infers design direction, ships non-templated interfaces |
| `high-end-visual-design` | UXDesigner, FrontendDev | Exact fonts, spacing, shadows, card structures, animations |
| `minimalist-ui` | UXDesigner, Designer | Medical/Dental/Legal, clean editorial. Warm monochrome, typographic contrast, flat bento grids |
| `industrial-brutalist-ui` | UXDesigner, Designer | Tech/Security dashboards. Swiss typography, military terminal aesthetic |

## Motion & Animation

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `gpt-taste` | MotionEngineer, FrontendDev, UXDesigner | GSAP ScrollTriggers (pinning, stacking, scrubbing, gapless bento) |
| `emil-design-eng` | ALL subagents | Micro-interactions, hover states, transition polish, invisible details |

## Audit & Quality

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `impeccable` | ALL subagents | 41 anti-patterns, visual hierarchy, accessibility, performance, responsive |
| `redesign-existing-projects` | Designer, UXDesigner, FrontendDev | Upgrade existing websites to premium quality without breaking functionality |
| `full-output-enforcement` | ALL subagents | Bans placeholder patterns. Every line is real code. |

## Upgrades: Roast, Verify, Handoff

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `roast` | ALL subagents | Idea stress-test via 5-adversarial council. Run before any build to avoid shipping wrong thing |
| `session-handoff` | ALL subagents | Structured context dump to CURRENT-STATE.md before /clear. Prevents context rot |
| `goal-runner` | ALL subagents | Objective done conditions with separate evaluator. Prevents finished-but-not-working builds |

## Trigger.dev Backend (6 skills)

| Skill | Subagent(s) | Purpose |
|-------|-------------|---------|
| `trigger-authoring-tasks` | BackendDev | Define tasks: task(), schemaTask(), retries, queues, idempotency |
| `trigger-realtime-and-frontend` | FrontendDev, BackendDev | Real-time streams, hooks, browser triggering |
| `trigger-authoring-chat-agent` | BackendDev, AIIntegration | AI chat agents with streaming, tool use |
| `trigger-chat-agent-advanced` | BackendDev, AIIntegration | Multi-agent orchestration, human-in-the-loop |
| `trigger-cost-savings` | BackendDev | Concurrency, queue sizing, batch optimization |
| `trigger-getting-started` | BackendDev | Project bootstrap: init, auth, config, first task |

## Copywriting & Marketing (44 skills)

All injected into the **Copywriter** subagent for marketing-site, ecommerce, and redesign builds:

| Category | Skills |
|----------|--------|
| **Copy & Content** | `copywriting`, `copy-editing`, `content-strategy`, `product-marketing`, `sales-enablement`, `marketing-psychology` |
| **Conversion** | `cro`, `pricing`, `lead-magnets`, `ab-testing` |
| **Channels** | `cold-email`, `emails`, `sms`, `social`, `video`, `ads`, `ad-creative` |
| **Strategy** | `marketing-ideas`, `marketing-plan`, `launch`, `referrals`, `public-relations` |
| **UX/Flow** | `onboarding`, `signup`, `popups`, `paywalls`, `co-marketing`, `community-marketing`, `prospecting` |
| **Research** | `competitor-profiling`, `competitors`, `customer-research`, `analytics` |
| **SEO** | `seo-audit`, `ai-seo`, `programmatic-seo`, `site-architecture`, `schema`, `directory-submissions` |
| **Other** | `free-tools`, `revops`, `churn-prevention`, `aso` |

## Components

| Tool | When to Use | Purpose |
|------|-------------|---------|
| `21st.dev Magic` | All React projects | 100+ production-ready React components (MCP server) |

---

## Routing: Project Type → Subagents

Defined in `src/skills/registry.ts` — auto-classifies from brief. Each project type now has 30-50+ agents across 9 phases (see `src/agency/agency-registry.ts` for the full phase mapping):

| Project Type | Phase -1 Validate | Phase 0 Roast | Phase 1 Architecture | Phase 2 Design | Phase 3 Build | Phase 4 QA | Phase 5 GTM | Phase 6 Paid | Phase 7 Ops |
|-------------|-------------------|---------------|---------------------|----------------|--------------|------------|-------------|--------------|-------------|
| **Full-Stack App** | PM, Trend, Feedback, Offer | ✓ | Shepherd, Architect, DB | Brand, UI, UX, Whimsy | Full stack | AppSec, Code, Reality, A11y, Perf | Outbound, Deal, Pipeline, SEO, Content, Email, Social, LinkedIn, PR | PPC, PaidSocial, Creative, Tracking | Analytics, Exec, CS |
| **E-Commerce** | PM, Trend, Feedback, Offer | ✓ | Shepherd, Architect, DB | Brand, UI, UX | Full stack + stripe | Same | Same + less LinkedIn | Same | Same |
| **Marketing Site** | PM, Trend, Offer | ✓ | (lite) | Brand, UI | Design, Copy, FE, Motion | Reality, A11y, Perf | SEO, Content, Social | PPC, PaidSocial, Creative, Tracking | (skip) |
| **AI App** | PM, Trend, Feedback, Offer | ✓ | Shepherd, Architect, DB | Brand, UI, UX, Whimsy | Full + AI | Same | Outbound, Deal, Pipeline, Content, Email, Social, LinkedIn, PR | PPC, PaidSocial, Tracking | Analytics, Exec, CS |
| **Automation** | PM, Offer | ✓ | (lite) | (skip) | Backend, DB | Reality | Outbound, Pipeline | (skip) | Analytics |
| **Data Pipeline** | PM | ✓ | Architect, DB | (skip) | Backend, DB | Reality | Pipeline | (skip) | Analytics, Exec |
| **Real-Time** | PM, Trend | ✓ | Architect, DB | UI, UX | Backend, FE | Reality, A11y, Perf | SEO, Content, Social, LinkedIn | Tracking | Analytics |

## Loading Order (Automatic)

The system auto-injects skills in this order per subagent:

1. `full-output-enforcement` — Quality baseline (all subagents)
2. `roast` — Idea stress-test (all subagents, before build phase)
3. Role-specific design/backend skills
4. Agency agent base prompts (loaded from registry.ts for each division)
5. `emil-design-eng` — Polish & micro-interactions (all subagents)
6. `goal-runner` — Objective completion conditions (all subagents, during build phase)
7. `impeccable` — Final quality standards (all subagents)
8. `session-handoff` — Context preservation (all subagents, on /handoff)
9. Marketing skills — Injected into Copywriter subagent
10. Sales/GTM skills — Injected into agency sales subagents

No manual loading needed. Just run `src/orchestrator.ts` with the project brief.

---

## How to Activate Agency Agents

| If you need to... | Do this |
|------------------|---------|
| Write a PRD | Reference `.opencode/agents/product-manager.md` or call `task(ProductManager)` |
| Plan GTM strategy | Reference `.opencode/agents/sales-outbound-strategist.md` or call `task(OutboundStrategist)` |
| Create brand identity | Reference `.opencode/agents/design-brand-guardian.md` or call `task(BrandGuardian)` |
| QA the build | Reference `.opencode/agents/testing-reality-checker.md` or call `task(RealityChecker)` |
| Set up paid ads | Reference `.opencode/agents/paid-media-ppc-strategist.md` or call `task(PPCStrategist)` |

All 199 agents are installed in `.opencode/agents/`. Browse them by division:
