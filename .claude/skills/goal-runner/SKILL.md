---
name: goal-runner
description: Define objective completion conditions upfront, spawn parallel subagents, then verify with a separate evaluator. Prevents "finished but not working" builds. Use before any multi-step build task.
---

# Goal Runner — Objective Completion Protocol

Before starting any build, define what "done" means objectively. A separate evaluator (not the builder) verifies completion.

## Protocol

### Step 1: Define the Goal

```markdown
## Goal: [One-line description]

### Deliverables
- [File path 1] — [what it is]
- [File path 2] — [what it is]

### Definition of Done
All of:
- [ ] All files exist and are non-empty
- [ ] tsc --noEmit passes with zero errors
- [ ] npm run build passes
- [ ] [Specific condition for this task]

### Evaluation
A separate subagent will verify done=true before declaring complete.
```

### Step 2: Build

- Spawn subagents in parallel for independent deliverables
- Each subagent gets a clean context
- Each subagent writes its files to disk

### Step 3: Evaluate

A DIFFERENT subagent (not the builder) checks:

1. All files exist and are non-empty
2. Build passes (`npm run build`)
3. Type check passes (`tsc --noEmit`)
4. Any custom conditions specific to this goal

The evaluator replies with exactly:
- **COMPLETE** — all conditions met
- **INCOMPLETE: [reason]** — what's missing

### Step 4: Loop (if needed)

If INCOMPLETE, the builder retries up to N attempts, addressing the evaluator's feedback.
Only the builder retries. The evaluator stays independent.

## Example

```
GOAL: Build pricing section with 3 tiers
DONE WHEN: Pricing.tsx exists, tsc passes, build passes, 3 plan objects in array
BUILDER: task(general, "Create Pricing.tsx with 3 tiers...")
EVALUATOR: task(general, "Check: Pricing.tsx exists? 3 plans? tsc? build?")
if INCOMPLETE: task(general, "Fix: [what evaluator said]")
```

## Rules

- The evaluator MUST be a different subagent from the builder
- The evaluator does not write code — only reads and checks
- Objective conditions only (file exists, build passes, count matches)
- No subjective evaluation ("looks good", "feels right")
- Max 3 build attempts before surfacing failure to user
