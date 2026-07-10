import { buildProject } from "./factory.js";

export async function buildBookingSystem(brief: string) {
  return buildProject(brief);
}
