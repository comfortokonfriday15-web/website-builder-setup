import { classifyProject, PROJECT_TYPE_LABELS, pickDesignVibe, PROJECT_TYPE_SUBAGENTS } from "./skills/registry.js";

const brief = "project management tool landing page";
const projectType = classifyProject(brief);
const label = PROJECT_TYPE_LABELS[projectType];
const vibe = pickDesignVibe(brief);
const subagentTypes = PROJECT_TYPE_SUBAGENTS[projectType];

console.log(JSON.stringify({
  brief,
  projectType,
  label,
  designVibe: vibe,
  subagents: subagentTypes,
}, null, 2));
