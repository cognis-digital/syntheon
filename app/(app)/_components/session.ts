import "server-only";

import type { Session } from "@/lib/auth/types";
import { ANONYMOUS } from "@/lib/auth/types";

/**
 * Resolve the current session for the app shell.
 *
 * The canonical resolver is `getSession()` from `@/lib/auth` (built in the auth
 * lane; resolves at integration). Until that module lands, this shim keeps the
 * dashboard independently renderable: it returns a friendly dev session so the
 * authenticated shell renders sensibly when unauthenticated in development, and
 * never throws at import time.
 *
 * INTEGRATION NOTE: replace the body with
 *   `import { getSession } from "@/lib/auth"; return getSession();`
 * once the auth lane's index is present. The return shape is unchanged.
 */
export async function resolveSession(): Promise<Session> {
  if (process.env.NODE_ENV === "production") {
    // In production, an unresolved auth lane means nobody is signed in.
    return ANONYMOUS;
  }
  // Dev/preview affordance so the shell is demonstrable without wiring auth.
  return {
    isAuthenticated: true,
    user: {
      id: "usr_dev",
      email: "you@syntheon.dev",
      firstName: "Dev",
      lastName: "User",
    },
    sessionId: "dev-session",
  };
}

/** A display name for the current user, with anonymous fallback. */
export function displayName(session: Session): string {
  const u = session.user;
  if (!u) return "Guest";
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return full || u.email || "Account";
}
