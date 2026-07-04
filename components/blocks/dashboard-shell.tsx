"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sidebar brand/header node. */
  brand?: React.ReactNode;
  /** Sidebar navigation (e.g. a <SidebarNav />). */
  nav?: React.ReactNode;
  /** Sidebar footer node (e.g. user menu). */
  sidebarFooter?: React.ReactNode;
  /** Top-bar content rendered next to the sidebar trigger. */
  topbar?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({
  brand = <span className="px-2 text-lg font-bold tracking-tight">Syntheon</span>,
  nav,
  sidebarFooter,
  topbar,
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <SidebarProvider className={className} {...props}>
      <Sidebar>
        <SidebarHeader>{brand}</SidebarHeader>
        <SidebarContent>{nav}</SidebarContent>
        {sidebarFooter && <SidebarFooter>{sidebarFooter}</SidebarFooter>}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-1 items-center justify-between gap-4">{topbar}</div>
        </header>
        <main className={cn("flex-1 overflow-auto p-4 md:p-6")}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
