/**
 * HubSpot adapter — upsert contacts + deals, set lifecycle stage, via the
 * v3 CRM API with a private-app access token.
 *
 * Env: HUBSPOT_ACCESS_TOKEN
 */
import { hasEnv, requireEnv } from "../types";

export const HUBSPOT_ENV = ["HUBSPOT_ACCESS_TOKEN"] as const;

const HUBSPOT_API = "https://api.hubapi.com";

export function isConfigured(): boolean {
  return hasEnv("HUBSPOT_ACCESS_TOKEN");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = requireEnv("hubspot", "HUBSPOT_ACCESS_TOKEN");
  const res = await _fetch(`${HUBSPOT_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`[hubspot] ${res.status} ${path}: ${await res.text()}`);
  return (await res.json()) as T;
}

export interface HubSpotObject {
  id: string;
  properties: Record<string, string>;
}

/**
 * Upsert a contact by email (create, or update if it already exists).
 * Uses the search API then create/update — HubSpot has no native upsert.
 */
export async function upsertContact(
  email: string,
  properties: Record<string, string> = {},
): Promise<HubSpotObject> {
  const search = await api<{ results: HubSpotObject[] }>(
    "/crm/v3/objects/contacts/search",
    {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          { filters: [{ propertyName: "email", operator: "EQ", value: email }] },
        ],
        limit: 1,
      }),
    },
  );
  const props = { email, ...properties };
  const existing = search.results[0];
  if (existing) {
    return api<HubSpotObject>(`/crm/v3/objects/contacts/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties: props }),
    });
  }
  return api<HubSpotObject>("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties: props }),
  });
}

/** Set a contact's lifecycle stage (e.g. lead, marketingqualifiedlead, customer). */
export async function setLifecycleStage(
  contactId: string,
  stage: string,
): Promise<HubSpotObject> {
  return api<HubSpotObject>(`/crm/v3/objects/contacts/${contactId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: { lifecyclestage: stage } }),
  });
}

/** Create a deal. */
export async function createDeal(
  properties: Record<string, string>,
): Promise<HubSpotObject> {
  return api<HubSpotObject>("/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

/** Update a deal by id. */
export async function updateDeal(
  dealId: string,
  properties: Record<string, string>,
): Promise<HubSpotObject> {
  return api<HubSpotObject>(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
}
