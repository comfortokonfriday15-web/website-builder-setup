import { parse } from "csv-parse/sync";

interface LeadRow {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
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
    const name = (row.name || "").trim();
    const email = (row.email || "").trim();
    if (!name || !email) continue;

    leads.push({
      name,
      email,
      company: (row.company || "").trim() || undefined,
      phone: (row.phone || "").trim() || undefined,
      notes: (row.notes || "").trim() || undefined,
    });
  }

  return leads;
}
