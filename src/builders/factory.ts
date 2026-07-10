import { PlanAgent, NodeFilesystemBackend } from "@voltagent/core";
import type { PlanAgentSubagentDefinition } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";
import {
  classifyProject,
  pickDesignVibe,
  PROJECT_TYPE_SUBAGENTS,
  BASE_SUBAGENT_DESCRIPTIONS,
  type ProjectType,
  type SubagentType,
} from "../skills/registry.js";
import { loadSkillsForSubagent, buildSkillInjectedPrompt } from "../skills/loader.js";

const logger = createPinoLogger({
  name: "agent-factory",
  level: "info",
});

const DEFAULT_MODEL = "openai/gpt-4o";
const FALLBACK_MODELS: string[] = [
  "openai/gpt-4o-mini",
  "anthropic/claude-sonnet-4-20250514",
];

interface SubagentDefinition {
  name: string
  description: string
  systemPrompt: string
}

function buildSubagent(type: SubagentType, projectType: ProjectType): SubagentDefinition {
  const base = BASE_SUBAGENT_DESCRIPTIONS[type];
  if (!base) {
    throw new Error(`Unknown subagent type: ${type}`);
  }

  const skills = loadSkillsForSubagent(projectType, type);
  const systemPrompt = buildSkillInjectedPrompt(base.basePrompt, skills);

  return {
    name: type,
    description: base.description,
    systemPrompt,
  } satisfies SubagentDefinition;
}

