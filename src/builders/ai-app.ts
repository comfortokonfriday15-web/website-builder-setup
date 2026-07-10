import { buildProject } from "./factory.js";

export async function buildAIApp(brief: string) {
  return buildProject(brief);
}
