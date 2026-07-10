import { classifyProject, PROJECT_TYPE_LABELS } from "./skills/registry.js";
import { buildProject } from "./builders/factory.js";
import { buildPhaseExecutionPlan, generateOrchestratorPrompt } from "./agency/agency-router.js";

export interface OrchestratorResult {
  projectType: string
  label: string
  buildPlan: any[]
  phases: number
  systemPrompt: string
  buildResult: any
}

export async function orchestrate(brief: string) {
  const projectType = classifyProject(brief);
  const label = PROJECT_TYPE_LABELS[projectType];
  const plan = buildPhaseExecutionPlan(projectType);
  const systemPrompt = generateOrchestratorPrompt(brief, projectType);

  console.log(`\n=== NEXUS AGENCY ORCHESTRATOR ===`);
  console.log(`Brief: ${brief}`);
  console.log(`Classified as: ${label}`);
  console.log(`Phases: ${plan.length}`);
  console.log(`Total agents: ${plan.reduce((s, p) => s + p.agents.length, 0)}`);
  console.log(`=================================\n`);

  for (const phase of plan) {
    console.log(`Phase ${phase.order}: ${phase.phaseLabel} (${phase.agents.length} agents)`);
  }
  console.log(``);

  const buildResult = await buildProject(brief);

  return {
    projectType,
    label,
    buildPlan: plan,
    phases: plan.length,
    systemPrompt,
    buildResult,
  } satisfies OrchestratorResult;
}

export { buildPhaseExecutionPlan, generateOrchestratorPrompt };

