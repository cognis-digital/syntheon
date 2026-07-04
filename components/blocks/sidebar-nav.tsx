"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
  /** The href of the currently-active route. */
  activeHref?: string;
}

export function SidebarNav({ items, activeHref, className, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("w-full", className)} {...props}>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <a href={item.href} aria-current={isActive ? "page" : undefined}>
                  {Icon && <Icon />}
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </nav>
  );
}
