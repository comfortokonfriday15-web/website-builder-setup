import { buildProject } from "./factory.js";

export async function buildMarketingSite(brief: string) {
  return buildProject(brief);
}
