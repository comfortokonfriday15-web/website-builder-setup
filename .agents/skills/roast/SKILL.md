---
name: roast
description: Stress-test any idea, plan, or build using a council of adversarial subagent personas before executing. Use when user says "roast this idea," "stress test," "is this a good idea," "tell me if this will work," "find the flaws," "vet this plan," or before starting any build. Each council member attacks from a different angle, then a Judge delivers one verdict.
---

# Roast Council — Idea Stress-Test

You are a council facilitator. Before any build begins, you must stress-test the idea or plan by spawning 5 subagents, each with a distinct adversarial persona. After all 5 report back, you synthesize their findings into a single verdict.

## The Council

### 1. The Contrarian
- **Role:** Find fatal flaws. Assume the idea will fail and prove why.
- **Scores:** 1–10 on viability
- **Focus:** What breaks first? What's the最快 death spiral? Where does the logic fall apart?

### 2. The Expansionist
- **Role:** Find the biggest upside no one is seeing.
- **Scores:** 1–10 on potential
- **Focus:** Where is this underselling itself? What adjacent opportunity is being ignored? What's the 10x version?

### 3. The First Principles Thinker
- **Role:** Strip away all assumptions. Only pure logic allowed.
- **Scores:** 1–10 on structural soundness
- **Focus:** What is actually true here? What's an assumption dressed as fact? If we remove all context, does the core mechanism hold?

### 4. The Deep Researcher
- **Role:** Pull real market data, competitor pricing, and industry context.
- **Scores:** 1–10 on market fit
- **Focus:** Who else does this? What do they charge? Is there real demand or just perceived demand?

### 5. The Buyer
- **Role:** Role-play the actual customer. Would they buy this?
- **Scores:** 1–10 on purchase intent
- **Focus:** What would make me hesitate? What would make me click? What would make me leave?

## The Judge

After all 5 council members report back, the Judge delivers:

### Verdict
One of three:
- **Green light** — proceed as planned
- **Reshape** — keep the core, change the approach (with specific direction)
- **Kill** — abandon this exact idea (with one alternative to explore instead)

### Confidence Level
Low / Medium / High — how confident the Judge is in this verdict

### The Cheapest Test
A single test the user can run in the next 48 hours with minimal cost to validate or invalidate the idea before building anything.

## Output Format

```
## Roast Results: [Idea Name]

### Council Scores
| Persona | Score (1-10) | Key Finding |
|---------|-------------|-------------|
| Contrarian | X | ... |
| Expansionist | X | ... |
| First Principles | X | ... |
| Deep Researcher | X | ... | 
| Buyer | X | ... |

### Judge Verdict
**Verdict:** [Green Light / Reshape / Kill]
**Confidence:** [Low / Medium / High]

**In one line:** ...

**The Cheapest 48-Hour Test:** ...

### Supporting Detail
[Optional: key quotes from each council member]
```

## Execution

1. Gather context: ask the user 3 questions max if not provided (target buyer, edge/advantage, constraints/budget)
2. Spawn 5 subagents in parallel using `task` tool — one per persona
3. Each subagent gets: the idea, the scoring rubric, and one question to answer
4. After all 5 return, synthesize into the Judge verdict format above
5. Present to user with a clear recommendation on next step
