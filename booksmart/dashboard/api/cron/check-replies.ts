import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkForReplies } from "../../src/lib/replies.js";
import { sendNtfy } from "../../src/lib/ntfy.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const found = await checkForReplies();

    if (found > 0) {
      await sendNtfy({
        title: "BookSmart",
        message: `${found} new repl${found === 1 ? "y" : "ies"} found this check`,
        tags: ["incoming_envelope"],
      });
    }

    res.status(200).json({ found });
  } catch (err: any) {
    console.error("check-replies error:", err);
    res.status(500).json({ error: err.message });
  }
}
