import { ImapFlow } from "imapflow";
import { admin } from "./insforge.js";
import { sendNtfy } from "./ntfy.js";

export async function checkForReplies(): Promise<number> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.warn("SMTP_USER or SMTP_PASS not set, skipping reply check");
    return 0;
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    let newReplies = 0;

    try {
      const unseen = (await client.search({ seen: false })) as number[];
      if (unseen.length === 0) return 0;

      const { data: sentEvents } = await admin.database
        .from("EmailEvent")
        .select("subject, leadId")
        .eq("type", "sent");

      const subjectToLead = new Map<string, string>();
      for (const e of (sentEvents ?? []) as { subject: string; leadId: string }[]) {
        subjectToLead.set(e.subject.toLowerCase(), e.leadId);
      }

      for (const uid of unseen) {
        const raw = await client.fetchOne(uid, {
          envelope: true,
          flags: true,
        });
        if (!raw) continue;
        const msg = raw as { envelope: { subject?: string; from?: { address?: string }[] } };
        if (!msg.envelope) continue;
        const subject = msg.envelope.subject ?? "";

        const replyMatch = subject.match(/^Re:\s*(.+)/i);
        if (!replyMatch) continue;

        const originalSubject = replyMatch[1].trim().toLowerCase();
        const leadId = subjectToLead.get(originalSubject);
        if (!leadId) continue;

        const { data: existing } = await admin.database
          .from("EmailEvent")
          .select("id")
          .eq("leadId", leadId)
          .eq("type", "replied")
          .eq("subject", subject)
          .maybeSingle();

        if (existing) continue;

        await admin.database.from("EmailEvent").insert([{
          leadId,
          stepOrder: -1,
          type: "replied",
          to: msg.envelope.from?.[0]?.address ?? "",
          subject,
        }]);

        const { data: lead } = await admin.database
          .from("Lead")
          .select("name")
          .eq("id", leadId)
          .single();

        await sendNtfy({
          title: "BookSmart - Reply Received",
          message: `${(lead as { name: string } | null)?.name ?? "A lead"} replied to "${subject}"`,
          tags: ["leftwards_arrow_with_hook"],
          priority: 4,
        });

        newReplies++;
      }
    } finally {
      lock.release();
    }

    return newReplies;
  } finally {
    await client.logout();
  }
}
