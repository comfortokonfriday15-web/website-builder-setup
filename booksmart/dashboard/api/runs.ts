import { admin } from "../src/lib/insforge.js";

export default async function handler(_req: any, res: any) {
  try {
    const limit = Math.min(Number(_req.query?.limit) || 100, 200);

    const { data: raw, error } = await admin.database
      .from("cronrun")
      .select("*")
      .order("startedat", { ascending: false })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const runs = (raw as any[]) ?? [];

    const total = runs.length;
    const success = runs.filter((r) => r.status === "success").length;
    const failed = runs.filter((r) => r.status === "error").length;
    const running = runs.filter((r) => r.status === "running").length;
    const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : "100.0";

    const recentFailures = runs
      .filter((r) => r.status === "error")
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        type: r.type,
        error: r.error,
        startedat: r.startedat,
        duration: r.duration,
      }));

    const byType = runs.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = { success, failed, running };

    res.status(200).json({
      runs,
      summary: { total, success, failed, running, successRate },
      recentFailures,
      byType,
      byStatus,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
