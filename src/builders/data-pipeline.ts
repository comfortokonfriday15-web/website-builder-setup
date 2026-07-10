import { buildProject } from "./factory.js";

export async function buildDataPipeline(brief: string) {
  return buildProject(brief);
}
