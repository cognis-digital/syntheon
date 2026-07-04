/**
 * Zapier adapter — trigger an outbound REST hook (Catch Hook / webhook) and
 * parse an inbound action payload.
 *
 * Env: ZAPIER_WEBHOOK_URL
 */
import { env, hasEnv, requireEnv } from "../types";

export const ZAPIER_ENV = ["ZAPIER_WEBHOOK_URL"] as const;

export function isConfigured(): boolean {
  return hasEnv("ZAPIER_WEBHOOK_URL");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

/** POST a JSON payload to a Zapier Catch Hook (trigger a Zap). */
export async function trigger(
  payload: Record<string, unknown>,
  url?: string,
): Promise<{ ok: boolean; status: number }> {
  const target = url ?? requireEnv("zapier", "ZAPIER_WEBHOOK_URL");
  const res = await _fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status };
}

export interface InboundAction<T = Record<string, unknown>> {
  action: string;
  data: T;
}

/**
 * Parse an inbound Zapier action (a Zap POSTing to your endpoint). Zapier
 * inbound webhooks are unauthenticated by convention; use a per-endpoint
 * secret path or a shared token you check separately.
 */
export function parseInboundAction<T = Record<string, unknown>>(
  body: string,
): InboundAction<T> {
  const parsed = JSON.parse(body) as { action?: string } & Record<string, unknown>;
  const { action = "unknown", ...rest } = parsed;
  return { action, data: rest as T };
}

/** True if a shared inbound token matches the expected value (constant-time-ish). */
export function verifyInboundToken(provided: string | undefined): boolean {
  const expected = env("ZAPIER_INBOUND_TOKEN");
  if (!expected) return false;
  return provided === expected;
}
