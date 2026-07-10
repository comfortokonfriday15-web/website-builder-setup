import type { ProjectType } from "../skills/registry.js";

export type AgencyPhase =
  | "pre-validate"
  | "pre-product"
  | "pre-pricing"
  | "architecture"
  | "brand-design"
  | "build"
  | "qa"
  | "security-review"
  | "gtm"
  | "paid-media"
  | "post-launch";

export interface AgencyAgent {
  name: string
  slug: string
  division: string
  description: string
  phase: AgencyPhase
  promptTemplate: string
  projectTypes: ProjectType[]
}

export interface PhaseDefinition {
  id: AgencyPhase
  label: string
  order: number
  description: string
  triggerPrompt: string
  handoffTemplate: string
}

export const AGENCY_PHASES: PhaseDefinition[] = [
  {
    id: "pre-validate",
    label: "Market Validation & PRD",
    order: -1,
    description: "Product management, competitive analysis, market validation, and PRD writing before any code is written.",
    triggerPrompt: "Validate this service package through market research, competitive analysis, and client pain point verification. Write a structured PRD for an agency deliverable.",
    handoffTemplate: "PRD_<project>.md with validated pain points, competitive landscape, client personas, success metrics, and prioritized feature list.",
  },
  {
    id: "pre-pricing",
    label: "Offer Design & Pricing",
    order: 0,
    description: "Service package pricing, setup fee + monthly retainer design, scope of work definition, and offer construction.",
    triggerPrompt: "Design service package pricing: setup fee + monthly retainer. Define scope of work, deliverables, and boundaries for each tier (Launch/Grow/Scale).",
    handoffTemplate: "PRICING_<project>.md with tier structure, setup fees, monthly retainers, scope of work definitions, and positioning statement.",
  },
  {
    id: "architecture",
    label: "Architecture & Planning",
    order: 1,
    description: "Workflow mapping, project timelines, dependency mapping, and technical architecture.",
    triggerPrompt: "Map the full workflow, design the technical architecture, create project timeline with dependencies.",
    handoffTemplate: "ARCH_<project>.md with workflow diagrams, data model, component tree, and project timeline.",
  },
  {
    id: "brand-design",
    label: "Brand & Design",
    order: 2,
    description: "Brand identity, visual direction, UX design, design tokens, and brand guidelines.",
    triggerPrompt: "Create brand identity, design system, UX flow, and visual direction for the project.",
    handoffTemplate: "BRAND_<project>.md with brand guidelines, design tokens, color palette, typography, and UI mockups.",
  },
  {
    id: "build",
    label: "Engineering & Development",
    order: 3,
    description: "Full-stack development with React, Trigger.dev, PostgreSQL. Auth and payments added per client need.",
    triggerPrompt: "Build the full application following the PRD, architecture, and design spec. All code must be production-ready with no placeholders.",
    handoffTemplate: "Completed application code. All TypeScript compiles, tests pass, dev server runs without errors.",
  },
  {
    id: "security-review",
    label: "Security Review",
    order: 4,
    description: "Application security review, threat modeling, compliance check, secrets scanning.",
    triggerPrompt: "Review the application for security vulnerabilities, hardcoded secrets, auth flaws, and compliance issues.",
    handoffTemplate: "SECURITY_<project>.md with findings, severity ratings, and remediation steps. Zero critical or high findings to ship.",
  },
  {
    id: "qa",
    label: "Quality Assurance",
    order: 5,
    description: "Testing, QA, accessibility audit, performance benchmarking, and reality check.",
    triggerPrompt: "Run full QA suite: functional testing, accessibility audit, performance benchmarking, and reality check.",
    handoffTemplate: "QA_<project>.md with test results, accessibility score, performance metrics, and NEEDS-WORK / SHIP-READY verdict.",
  },
  {
    id: "gtm",
    label: "Go-to-Market Strategy",
    order: 6,
    description: "Sales strategy, content marketing, SEO, email sequences, social media launch, community building.",
    triggerPrompt: "Build the go-to-market strategy: ICP definition, channel selection, content calendar, email sequences, social media plan, and sales outreach playbook.",
    handoffTemplate: "GTM_<project>.md with channel strategy, content calendar, email flows, social media plan, and 90-day launch timeline.",
  },
  {
    id: "paid-media",
    label: "Paid Acquisition",
    order: 7,
    description: "Google Ads, Meta Ads, LinkedIn Ads, ad creative, tracking setup.",
    triggerPrompt: "Set up paid acquisition channels: campaign architecture, ad creative, audience targeting, tracking, and budget allocation.",
    handoffTemplate: "PAID_<project>.md with campaign structure, ad creative library, tracking setup, and KPIs.",
  },
  {
    id: "post-launch",
    label: "Post-Launch Operations",
    order: 8,
    description: "Client success: onboarding handoff, monthly check-ins, quarterly business reviews, upsell and referral triggers.",
    triggerPrompt: "Set up post-launch operations: client success workflows, analytics dashboards, quarterly business review templates, and upsell/referral triggers.",
    handoffTemplate: "OPS_<project>.md with client onboarding SOP, analytics dashboards, QBR template, and expansion playbook.",
  },
];

