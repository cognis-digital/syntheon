/**
 * Clerk auth adapter.
 *
 * Bridges Clerk's server-side `auth()`/`currentUser()` into the Syntheon
 * `AuthAdapter` contract. `@clerk/nextjs/server` is imported lazily (dynamic
 * import at call time) so that:
 *   - the module never throws at import when Clerk env is absent, and
 *   - the client bundle never pulls the server SDK.
 *
 * When Clerk is not configured, `getSession()` resolves to ANONYMOUS rather
 * than throwing — the interface stays graceful.
 */
import { hasEnv } from "../../integrations/types";
import type { AuthAdapter, Session, AuthUser } from "../types";
import { ANONYMOUS } from "../types";

export function clerkConfigured(): boolean {
  return hasEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY");
}

/**
 * Minimal shape of the Clerk server helpers we consume. Kept local so the
 * adapter compiles even if `@clerk/nextjs/server` types drift, and so a test
 * can inject a stub without the real SDK.
 */
export interface ClerkServer {
  auth: () => Promise<{ userId: string | null; sessionId?: string | null }>;
  currentUser: () => Promise<{
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
    primaryEmailAddress?: { emailAddress: string } | null;
    emailAddresses?: { emailAddress: string }[];
  } | null>;
}

let _server: ClerkServer | null = null;

/** Test seam: inject a stub Clerk server module (reset with `null`). */
export function __setClerkServer(server: ClerkServer | null): void {
  _server = server;
}

async function loadServer(): Promise<ClerkServer | null> {
  if (_server) return _server;
  try {
    // Dynamic import: only resolved when Clerk is actually the active provider.
    const mod = (await import(
      /* webpackIgnore: true */ "@clerk/nextjs/server"
    )) as unknown as ClerkServer;
    return mod;
  } catch {
    return null;
  }
}

export const clerkAdapter: AuthAdapter = {
  id: "clerk",

  isConfigured() {
    return clerkConfigured();
  },

  async getSession(): Promise<Session> {
    if (!clerkConfigured()) return ANONYMOUS;
    const server = await loadServer();
    if (!server) return ANONYMOUS;
    try {
      const { userId, sessionId } = await server.auth();
      if (!userId) return ANONYMOUS;
      const cu = await server.currentUser();
      const user: AuthUser = {
        id: userId,
        email:
          cu?.primaryEmailAddress?.emailAddress ??
          cu?.emailAddresses?.[0]?.emailAddress,
        firstName: cu?.firstName ?? undefined,
        lastName: cu?.lastName ?? undefined,
        imageUrl: cu?.imageUrl ?? undefined,
      };
      return {
        isAuthenticated: true,
        user,
        sessionId: sessionId ?? undefined,
      };
    } catch {
      // Never let a provider hiccup break rendering.
      return ANONYMOUS;
    }
  },

  async signOut(): Promise<void> {
    // Clerk sign-out is handled client-side by <UserButton/> / <SignOutButton/>
    // or the middleware; there is no server-side cookie for this adapter to
    // clear. No-op keeps the contract total.
  },
};
