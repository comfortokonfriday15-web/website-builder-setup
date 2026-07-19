import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";

const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string | undefined;
  if (!id) {
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    });
    res.end(PIXEL);
    return;
  }

  try {
    const parts = id.split(":");
    const leadId = parts[0];
    const stepOrder = parseInt(parts[1] || "0", 10);

    if (leadId) {
      const existing = await admin.database
        .from("EmailEvent")
        .select("id")
        .eq("leadId", leadId)
        .eq("type", "opened")
        .eq("stepOrder", stepOrder)
        .limit(1);

      if (!(existing.data && existing.data.length > 0)) {
        await admin.database.from("EmailEvent").insert([{
          leadId,
          stepOrder,
          type: "opened",
          subject: `opened step ${stepOrder}`,
        }]);
      }
    }
  } catch {
    // silent — pixel must always load
  }

  res.writeHead(200, {
    "Content-Type": "image/gif",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });
  res.end(PIXEL);
}
