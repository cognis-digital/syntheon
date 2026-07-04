/**
 * Session-cookie helpers for the self-hosted auth adapter.
 *
 * These are thin, framework-agnostic helpers. In a Next.js route/server action
 * you pass Next's `cookies()` store (or any object with `get`/`set`/`delete`);
 * in tests you pass a plain in-memory stub. Nothing here imports `next/headers`
 * at module scope, so it is safe to import anywhere.
 */

/** The cookie name Syntheon uses for the self-hosted session token. */
export const SESSION_COOKIE = "syntheon_session";

/** Minimal cookie-store shape (a subset of Next's ReadonlyRequestCookies). */
export interface CookieStore {
  get(name: string): { name: string; value: string } | undefined;
  set?(
    name: string,
    value: string,
    opts?: Record<string, unknown>,
  ): void;
  delete?(name: string): void;
}

/** Default cookie attributes — httpOnly, sameSite lax, secure in production. */
export function sessionCookieOptions(maxAgeSec: number): Record<string, unknown> {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}

/** Read the session token from a cookie store, if present. */
export function readSessionToken(store: CookieStore): string | undefined {
  return store.get(SESSION_COOKIE)?.value || undefined;
}

/** Write the session token cookie (no-op if the store is read-only). */
export function writeSessionToken(
  store: CookieStore,
  token: string,
  maxAgeSec: number,
): void {
  store.set?.(SESSION_COOKIE, token, sessionCookieOptions(maxAgeSec));
}

/** Clear the session cookie (no-op if the store is read-only). */
export function clearSessionToken(store: CookieStore): void {
  if (store.delete) store.delete(SESSION_COOKIE);
  else store.set?.(SESSION_COOKIE, "", sessionCookieOptions(0));
}
