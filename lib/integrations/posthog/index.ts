/**
 * PostHog adapter — capture events + identify via the public capture API
 * using fetch. The project API key is public (safe client-side).
 *
 * Env: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
 */
import { env, hasEnv, IntegrationError, requireEnv } from "../types";

export const POSTHOG_ENV = [
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
] as const;

const DEFAULT_HOST = "https://us.i.posthog.com";

export function isConfigured(): boolean {
  return hasEnv("NEXT_PUBLIC_POSTHOG_KEY");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

function host(): string {
  return (env("NEXT_PUBLIC_POSTHOG_HOST") ?? DEFAULT_HOST).replace(/\/$/, "");
}

/** Capture an event for a distinct user id. */
export async function capture(
  event: string,
  distinctId: string,
  properties: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number }> {
  if (!distinctId) {
    throw new IntegrationError("posthog", "distinctId is required", "bad_request");
  }
  const key = requireEnv("posthog", "NEXT_PUBLIC_POSTHOG_KEY");
  const res = await _fetch(`${host()}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      event,
      distinct_id: distinctId,
      properties,
    }),
  });
  return { ok: res.ok, status: res.status };
}

/** Set person properties via a $identify event. */
export async function identify(
  distinctId: string,
  properties: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number }> {
  return capture("$identify", distinctId, { $set: properties });
}
