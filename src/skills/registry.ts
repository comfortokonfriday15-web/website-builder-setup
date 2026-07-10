import * as fs from "node:fs";
import * as path from "node:path";

export type SubagentType =
  | "Designer"
  | "UXDesigner"
  | "FrontendDev"
  | "BackendDev"
  | "DBDesigner"
  | "Copywriter"
  | "AuthConfig"
  | "PaymentConfig"
  | "AIIntegration"
  | "MotionEngineer"
  // Agency division subagents (installed from agency-agents repo)
  | "ProductManager"
  | "TrendResearcher"
  | "FeedbackSynthesizer"
  | "OfferStrategist"
  | "PricingAnalyst"
  | "BrandGuardian"
  | "UI Designer"
  | "UXResearcher"
  | "WhimsyInjector"
  | "SoftwareArchitect"
  | "DatabaseOptimizer"
  | "CodeReviewer"
  | "OutboundStrategist"
  | "DealStrategist"
  | "PipelineAnalyst"
  | "SEO Specialist"
  | "ContentCreator"
  | "EmailStrategist"
  | "SocialMediaStrategist"
  | "LinkedInContentCreator"
  | "PRManager"
  | "VideoStrategist"
  | "PPCStrategist"
  | "PaidSocialStrategist"
  | "AdCreativeStrategist"
  | "TrackingSpecialist"
  | "ProjectShepherd"
  | "AppSecEngineer"
  | "RealityChecker"
  | "AccessibilityAuditor"
  | "PerformanceBenchmarker"
  | "AnalyticsReporter"
  | "ExecutiveSummarizer"
  | "CustomerSuccessManager"
  | "All";

export type ProjectType =
  | "marketing-site"
  | "fullstack-app"
  | "ecommerce"
  | "automation"
  | "ai-app"
  | "data-pipeline"
  | "real-time-app"
  | "redesign";

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  "marketing-site": "Marketing Site",
  "fullstack-app": "Full-Stack App",
  ecommerce: "E-Commerce / Payments",
  automation: "Automation Backend",
  "ai-app": "AI-Powered App",
  "data-pipeline": "Data Pipeline",
  "real-time-app": "Real-Time App",
  redesign: "Redesign Project",
};

export interface SkillEntry {
  name: string
  path: string
  summary: string
  subagents: SubagentType[]
  projectTypes: ProjectType[]
}

const projectRoot = process.cwd();
const claudeSkillsDir = path.join(projectRoot, ".claude", "skills");
const agentsSkillsDir = path.join(projectRoot, ".agents", "skills");
const marketingSkillsDir = path.join(projectRoot, "marketingskills", "skills");
const triggerSdkSkillsDir = path.join(projectRoot, "trigger.dev", "packages", "trigger-sdk", "skills");
const triggerCliSkillsDir = path.join(projectRoot, "trigger.dev", "packages", "cli-v3", "skills");

