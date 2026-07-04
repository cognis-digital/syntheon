/**
 * Notion adapter — create pages + databases via the REST API using fetch.
 *
 * Env: NOTION_API_KEY, NOTION_VERSION
 */
import { env, hasEnv, requireEnv } from "../types";

export const NOTION_ENV = ["NOTION_API_KEY", "NOTION_VERSION"] as const;

const NOTION_API = "https://api.notion.com/v1";
const DEFAULT_VERSION = "2022-06-28";

export function isConfigured(): boolean {
  return hasEnv("NOTION_API_KEY");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = requireEnv("notion", "NOTION_API_KEY");
  const res = await _fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Notion-Version": env("NOTION_VERSION") ?? DEFAULT_VERSION,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`[notion] ${res.status} ${path}: ${await res.text()}`);
  return (await res.json()) as T;
}

export interface NotionPage {
  id: string;
  url?: string;
}

/**
 * Create a page under a parent database or page.
 * `parent` is `{ database_id }` or `{ page_id }`.
 */
export async function createPage(
  parent: { database_id: string } | { page_id: string },
  properties: Record<string, unknown>,
  children?: unknown[],
): Promise<NotionPage> {
  return api<NotionPage>("/pages", {
    method: "POST",
    body: JSON.stringify({ parent, properties, children }),
  });
}

/** Create a database under a parent page. */
export async function createDatabase(
  pageId: string,
  title: string,
  properties: Record<string, unknown>,
): Promise<{ id: string; url?: string }> {
  return api<{ id: string; url?: string }>("/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: pageId },
      title: [{ type: "text", text: { content: title } }],
      properties,
    }),
  });
}

/** Query a database (optionally filtered/sorted). */
export async function queryDatabase(
  databaseId: string,
  body: Record<string, unknown> = {},
): Promise<{ results: NotionPage[] }> {
  return api<{ results: NotionPage[] }>(`/databases/${databaseId}/query`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
