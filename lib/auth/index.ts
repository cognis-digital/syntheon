/**
 * Syntheon auth — the provider-agnostic entry point.
 *
 * The rest of the app imports only from here:
 *
 *   import { getSession, requireUser, signOut } from "@/lib/auth";
 *
 * Provider selection: Clerk when its keys are present, otherwise the built-in
 * self-hosted adapter. The choice is resolved per call (env can change between
 * build and runtime) and can be overridden in tests via `setAuthAdapter`.
 *
 * Every function degrades gracefully: with no provider configured, `getSession`
 * returns an anonymous session and never throws.
 */
import type { AuthAdapter, Session, AuthUser } from "./types";
import { ANONYMOUS, UnauthenticatedError } from "./types";
import { clerkAdapter, clerkConfigured } from "./adapters/clerk";
import { selfHostedAdapter } from "./adapters/self-hosted";

export type { AuthAdapter, Session, AuthUser } from "./types";
export { ANONYMOUS, UnauthenticatedError } from "./types";
export type { AuthProviderId } from "./types";

let _override: AuthAdapter | null = null;

/** Test/advanced seam: force a specific adapter (reset with `null`). */
export function setAuthAdapter(adapter: AuthAdapter | null): void {
  _override = adapter;
}

/** Resolve the active adapter: override → Clerk (if configured) → self-hosted. */
export function activeAdapter(): AuthAdapter {
  if (_override) return _override;
  if (clerkConfigured()) return clerkAdapter;
  return selfHostedAdapter;
}

/** Which provider id is currently active. */
export function activeProvider(): AuthAdapter["id"] {
  return activeAdapter().id;
}

/**
 * Resolve the current request's session. Returns an anonymous session when
 * nobody is signed in or no provider is configured — never throws.
 */
export async function getSession(): Promise<Session> {
  try {
    return await activeAdapter().getSession();
  } catch {
    return ANONYMOUS;
  }
}

/**
 * Require an authenticated user. Returns the `AuthUser`, or throws
 * `UnauthenticatedError` — call sites map that to a redirect / 401.
 */
export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    throw new UnauthenticatedError();
  }
  return session.user;
}

/** Convenience: the current user or `null`, never throwing. */
export async function currentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return session.user;
}

/** Sign out of the active provider (best-effort). */
export async function signOut(): Promise<void> {
  try {
    await activeAdapter().signOut();
  } catch {
    /* signing out must never throw */
  }
}

// Re-export the waitlist + middleware surface for a single import root.
export {
  joinWaitlist,
  approveWaitlist,
  rejectWaitlist,
  listWaitlist,
  onWaitlistJoin,
} from "./waitlist";
export type { WaitlistRecord, WaitlistStatus, JoinResult } from "./waitlist";
export { protect, isPublicPath } from "./middleware";
export type { ProtectOptions } from "./middleware";
