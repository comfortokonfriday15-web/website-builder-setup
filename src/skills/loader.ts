import * as fs from "node:fs";
import { getSkillsForSubagent, type ProjectType, type SubagentType, type SkillEntry } from "./registry.js";

const MAX_SKILL_LINES = 200;

export interface LoadedSkill {
  name: string
  summary: string
  content: string
}

function readSkillFile(skill: SkillEntry): string {
  try {
    const raw = fs.readFileSync(skill.path, "utf-8");
    const lines = raw.split("\n");

    const contentLines: string[] = [];
    let inFrontmatter = false;
    let lineCount = 0;

    for (const line of lines) {
      if (line.trim() === "---" && !inFrontmatter) {
        inFrontmatter = true;
        continue;
      }
      if (line.trim() === "---" && inFrontmatter) {
        inFrontmatter = false;
        continue;
      }
      if (inFrontmatter) continue;

      contentLines.push(line);
      lineCount++;
      if (lineCount >= MAX_SKILL_LINES) break;
    }

    return contentLines.join("\n").trim();
  } catch {
    return `[Skill file not found at ${skill.path}]`;
  }
}

export function loadSkillsForSubagent(
  projectType: ProjectType,
  subagent: SubagentType,
): LoadedSkill[] {
  const skills = getSkillsForSubagent(projectType, subagent);
  return skills.map((s) => ({
    name: s.name,
    summary: s.summary,
    content: readSkillFile(s),
  }));
}

export function buildSkillInjectedPrompt(
  basePrompt: string,
  skills: LoadedSkill[],
): string {
  if (skills.length === 0) return basePrompt;

  const sections = skills.map(
    (s) => `=== Skill: ${s.name} ===
${s.summary}

${s.content}`,
  );

  return [
    basePrompt,
    "",
    "=== SKILLS & DESIGN GUIDELINES ===",
    "You have access to the following skills. Read and apply the relevant rules for your task:",
    "",
    ...sections,
    "",
    "=== END SKILLS ===",
  ].join("\n");
}
