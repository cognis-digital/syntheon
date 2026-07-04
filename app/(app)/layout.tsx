import * as React from "react";

import { AppShell } from "./_components/app-shell";
import { resolveSession } from "./_components/session";

/**
 * Layout for the authenticated app group. Resolves the current session on the
 * server and renders the dashboard shell around every app route. In dev, an
 * unwired auth lane resolves to a demo session so the shell is demonstrable;
 * in production an unresolved session renders as an unauthenticated preview.
 */
export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await resolveSession();
  return <AppShell session={session}>{children}</AppShell>;
}
