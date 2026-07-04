/**
 * Self-hosted auth adapter.
 *
 * Resolves the session from the Syntheon session cookie against the local user
 * store (`lib/auth/store`). This is the always-available fallback: it needs no
 * external service and no env keys, so the app has working auth out of the box.
 *
 * The adapter reads cookies through an injectable resolver so it works in a
 * Next.js request context (wire `cookies()` from `next/headers`) and in tests
 * (pass a stub). When no cookie resolver is wired, it resolves to ANONYMOUS.
 */
import { store } from "../store";
import {
  readSessionToken,
  clearSessionToken,
  type CookieStore,
} from "../cookies";
import type { AuthAdapter, Session, AuthUser } from "../types";
import { ANONYMOUS } from "../types";

/** How the adapter obtains the request's cookie store. */
export type CookieResolver = () => CookieStore | Promise<CookieStore>;

let _resolver: CookieResolver | null = null;

/**
 * Wire the cookie resolver. In a Next.js server context:
 *   `setCookieResolver(() => cookies())`
 * In tests, pass a stub store.
 */
export function setCookieResolver(resolver: CookieResolver | null): void {
  _resolver = resolver;
}

async function currentStore(): Promise<CookieStore | null> {
  if (!_resolver) return null;
  return _resolver();
}

function toAuthUser(u: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}): AuthUser {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
  };
}

export const selfHostedAdapter: AuthAdapter = {
  id: "self-hosted",

  // Always "configured" — it is the zero-dependency baseline provider.
  isConfigured() {
    return true;
  },

  async getSession(): Promise<Session> {
    const cookieStore = await currentStore();
    if (!cookieStore) return ANONYMOUS;
    const token = readSessionToken(cookieStore);
    if (!token) return ANONYMOUS;
    const session = store.getSession(token);
    if (!session) return ANONYMOUS;
    const user = store.findById(session.userId);
    if (!user) return ANONYMOUS;
    return {
      isAuthenticated: true,
      user: toAuthUser(user),
      sessionId: session.token,
    };
  },

  async signOut(): Promise<void> {
    const cookieStore = await currentStore();
    if (!cookieStore) return;
    const token = readSessionToken(cookieStore);
    if (token) store.destroySession(token);
    clearSessionToken(cookieStore);
  },
};
