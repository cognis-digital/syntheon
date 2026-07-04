import "server-only";

import { cookies } from "next/headers";

import { getSession } from "@/lib/auth";
import { setCookieResolver } from "@/lib/auth/adapters/self-hosted";
import type { Session } from "@/lib/auth/types";

/**
 * A stable owner id for the CRUD store even when nobody is signed in, so the
 * example dashboard is demonstrable in a preview / dev context.
 */
export const PREVIEW_OWNER_ID = "usr_preview";

let _wired = false;

/**
 * Resolve the current session for the app shell via `@/lib/auth`.
 *
 * The self-hosted adapter reads the session cookie through an injected
 * resolver; we wire Next's `cookies()` once here. When Clerk keys are present
 * `@/lib/auth` transparently uses Clerk instead. With no provider configured
 * and nobody signed in, `getSession()` returns an anonymous session — in that
 * case (outside production) we surface a friendly preview identity so the
 * authenticated shell and its CRUD feature render sensibly out of the box.
 */
export async function resolveSession(): Promise<Session> {
  if (!_wired) {
    _wired = true;
    setCookieResolver(async () => await cookies());
  }
  const session = await getSession();
  if (session.isAuthenticated) return session;

  if (process.env.NODE_ENV === "production") {
    return session; // genuinely anonymous in production
  }
  // Dev/preview affordance so the shell is demonstrable without wiring auth.
  return {
    isAuthenticated: true,
    user: {
      id: PREVIEW_OWNER_ID,
      email: "you@syntheon.dev",
      firstName: "Preview",
      lastName: "User",
    },
    sessionId: "preview-session",
  };
}

/** The stable owner id for the current session (falls back to preview). */
export function ownerIdOf(session: Session): string {
  return session.user?.id ?? PREVIEW_OWNER_ID;
}

/** A display name for the current user, with anonymous fallback. */
export function displayName(session: Session): string {
  const u = session.user;
  if (!u) return "Guest";
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return full || u.email || "Account";
}
