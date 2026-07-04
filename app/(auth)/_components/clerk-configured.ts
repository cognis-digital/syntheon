/**
 * Server-safe check for whether Clerk is configured, for the auth pages.
 *
 * Kept tiny and dependency-free so the (auth) route group never imports the
 * Clerk SDK unless keys are actually present. When absent, pages render the
 * self-hosted fallback form instead of Clerk's hosted components.
 */
export function isClerkConfigured(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const sk = process.env.CLERK_SECRET_KEY;
  return Boolean(pk && pk.length > 0 && sk && sk.length > 0);
}
