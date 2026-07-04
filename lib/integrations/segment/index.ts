/**
 * Segment adapter — track + identify via the HTTP Tracking API using fetch
 * (HTTP Basic auth with the write key as the username, empty password).
 *
 * Env: SEGMENT_WRITE_KEY
 */
import { hasEnv, IntegrationError, requireEnv } from "../types";

export const SEGMENT_ENV = ["SEGMENT_WRITE_KEY"] as const;

const SEGMENT_API = "https://api.segment.io/v1";

export function isConfigured(): boolean {
  return hasEnv("SEGMENT_WRITE_KEY");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

function authHeader(): string {
  const key = requireEnv("segment", "SEGMENT_WRITE_KEY");
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

async function post(path: string, body: Record<string, unknown>): Promise<{ ok: boolean; status: number }> {
  const res = await _fetch(`${SEGMENT_API}${path}`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}

export interface Identity {
  /** logged-in user id */
  userId?: string;
  /** anonymous device/session id */
  anonymousId?: string;
}

function requireIdentity(id: Identity): void {
  if (!id.userId && !id.anonymousId) {
    throw new IntegrationError("segment", "userId or anonymousId is required", "bad_request");
  }
}

/** Track an event. */
export async function track(
  event: string,
  id: Identity,
  properties: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number }> {
  requireIdentity(id);
  return post("/track", { event, properties, ...id });
}

/** Identify a user with traits. */
export async function identify(
  id: Identity,
  traits: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number }> {
  requireIdentity(id);
  return post("/identify", { traits, ...id });
}