export const AGENCY_AGENTS: AgencyAgent[] = [
  // === PHASE: PRE-VALIDATE (Product Division) ===
  {
    name: "Product Manager",
    slug: "product-manager",
    division: "product",
    description: "Full lifecycle product owner — discovery, PRDs, roadmap, GTM, outcome measurement.",
    phase: "pre-validate",
    promptTemplate: "Act as a seasoned Product Manager. Write a PRD for this project: validate the market, define user personas, list success metrics, prioritize features. Output: PRD_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  {
    name: "Trend Researcher",
    slug: "product-trend-researcher",
    division: "product",
    description: "Market intelligence analyst — emerging trends, competitive analysis, opportunity assessment.",
    phase: "pre-validate",
    promptTemplate: "Act as a Trend Researcher. Analyze the market for this product: identify emerging trends, map competitive landscape, assess market opportunity. Output: COMPETITIVE_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Feedback Synthesizer",
    slug: "product-feedback-synthesizer",
    division: "product",
    description: "Multi-channel user feedback analyst — sentiment analysis, theme identification, feature request prioritization.",
    phase: "pre-validate",
    promptTemplate: "Act as a Feedback Synthesizer. Analyze user pain points and feedback for this market: identify themes, prioritize needs, cross-reference with competitor gaps. Output: VALIDATION_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
  // === PHASE: PRE-PRICING (Sales + Specialized) ===
  {
    name: "Offer & Lead Gen Strategist",
    slug: "sales-offer-lead-gen-strategist",
    division: "sales",
    description: "Top-of-funnel architect — irresistible offers, lead magnets, value-equation construction.",
    phase: "pre-pricing",
    promptTemplate: "Act as an Offer Strategist. Design the offer architecture: pricing tiers, lead magnets, value proposition, and competitive positioning. Output: OFFER_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app"],
  },
  // === PHASE: ARCHITECTURE (Project Management + Workflow) ===
  {
    name: "Project Shepherd",
    slug: "project-management-project-shepherd",
    division: "project-management",
    description: "Cross-functional project coordinator — timeline management, dependency mapping, stakeholder alignment.",
    phase: "architecture",
    promptTemplate: "Act as a Project Shepherd. Map the full project timeline: identify dependencies, sequence work, assign resources, set milestones. Output: TIMELINE_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  {
    name: "Studio Producer",
    slug: "project-management-studio-producer",
    division: "project-management",
    description: "Executive creative strategist — multi-project portfolio management, resource allocation, stakeholder relationships.",
    phase: "architecture",
    promptTemplate: "Act as a Studio Producer. Plan resource allocation and portfolio fit: assess capacity, identify bottlenecks, set quality gates. Output: PRODUCTION_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
  // === PHASE: BRAND & DESIGN (Design Division) ===
  {
    name: "Brand Guardian",
    slug: "design-brand-guardian",
    division: "design",
    description: "Brand strategist and identity guardian — brand strategy, visual identity, voice/tone guidelines.",
    phase: "brand-design",
    promptTemplate: "Act as a Brand Guardian. Develop the brand identity: brand strategy, visual identity system, voice and tone guidelines, brand architecture. Output: BRAND_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "redesign"],
  },
  {
    name: "UI Designer",
    slug: "design-ui-designer",
    division: "design",
    description: "Visual design systems specialist — component libraries, design tokens, pixel-perfect interfaces, WCAG AA.",
    phase: "brand-design",
    promptTemplate: "Act as a UI Designer. Create visual design system: component library, design tokens, responsive grid, accessibility compliance. Output: DESIGN_SYSTEM_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app", "real-time-app", "redesign"],
  },
  {
    name: "UX Researcher",
    slug: "design-ux-researcher",
    division: "design",
    description: "User behavior analyst — qualitative/quantitative research, persona development, usability testing, journey maps.",
    phase: "brand-design",
    promptTemplate: "Act as a UX Researcher. Design the user experience: user flows, journey maps, interaction patterns, usability heuristics. Output: UX_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app", "real-time-app"],
  },
  {
    name: "Whimsy Injector",
    slug: "design-whimsy-injector",
    division: "design",
    description: "Brand personality specialist — delightful micro-interactions, Easter eggs, gamification, witty microcopy.",
    phase: "brand-design",
    promptTemplate: "Act as a Whimsy Injector. Add personality to the experience: micro-interactions, Easter eggs, gamification elements, delightful moments. Output: WHIMSY_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app", "redesign"],
  },
  // === PHASE: BUILD (Engineering Division - select best) ===
  {
    name: "Software Architect",
    slug: "engineering-software-architect",
    division: "engineering",
    description: "System design — DDD, bounded contexts, architectural patterns, trade-off analysis, ADRs.",
    phase: "build",
    promptTemplate: "Act as a Software Architect. Review the technical architecture: validate patterns, identify risks, document decisions with ADRs. Output: ARCHITECTURE_REVIEW.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app", "data-pipeline", "real-time-app"],
  },
  {
    name: "Database Optimizer",
    slug: "engineering-database-optimizer",
    division: "engineering",
    description: "PostgreSQL performance expert — query plan analysis, indexing strategies, N+1 detection, connection pooling.",
    phase: "build",
    promptTemplate: "Act as a Database Optimizer. Review Prisma schema and queries: identify N+1 patterns, recommend indexes, optimize query performance. Output: DB_REVIEW.md",
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app"],
  },
  {
    name: "Code Reviewer",
    slug: "engineering-code-reviewer",
    division: "engineering",
    description: "Constructive PR reviewer — correctness, security, maintainability, performance. Mentors not gatekeeps.",
    phase: "build",
    promptTemplate: "Act as a Code Reviewer. Review the generated code: check correctness, security, maintainability, TypeScript strictness. Output: CODE_REVIEW.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  // === PHASE: SECURITY REVIEW (Security Division) ===
  {
    name: "AppSec Engineer",
    slug: "security-appsec-engineer",
    division: "security",
    description: "SDLC security — SAST/DAST, secure code review, code-level vulnerability detection.",
    phase: "security-review",
    promptTemplate: "Act as an AppSec Engineer. Review the application for vulnerabilities: hardcoded secrets, auth flaws, SQL injection, XSS, CSRF, insecure dependencies. Output: SECURITY_REVIEW.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app", "real-time-app"],
  },
  // === PHASE: QA (Testing Division) ===
  {
    name: "Reality Checker",
    slug: "testing-reality-checker",
    division: "testing",
    description: "Evidence-based certification gate — quality gates, production readiness, default-to-NEEDS-WORK posture.",
    phase: "qa",
    promptTemplate: "Act as a Reality Checker. Audit the build: check all features work end-to-end, no console errors, responsive at all breakpoints, load states handled, error states handled. Output: SHIP_CHECK.md with SHIP-READY or NEEDS-WORK verdict.",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  {
    name: "Accessibility Auditor",
    slug: "testing-accessibility-auditor",
    division: "testing",
    description: "WCAG auditing — assistive technology testing, screen reader testing, inclusive design verification.",
    phase: "qa",
    promptTemplate: "Act as an Accessibility Auditor. Audit WCAG compliance: check color contrast, keyboard navigation, screen reader support, focus management. Output: ACCESSIBILITY_AUDIT.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app", "real-time-app", "redesign"],
  },
  {
    name: "Performance Benchmarker",
    slug: "testing-performance-benchmarker",
    division: "testing",
    description: "Speed testing, load testing, performance tuning, optimization recommendations.",
    phase: "qa",
    promptTemplate: "Act as a Performance Benchmarker. Run performance analysis: check bundle size, Lighthouse scores, load times, render performance. Output: PERF_BENCHMARK.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app", "real-time-app"],
  },
  // === PHASE: GTM (Sales Division) ===
  {
    name: "Outbound Strategist",
    slug: "sales-outbound-strategist",
    division: "sales",
    description: "Signal-based outbound specialist — multi-channel prospecting sequences, ICP definition, pipeline building.",
    phase: "gtm",
    promptTemplate: "Act as an Outbound Strategist. Design the outbound sales playbook: ICP definition, signal-based prospecting sequences, channel mix, messaging framework, reply rate optimization. Output: OUTBOUND_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app"],
  },
  {
    name: "Deal Strategist",
    slug: "sales-deal-strategist",
    division: "sales",
    description: "MEDDPICC qualification master — scores opportunities, exposes pipeline risk, builds win strategies.",
    phase: "gtm",
    promptTemplate: "Act as a Deal Strategist. Design the sales qualification framework: MEDDPICC scoring, competitive positioning, win themes, objection handling. Output: SALES_PLAYBOOK_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Pipeline Analyst",
    slug: "sales-pipeline-analyst",
    division: "sales",
    description: "Revenue operations analyst — pipeline velocity, forecast accuracy, deal scoring.",
    phase: "gtm",
    promptTemplate: "Act as a Pipeline Analyst. Build the revenue model: pipeline velocity targets, conversion rate benchmarks, revenue forecasting, monthly recurring revenue model. Output: PIPELINE_MODEL_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app"],
  },
  // === PHASE: GTM (Marketing Division) ===
  {
    name: "SEO Specialist",
    slug: "marketing-seo-specialist",
    division: "marketing",
    description: "White-hat search strategist — technical SEO, content optimization, E-E-A-T compliance, SERP feature capture.",
    phase: "gtm",
    promptTemplate: "Act as an SEO Specialist. Build the SEO strategy: keyword clusters, technical SEO setup, content briefs for topic clusters, structured data, and link building plan. Output: SEO_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce"],
  },
  {
    name: "Content Creator",
    slug: "marketing-content-creator",
    division: "marketing",
    description: "Multi-platform content strategist — editorial calendars, copy, video scripts, brand storytelling.",
    phase: "gtm",
    promptTemplate: "Act as a Content Creator. Build the content strategy: editorial calendar, content pillars, topic clusters, content formats, distribution channels. Output: CONTENT_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Email Strategist",
    slug: "marketing-email-strategist",
    division: "marketing",
    description: "CRM-driven lifecycle architect — segmentation, automation sequences, deliverability management.",
    phase: "gtm",
    promptTemplate: "Act as an Email Strategist. Design the email marketing system: welcome sequences, nurture flows, onboarding emails, reactivation campaigns, deliverability setup. Output: EMAIL_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Social Media Strategist",
    slug: "marketing-social-media-strategist",
    division: "marketing",
    description: "Cross-platform campaign orchestrator — LinkedIn, Twitter, professional networks. B2B social selling.",
    phase: "gtm",
    promptTemplate: "Act as a Social Media Strategist. Build the social media strategy: platform selection, content calendar, engagement plan, growth tactics, social selling playbook. Output: SOCIAL_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "LinkedIn Content Creator",
    slug: "marketing-linkedin-content-creator",
    division: "marketing",
    description: "Personal brand architect — scroll-stopping thought leadership, strong hooks, inbound opportunity generation.",
    phase: "gtm",
    promptTemplate: "Act as a LinkedIn Content Creator. Design the LinkedIn content strategy: thought leadership topics, posting cadence, engagement strategy, personal branding for founders. Output: LINKEDIN_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Video Optimization Specialist",
    slug: "marketing-video-optimization-specialist",
    division: "marketing",
    description: "YouTube algorithm expert — audience retention, thumbnail A/B testing, cross-platform syndication.",
    phase: "gtm",
    promptTemplate: "Act as a Video Optimization Specialist. Build the video content strategy: YouTube SEO, content formats, production briefs, distribution plan. Output: VIDEO_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "PR & Communications Manager",
    slug: "marketing-pr-communications-manager",
    division: "marketing",
    description: "Media relations, press releases, crisis communications, executive thought leadership.",
    phase: "gtm",
    promptTemplate: "Act as a PR Manager. Build the launch PR strategy: media list, press release, pitch angles, launch timeline, executive thought leadership plan. Output: PR_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
  // === PHASE: PAID MEDIA ===
  {
    name: "PPC Campaign Strategist",
    slug: "paid-media-ppc-strategist",
    division: "paid-media",
    description: "Google/Microsoft/Amazon Ads — account architecture, bidding strategies, budget allocation, scaling.",
    phase: "paid-media",
    promptTemplate: "Act as a PPC Strategist. Design the paid search strategy: campaign architecture, keyword themes, bidding strategy, budget allocation, ad extensions. Output: PPC_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Paid Social Strategist",
    slug: "paid-media-paid-social-strategist",
    division: "paid-media",
    description: "Meta, LinkedIn, TikTok — cross-platform social ad programs, audience strategy, platform selection.",
    phase: "paid-media",
    promptTemplate: "Act as a Paid Social Strategist. Design the paid social strategy: platform selection, audience segments, creative strategy, budget allocation, testing framework. Output: PAID_SOCIAL_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  {
    name: "Ad Creative Strategist",
    slug: "paid-media-creative-strategist",
    division: "paid-media",
    description: "RSA copy, Meta creative, Performance Max assets — creative launches, testing, ad fatigue refreshes.",
    phase: "paid-media",
    promptTemplate: "Act as an Ad Creative Strategist. Generate ad creative: headline variants, body copy, visual direction, CTA testing, creative refresh calendar. Output: AD_CREATIVE_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce"],
  },
  {
    name: "Tracking & Measurement Specialist",
    slug: "paid-media-tracking-specialist",
    division: "paid-media",
    description: "GTM, GA4, conversion tracking, CAPI — new implementations, tracking audits, platform migrations.",
    phase: "paid-media",
    promptTemplate: "Act as a Tracking Specialist. Set up measurement infrastructure: GTM container, GA4 property, conversion tracking, CAPI setup, UTM conventions. Output: TRACKING_<project>.md",
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app"],
  },
  // === PHASE: POST-LAUNCH (Support Division) ===
  {
    name: "Analytics Reporter",
    slug: "support-analytics-reporter",
    division: "support",
    description: "Data analysis, dashboards, insights, KPI tracking, business intelligence.",
    phase: "post-launch",
    promptTemplate: "Act as an Analytics Reporter. Set up the analytics dashboard: KPIs, data sources, dashboard layout, reporting cadence, automated reports. Output: ANALYTICS_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline"],
  },
  {
    name: "Executive Summary Generator",
    slug: "support-executive-summary-generator",
    division: "support",
    description: "C-suite communication, strategic summaries, executive reporting, decision support.",
    phase: "post-launch",
    promptTemplate: "Act as an Executive Summary Generator. Create the executive dashboard: revenue metrics, growth KPIs, customer health, competitive position, strategic recommendations. Output: EXECUTIVE_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app", "data-pipeline"],
  },
  {
    name: "Customer Success Manager",
    slug: "specialized-customer-success-manager",
    division: "specialized",
    description: "Onboarding, health & retention, QBRs, churn prevention, expansion revenue.",
    phase: "post-launch",
    promptTemplate: "Act as a Customer Success Manager. Design the customer success system: onboarding flow, health scoring, QBR template, churn prevention triggers, expansion playbook. Output: CS_<project>.md",
    projectTypes: ["fullstack-app", "ecommerce", "ai-app"],
  },
];

export const PHASE_AGENTS: Record<AgencyPhase, AgencyAgent[]> = {} as Record<AgencyPhase, AgencyAgent[]>;
for (const agent of AGENCY_AGENTS) {
  if (!PHASE_AGENTS[agent.phase]) PHASE_AGENTS[agent.phase] = [];
  PHASE_AGENTS[agent.phase].push(agent);
}

export function getAgentsForProject(phase: AgencyPhase, projectType: ProjectType): AgencyAgent[] {
  const phaseAgents = PHASE_AGENTS[phase] ?? [];
  return phaseAgents.filter((a) => a.projectTypes.includes(projectType));
}

export function getPhaseByOrder(order: number): PhaseDefinition | undefined {
  return AGENCY_PHASES.find((p) => p.order === order);
}

export function getPhasesForProjectType(projectType: ProjectType): PhaseDefinition[] {
  const applicable = new Set<AgencyPhase>();
  for (const agent of AGENCY_AGENTS) {
    if (agent.projectTypes.includes(projectType)) {
      applicable.add(agent.phase);
    }
  }
  return AGENCY_PHASES.filter((p) => applicable.has(p.id));
}
