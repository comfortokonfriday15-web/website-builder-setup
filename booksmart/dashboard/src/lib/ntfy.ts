const NTFY_BASE = "https://ntfy.sh";

interface NtfyOptions {
  title?: string;
  message: string;
  priority?: number;
  tags?: string[];
}

export async function sendNtfy(options: NtfyOptions): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.warn("NTFY_TOPIC not set, skipping notification");
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "text/plain",
  };
  if (options.title) headers["Title"] = options.title;
  if (options.priority) headers["Priority"] = String(options.priority);
  if (options.tags) headers["Tags"] = options.tags.join(",");

  try {
    const res = await fetch(`${NTFY_BASE}/${topic}`, {
      method: "POST",
      headers,
      body: options.message,
    });
    if (!res.ok) {
      console.warn(`ntfy.sh returned ${res.status}: ${await res.text()}`);
    }
  } catch (err: any) {
    console.warn(`ntfy.sh error: ${err.message}`);
  }
}
