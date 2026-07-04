/**
 * Clerk adapter — auth + waitlist helpers.
 *
 * The `@clerk/nextjs` package provides middleware/components/hooks for the app
 * itself; this adapter adds server-side helpers (backend API calls) and the
 * config guard the registry needs. It never throws at import time.
 *
 * Env: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
 *      NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL,
 *      NEXT_PUBLIC_CLERK_WAITLIST_URL
 */
import { env, hasEnv, requireEnv } from "../types";

export const CLERK_ENV = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_WAITLIST_URL",
] as const;

const CLERK_API = "https://api.clerk.com/v1";

export function isConfigured(): boolean {
  return hasEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY");
}

/** Resolve the configured auth route URLs (with sensible defaults). */
export function authUrls(): {
  signIn: string;
  signUp: string;
  waitlist: string;
} {
  return {
    signIn: env("NEXT_PUBLIC_CLERK_SIGN_IN_URL") ?? "/sign-in",
    signUp: env("NEXT_PUBLIC_CLERK_SIGN_UP_URL") ?? "/sign-up",
    waitlist: env("NEXT_PUBLIC_CLERK_WAITLIST_URL") ?? "/waitlist",
  };
}

/** Injectable transport for tests. */
export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...args) => fetch(...args);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...args) => fetch(...args));
}

async function clerkApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const key = requireEnv("clerk", "CLERK_SECRET_KEY");
  const res = await _fetch(`${CLERK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[clerk] ${res.status} ${path}: ${body}`);
  }
  return (await res.json()) as T;
}

export interface WaitlistEntry {
  id: string;
  email_address: string;
  status: string;
}

/** Add an email to the Clerk waitlist. */
export async function addToWaitlist(email: string): Promise<WaitlistEntry> {
  return clerkApi<WaitlistEntry>("/waitlist_entries", {
    method: "POST",
    body: JSON.stringify({ email_address: email }),
  });
}

/** List waitlist entries (paginated). */
export async function listWaitlist(
  opts: { limit?: number; offset?: number } = {},
): Promise<WaitlistEntry[]> {
  const q = new URLSearchParams();
  if (opts.limit) q.set("limit", String(opts.limit));
  if (opts.offset) q.set("offset", String(opts.offset));
  const qs = q.toString();
  const res = await clerkApi<{ data: WaitlistEntry[] } | WaitlistEntry[]>(
    `/waitlist_entries${qs ? `?${qs}` : ""}`,
  );
  return Array.isArray(res) ? res : res.data;
}

export interface ClerkUser {
  id: string;
  email_addresses: { email_address: string }[];
}

/** Fetch a user by id from the backend API. */
export async function getUser(userId: string): Promise<ClerkUser> {
  return clerkApi<ClerkUser>(`/users/${userId}`);
}