const PROJECT_PLAN_PROMPTS: Record<ProjectType, string> = {
  "fullstack-app": [
    "You build custom platforms for agency clients — each project is a service package delivered for a setup fee + monthly retainer. Every project follows the FULL pipeline below — DO NOT skip phases.",
    "",
    "=== FULL BUILD PIPELINE (run every phase in order) ===",
    "",
    "PHASE -1: MARKET VALIDATION & PRD",
    "1. task(ProductManager) — Write PRD: problem statement, target personas, success metrics, competitive landscape, prioritized features. Save as PRD_<project>.md",
    "2. task(TrendResearcher) — Analyze competitive landscape and market trends. Save as COMPETITIVE_<project>.md",
    "3. task(FeedbackSynthesizer) — Validate pain points against user research. Save as VALIDATION_<project>.md",
    "4. task(OfferStrategist) — Design pricing tiers, lead magnets, value proposition. Save as OFFER_<project>.md",
    "",
    "PHASE 0: ARCHITECTURE & PLANNING",
    "5. task(ProjectShepherd) — Map timeline, dependencies, and milestones. Save as TIMELINE_<project>.md",
    "6. task(SoftwareArchitect) — Design system architecture with ADRs. Save as ARCHITECTURE_REVIEW.md",
    "7. task(DatabaseOptimizer) — Design optimal Prisma schema. Save as DB_REVIEW.md",
    "",
    "PHASE 1: BRAND & DESIGN",
    "8. task(BrandGuardian) — Create brand identity, voice, visual guidelines. Save as BRAND_<project>.md",
    "9. task(UI Designer) — Build design system: tokens, components, grid, WCAG AA. Save as DESIGN_SYSTEM_<project>.md",
    "10. task(UXResearcher) — Map user flows, journey maps, interaction patterns. Save as UX_<project>.md",
    "11. task(WhimsyInjector) — Add delight: micro-interactions, Easter eggs, gamification. Save as WHIMSY_<project>.md",
    "",
    "PHASE 2: BUILD (core build — parallel subagents allowed here)",
    "12. task(UXDesigner) — Design tokens, color palette, layout system",
    "13. task(DBDesigner) — Create Prisma schema with all models and relations",
    "14. task(BackendDev) — Trigger.dev task definitions (parallel with frontend)",
    "15. task(FrontendDev) — React pages and components (parallel with backend)",
    "16. task(AuthConfig) — Clerk auth integration (only if the client's app needs user accounts)",
    "17. task(PaymentConfig) — Stripe integration (only if the client collects payments from their customers)",
    "",
    "PHASE 3: SECURITY & CODE REVIEW",
    "18. task(AppSecEngineer) — Security audit: auth flaws, injection, secrets, compliance. Save as SECURITY_REVIEW.md",
    "19. task(CodeReviewer) — Code quality review: TypeScript strictness, error handling, maintainability. Save as CODE_REVIEW.md",
    "",
    "PHASE 4: QUALITY ASSURANCE",
    "20. task(RealityChecker) — Full QA: end-to-end, console errors, responsive, edge cases. Default NEEDS-WORK. Save as SHIP_CHECK.md",
    "21. task(AccessibilityAuditor) — WCAG AA audit: contrast, keyboard, screen reader. Save as ACCESSIBILITY_AUDIT.md",
    "22. task(PerformanceBenchmarker) — Lighthouse, bundle, load testing. Save as PERF_BENCHMARK.md",
    "",
    "PHASE 5: GO-TO-MARKET STRATEGY",
    "23. task(OutboundStrategist) — Sales outbound: ICP, sequences, messaging. Save as OUTBOUND_<project>.md",
    "24. task(DealStrategist) — Sales qualification: MEDDPICC, win themes. Save as SALES_PLAYBOOK_<project>.md",
    "25. task(PipelineAnalyst) — Agency revenue model: client LTV, retainer MRR, margins. Save as PIPELINE_MODEL_<project>.md",
    "26. task(SEO Specialist) — SEO strategy: keywords, technical setup, content briefs. Save as SEO_<project>.md",
    "27. task(ContentCreator) — Content strategy: editorial calendar, formats, distribution. Save as CONTENT_<project>.md",
    "28. task(EmailStrategist) — Email sequences: welcome, nurture, onboarding, reactivation. Save as EMAIL_<project>.md",
    "29. task(SocialMediaStrategist) — Social strategy: platform, calendar, engagement. Save as SOCIAL_<project>.md",
    "30. task(LinkedInContentCreator) — LinkedIn thought leadership: hooks, posting cadence. Save as LINKEDIN_<project>.md",
    "31. task(PRManager) — PR strategy: media list, press release, launch pitch. Save as PR_<project>.md",
    "",
    "PHASE 6: PAID ACQUISITION",
    "32. task(PPCStrategist) — Google Ads: campaign architecture, keywords, bidding. Save as PPC_<project>.md",
    "33. task(PaidSocialStrategist) — Paid social: platform, audiences, creative. Save as PAID_SOCIAL_<project>.md",
    "34. task(AdCreativeStrategist) — Ad creative: headlines, visuals, testing plan. Save as AD_CREATIVE_<project>.md",
    "35. task(TrackingSpecialist) — Analytics: GTM, GA4, CAPI, UTM. Save as TRACKING_<project>.md",
    "",
    "PHASE 7: POST-LAUNCH OPERATIONS",
    "36. task(AnalyticsReporter) — Dashboards: KPIs, data sources, reporting cadence. Save as ANALYTICS_<project>.md",
    "37. task(ExecutiveSummarizer) — Executive dashboard: revenue, growth, customer health. Save as EXECUTIVE_<project>.md",
    "38. task(CustomerSuccessManager) — Client success: onboarding handoff, QBRs, upsells, referral generation. Save as CS_<project>.md",
    "",
    "VERIFICATION:",
    "- TypeScript compiles with zero errors (tsc --noEmit)",
    "- npm run build passes",
    "- All outputs saved to disk as .md files",
  ].join("\n"),
  ecommerce: [
    "You build custom e-commerce platforms for agency clients — each project is a service package delivered for a setup fee + monthly retainer. Every project follows the FULL pipeline below — DO NOT skip phases.",
    "",
    "=== FULL BUILD PIPELINE (run every phase in order) ===",
    "",
    "PHASE -1: MARKET VALIDATION & PRD",
    "1. task(ProductManager) — Write PRD: problem, personas, success metrics, features. Save as PRD_<project>.md",
    "2. task(TrendResearcher) — Competitive analysis and market trends. Save as COMPETITIVE_<project>.md",
    "3. task(FeedbackSynthesizer) — Validate pain points. Save as VALIDATION_<project>.md",
    "4. task(OfferStrategist) — Pricing tiers, lead magnets, offer architecture. Save as OFFER_<project>.md",
    "",
    "PHASE 0: ARCHITECTURE & PLANNING",
    "5. task(ProjectShepherd) — Timeline, dependencies, milestones. Save as TIMELINE_<project>.md",
    "6. task(SoftwareArchitect) — System architecture with ADRs. Save as ARCHITECTURE_REVIEW.md",
    "7. task(DatabaseOptimizer) — Optimal Prisma schema. Save as DB_REVIEW.md",
    "",
    "PHASE 1: BRAND & DESIGN",
    "8. task(BrandGuardian) — Brand identity and guidelines. Save as BRAND_<project>.md",
    "9. task(UI Designer) — Design system, component library, WCAG AA. Save as DESIGN_SYSTEM_<project>.md",
    "10. task(UXResearcher) — User flows and journey maps. Save as UX_<project>.md",
    "11. task(WhimsyInjector) — Delight and micro-interactions. Save as WHIMSY_<project>.md",
    "",
    "PHASE 2: BUILD (core build — parallel subagents)",
    "12. task(UXDesigner) — Design tokens and product page layout",
    "13. task(DBDesigner) — Prisma schema for products, orders, customers",
    "14. task(PaymentConfig) — Stripe checkout and webhooks (only if the client collects payments) (parallel with frontend)",
    "15. task(AuthConfig) — Clerk auth for customer accounts (only if the client's app needs it)",
    "16. task(FrontendDev) — Product pages, cart, checkout UI (parallel with payment)",
    "",
    "PHASE 3: SECURITY & CODE REVIEW",
    "17. task(AppSecEngineer) — Security audit. Save as SECURITY_REVIEW.md",
    "18. task(CodeReviewer) — Code quality review. Save as CODE_REVIEW.md",
    "",
    "PHASE 4: QUALITY ASSURANCE",
    "19. task(RealityChecker) — Full QA. Default NEEDS-WORK. Save as SHIP_CHECK.md",
    "20. task(AccessibilityAuditor) — WCAG AA audit. Save as ACCESSIBILITY_AUDIT.md",
    "21. task(PerformanceBenchmarker) — Lighthouse and load testing. Save as PERF_BENCHMARK.md",
    "",
    "PHASE 5: GO-TO-MARKET STRATEGY",
    "22. task(OutboundStrategist) — Sales outbound playbook. Save as OUTBOUND_<project>.md",
    "23. task(DealStrategist) — Sales qualification framework. Save as SALES_PLAYBOOK_<project>.md",
    "24. task(PipelineAnalyst) — Agency revenue model: client LTV, retainer MRR, margins. Save as PIPELINE_MODEL_<project>.md",
    "25. task(SEO Specialist) — SEO strategy and content briefs. Save as SEO_<project>.md",
    "26. task(ContentCreator) — Content strategy and editorial calendar. Save as CONTENT_<project>.md",
    "27. task(EmailStrategist) — Email sequences and deliverability. Save as EMAIL_<project>.md",
    "28. task(SocialMediaStrategist) — Social media strategy. Save as SOCIAL_<project>.md",
    "29. task(PPCStrategist) — Google Ads architecture. Save as PPC_<project>.md",
    "30. task(PaidSocialStrategist) — Paid social strategy. Save as PAID_SOCIAL_<project>.md",
    "31. task(AdCreativeStrategist) — Ad creative library. Save as AD_CREATIVE_<project>.md",
    "32. task(TrackingSpecialist) — Analytics infrastructure. Save as TRACKING_<project>.md",
    "",
    "PHASE 6: POST-LAUNCH OPERATIONS",
    "33. task(AnalyticsReporter) — Dashboards and KPIs. Save as ANALYTICS_<project>.md",
    "34. task(ExecutiveSummarizer) — Executive dashboard. Save as EXECUTIVE_<project>.md",
    "35. task(CustomerSuccessManager) — Client success: onboarding handoff, QBRs, upsells, referral generation. Save as CS_<project>.md",
    "",
    "VERIFICATION: TypeScript compiles, payment flow works end-to-end, all outputs saved.",
  ].join("\n"),
  "marketing-site": [
    "You build premium marketing websites that convert visitors into leads.",
    "Every project follows the FULL pipeline below — DO NOT skip phases.",
    "",
    "PHASE -1: VALIDATION & PRD",
    "1. task(ProductManager) — Write PRD. Save as PRD_<project>.md",
    "2. task(TrendResearcher) — Competitive analysis. Save as COMPETITIVE_<project>.md",
    "3. task(OfferStrategist) — Lead magnets and offers. Save as OFFER_<project>.md",
    "",
    "PHASE 1: BRAND & DESIGN",
    "4. task(BrandGuardian) — Brand identity. Save as BRAND_<project>.md",
    "5. task(UI Designer) — Design system. Save as DESIGN_SYSTEM_<project>.md",
    "",
    "PHASE 2: BUILD (core build)",
    "6. task(Designer) — Select design system from awesome-design-md, create DESIGN.md, generate brand assets",
    "7. task(Copywriter) — Write all UX copy following the brand voice",
    "8. task(Designer) — Generate reference images for each section",
    "9. task(FrontendDev) — Build all React pages and components (parallel with motion)",
    "10. task(MotionEngineer) — Add GSAP/Framer Motion animations (parallel with frontend)",
    "",
    "PHASE 3: QUALITY ASSURANCE",
    "11. task(RealityChecker) — Full QA. Default NEEDS-WORK. Save as SHIP_CHECK.md",
    "12. task(AccessibilityAuditor) — WCAG AA audit. Save as ACCESSIBILITY_AUDIT.md",
    "13. task(PerformanceBenchmarker) — Lighthouse scores. Save as PERF_BENCHMARK.md",
    "",
    "PHASE 4: CLIENT ACQUISITION PLAYBOOK (cold outbound + content)",
    "14. task(OutboundStrategist) — ICP definition, cold outreach sequences (8-12 touches), targeting filters, messaging. Save as OUTBOUND_<project>.md",
    "15. task(DealStrategist) — Pitch framework, MEDDPICC qualification, win themes, objection handling. Save as SALES_PLAYBOOK_<project>.md",
    "16. task(PipelineAnalyst) — Pricing tier (Launch/Grow/Scale), client LTV, retainer MRR projection. Save as PIPELINE_MODEL_<project>.md",
    "17. task(SEO Specialist) — SEO strategy. Save as SEO_<project>.md",
    "18. task(ContentCreator) — Content strategy. Save as CONTENT_<project>.md",
    "19. task(EmailStrategist) — Nurture and follow-up sequences. Save as EMAIL_<project>.md",
    "20. task(SocialMediaStrategist) — Social media strategy. Save as SOCIAL_<project>.md",
    "",
    "PHASE 5: PAID ACQUISITION",
    "21. task(PPCStrategist) — Google Ads. Save as PPC_<project>.md",
    "22. task(PaidSocialStrategist) — Paid social. Save as PAID_SOCIAL_<project>.md",
    "23. task(AdCreativeStrategist) — Ad creative. Save as AD_CREATIVE_<project>.md",
    "24. task(TrackingSpecialist) — Analytics setup. Save as TRACKING_<project>.md",
    "",
    "VERIFICATION: Everything compiles, looks premium, all outputs saved.",
  ].join("\n"),
  "ai-app": [
    "You build custom AI-powered platforms for agency clients — each project is a service package delivered for a setup fee + monthly retainer. Every project follows the FULL pipeline below — DO NOT skip phases.",
    "",
    "PHASE -1: VALIDATION & PRD",
    "1. task(ProductManager) — Write PRD. Save as PRD_<project>.md",
    "2. task(TrendResearcher) — Market and competitor analysis. Save as COMPETITIVE_<project>.md",
    "3. task(FeedbackSynthesizer) — User pain point validation. Save as VALIDATION_<project>.md",
    "4. task(OfferStrategist) — Pricing and offer. Save as OFFER_<project>.md",
    "",
    "PHASE 0: ARCHITECTURE",
    "5. task(ProjectShepherd) — Timeline and milestones. Save as TIMELINE_<project>.md",
    "6. task(SoftwareArchitect) — System architecture. Save as ARCHITECTURE_REVIEW.md",
    "7. task(DatabaseOptimizer) — Schema optimization. Save as DB_REVIEW.md",
    "",
    "PHASE 1: BRAND & DESIGN",
    "8. task(BrandGuardian) — Brand identity. Save as BRAND_<project>.md",
    "9. task(UI Designer) — Design system. Save as DESIGN_SYSTEM_<project>.md",
    "10. task(UXResearcher) — User flows. Save as UX_<project>.md",
    "11. task(WhimsyInjector) — Delight elements. Save as WHIMSY_<project>.md",
    "",
    "PHASE 2: BUILD",
    "12. task(UXDesigner) — Design tokens and AI interaction patterns",
    "13. task(DBDesigner) — Prisma schema for conversations, users, data",
    "14. task(BackendDev) — Trigger.dev tasks for AI processing (parallel with frontend)",
    "15. task(FrontendDev) — React UI with streaming responses (parallel with backend)",
    "16. task(AIIntegration) — OpenAI/LLM API integration (if applicable)",
    "17. task(AuthConfig) — Clerk auth (only if the client's app needs user accounts)",
    "",
    "PHASE 3: SECURITY & REVIEW",
    "18. task(AppSecEngineer) — Security audit. Save as SECURITY_REVIEW.md",
    "19. task(CodeReviewer) — Code review. Save as CODE_REVIEW.md",
    "",
    "PHASE 4: QA",
    "20. task(RealityChecker) — Full QA (default NEEDS-WORK). Save as SHIP_CHECK.md",
    "21. task(AccessibilityAuditor) — WCAG audit. Save as ACCESSIBILITY_AUDIT.md",
    "22. task(PerformanceBenchmarker) — Performance audit. Save as PERF_BENCHMARK.md",
    "",
    "PHASE 5: GTM",
    "23. task(OutboundStrategist) — Outbound sales. Save as OUTBOUND_<project>.md",
    "24. task(DealStrategist) — Sales playbook. Save as SALES_PLAYBOOK_<project>.md",
    "25. task(PipelineAnalyst) — Agency revenue model: client LTV, retainer MRR, margins. Save as PIPELINE_MODEL_<project>.md",
    "26. task(ContentCreator) — Content strategy. Save as CONTENT_<project>.md",
    "27. task(EmailStrategist) — Email sequences. Save as EMAIL_<project>.md",
    "28. task(SocialMediaStrategist) — Social strategy. Save as SOCIAL_<project>.md",
    "29. task(LinkedInContentCreator) — LinkedIn strategy. Save as LINKEDIN_<project>.md",
    "30. task(PRManager) — PR strategy. Save as PR_<project>.md",
    "",
    "PHASE 6: PAID ACQUISITION",
    "31. task(PPCStrategist) — Google Ads. Save as PPC_<project>.md",
    "32. task(PaidSocialStrategist) — Paid social. Save as PAID_SOCIAL_<project>.md",
    "33. task(TrackingSpecialist) — Analytics setup. Save as TRACKING_<project>.md",
    "",
    "PHASE 7: POST-LAUNCH OPS",
    "34. task(AnalyticsReporter) — Dashboards. Save as ANALYTICS_<project>.md",
    "35. task(ExecutiveSummarizer) — Executive dashboard. Save as EXECUTIVE_<project>.md",
    "36. task(CustomerSuccessManager) — Client success: onboarding handoff, QBRs, upsells, referral generation. Save as CS_<project>.md",
    "",
    "VERIFICATION: TypeScript compiles, AI streaming works, all outputs saved.",
  ].join("\n"),
  automation: [
    "You build automation backends for agency clients. Include validation and GTM phases.",
    "",
    "=== FULL BUILD PIPELINE ===",
    "",
    "PHASE -1: VALIDATION & PRD",
    "1. task(ProductManager) — Validated spec and pain points. Save as PRD_<project>.md",
    "2. task(OfferStrategist) — Pricing and offer. Save as OFFER_<project>.md",
    "",
    "PHASE 1: BUILD",
    "3. task(DBDesigner) — Prisma schema for job tracking and state",
    "4. task(BackendDev) — All Trigger.dev task definitions",
    "",
    "PHASE 2: QUALITY ASSURANCE",
    "5. task(RealityChecker) — Verify tasks work end-to-end. Save as SHIP_CHECK.md",
    "",
    "PHASE 3: CLIENT ACQUISITION PLAYBOOK (cold outbound)",
    "6. task(OutboundStrategist) — ICP, cold outreach sequences, targeting. Save as OUTBOUND_<project>.md",
    "7. task(DealStrategist) — Pitch framework, qualification. Save as SALES_PLAYBOOK_<project>.md",
    "8. task(PipelineAnalyst) — Pricing tier, revenue model. Save as PIPELINE_MODEL_<project>.md",
    "9. task(ContentCreator) — Content brief for selling. Save as CONTENT_<project>.md",
    "10. task(EmailStrategist) — Follow-up sequences. Save as EMAIL_<project>.md",
    "11. task(AnalyticsReporter) — Dashboard. Save as ANALYTICS_<project>.md",
    "",
    "VERIFICATION: Tasks deploy, all GTM outputs saved.",
  ].join("\n"),
  "data-pipeline": [
    "You build data pipeline and ETL systems for agency clients. Include validation and GTM phases.",
    "",
    "=== FULL BUILD PIPELINE ===",
    "",
    "PHASE -1: VALIDATION & PRD",
    "1. task(ProductManager) — Validated spec. Save as PRD_<project>.md",
    "",
    "PHASE 1: ARCHITECTURE",
    "2. task(SoftwareArchitect) — Pipeline architecture. Save as ARCHITECTURE_REVIEW.md",
    "3. task(DatabaseOptimizer) — Schema optimization. Save as DB_REVIEW.md",
    "",
    "PHASE 2: BUILD",
    "4. task(DBDesigner) — Prisma schema for data models and job tracking",
    "5. task(BackendDev) — All Trigger.dev ETL task definitions",
    "",
    "PHASE 3: QUALITY ASSURANCE",
    "6. task(RealityChecker) — Verify pipeline processes correctly. Save as SHIP_CHECK.md",
    "",
    "PHASE 4: CLIENT ACQUISITION PLAYBOOK (cold outbound)",
    "7. task(OutboundStrategist) — ICP, cold outreach sequences, targeting. Save as OUTBOUND_<project>.md",
    "8. task(DealStrategist) — Pitch framework, qualification. Save as SALES_PLAYBOOK_<project>.md",
    "9. task(PipelineAnalyst) — Pricing tier, revenue model. Save as PIPELINE_MODEL_<project>.md",
    "10. task(AnalyticsReporter) — Dashboard. Save as ANALYTICS_<project>.md",
    "11. task(ExecutiveSummarizer) — Executive summary. Save as EXECUTIVE_<project>.md",
    "",
    "VERIFICATION: Pipeline processes, all GTM outputs saved.",
  ].join("\n"),
  "real-time-app": [
    "You build real-time applications for agency clients. Include full validation and GTM phases.",
    "",
    "=== FULL BUILD PIPELINE ===",
    "",
    "PHASE -1: VALIDATION & PRD",
    "1. task(ProductManager) — PRD, problem, personas. Save as PRD_<project>.md",
    "2. task(TrendResearcher) — Competitive analysis. Save as COMPETITIVE_<project>.md",
    "",
    "PHASE 1: ARCHITECTURE",
    "3. task(SoftwareArchitect) — System architecture. Save as ARCHITECTURE_REVIEW.md",
    "4. task(DatabaseOptimizer) — Schema optimization. Save as DB_REVIEW.md",
    "",
    "PHASE 2: BRAND & DESIGN",
    "5. task(UI Designer) — Design system. Save as DESIGN_SYSTEM_<project>.md",
    "6. task(UXResearcher) — User flows. Save as UX_<project>.md",
    "",
    "PHASE 3: BUILD",
    "7. task(UXDesigner) — Design tokens and real-time UI patterns",
    "8. task(DBDesigner) — Prisma schema",
    "9. task(BackendDev) — Trigger.dev tasks with real-time events (parallel with frontend)",
    "10. task(FrontendDev) — React UI with real-time updates (parallel with backend)",
    "",
    "PHASE 4: QUALITY ASSURANCE",
    "11. task(RealityChecker) — Full QA. Save as SHIP_CHECK.md",
    "12. task(AccessibilityAuditor) — WCAG audit. Save as ACCESSIBILITY_AUDIT.md",
    "13. task(PerformanceBenchmarker) — Performance audit. Save as PERF_BENCHMARK.md",
    "",
    "PHASE 5: CLIENT ACQUISITION PLAYBOOK (cold outbound + content)",
    "14. task(OutboundStrategist) — ICP, cold outreach sequences, targeting. Save as OUTBOUND_<project>.md",
    "15. task(DealStrategist) — Pitch framework, qualification. Save as SALES_PLAYBOOK_<project>.md",
    "16. task(PipelineAnalyst) — Pricing tier, revenue model. Save as PIPELINE_MODEL_<project>.md",
    "17. task(SEO Specialist) — SEO strategy. Save as SEO_<project>.md",
    "18. task(ContentCreator) — Content strategy. Save as CONTENT_<project>.md",
    "19. task(EmailStrategist) — Nurture sequences. Save as EMAIL_<project>.md",
    "20. task(SocialMediaStrategist) — Social strategy. Save as SOCIAL_<project>.md",
    "21. task(TrackingSpecialist) — Analytics setup. Save as TRACKING_<project>.md",
    "22. task(AnalyticsReporter) — Dashboard. Save as ANALYTICS_<project>.md",
    "",
    "VERIFICATION: Real-time flow works, all GTM outputs saved.",
  ].join("\n"),
  redesign: [
    "You redesign existing websites and apps to premium quality for agency clients. Include full validation, QA, and client acquisition.",
    "",
    "=== FULL BUILD PIPELINE ===",
    "",
    "PHASE -1: AUDIT & SCOPE",
    "1. task(ProductManager) — Audit and redesign scope. Save as PRD_<project>.md",
    "",
    "PHASE 1: BRAND & DESIGN",
    "2. task(BrandGuardian) — Updated brand identity. Save as BRAND_<project>.md",
    "3. task(UI Designer) — New design system. Save as DESIGN_SYSTEM_<project>.md",
    "4. task(WhimsyInjector) — Delight elements. Save as WHIMSY_<project>.md",
    "",
    "PHASE 2: BUILD",
    "5. task(Designer) — Scan existing codebase, identify anti-patterns, select new design direction",
    "6. task(UXDesigner) — Create updated design tokens preserving brand identity",
    "7. task(FrontendDev) — Implement redesign working with existing code, not rewriting from scratch",
    "",
    "PHASE 3: QUALITY ASSURANCE",
    "8. task(CodeReviewer) — Code quality review. Save as CODE_REVIEW.md",
    "9. task(RealityChecker) — Verify nothing is broken. Save as SHIP_CHECK.md",
    "10. task(AccessibilityAuditor) — WCAG audit. Save as ACCESSIBILITY_AUDIT.md",
    "11. task(PerformanceBenchmarker) — Performance audit. Save as PERF_BENCHMARK.md",
    "",
    "PHASE 4: CLIENT ACQUISITION PLAYBOOK (cold outbound + content)",
    "12. task(OutboundStrategist) — ICP, cold outreach sequences, targeting. Save as OUTBOUND_<project>.md",
    "13. task(DealStrategist) — Pitch framework, qualification. Save as SALES_PLAYBOOK_<project>.md",
    "14. task(PipelineAnalyst) — Pricing tier, revenue model. Save as PIPELINE_MODEL_<project>.md",
    "15. task(SEO Specialist) — SEO strategy. Save as SEO_<project>.md",
    "16. task(ContentCreator) — Content strategy. Save as CONTENT_<project>.md",
    "17. task(EmailStrategist) — Nurture sequences. Save as EMAIL_<project>.md",
    "18. task(SocialMediaStrategist) — Social strategy. Save as SOCIAL_<project>.md",
    "",
    "VERIFICATION: Nothing broken, quality upgraded, all GTM outputs saved.",
  ].join("\n"),
};

