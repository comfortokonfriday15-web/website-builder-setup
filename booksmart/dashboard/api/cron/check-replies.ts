import { checkForReplies } from "../../src/lib/replies.js";
import { sendNtfy } from "../../src/lib/ntfy.js";
import { withRunLog } from "../../src/lib/withRunLog.js";

export default withRunLog("cron.check-replies", async (_req, res) => {
  const found = await checkForReplies();

  if (found > 0) {
    await sendNtfy({
      title: "BookSmart",
      message: `${found} new repl${found === 1 ? "y" : "ies"} found this check`,
      tags: ["incoming_envelope"],
    });
  }

  res.status(200).json({ found });
});
