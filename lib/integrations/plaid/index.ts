/**
 * Plaid adapter — create a Link token + exchange a public token for an
 * access token, via the REST API using fetch (no SDK dependency).
 *
 * Env: PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV
 */
import { env, hasEnv, requireEnv } from "../types";

export const PLAID_ENV = ["PLAID_CLIENT_ID", "PLAID_SECRET", "PLAID_ENV"] as const;

export function isConfigured(): boolean {
  return hasEnv("PLAID_CLIENT_ID", "PLAID_SECRET");
}

/** Resolve the Plaid API base URL from PLAID_ENV (sandbox | development | production). */
export function baseUrl(): string {
  const e = (env("PLAID_ENV") ?? "sandbox").toLowerCase();
  const host =
    e === "production"
      ? "production.plaid.com"
      : e === "development"
        ? "development.plaid.com"
        : "sandbox.plaid.com";
  return `https://${host}`;
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

async function api<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const clientId = requireEnv("plaid", "PLAID_CLIENT_ID");
  const secret = requireEnv("plaid", "PLAID_SECRET");
  const res = await _fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, secret, ...body }),
  });
  if (!res.ok) throw new Error(`[plaid] ${res.status} ${path}: ${await res.text()}`);
  return (await res.json()) as T;
}

export interface LinkTokenOptions {
  userId: string;
  clientName?: string;
  products?: string[];
  countryCodes?: string[];
  language?: string;
}

/** Create a Link token for the Plaid Link flow. */
export async function createLinkToken(
  opts: LinkTokenOptions,
): Promise<{ linkToken: string; expiration: string }> {
  const res = await api<{ link_token: string; expiration: string }>("/link/token/create", {
    user: { client_user_id: opts.userId },
    client_name: opts.clientName ?? "Syntheon",
    products: opts.products ?? ["auth", "transactions"],
    country_codes: opts.countryCodes ?? ["US"],
    language: opts.language ?? "en",
  });
  return { linkToken: res.link_token, expiration: res.expiration };
}

/** Exchange a public token (from Link onSuccess) for an access token + item id. */
export async function exchangePublicToken(
  publicToken: string,
): Promise<{ accessToken: string; itemId: string }> {
  const res = await api<{ access_token: string; item_id: string }>(
    "/item/public_token/exchange",
    { public_token: publicToken },
  );
  return { accessToken: res.access_token, itemId: res.item_id };
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  type: string;
}

/** Fetch accounts for an item's access token. */
export async function getAccounts(accessToken: string): Promise<PlaidAccount[]> {
  const res = await api<{ accounts: PlaidAccount[] }>("/accounts/get", {
    access_token: accessToken,
  });
  return res.accounts;
}