export interface BuildResult {
  projectType: ProjectType
  summary: string
  success: boolean
  error?: string
}

function getSystemPrompt(
  brief: string,
  subagents: SubagentDefinition[],
  planPrompt: string,
): string {
  const subagentSummaries = subagents.map(
    (s) => `- ${s.name}: ${s.description}`,
  ).join("\n");

  const designVibe = pickDesignVibe(brief);
  const parts: string[] = [
    `You build ${planPrompt}.`,
    "",
    "Your subagents:",
    subagentSummaries,
    "",
    planPrompt,
  ];

  if (designVibe) {
    parts.push(
      "",
      `Design direction: ${designVibe}`,
      `The designer should reference the DESIGN.md at ${designVibe} for brand-aligned visual direction.`,
    );
  }

  return parts.join("\n");
}

async function tryBuildWithModels(
  brief: string,
  models: string[],
  projectType: ProjectType,
  subagents: PlanAgentSubagentDefinition[],
  systemPrompt: string,
): Promise<string> {
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const agent = new PlanAgent({
        name: `builder-${projectType}`,
        model,
        systemPrompt,
        subagents,
        filesystem: {
          backend: new NodeFilesystemBackend({
            rootDir: process.cwd(),
            virtualMode: false,
          }),
        },
        planning: {},
        tools: [],
        maxSteps: 200,
        summarization: {
          triggerTokens: 2000,
          keepMessages: 8,
          maxOutputTokens: 1000,
        },
      });

      logger.info(`Attempting build with model: ${model}`);
      const result = await agent.generateText(brief);
      logger.info(`Build succeeded with model: ${model}`);
      return typeof result === "string" ? result : JSON.stringify(result);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`Model ${model} failed: ${lastError.message}. Trying next model...`);
    }
  }

  throw lastError ?? new Error("All models failed with no specific error");
}

