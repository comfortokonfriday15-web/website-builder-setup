import { buildProject } from "./factory.js";

export async function buildAutomationBackend(brief: string) {
  return buildProject(brief);
}
