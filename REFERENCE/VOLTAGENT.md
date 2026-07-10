# VoltAgent Subagent & Workflow Orchestrator

**`@voltagent/core` v2.8.0** — Framework for building AI agent systems with subagent delegation, dynamic task spawning, and workflow orchestration.

---

## Architecture Overview

VoltAgent provides 3 patterns for orchestrating work:

```
Pattern 1: Supervisor-Subagent
  Supervisor Agent (subAgents: [...])
    └── delegate_task tool → spawns subagents with fixed roles

Pattern 2: PlanAgent (Recommended for builds)
  PlanAgent (task tool + write_todos + filesystem)
    ├── write_todos → plan the work
    ├── task → spawn ephemeral subagents per todo
    ├── filesystem → read/write project files
    └── parallel tasks → fan out independent work

Pattern 3: Workflow (createWorkflow / createWorkflowChain)
  createWorkflow({...}, step1, step2, ...)
    ├── andAgent → AI-powered step
    ├── andThen → function step
    ├── andAll → parallel steps
    ├── andBranch → conditional
    ├── andForEach → iterate
    └── andSleep / andGuardrail / etc.
```

**For building projects (the 42 workflows), use Pattern 2 (PlanAgent).** It dynamically spawns the right subagents for each task, plans with todos, writes files, and parallelizes work.

---

## PlanAgent — The Build Engine

### Purpose
A PlanAgent is a specialized Agent with:
- **`task` tool** — spawn ephemeral subagents for isolated tasks
- **`write_todos` tool** — plan and track multi-step work
- **Filesystem tools** — read, write, edit, glob, grep project files
- **Custom subagent definitions** — pre-configured role agents

### How the `task` Tool Works

The PlanAgent's `task` tool dynamically creates subagents at runtime:

```
1. Spawn → PlanAgent calls task({ role, instructions, input })
2. Run  → VoltAgent creates ephemeral Agent with those instructions
3. Return → Subagent completes work, returns structured result
4. Reconcile → PlanAgent incorporates result into main thread
```

The PlanAgent is prompted to use `task` when:
- A task is complex and multi-step, can be fully delegated in isolation
- A task is independent and can run in parallel with others
- A task requires focused reasoning that would bloat the orchestrator
- Sandboxing improves reliability (code execution, research)
- Only the output matters, not intermediate steps

### Parallel Execution

PlanAgent is instructed to parallelize aggressively:
- Run independent tool_calls in parallel
- Kick off multiple `task` subagents simultaneously
- Each subagent is fully autonomous with its own instructions

---

## Supervisor-Subagent Pattern

### Configuration

```typescript
import { Agent, createSubagent } from "@voltagent/core";

// Define specialized subagents
const frontendAgent = new Agent({
  name: "FrontendDev",
  purpose: "Builds React + Tailwind UI components",
  instructions: "You build pixel-perfect React components...",
  model: openai("gpt-4o"),
  tools: [readFile, writeFile, ...],
});

const backendAgent = new Agent({
  name: "BackendDev",
  purpose: "Builds Trigger.dev tasks and API routes",
  instructions: "You build Trigger.dev task definitions...",
  model: openai("gpt-4o"),
  tools: [readFile, writeFile, ...],
});

// Supervisor with subAgents
const supervisor = new Agent({
  name: "BuildSupervisor",
  instructions: "Coordinate frontend and backend development",
  model: openai("gpt-4o"),
  subAgents: [frontendAgent, backendAgent],
  supervisorConfig: {
    fullStreamEventForwarding: {
      types: ["tool-call", "tool-result", "text-delta"],
    },
  },
});
```

### How Delegation Works
1. Supervisor's `prepareTools()` injects the `delegate_task` tool when `subAgents` exist
2. The LLM supervisor decides when to call `delegate_task({ task, targetAgents })`
3. `SubAgentManager` resolves agent names to configs, executes via configured method
4. Results stream back to supervisor with metadata enrichment (`subAgentId`, `subAgentName`)
5. `onHandoffComplete` hook can call `bail(result)` to short-circuit with subagent's result

### Subagent Execution Methods

| Method | Use Case |
|--------|----------|
| `streamText` (default) | Streaming text responses |
| `generateText` | Single text response (non-streaming) |
| `streamObject` | Streaming structured object output |
| `generateObject` | Single structured object output |

---

## Workflow Engine (createWorkflow)

### When to Use
- Projects with clear sequential steps
- Human-in-the-loop approval workflows
- Multi-step data processing pipelines
- Complex branching/looping logic

### Step Types

| Step | Purpose |
|------|---------|
| `andThen({ id, execute })` | Execute async function, pass data to next step |
| `andAgent(promptFn, agent, { schema })` | AI-powered step with structured output |
| `andAll(step1, step2, ...)` | Run steps in parallel |
| `andRace(step1, step2, ...)` | Run steps in parallel, return first to complete |
| `andBranch({ id, branches })` | Conditional branching with conditions |
| `andForEach({ id, step, concurrency })` | Iterate over array data in parallel |
| `andDoWhile({ id, step, condition })` | Loop while condition is true |
| `andDoUntil({ id, step, condition })` | Loop until condition is true |
| `andSleep({ id, duration })` | Pause for a duration |
| `andSleepUntil({ id, date })` | Pause until a specific time |
| `andGuardrail({ id, outputGuardrails })` | Apply guardrails at step level |
| `andTap({ id, execute })` | Side-effect only (no data transformation) |
| `andMap({ id, map })` | Transform data with source mappings |
| `andWorkflow(nestedWorkflow)` | Nest a workflow inside another |

### Context Available to Steps

```typescript
execute: async ({ data, suspend, resumeData, workflowState, 
                   setWorkflowState, getStepData, abortSignal }) => {
  // data: typed output from previous step
  // suspend(reason, metadata): human-in-the-loop pause
  // resumeData: data provided on resume (typed via resumeSchema)
  // workflowState / setWorkflowState: persistent state across steps
  // getStepData(stepId): access any previous step's output
  // abortSignal: cancellation token
}
```

---

## Workflow Chain (createWorkflowChain)

Fluent API alternative to `createWorkflow`:

```typescript
const workflow = createWorkflowChain({ id, input, result })
  .andThen({ ... })
  .andAgent(promptFn, agent, { schema })
  .andAll(step1, step2)
  .andRace(step1, step2)
  .andBranch({ branches: [...] })
  .andForEach({ step, concurrency })
  .andMap({ map: { ... } })
  .andDoWhile({ step, condition })
  .andGuardrail({ ... })
  .andSleep({ duration })
  .build(); // returns Workflow
```

---

## Integration with Trigger.dev

VoltAgent and Trigger.dev serve different purposes:

| Aspect | VoltAgent | Trigger.dev |
|--------|-----------|-------------|
| **Role** | AI agent orchestration | Background job orchestration |
| **When** | Planning/building projects | Running business logic in production |
| **Subagents** | AI agents with roles/tools | Background tasks with retries |
| **Human-in-loop** | suspend/resume | approval steps |
| **Persistence** | Memory + conversation storage | Queue + run history |

**Together in a build:**
1. **VoltAgent PlanAgent** orchestrates the build — plans todos, spawns subagents for each part
2. **Subagents** build components, write Trigger.dev task definitions, create frontend pages
3. **Trigger.dev** is what the BUILT project uses for its background jobs
