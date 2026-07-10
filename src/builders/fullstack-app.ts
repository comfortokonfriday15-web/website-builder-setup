import { buildProject } from "./factory.js";

export async function buildFullstackApp(brief: string) {
  return buildProject(brief);
}
