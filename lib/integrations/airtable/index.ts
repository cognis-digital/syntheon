/**
 * Airtable adapter — record CRUD via the REST API using fetch.
 *
 * Env: AIRTABLE_API_KEY, AIRTABLE_BASE_ID
 */
import { env, hasEnv, requireEnv } from "../types";

export const AIRTABLE_ENV = ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"] as const;

const AIRTABLE_API = "https://api.airtable.com/v0";

export function isConfigured(): boolean {
  return hasEnv("AIRTABLE_API_KEY", "AIRTABLE_BASE_ID");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

function baseId(override?: string): string {
  return override ?? requireEnv("airtable", "AIRTABLE_BASE_ID");
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = requireEnv("airtable", "AIRTABLE_API_KEY");
  const res = await _fetch(`${AIRTABLE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`[airtable] ${res.status} ${path}: ${await res.text()}`);
  return (await res.json()) as T;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

/** List records in a table (optional filterByFormula / maxRecords). */
export async function listRecords(
  table: string,
  opts: { filterByFormula?: string; maxRecords?: number; base?: string } = {},
): Promise<AirtableRecord[]> {
  const q = new URLSearchParams();
  if (opts.filterByFormula) q.set("filterByFormula", opts.filterByFormula);
  if (opts.maxRecords) q.set("maxRecords", String(opts.maxRecords));
  const qs = q.toString();
  const res = await api<{ records: AirtableRecord[] }>(
    `/${baseId(opts.base)}/${encodeURIComponent(table)}${qs ? `?${qs}` : ""}`,
  );
  return res.records;
}

/** Create a record. */
export async function createRecord(
  table: string,
  fields: Record<string, unknown>,
  base?: string,
): Promise<AirtableRecord> {
  return api<AirtableRecord>(`/${baseId(base)}/${encodeURIComponent(table)}`, {
    method: "POST",
    body: JSON.stringify({ fields }),
  });
}

/** Update (PATCH — partial) a record by id. */
export async function updateRecord(
  table: string,
  recordId: string,
  fields: Record<string, unknown>,
  base?: string,
): Promise<AirtableRecord> {
  return api<AirtableRecord>(
    `/${baseId(base)}/${encodeURIComponent(table)}/${recordId}`,
    { method: "PATCH", body: JSON.stringify({ fields }) },
  );
}

/** Delete a record by id. */
export async function deleteRecord(
  table: string,
  recordId: string,
  base?: string,
): Promise<{ id: string; deleted: boolean }> {
  return api<{ id: string; deleted: boolean }>(
    `/${baseId(base)}/${encodeURIComponent(table)}/${recordId}`,
    { method: "DELETE" },
  );
}

/** Default base id (for convenience). */
export function defaultBaseId(): string | undefined {
  return env("AIRTABLE_BASE_ID");
}
