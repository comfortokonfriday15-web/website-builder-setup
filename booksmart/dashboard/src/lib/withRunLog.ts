import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "./insforge.js";

type Metadata = Record<string, unknown>;

export function withRunLog(
  type: string,
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>,
  getMetadata?: (req: VercelRequest) => Metadata | Promise<Metadata>,
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const startedAt = new Date();
    let runId: string | null = null;

    try {
      const meta = getMetadata ? await getMetadata(req) : undefined;
      const { data } = await admin.database
        .from("cronrun")
        .insert([{ type, status: "running", startedAt: startedAt.toISOString(), metadata: meta ?? null }])
        .select("id")
        .single();
      runId = (data as any)?.id ?? null;

      const originalJson = res.json.bind(res);
      const originalStatus = res.status.bind(res);
      let statusCode = 200;
      let body: any = null;

      res.json = (obj: any) => {
        body = obj;
        return originalJson(obj);
      };
      res.status = (code: number) => {
        statusCode = code;
        return originalStatus(code);
      };

      await handler(req, res);

      const finishedAt = new Date();
      const duration = finishedAt.getTime() - startedAt.getTime();

      if (runId) {
        await admin.database
          .from("cronrun")
          .update({
            status: statusCode >= 400 ? "error" : "success",
            finishedAt: finishedAt.toISOString(),
            result: body ? JSON.stringify(body) : null,
            duration,
          })
          .eq("id", runId);
      }
    } catch (err: any) {
      const finishedAt = new Date();
      const duration = finishedAt.getTime() - startedAt.getTime();

      if (runId) {
        await admin.database
          .from("cronrun")
          .update({
            status: "error",
            finishedAt: finishedAt.toISOString(),
            error: err.message,
            duration,
          })
          .eq("id", runId);
      }
      console.error(`${type} error:`, err);
      res.status(500).json({ error: err.message });
    }
  };
}
