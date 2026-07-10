---
name: awesome-design-md
description: Curated collection of 73+ DESIGN.md files from real world websites (Apple, Stripe, Vercel, Linear, Nike, SpaceX, etc.). Drop any DESIGN.md into your project and tell your AI agent to match its design language for instant, high-quality UI generation.
---

# Awesome DESIGN.md Skill

## Overview
A ready-to-use library of **73+ DESIGN.md design systems** extracted from real-world production websites. These are pre-analyzed design tokens (color palettes, typography, components, layout principles) from companies like Apple, Stripe, Vercel, Linear, Nike, SpaceX, Figma, and more.

Copy any `DESIGN.md` into your project root, tell your AI agent *"build this page using the design system in DESIGN.md"*, and get premium, visually consistent UI instantly.

## How to Use

### 1. Browse the Collection
All DESIGN.md files are in `design-md/` organized by company name:
```
.claude/skills/awesome-design-md/design-md/
├── apple/
├── stripe/
├── vercel/
├── linear.app/
├── nike/
├── spacex/
├── figma/
├── supabase/
├── notion/
├── shopify/
├── tesla/
├── uber/
├── ferrari/
└── ... (73+ total)
```

### 2. Pick a Vibe & Copy
Choose a design system that matches the project's tone:
- **Premium/Consumer:** `apple/`, `nike/`, `tesla/`, `ferrari/`, `bugatti/`
- **Developer Tools:** `vercel/`, `cursor/`, `linear.app/`, `warp/`, `raycast/`
- **SaaS/Enterprise:** `stripe/`, `supabase/`, `notion/`, `intercom/`, `sentry/`
- **Dark/Cinematic:** `spacex/`, `shopify/`, `runwayml/`, `playstation/`
- **Fintech:** `stripe/`, `coinbase/`, `revolut/`, `wise/`
- **AI/Tech:** `claude/`, `mistral.ai/`, `replicate/`, `together.ai/`, `opencode.ai/`
- **Editorial/Media:** `theverge/`, `wired/`, `ibm/`

Each folder contains:
| File | Purpose |
|------|---------|
| `DESIGN.md` | The design system document (what AI agents read) |
| `preview.html` | Visual catalog — color swatches, type scale, buttons, cards |
| `preview-dark.html` | Same catalog with dark surfaces |

### 3. Use in Your Project
```bash
# Copy a design system into your project root
cp .claude/skills/awesome-design-md/design-md/stripe/DESIGN.md ./DESIGN.md

# Then tell your AI agent:
# "Build a landing page for [project] using the design system in DESIGN.md"
```

### 4. Combine with Other Skills
- Use any DESIGN.md directly as a drop-in design system reference
- Use alongside a reference DESIGN.md for visual consistency
- Use with `minimalist-ui`, `high-end-visual-design`, or `gpt-taste` as the execution engine

## What's Inside Each DESIGN.md
| Section | What it captures |
|---------|-----------------|
| Visual Theme & Atmosphere | Mood, density, design philosophy |
| Color Palette & Roles | Semantic name + hex + functional role |
| Typography Rules | Font families, full hierarchy table |
| Component Stylings | Buttons, cards, inputs, navigation with states |
| Layout Principles | Spacing scale, grid, whitespace philosophy |
| Depth & Elevation | Shadow system, surface hierarchy |
| Do's and Don'ts | Design guardrails and anti-patterns |
| Responsive Behavior | Breakpoints, touch targets, collapsing strategy |
| Agent Prompt Guide | Quick color reference, ready-to-use prompts |

## Source
This is a mirror of [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — a community-curated collection of DESIGN.md files from real websites. MIT license.