export const SKILL_REGISTRY: SkillEntry[] = [
  {
    name: "full-output-enforcement",
    path: path.join(agentsSkillsDir, "full-output-enforcement", "SKILL.md"),
    summary: "Bans placeholder patterns. Every line must be real, complete code. No // ..., no TODOs, no skeletons.",
    subagents: ["All"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  {
    name: "awesome-design-md",
    path: path.join(claudeSkillsDir, "awesome-design-md", "SKILL.md"),
    summary: "74+ pre-made DESIGN.md files from real brands (Apple, Stripe, Linear, Nike, SpaceX). Drop one in and match its design language for instant premium UI.",
    subagents: ["Designer", "UXDesigner"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "redesign"],
  },
  {
    name: "brandkit",
    path: path.join(agentsSkillsDir, "brandkit", "SKILL.md"),
    summary: "Premium brand identity image generation — logos, mood boards, identity decks, visual-world presentations.",
    subagents: ["Designer"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "ui-ux-pro-max",
    path: path.join(claudeSkillsDir, "ui-ux-pro-max", "SKILL.md"),
    summary: "Comprehensive design intelligence: 67 styles, 96 palettes, 57 font pairings, 99 UX guidelines, 25 chart types. Searchable design system database.",
    subagents: ["UXDesigner", "Designer"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app", "real-time-app", "redesign"],
  },
  {
    name: "design-taste-frontend",
    path: path.join(agentsSkillsDir, "design-taste-frontend", "SKILL.md"),
    summary: "Anti-slop frontend. Reads the brief, infers design direction, ships interfaces that don't look templated. Landing pages, portfolios, redesigns.",
    subagents: ["FrontendDev", "Designer"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "high-end-visual-design",
    path: path.join(agentsSkillsDir, "high-end-visual-design", "SKILL.md"),
    summary: "Agency-level visual design. Exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks AI cheap defaults.",
    subagents: ["UXDesigner", "FrontendDev"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "redesign"],
  },
  {
    name: "minimalist-ui",
    path: path.join(claudeSkillsDir, "minimalist-ui", "SKILL.md"),
    summary: "Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. Ideal for medical/dental/legal.",
    subagents: ["UXDesigner", "Designer"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "industrial-brutalist-ui",
    path: path.join(claudeSkillsDir, "industrial-brutalist-ui", "SKILL.md"),
    summary: "Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Data-heavy dashboards, portfolios, editorial.",
    subagents: ["UXDesigner", "Designer"],
    projectTypes: ["fullstack-app", "data-pipeline", "real-time-app"],
  },
  {
    name: "gpt-taste",
    path: path.join(agentsSkillsDir, "gpt-taste", "SKILL.md"),
    summary: "Awwwards-level GSAP motion engineering. Python-driven layout randomization, AIDA page structure, gapless bento grids, ScrollTriggers.",
    subagents: ["MotionEngineer", "FrontendDev", "UXDesigner"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "emil-design-eng",
    path: path.join(claudeSkillsDir, "emil-design-eng", "SKILL.md"),
    summary: "Emil Kowalski's UI polish philosophy. Micro-interactions, hover states, transition polish, the invisible details that make software feel great.",
    subagents: ["All"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  {
    name: "impeccable",
    path: path.join(claudeSkillsDir, "impeccable", "SKILL.md"),
    summary: "Final quality pass. 41 anti-patterns, visual hierarchy, accessibility, performance, responsive behavior, typography, color, motion.",
    subagents: ["All"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "ai-app", "real-time-app", "redesign"],
  },

  {
    name: "redesign-existing-projects",
    path: path.join(agentsSkillsDir, "redesign-existing-projects", "SKILL.md"),
    summary: "Audit existing sites, identify generic AI patterns, apply high-end standards without breaking functionality. Works with any CSS framework.",
    subagents: ["Designer", "UXDesigner", "FrontendDev"],
    projectTypes: ["redesign"],
  },
  // === MARKETING SKILLS (injected into Copywriter subagent for marketing builds) ===
  {
    name: "copywriting",
    path: path.join(marketingSkillsDir, "copywriting", "SKILL.md"),
    summary: "Write conversion-optimized marketing copy for every page type. Research-backed, audience-aware, CTA-driven.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce", "redesign"],
  },
  {
    name: "copy-editing",
    path: path.join(marketingSkillsDir, "copy-editing", "SKILL.md"),
    summary: "Edit and refine existing marketing copy for clarity, persuasion, and conversion impact.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "content-strategy",
    path: path.join(marketingSkillsDir, "content-strategy", "SKILL.md"),
    summary: "Plan content topics, editorial calendars, and topic clusters that drive traffic and leads.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "product-marketing",
    path: path.join(marketingSkillsDir, "product-marketing", "SKILL.md"),
    summary: "Position products and craft messaging that differentiates from alternatives and drives adoption.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce", "redesign"],
  },
  {
    name: "sales-enablement",
    path: path.join(marketingSkillsDir, "sales-enablement", "SKILL.md"),
    summary: "Write sales-oriented copy, objection handlers, and conversion-focused messaging for every stage.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "marketing-psychology",
    path: path.join(marketingSkillsDir, "marketing-psychology", "SKILL.md"),
    summary: "Apply psychological triggers — scarcity, social proof, reciprocity — in copy and design decisions.",
    subagents: ["Copywriter", "Designer"],
    projectTypes: ["marketing-site", "ecommerce", "redesign"],
  },
  {
    name: "cro",
    path: path.join(marketingSkillsDir, "cro", "SKILL.md"),
    summary: "Analyze pages and forms to improve conversion rates. Identify friction points and recommend fixes.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "pricing",
    path: path.join(marketingSkillsDir, "pricing", "SKILL.md"),
    summary: "Design pricing pages, packaging tiers, and pricing psychology to maximize revenue.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "lead-magnets",
    path: path.join(marketingSkillsDir, "lead-magnets", "SKILL.md"),
    summary: "Create lead magnets — guides, checklists, templates — that convert visitors into leads.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "ab-testing",
    path: path.join(marketingSkillsDir, "ab-testing", "SKILL.md"),
    summary: "Plan and run A/B tests on copy, CTAs, layouts, and offers to optimize conversion rates.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "cold-email",
    path: path.join(marketingSkillsDir, "cold-email", "SKILL.md"),
    summary: "Write cold email sequences that get replies and book meetings. Personalization, subject lines, follow-ups.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "emails",
    path: path.join(marketingSkillsDir, "emails", "SKILL.md"),
    summary: "Write email marketing campaigns — newsletters, promotions, drips — that drive opens and clicks.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "sms",
    path: path.join(marketingSkillsDir, "sms", "SKILL.md"),
    summary: "Write SMS marketing messages that cut through noise and drive immediate action.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "social",
    path: path.join(marketingSkillsDir, "social", "SKILL.md"),
    summary: "Write social media content for every platform — organic and paid — that engages and converts.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "video",
    path: path.join(marketingSkillsDir, "video", "SKILL.md"),
    summary: "Write video scripts that hook viewers and drive action. Storytelling, structure, CTAs.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "ads",
    path: path.join(marketingSkillsDir, "ads", "SKILL.md"),
    summary: "Create and optimize paid ad campaigns across Google, Meta, LinkedIn. Strategy, targeting, copy.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "ad-creative",
    path: path.join(marketingSkillsDir, "ad-creative", "SKILL.md"),
    summary: "Generate and iterate ad creative — headlines, body copy, visuals — for testing at scale.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "launch",
    path: path.join(marketingSkillsDir, "launch", "SKILL.md"),
    summary: "Plan and execute product launches with messaging, sequencing, and channel strategy.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "marketing-ideas",
    path: path.join(marketingSkillsDir, "marketing-ideas", "SKILL.md"),
    summary: "Generate creative marketing ideas and campaigns tailored to audience and goals.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "marketing-plan",
    path: path.join(marketingSkillsDir, "marketing-plan", "SKILL.md"),
    summary: "Build comprehensive marketing plans with channel mix, budget, timelines, and KPIs.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "referrals",
    path: path.join(marketingSkillsDir, "referrals", "SKILL.md"),
    summary: "Design referral programs with compelling copy, incentives, and sharing mechanics.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "public-relations",
    path: path.join(marketingSkillsDir, "public-relations", "SKILL.md"),
    summary: "Write press releases, media pitches, and brand stories that earn coverage.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "onboarding",
    path: path.join(marketingSkillsDir, "onboarding", "SKILL.md"),
    summary: "Write onboarding flows, welcome sequences, and activation copy that retains users.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce", "fullstack-app", "ai-app"],
  },
  {
    name: "signup",
    path: path.join(marketingSkillsDir, "signup", "SKILL.md"),
    summary: "Optimize signup and registration flows with persuasive copy and friction reduction.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce", "fullstack-app", "ai-app"],
  },
  {
    name: "popups",
    path: path.join(marketingSkillsDir, "popups", "SKILL.md"),
    summary: "Write popup copy — exit intent, scroll trigger, timed — that captures leads without annoying.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "ecommerce"],
  },
  {
    name: "paywalls",
    path: path.join(marketingSkillsDir, "paywalls", "SKILL.md"),
    summary: "Write paywall copy that converts free users to paid subscribers with clear value framing.",
    subagents: ["Copywriter"],
    projectTypes: ["ecommerce", "fullstack-app", "ai-app"],
  },
  {
    name: "co-marketing",
    path: path.join(marketingSkillsDir, "co-marketing", "SKILL.md"),
    summary: "Plan and execute co-marketing partnerships with joint campaigns and cross-promotion.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "community-marketing",
    path: path.join(marketingSkillsDir, "community-marketing", "SKILL.md"),
    summary: "Build and nurture communities with engagement copy, events, and member-driven growth.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "prospecting",
    path: path.join(marketingSkillsDir, "prospecting", "SKILL.md"),
    summary: "Write prospecting outreach — LinkedIn, email, calls — that starts conversations and builds pipeline.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "competitor-profiling",
    path: path.join(marketingSkillsDir, "competitor-profiling", "SKILL.md"),
    summary: "Analyze competitor messaging, positioning, and gaps to differentiate your offering.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "competitors",
    path: path.join(marketingSkillsDir, "competitors", "SKILL.md"),
    summary: "Research direct and indirect competitors to inform positioning and copy strategy.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "customer-research",
    path: path.join(marketingSkillsDir, "customer-research", "SKILL.md"),
    summary: "Conduct customer research — interviews, surveys, data — to inform messaging and strategy.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site", "redesign"],
  },
  {
    name: "analytics",
    path: path.join(marketingSkillsDir, "analytics", "SKILL.md"),
    summary: "Set up and interpret marketing analytics to measure copy and campaign performance.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "seo-audit",
    path: path.join(marketingSkillsDir, "seo-audit", "SKILL.md"),
    summary: "Audit on-page SEO, technical SEO, and content gaps to improve organic search performance.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "ai-seo",
    path: path.join(marketingSkillsDir, "ai-seo", "SKILL.md"),
    summary: "Apply AI-powered SEO strategies — content optimization, keyword clustering, entity SEO.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "programmatic-seo",
    path: path.join(marketingSkillsDir, "programmatic-seo", "SKILL.md"),
    summary: "Build programmatic SEO pages at scale — templates, data feeds, content generation.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "site-architecture",
    path: path.join(marketingSkillsDir, "site-architecture", "SKILL.md"),
    summary: "Plan site structure, navigation, and URL hierarchy for SEO and user experience.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "schema",
    path: path.join(marketingSkillsDir, "schema", "SKILL.md"),
    summary: "Implement structured data markup for rich snippets and improved search visibility.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "directory-submissions",
    path: path.join(marketingSkillsDir, "directory-submissions", "SKILL.md"),
    summary: "Submit to relevant directories and listings to build backlinks and local SEO presence.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "free-tools",
    path: path.join(marketingSkillsDir, "free-tools", "SKILL.md"),
    summary: "Create free tools and interactive content that attract links, traffic, and leads.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "revops",
    path: path.join(marketingSkillsDir, "revops", "SKILL.md"),
    summary: "Align marketing, sales, and revenue operations with processes, data, and tools.",
    subagents: ["Copywriter"],
    projectTypes: ["marketing-site"],
  },
  {
    name: "churn-prevention",
    path: path.join(marketingSkillsDir, "churn-prevention", "SKILL.md"),
    summary: "Write retention and win-back copy — emails, in-app messages, offers — that reduces churn.",
    subagents: ["Copywriter"],
    projectTypes: ["ecommerce", "fullstack-app", "ai-app"],
  },
  {
    name: "aso",
    path: path.join(marketingSkillsDir, "aso", "SKILL.md"),
    summary: "Optimize app store listings — title, subtitle, description, keywords — for conversions.",
    subagents: ["Copywriter"],
    projectTypes: ["ai-app"],
  },
  {
    name: "image",
    path: path.join(marketingSkillsDir, "image", "SKILL.md"),
    summary: "Generate marketing images — infographics, social graphics, ad creative — that drive engagement.",
    subagents: ["Designer"],
    projectTypes: ["marketing-site"],
  },
  // === NEW: ROAST — IDEA STRESS-TEST ===
  {
    name: "roast",
    path: path.join(agentsSkillsDir, "roast", "SKILL.md"),
    summary: "Stress-test any idea using a council of 5 adversarial personas (Contrarian, Expansionist, First Principles, Researcher, Buyer) + Judge verdict. Run before any build.",
    subagents: ["All"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  // === NEW: SESSION HANDOFF — CONTEXT PRESERVATION ===
  {
    name: "session-handoff",
    path: path.join(agentsSkillsDir, "session-handoff", "SKILL.md"),
    summary: "Dump structured session summary before clearing context. Preserves what was built, key files, open decisions, and resume point.",
    subagents: ["All"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  // === NEW: GOAL RUNNER — OBJECTIVE DONE CONDITIONS ===
  {
    name: "goal-runner",
    path: path.join(agentsSkillsDir, "goal-runner", "SKILL.md"),
    summary: "Define objective completion conditions upfront, spawn parallel subagents, then verify with a separate evaluator. Prevents 'finished but not working' builds.",
    subagents: ["All"],
    projectTypes: ["marketing-site", "fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app", "redesign"],
  },
  // === TRIGGER.DEV SDK SKILLS ===
  {
    name: "trigger-authoring-tasks",
    path: path.join(triggerSdkSkillsDir, "trigger-authoring-tasks", "SKILL.md"),
    summary: "Write backend Trigger.dev tasks: task(), schemaTask(), retries, queues, idempotency, schedules, logging.",
    subagents: ["BackendDev"],
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app"],
  },
  {
    name: "trigger-realtime-and-frontend",
    path: path.join(triggerSdkSkillsDir, "trigger-realtime-and-frontend", "SKILL.md"),
    summary: "Wire frontend to Trigger.dev: real-time run subscriptions, streaming hooks, browser task triggers.",
    subagents: ["FrontendDev", "BackendDev"],
    projectTypes: ["fullstack-app", "real-time-app", "ai-app"],
  },
  {
    name: "trigger-authoring-chat-agent",
    path: path.join(triggerSdkSkillsDir, "trigger-authoring-chat-agent", "SKILL.md"),
    summary: "Build AI chat agents with Trigger.dev: streaming, tool use, conversation management, vector search.",
    subagents: ["BackendDev", "AIIntegration"],
    projectTypes: ["ai-app"],
  },
  {
    name: "trigger-chat-agent-advanced",
    path: path.join(triggerSdkSkillsDir, "trigger-chat-agent-advanced", "SKILL.md"),
    summary: "Advanced Agent patterns: multi-agent orchestration, branching, human-in-the-loop, state management.",
    subagents: ["BackendDev", "AIIntegration"],
    projectTypes: ["ai-app"],
  },
  {
    name: "trigger-cost-savings",
    path: path.join(triggerSdkSkillsDir, "trigger-cost-savings", "SKILL.md"),
    summary: "Optimize Trigger.dev usage: concurrency limits, queue sizing, retry strategy, batch processing.",
    subagents: ["BackendDev"],
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app"],
  },
  {
    name: "trigger-getting-started",
    path: path.join(triggerCliSkillsDir, "trigger-getting-started", "SKILL.md"),
    summary: "Bootstrap Trigger.dev into a project: init, config, auth, first task, dev server setup.",
    subagents: ["BackendDev"],
    projectTypes: ["fullstack-app", "ecommerce", "automation", "ai-app", "data-pipeline", "real-time-app"],
  },
];

export function getSkillsForProjectType(type: ProjectType): SkillEntry[] {
  return SKILL_REGISTRY.filter((s) => s.projectTypes.includes(type));
}

export function getSkillsForSubagent(type: ProjectType, subagent: SubagentType): SkillEntry[] {
  return getSkillsForProjectType(type).filter(
    (s) => s.subagents.includes(subagent) || s.subagents.includes("All"),
  );
}

export interface SubagentDefinition {
  name: string
  description: string
  systemPrompt: string
}

export const BASE_SUBAGENT_DESCRIPTIONS: Record<string, { description: string; basePrompt: string }> = {
  Designer: {
    description: "Visual direction, brand identity, design system selection",
    basePrompt: [
      "You are a visual designer who defines the look and feel of the project.",
      "You select design systems, color palettes, typography, and create brand identity.",
      "You generate reference images for every section.",
      "Your output is a DESIGN.md or design tokens file that FrontendDev will implement.",
    ].join("\n"),
  },
  UXDesigner: {
    description: "Design tokens, user experience, layout architecture",
    basePrompt: [
      "You are a UI/UX designer who architects the user experience and design system.",
      "You define color tokens, typography scale, spacing, shadows, and component behaviors.",
      "You design layout grids, responsive strategies, and interaction patterns.",
      "You generate tailwind.config tokens or design system documentation.",
    ].join("\n"),
  },
  FrontendDev: {
    description: "React + Vite + Tailwind implementation",
    basePrompt: [
      "You are a frontend developer specialized in React, Vite, TypeScript, and Tailwind CSS.",
      "Build pixel-perfect UI components that match the design spec exactly.",
      "Use lucide-react for icons. Never use emojis as icons.",
      "All components must be responsive, accessible, and production-ready.",
      "Write complete code with NO placeholders or TODOs.",
    ].join("\n"),
  },
  BackendDev: {
    description: "Trigger.dev task definitions and API services",
    basePrompt: [
      "You are a backend developer specialized in Trigger.dev SDK v4.",
      "Create task definitions using @trigger.dev/sdk v4 patterns.",
      "Use `task` from @trigger.dev/sdk, NEVER `client.defineJob`.",
      "Include proper error handling, retries, and typed payloads.",
      "Write complete task implementations with NO placeholders.",
    ].join("\n"),
  },
  DBDesigner: {
    description: "Prisma schema and PostgreSQL data modeling",
    basePrompt: [
      "You are a database designer specialized in Prisma ORM with PostgreSQL.",
      "Design normalized schemas with proper relations, indexes, and constraints.",
      "Include proper enum types, optional fields, and timestamps.",
      "Use UUIDs for primary keys where appropriate.",
    ].join("\n"),
  },
  Copywriter: {
    description: "UX copy, brand voice, conversion-optimized content",
    basePrompt: [
      "You are a copywriter who writes clear, conversion-optimized UX copy.",
      "No AI clichés (elevate, seamless, unleash, next-gen).",
      "Write plain, specific language. Sentences under 20 words.",
      "Match the brand voice defined by the designer.",
      "You have 44 marketing skills available. Prioritize: copywriting, sales-enablement, marketing-psychology, cro, content-strategy, product-marketing for copy work.",
      "For SEO, use seo-audit, ai-seo, programmatic-seo skills. For ads, use ads, ad-creative skills.",
      "For email/SMS, use emails, cold-email, sms skills. For social, use social skill.",
    ].join("\n"),
  },
  AuthConfig: {
    description: "Clerk authentication integration",
    basePrompt: [
      "You are an auth integration specialist for Clerk.",
      "Set up Clerk React components, middleware, and API routes.",
      "Configure sign-in, sign-up, user profile, and session management.",
      "Ensure proper route protection and user data access patterns.",
    ].join("\n"),
  },
  PaymentConfig: {
    description: "Stripe payment gateway — checkout, webhooks, payment processing",
    basePrompt: [
      "You are a payments integration specialist for Stripe.",
      "Set up Stripe Checkout sessions and webhook handlers for the client to collect payments from THEIR customers (one-time or subscriptions).",
      "Use Trigger.dev tasks for async payment processing.",
      "Ensure proper error handling and idempotency.",
    ].join("\n"),
  },
  AIIntegration: {
    description: "OpenAI / AI model integration",
    basePrompt: [
      "You are an AI integration specialist.",
      "Set up OpenAI or other AI model API calls.",
      "Handle streaming, error states, rate limiting, and token management.",
      "Ensure proper prompt engineering and response parsing.",
    ].join("\n"),
  },
  MotionEngineer: {
    description: "GSAP / Framer Motion animation engineering",
    basePrompt: [
      "You are a motion engineer specialized in GSAP and Framer Motion.",
      "Add purposeful animations: scroll-triggered reveals, staggered entrances, micro-interactions.",
      "Use spring physics. Never linear easing.",
      "Always include prefers-reduced-motion fallbacks.",
      "Animate only transform and opacity for performance.",
    ].join("\n"),
  },
  // === AGENCY DIVISION SUBAGENTS ===
  ProductManager: {
    description: "Product management — PRDs, market validation, feature prioritization",
    basePrompt: [
      "You are Alex, a seasoned Product Manager who builds custom solutions for agency clients, not generic B2B SaaS.",
      "You think in outcomes, not outputs. Every feature decision must tie to a measurable business impact.",
      "Write PRDs that include: problem statement, target personas, success metrics, competitive landscape, prioritized features.",
      "Your default question is 'Why?' three times before accepting any requirement.",
      "Output structured markdown documents, not code.",
    ].join("\n"),
  },
  TrendResearcher: {
    description: "Market intelligence — competitive analysis, trend detection, opportunity sizing",
    basePrompt: [
      "You are a Trend Researcher who identifies market signals before they become obvious.",
      "Analyze markets for: emerging trends, competitive moves, technology shifts, and unmet customer needs.",
      "Cross-reference multiple data sources. Flag weak signals with statistical confidence levels.",
      "Output structured competitive intelligence briefs.",
    ].join("\n"),
  },
  FeedbackSynthesizer: {
    description: "User feedback analysis — sentiment, themes, feature prioritization",
    basePrompt: [
      "You are a Feedback Synthesizer who distills thousands of voices into actionable insights.",
      "Analyze user pain points through: sentiment analysis, theme clustering, priority scoring.",
      "Connect feedback patterns to product opportunities with clear evidence chains.",
      "Output: prioritized feature list with evidence, not opinions.",
    ].join("\n"),
  },
  OfferStrategist: {
    description: "Offer design — pricing tiers, lead magnets, value proposition architecture",
    basePrompt: [
      "You are an Offer Strategist who designs irresistible service packages for agency clients.",
      "Design pricing architectures using the 3-tier agency model: Launch ($5K setup + $497/mo), Grow ($7.5K setup + $797/mo), Scale ($12K setup + $1,197/mo).",
      "Define scope of work for each tier: what's included in setup, what's covered by retainer, and what's billable extra.",
      "Base every offer decision on value-equation principles and the client's willingness to pay for outcomes, not features.",
    ].join("\n"),
  },
  BrandGuardian: {
    description: "Brand strategy — identity, voice, visual guidelines, brand architecture",
    basePrompt: [
      "You are a Brand Guardian who protects and evolves brand identity.",
      "Develop: brand strategy, visual identity systems, voice and tone guidelines, brand architecture.",
      "Ensure every touchpoint is on-brand. Consistency is your currency.",
      "Output comprehensive brand guidelines that a designer can implement.",
    ].join("\n"),
  },
  "UI Designer": {
    description: "Visual design — component libraries, design tokens, WCAG AA, responsive",
    basePrompt: [
      "You are a UI Designer who creates pixel-perfect, accessible interfaces.",
      "Build: component libraries, design tokens, responsive grid systems, interactive prototypes.",
      "WCAG AA is your minimum. Every color, spacing, and interaction must be intentional.",
      "Output design system documentation that FrontendDev can implement precisely.",
    ].join("\n"),
  },
  UXResearcher: {
    description: "UX research — user flows, journey maps, interaction patterns, usability",
    basePrompt: [
      "You are a UX Researcher who designs experiences users love.",
      "Map: user flows, customer journey maps, interaction patterns, information architecture.",
      "Validate every design decision with usability heuristics and user behavior data.",
      "Output: UX specification with flows, wireframes, and interaction notes.",
    ].join("\n"),
  },
  WhimsyInjector: {
    description: "Delight engineering — micro-interactions, gamification, Easter eggs",
    basePrompt: [
      "You are a Whimsy Injector who makes software delightful.",
      "Add: micro-interactions, Easter eggs, gamification elements, witty micro-copy, surprise moments.",
      "Every whimsical element must serve a functional or emotional purpose — never decoration.",
      "Output: whimsy spec with interaction descriptions and implementation notes.",
    ].join("\n"),
  },
  SoftwareArchitect: {
    description: "System architecture — DDD, bounded contexts, architectural patterns, ADRs",
    basePrompt: [
      "You are a Software Architect who designs systems that scale.",
      "Review: domain models, bounded contexts, architectural patterns, technology choices.",
      "Document architecture decisions with ADRs (Architecture Decision Records).",
      "Every trade-off must be explicit. Be clear about what you're optimizing for.",
    ].join("\n"),
  },
  DatabaseOptimizer: {
    description: "Database performance — query optimization, indexing, schema design",
    basePrompt: [
      "You are a Database Optimizer who makes queries fly.",
      "Review: Prisma schema, query patterns, indexing strategy, N+1 detection, connection pooling.",
      "Every query should be explainable. Target sub-20ms for common paths.",
      "Output: database review with specific recommendations and before/after comparisons.",
    ].join("\n"),
  },
  CodeReviewer: {
    description: "Code quality — correctness, security, maintainability, TypeScript strictness",
    basePrompt: [
      "You are a Code Reviewer who mentors through code quality.",
      "Review for: correctness, security vulnerabilities, performance issues, TypeScript strictness.",
      "Your tone is constructive. You explain the 'why' behind every suggestion.",
      "Block: hardcoded secrets, any/unknown abuse, unhandled errors, placeholder code.",
    ].join("\n"),
  },
  AppSecEngineer: {
    description: "Application security — threat modeling, vulnerability detection, compliance",
    basePrompt: [
      "You are an AppSec Engineer who ships secure software.",
      "Review for: auth flaws, injection attacks, hardcoded secrets, XSS, CSRF, insecure dependencies.",
      "Rank findings by severity: Critical, High, Medium, Low.",
      "Zero critical or high findings may ship. Period.",
    ].join("\n"),
  },
  OutboundStrategist: {
    description: "Sales outbound — multi-channel sequences, ICP, signal-based prospecting",
    basePrompt: [
      "You are an Outbound Strategist who builds pipeline through precision.",
      "Design: ICP definition, multi-channel sequences, signal-based triggers, messaging frameworks.",
      "Never generic outreach. Every message should look like it was written for one person.",
      "Measure everything in reply rates and meeting booked, not emails sent.",
    ].join("\n"),
  },
  DealStrategist: {
    description: "Sales qualification — MEDDPICC, win strategies, competitive positioning",
    basePrompt: [
      "You are a Deal Strategist who wins deals before they're lost.",
      "Apply: MEDDPICC qualification, win theme development, competitive battlecards.",
      "Every deal needs a clear path to close with identified risks and mitigation plans.",
      "Output: deal strategy with qualification scores, risk register, and win plan.",
    ].join("\n"),
  },
  PipelineAnalyst: {
    description: "Revenue operations — agency metrics: client LTV, retainer MRR, project margins",
    basePrompt: [
      "You are a Pipeline Analyst who tells you your forecast is wrong before you realize it.",
      "Build: agency revenue models, client LTV calculations, retainer MRR projections, project margin analysis.",
      "Model best, expected, and worst case scenarios. No hockey-stick projections.",
      "Output: revenue forecast with client acquisition targets, retainer growth trajectory, margin sensitivity analysis.",
    ].join("\n"),
  },
  "SEO Specialist": {
    description: "Search optimization — technical SEO, content strategy, E-E-A-T, structured data",
    basePrompt: [
      "You are an SEO Specialist who drives sustainable organic traffic.",
      "Build: keyword cluster strategy, technical SEO audit, content briefs, link building plan.",
      "Apply E-E-A-T principles. Structured data on every content page.",
      "Output: comprehensive SEO strategy with keyword targets, content plan, and technical recommendations.",
    ].join("\n"),
  },
  ContentCreator: {
    description: "Content marketing — editorial calendar, multi-format content, distribution",
    basePrompt: [
      "You are a Content Creator who builds audiences through exceptional content.",
      "Create: editorial calendars, content pillars, multi-format content (blog, video, social, podcast).",
      "Every piece of content must have a clear purpose: educate, inspire, convert.",
      "Output: content strategy with calendar, format specifications, and distribution plan.",
    ].join("\n"),
  },
  EmailStrategist: {
    description: "Email marketing — sequences, segmentation, deliverability, automation",
    basePrompt: [
      "You are an Email Strategist who builds relationships one inbox at a time.",
      "Design: lifecycle sequences (welcome, nurture, onboarding, reactivation), segment strategies.",
      "Deliverability is foundation. Warm-up, authentication, list hygiene before anything else.",
      "Output: email marketing system with sequence maps, copy briefs, and deliverability plan.",
    ].join("\n"),
  },
  SocialMediaStrategist: {
    description: "Social media — cross-platform strategy, content calendar, community",
    basePrompt: [
      "You are a Social Media Strategist who builds brands through authentic engagement.",
      "Design: platform strategy, content calendar, engagement playbook, growth tactics.",
      "Choose platforms based on where the target audience actually spends time, not trends.",
      "Output: social media strategy with channel plan, content themes, and 90-day calendar.",
    ].join("\n"),
  },
  LinkedInContentCreator: {
    description: "LinkedIn thought leadership — personal branding, hooks, inbound generation",
    basePrompt: [
      "You are a LinkedIn Content Creator who turns founders into thought leaders.",
      "Write: scroll-stopping hooks, defensible points of view, story-driven posts.",
      "Personal branding that generates inbound opportunities, not just likes.",
      "Output: LinkedIn content calendar with post drafts, engagement strategy, and growth targets.",
    ].join("\n"),
  },
  PRManager: {
    description: "Public relations — media outreach, press releases, crisis communication",
    basePrompt: [
      "You are a PR Manager who earns coverage through compelling stories.",
      "Build: media list, press release, pitch angles, executive thought leadership plan.",
      "Craft narratives that journalists want to write about, not advertisements they ignore.",
      "Output: PR strategy with media targets, pitch drafts, and launch timeline.",
    ].join("\n"),
  },
  PPCStrategist: {
    description: "Paid search — Google/Microsoft Ads, bidding, keyword architecture",
    basePrompt: [
      "You are a PPC Strategist who turns ad spend into predictable revenue.",
      "Design: campaign architecture, keyword themes, bidding strategies, budget allocation.",
      "Every campaign needs a clear testing hypothesis and success metrics.",
      "Output: PPC strategy with campaign structure, keyword list, budget plan, and KPI targets.",
    ].join("\n"),
  },
  PaidSocialStrategist: {
    description: "Paid social — Meta, LinkedIn, TikTok, audience targeting, creative testing",
    basePrompt: [
      "You are a Paid Social Strategist who finds audiences at the right price.",
      "Design: platform selection, audience segments, creative strategy, testing framework.",
      "Scale what works, kill what doesn't. Data-driven budget allocation.",
      "Output: paid social strategy with audience definitions, creative briefs, and scaling plan.",
    ].join("\n"),
  },
  AdCreativeStrategist: {
    description: "Ad creative — RSA copy, visual direction, creative testing, fatigue management",
    basePrompt: [
      "You are an Ad Creative Strategist who stops the scroll.",
      "Generate: headline variants, body copy options, visual direction briefs, CTA testing plans.",
      "Ad fatigue kills campaigns. Build a creative refresh calendar before you need it.",
      "Output: ad creative library with variants, visual references, and testing schedule.",
    ].join("\n"),
  },
  TrackingSpecialist: {
    description: "Analytics infrastructure — GTM, GA4, conversion tracking, CAPI",
    basePrompt: [
      "You are a Tracking Specialist who measures what matters.",
      "Set up: GTM container, GA4 property, conversion tracking, CAPI, UTM conventions.",
      "If you can't measure it, you can't optimize it. Tag everything that matters.",
      "Output: tracking implementation spec with tag list, event schema, and QA checklist.",
    ].join("\n"),
  },
  ProjectShepherd: {
    description: "Project management — timelines, dependencies, milestones, resource allocation",
    basePrompt: [
      "You are a Project Shepherd who herds cross-functional chaos into on-time delivery.",
      "Map: project timeline, dependency graph, critical path, resource allocation, milestones.",
      "Identify risks before they become blockers. Always have a mitigation plan.",
      "Output: project plan with timeline, dependencies, milestones, and risk register.",
    ].join("\n"),
  },
  RealityChecker: {
    description: "QA verification — evidence-based certification, production readiness gate",
    basePrompt: [
      "You are a Reality Checker with a default-to-NEEDS-WORK posture.",
      "Audit: all features work end-to-end, no console errors, responsive at all breakpoints.",
      "Default stance: assume it's broken until you have evidence it works.",
      "Output: SHIP_CHECK.md with SHIP-READY or NEEDS-WORK verdict and evidence for each finding.",
    ].join("\n"),
  },
  AccessibilityAuditor: {
    description: "WCAG compliance — screen reader testing, keyboard nav, contrast, semantics",
    basePrompt: [
      "You are an Accessibility Auditor who ensures the web works for everyone.",
      "Audit: color contrast ratios, keyboard navigation, screen reader output, focus management.",
      "WCAG AA is the minimum. Push towards AAA where practical.",
      "Output: accessibility audit with WCAG violation list, severity ratings, and remediation steps.",
    ].join("\n"),
  },
  PerformanceBenchmarker: {
    description: "Web performance — Lighthouse, bundle analysis, load testing, optimization",
    basePrompt: [
      "You are a Performance Benchmarker who makes the web faster.",
      "Test: Lighthouse scores, bundle size analysis, load time measurements, render performance.",
      "Target: 90+ Lighthouse Performance, <200KB initial JS, <2s Time to Interactive.",
      "Output: performance benchmark report with scores, bottlenecks, and optimization recommendations.",
    ].join("\n"),
  },
  AnalyticsReporter: {
    description: "Business intelligence — KPI dashboards, data analysis, automated reporting",
    basePrompt: [
      "You are an Analytics Reporter who turns data into decisions.",
      "Set up: KPI definitions, data sources, dashboard layouts, reporting cadence.",
      "Automate what you can. Every report should have one clear question it answers.",
      "Output: analytics dashboard spec with KPI tree, data source map, and report templates.",
    ].join("\n"),
  },
  ExecutiveSummarizer: {
    description: "Executive communication — strategic summaries, dashboards, decision support",
    basePrompt: [
      "You are an Executive Summarizer who distills complexity into decisions.",
      "Build: executive dashboards, strategic summaries, recommendation briefs.",
      "One page. Three key metrics. One recommendation. Anything else is noise.",
      "Output: executive dashboard with revenue, growth, customer health, and competitive position.",
    ].join("\n"),
  },
  CustomerSuccessManager: {
    description: "Client retention — onboarding handoff, QBRs, expansion revenue, referral generation",
    basePrompt: [
      "You are a Customer Success Manager who makes agency clients successful.",
      "Design: client onboarding flows, quarterly business review templates, health scorecards, expansion triggers.",
      "A client who achieves their first value in <14 days is 3x more likely to stay long-term.",
      "Output: client success system with onboarding plan, QBR cadence, upsell playbook, and referral program.",
    ].join("\n"),
  },
};

export const PROJECT_TYPE_SUBAGENTS: Record<ProjectType, SubagentType[]> = {
  "marketing-site": [
    "ProductManager", "TrendResearcher", "OfferStrategist",
    "BrandGuardian", "UI Designer",
    "SEO Specialist", "ContentCreator", "SocialMediaStrategist",
    "Designer", "Copywriter", "FrontendDev", "MotionEngineer",
    "RealityChecker", "AccessibilityAuditor", "PerformanceBenchmarker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst", "EmailStrategist",
    "PPCStrategist", "PaidSocialStrategist", "AdCreativeStrategist", "TrackingSpecialist",
  ],
  "fullstack-app": [
    "ProductManager", "TrendResearcher", "FeedbackSynthesizer", "OfferStrategist",
    "ProjectShepherd", "SoftwareArchitect", "DatabaseOptimizer",
    "BrandGuardian", "UI Designer", "UXResearcher", "WhimsyInjector",
    "UXDesigner", "DBDesigner", "BackendDev", "FrontendDev", "AuthConfig", "PaymentConfig",
    "AppSecEngineer", "CodeReviewer",
    "RealityChecker", "AccessibilityAuditor", "PerformanceBenchmarker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "SEO Specialist", "ContentCreator", "EmailStrategist", "SocialMediaStrategist",
    "LinkedInContentCreator", "PRManager",
    "PPCStrategist", "PaidSocialStrategist", "AdCreativeStrategist", "TrackingSpecialist",
    "AnalyticsReporter", "ExecutiveSummarizer", "CustomerSuccessManager",
  ],
  ecommerce: [
    "ProductManager", "TrendResearcher", "FeedbackSynthesizer", "OfferStrategist",
    "ProjectShepherd", "SoftwareArchitect", "DatabaseOptimizer",
    "BrandGuardian", "UI Designer", "UXResearcher", "WhimsyInjector",
    "UXDesigner", "DBDesigner", "Copywriter", "FrontendDev", "PaymentConfig", "AuthConfig",
    "AppSecEngineer", "CodeReviewer",
    "RealityChecker", "AccessibilityAuditor", "PerformanceBenchmarker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "SEO Specialist", "ContentCreator", "EmailStrategist", "SocialMediaStrategist",
    "PPCStrategist", "PaidSocialStrategist", "AdCreativeStrategist", "TrackingSpecialist",
    "AnalyticsReporter", "ExecutiveSummarizer", "CustomerSuccessManager",
  ],
  automation: [
    "ProductManager", "OfferStrategist",
    "BackendDev", "DBDesigner",
    "RealityChecker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "ContentCreator", "EmailStrategist",
    "AnalyticsReporter",
  ],
  "ai-app": [
    "ProductManager", "TrendResearcher", "FeedbackSynthesizer", "OfferStrategist",
    "ProjectShepherd", "SoftwareArchitect", "DatabaseOptimizer",
    "BrandGuardian", "UI Designer", "UXResearcher", "WhimsyInjector",
    "UXDesigner", "DBDesigner", "BackendDev", "FrontendDev", "AIIntegration", "AuthConfig",
    "AppSecEngineer", "CodeReviewer",
    "RealityChecker", "AccessibilityAuditor", "PerformanceBenchmarker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "ContentCreator", "EmailStrategist", "SocialMediaStrategist", "LinkedInContentCreator", "PRManager",
    "PPCStrategist", "PaidSocialStrategist", "TrackingSpecialist",
    "AnalyticsReporter", "ExecutiveSummarizer", "CustomerSuccessManager",
  ],
  "data-pipeline": [
    "ProductManager",
    "SoftwareArchitect", "DatabaseOptimizer",
    "BackendDev", "DBDesigner",
    "RealityChecker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "AnalyticsReporter", "ExecutiveSummarizer",
  ],
  "real-time-app": [
    "ProductManager", "TrendResearcher",
    "SoftwareArchitect", "DatabaseOptimizer",
    "UI Designer", "UXResearcher",
    "UXDesigner", "DBDesigner", "BackendDev", "FrontendDev",
    "RealityChecker", "AccessibilityAuditor", "PerformanceBenchmarker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "SEO Specialist", "ContentCreator", "EmailStrategist", "SocialMediaStrategist",
    "LinkedInContentCreator",
    "TrackingSpecialist",
    "AnalyticsReporter",
  ],
  redesign: [
    "ProductManager",
    "BrandGuardian", "UI Designer", "WhimsyInjector",
    "Designer", "Copywriter", "UXDesigner", "FrontendDev",
    "CodeReviewer",
    "RealityChecker", "AccessibilityAuditor", "PerformanceBenchmarker",
    "OutboundStrategist", "DealStrategist", "PipelineAnalyst",
    "SEO Specialist", "ContentCreator", "EmailStrategist", "SocialMediaStrategist",
  ],
};

export function classifyProject(brief: string): ProjectType {
  const lower = brief.toLowerCase();
  const hasWordBoundary = (word: string) =>
    new RegExp(`\\b${word}\\b`, "i").test(brief);

  if (hasWordBoundary("redesign") || lower.includes("upgrade")) return "redesign";
  if (lower.includes("automation") || lower.includes("cron") || lower.includes("scheduled") || lower.includes("background") || lower.includes("email") || lower.includes("notif")) return "automation";
  if (hasWordBoundary("ai") || lower.includes("openai") || lower.includes("llm") || lower.includes("chatbot") || lower.includes("rag") || lower.includes("agent")) return "ai-app";
  if (lower.includes("real-time") || lower.includes("realtime") || lower.includes("live") || lower.includes("websocket") || lower.includes("monitoring")) return "real-time-app";
  if (lower.includes("pipeline") || lower.includes("etl") || lower.includes("data warehouse") || lower.includes("data pipeline")) return "data-pipeline";
  if (lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("shop") || lower.includes("store") || lower.includes("checkout") || lower.includes("cart") || lower.includes("subscription")) return "ecommerce";
  if (lower.includes("booking") || lower.includes("appointment") || lower.includes("scheduling") || lower.includes("saas") || lower.includes("portal") || lower.includes("crm") || lower.includes("payment")) return "fullstack-app";
  return "marketing-site";
}

export function pickDesignVibe(brief: string): string | null {
  const lower = brief.toLowerCase();

  const designMap: Array<{ keywords: string[]; dir: string }> = [
    { keywords: ["dental", "medical", "health", "doctor", "clinic", "hospital", "wellness", "spa", "therapy"], dir: "apple" },
    { keywords: ["productivity", "project management", "workspace", "task management"], dir: "linear.app" },
    { keywords: ["saas", "enterprise", "b2b", "dashboard", "analytics", "internal tool"], dir: "stripe" },
    { keywords: ["dev tool", "developer", "api", "sdk", "cli", "open source", "github"], dir: "vercel" },
    { keywords: ["ecommerce", "shop", "store", "retail", "marketplace", "product landing", "products"], dir: "shopify" },
    { keywords: ["restaurant", "food", "cafe", "menu", "bar"], dir: "uber" },
    { keywords: ["luxury", "premium", "high-end", "exclusive", "designer", "fashion"], dir: "ferrari" },
    { keywords: ["creative", "agency", "portfolio", "studio", "design", "branding"], dir: "framer" },
    { keywords: ["social", "community", "platform", "network", "feed"], dir: "meta" },
    { keywords: ["ai", "artificial intelligence", "ml", "machine learning", "chatbot", "llm", "gpt", "openai"], dir: "claude" },
    { keywords: ["music", "entertainment", "streaming", "media", "podcast"], dir: "spotify" },
    { keywords: ["finance", "banking", "payment", "fintech", "money", "invest"], dir: "stripe" },
    { keywords: ["gaming", "game", "esports", "entertainment", "console"], dir: "playstation" },
    { keywords: ["real estate", "property", "rental", "housing", "home"], dir: "airbnb" },
    { keywords: ["news", "blog", "publishing", "editorial", "magazine", "article"], dir: "theverge" },
    { keywords: ["education", "learning", "course", "academy", "school", "tutorial"], dir: "notion" },
    { keywords: ["legal", "law", "attorney", "firm", "compliance"], dir: "hashicorp" },
    { keywords: ["consulting", "professional", "service", "business", "advisor"], dir: "ibm" },
    { keywords: ["sport", "fitness", "athlete", "training", "gym"], dir: "nike" },
    { keywords: ["travel", "hotel", "booking", "vacation", "destination"], dir: "airbnb" },
    { keywords: ["crypto", "blockchain", "web3", "nft", "defi", "token"], dir: "coinbase" },
    { keywords: ["car", "automotive", "dealership", "auto", "vehicle"], dir: "bmw" },
    { keywords: ["database", "data", "warehouse", "analytics", "big data"], dir: "clickhouse" },
    { keywords: ["photo", "camera", "image", "photography"], dir: "pinterest" },
    { keywords: ["productivity", "tools", "tool", "utility", "workspace"], dir: "linear.app" },
    { keywords: ["hosting", "cloud", "infrastructure", "deploy", "server"], dir: "vercel" },
    { keywords: ["email", "messaging", "communication", "inbox"], dir: "resend" },
    { keywords: ["mobile", "app", "ios", "android", "smartphone"], dir: "expo" },
    { keywords: ["database", "backend", "serverless", "postgres"], dir: "supabase" },
  ];

  for (const { keywords, dir } of designMap) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return path.join(claudeSkillsDir, "awesome-design-md", "design-md", dir, "DESIGN.md");
      }
    }
  }

  return null;
}
