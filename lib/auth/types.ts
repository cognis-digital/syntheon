/**
 * Provider-agnostic auth contracts for Syntheon.
 *
 * The app calls the interface in `lib/auth/index.ts`; a concrete provider
 * (Clerk when configured, otherwise a lightweight self-hosted adapter) fulfils
 * it. Nothing here throws at import time — a missing provider resolves to an
 * anonymous session, never an error, so the app builds and renders with or
 * without auth keys.
 */

/** A resolved end-user. `id` is provider-stable; `email` may be absent. */
export interface AuthUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  /** free-form provider metadata, never trusted for authz decisions */
  metadata?: Record<string, unknown>;
}

/** The result of resolving the current request's session. */
export interface Session {
  /** true when a real, authenticated user is present */
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** opaque session id when the provider exposes one */
  sessionId?: string;
}

/** An anonymous, unauthenticated session — the safe default. */
export const ANONYMOUS: Session = { isAuthenticated: false, user: null };

/** Which provider backs the interface. */
export type AuthProviderId = "clerk" | "self-hosted";

/**
 * The interface every auth adapter implements. Methods are async so adapters
 * can hit a backend or read cookies without changing the contract.
 */
export interface AuthAdapter {
  readonly id: AuthProviderId;
  /** true when this adapter has the config it needs to be the active provider */
  isConfigured(): boolean;
  /** resolve the current session; returns ANONYMOUS when nobody is signed in */
  getSession(): Promise<Session>;
  /** clear the current session (best-effort; self-hosted clears its cookie) */
  signOut(): Promise<void>;
}

/** Raised by `requireUser()` when no authenticated user is present. */
export class UnauthenticatedError extends Error {
  readonly code = "unauthenticated";
  constructor(message = "authentication required") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}
