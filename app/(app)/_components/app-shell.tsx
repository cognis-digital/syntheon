import * as React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/lib/auth/types";

import { AppSidebar } from "./app-sidebar";
import { displayName } from "./session";

function initials(name: string): string {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

/**
 * The authenticated dashboard shell: a fixed sidebar, a top bar with the user
 * identity, and the page content region. Composes the app sidebar and UI
 * primitives. Server-renderable — takes the resolved session as a prop.
 */
export function AppShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const name = displayName(session);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-[0.4rem] bg-gradient-to-br from-primary to-accent"
          />
          <Link href="/" className="text-base font-bold tracking-tight">
            Syntheon
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AppSidebar />
        </div>
        <div className="border-t p-3">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a
              href="https://github.com/cognis-digital/syntheon"
              target="_blank"
              rel="noreferrer"
            >
              <Github />
              Star on GitHub
            </a>
          </Button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <span
              aria-hidden
              className="inline-block h-5 w-5 rounded-[0.4rem] bg-gradient-to-br from-primary to-accent"
            />
            <span className="font-bold tracking-tight">Syntheon</span>
          </div>
          <div className="hidden md:block">
            {session.isAuthenticated ? (
              <Badge variant="secondary">Signed in</Badge>
            ) : (
              <Badge variant="outline">Preview · not signed in</Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{name}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="border-b bg-background p-2 md:hidden">
          <AppSidebar className="flex-row overflow-x-auto" />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
