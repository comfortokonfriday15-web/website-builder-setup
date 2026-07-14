import { admin } from "../src/lib/insforge.js";

export default async function handler(_req: any, res: any) {
  try {
    const limit = Math.min(Number(_req.query?.limit) || 50, 200);

    const { data, error } = await admin.database
      .from("cronrun")
      .select("*")
      .order("startedat", { ascending: false })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: stats } = await admin.database
      .from("cronrun")
      .select("type, status, count", { count: "exact", head: false });

    res.status(200).json({
      runs: data ?? [],
      summary: {
        total: (data as any[])?.length ?? 0,
        success: (data as any[])?.filter((r: any) => r.status === "success").length ?? 0,
        error: (data as any[])?.filter((r: any) => r.status === "error").length ?? 0,
        running: (data as any[])?.filter((r: any) => r.status === "running").length ?? 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
