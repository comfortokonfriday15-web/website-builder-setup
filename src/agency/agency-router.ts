import {
  AGENCY_PHASES,
  AGENCY_AGENTS,
  getAgentsForProject,
  getPhaseByOrder,
  type AgencyPhase,
} from "./agency-registry.js";
import type { ProjectType } from "../skills/registry.js";

export interface PhaseExecutionPlan {
  phaseId: AgencyPhase
  phaseLabel: string
  order: number
  agents: string[]
  description: string
}

export function buildPhaseExecutionPlan(projectType: ProjectType): PhaseExecutionPlan[] {
  return AGENCY_PHASES.map((phase) => {
    const agents = getAgentsForProject(phase.id, projectType);
    return {
      phaseId: phase.id,
      phaseLabel: phase.label,
      order: phase.order,
      agents: agents.map((a) => a.name),
      description: phase.description,
    };
  }).filter((p) => p.agents.length > 0);
}

export function generateOrchestratorPrompt(brief: string, projectType: ProjectType): string {
  const plan = buildPhaseExecutionPlan(projectType);
  const parts: string[] = [
    `# Full-Stack Build Orchestrator`,
    `Project Brief: ${brief}`,
    `Project Type: ${projectType}`,
    ``,
    `You are a senior build orchestrator. You will run ALL 9 phases below in strict order.`,
    `Each phase has specific agents and outputs. DO NOT skip any phase.`,
    ``,
    `## Build Plan`,
    ``,
  ];

  let agentIndex = 1;
  for (const phase of plan) {
    parts.push(`### Phase ${phase.order >= 0 ? phase.order : "-1"}: ${phase.phaseLabel}`);
    parts.push(`${phase.description}`);
    for (const agentName of phase.agents) {
      parts.push(`  ${agentIndex}. task(${agentName})`);
      agentIndex++;
    }
    parts.push(``);
  }

  parts.push(`## Rules`);
  parts.push(`- Run phases in order. Phase -1 must complete before Phase 0.`);
  parts.push(`- Each phase's outputs must be saved before moving to the next.`);
  parts.push(`- Parallel execution allowed WITHIN a phase for independent work.`);
  parts.push(`- Use write_todos at the start to plan the full sequence.`);
  parts.push(`- After all phases complete, run verification: tsc --noEmit, npm run build.`);

  return parts.join("\n");
}

export function getNexusHandoffPrompt(
  previousPhase: AgencyPhase | null,
  nextPhase: AgencyPhase | null,
): string {
  const parts: string[] = ["## NEXUS Phase Handoff", ""];

  if (previousPhase) {
    const def = getPhaseByOrder(AGENCY_PHASES.find((p) => p.id === previousPhase)?.order ?? 0);
    parts.push(`### Handoff FROM: ${previousPhase}`);
    parts.push(`Expected deliverables: ${def?.handoffTemplate ?? "Phase outputs"}`);
    parts.push("");
  }

  if (nextPhase) {
    const def = getPhaseByOrder(AGENCY_PHASES.find((p) => p.id === nextPhase)?.order ?? 0);
    parts.push(`### Handoff TO: ${nextPhase}`);
    parts.push(`Phase objective: ${def?.description ?? "Next phase"}`);
    parts.push(`Trigger prompt: ${def?.triggerPrompt ?? "Continue build"}`);
    parts.push("");
  }

  parts.push("### Verification Gate");
  parts.push("- All previous phase outputs exist and are non-empty");
  parts.push("- No TODOs or placeholders in any output");
  parts.push("- Phase goals are clearly met before proceeding");
  parts.push("");

  return parts.join("\n");
}