export async function buildProject(
  brief: string,
  options?: { model?: string; fallbackModels?: string[] },
): Promise<BuildResult> {
  const models = [options?.model ?? DEFAULT_MODEL, ...(options?.fallbackModels ?? FALLBACK_MODELS)].filter(Boolean);

  try {
    const projectType = classifyProject(brief);
    const subagentTypes = PROJECT_TYPE_SUBAGENTS[projectType];

    if (!subagentTypes || subagentTypes.length === 0) {
      return {
        projectType,
        summary: `No subagents defined for project type: ${projectType}`,
        success: false,
        error: `No subagents defined for project type: ${projectType}`,
      };
    }

    const subagents = subagentTypes.map((t) => buildSubagent(t, projectType));
    const planPrompt = PROJECT_PLAN_PROMPTS[projectType];
    const systemPrompt = getSystemPrompt(brief, subagents, planPrompt);

    logger.info(`Starting ${projectType} build...`);
    logger.info(`Classified project type: ${projectType}`);
    logger.info(`Subagents: ${subagents.map((s) => s.name).join(", ")}`);

    const designVibe = pickDesignVibe(brief);
    if (designVibe) logger.info(`Design vibe: ${designVibe}`);

    const summary = await tryBuildWithModels(
      brief,
      models,
      projectType,
      subagents as PlanAgentSubagentDefinition[],
      systemPrompt,
    );

    logger.info("Build complete!");

    return {
      projectType,
      summary,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Build failed after all models exhausted: ${message}`);
    return {
      projectType: classifyProject(brief),
      summary: `Build failed: ${message}`,
      success: false,
      error: message,
    };
  }
}
