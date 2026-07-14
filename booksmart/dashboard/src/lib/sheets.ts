import { parse } from "csv-parse/sync";

interface LeadRow {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  rating?: number;
  reviewCount?: number;
}

export async function fetchLeadsFromSheet(): Promise<LeadRow[]> {
  const url = process.env.GOOGLE_SHEET_CSV_URL;
  if (!url) throw new Error("GOOGLE_SHEET_CSV_URL not set");

  console.log(`Fetching sheet: ${url}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);

  const csv = await res.text();
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const leads: LeadRow[] = [];

  for (const row of records) {
    const bizName = (row["Business Name"] || row.name || "").trim();
    const email = (row["Email"] || row.email || "").trim();
    if (!bizName || !email) continue;

    const rawRating = (row["Ratings"] || "").trim();
    const rawReviewCount = (row["Reviews"] || row[""] || "").trim();

    leads.push({
      name: bizName,
      email,
      company: bizName,
      phone: (row.phone || "").trim() || undefined,
      notes: (row.notes || "").trim() || undefined,
      rating: rawRating ? parseFloat(rawRating) : undefined,
      reviewCount: rawReviewCount ? parseInt(rawReviewCount, 10) : undefined,
    });
  }

  return leads;
}
