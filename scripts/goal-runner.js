/**
 * goal-runner.js — /goal-style task runner
 *
 * Defines objective completion conditions and uses a separate evaluator
 * to verify. Keeps re-attempting until conditions are met.
 *
 * Usage: node scripts/goal-runner.js
 *
 * This is consumed by AGENTS.md as a protocol for structured task execution.
 * It does NOT execute tasks itself — it defines the protocol that the agent follows.
 */

module.exports = {
  /**
   * Define a goal with objective completion conditions.
   *
   * @param {string} description - What to build
   * @param {string[]} deliverables - File paths that must exist
   * @param {function} conditions - Array of { check: string, pass: function(ctx) => boolean }
   * @param {object} opts
   * @param {number} opts.maxAttempts - Max build cycles (default 3)
   * @param {boolean} opts.verifyBuild - Run npm run build after (default true)
   * @param {boolean} opts.verifyTypes - Run tsc --noEmit after (default true)
   *
   * Returns: { success: boolean, attempts: number, results: object }
   */
  defineGoal(description, deliverables, conditions, opts = {}) {
    return {
      type: "goal",
      description,
      deliverables: deliverables.map((d) =>
        typeof d === "string" ? { path: d, minSize: 1 } : d
      ),
      conditions: conditions || [],
      maxAttempts: opts.maxAttempts || 3,
      verifyBuild: opts.verifyBuild !== false,
      verifyTypes: opts.verifyTypes !== false,
    };
  },

  /**
   * Create an evaluator prompt that a separate subagent uses to judge completion.
   *
   * @param {object} goal - The goal object from defineGoal()
   * @returns {string} - Prompt for the evaluator subagent
   */
  evaluatorPrompt(goal) {
    return `
You are a strict evaluator. Your job is to determine if a goal is COMPLETE or INCOMPLETE.

## Goal
${goal.description}

## Deliverables (all must exist and be non-empty)
${goal.deliverables.map((d) => `  - ${d.path}${d.minSize ? ` (min ${d.minSize} byte)` : ""}`).join("\n")}

## Conditions (all must pass)
${goal.conditions.length > 0 ? goal.conditions.map((c) => `  - ${c.check}`).join("\n") : "  (none specified)"}

${goal.verifyBuild ? "\n## Build Check\n- npm run build must pass" : ""}
${goal.verifyTypes ? "## Type Check\n- tsc --noEmit must pass" : ""}

## Your Response
Reply with EXACTLY one of:
- **COMPLETE** — all deliverables exist and are non-empty, all conditions pass
- **INCOMPLETE: [reason]** — specifically what's missing or failing
`;
  },

  /**
   * Default completion conditions for common project types.
   */
  defaultConditions: {
    landingPage: [
      { check: "All sections render without console errors" },
      { check: "No placeholder content (lorem ipsum, TODO)" },
      { check: "Responsive at 1440px and 390px viewports" },
    ],
    apiService: [
      { check: "All endpoints return correct status codes" },
      { check: "Error handling for invalid input" },
      { check: "No hardcoded secrets or API keys" },
    ],
    automation: [
      { check: "Task runs without errors" },
      { check: "Idempotency handling in place" },
      { check: "Error logging on failure paths" },
    ],
  },
};
