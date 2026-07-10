---
name: session-handoff
description: Dump a structured session summary before clearing context. Preserves what was built, key files, open decisions, and exactly where to resume. Use when context is getting full, before /clear, or when switching between projects.
---

# Session Handoff — Context Preservation

When the context window is getting full (check with /context if available), or before switching tasks, run this to create a structured handoff file.

## Output File

Save to `CURRENT-STATE.md` in the project root.

## Structure

```markdown
# Session Handoff — [Date/Time]

## What We're Building
[One-line summary of the current project/task]

## Decisions Locked
- [Decision 1]
- [Decision 2]

## What Was Shipped
- [File path] — [what it does, key details]

## Key Files
| File | Purpose | Status |
|------|---------|--------|
| src/components/Foo.tsx | Feature section | Complete |
| src/lib/utils.ts | Animation helpers | Needs review |

## Running State
- Dev server: [running / stopped]
- Port: [port]
- Build status: [passing / failing]

## Open Decisions
- [Question still unresolved]

## Deferred Items
- [Things intentionally postponed]

## Where to Resume
[Exact next action: file to open, command to run, decision to make]
```

## When to Use

1. Context is ~25%+ full (check with /context or by feel)
2. Before running /clear to start fresh
3. When switching between projects
4. Before a known long-running task (to checkpoint progress)
5. Before handing off to a different model or tool (Codex, Cursor, etc.)

## Recovery

When resuming from a handoff:
1. Read `CURRENT-STATE.md`
2. Run any setup commands noted
3. Open the "Where to Resume" file
4. Continue

## Rules

- Always overwrite the existing `CURRENT-STATE.md` (don't append)
- Keep it scannable — one line per item, no paragraphs
- If nothing has shipped yet, note "Pre-build phase — no files yet"
- Be honest about open decisions — don't pretend clarity that doesn't exist
