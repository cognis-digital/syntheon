"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";

export interface SettingsSection {
  id: string;
  label: string;
  /** Content for this section, rendered when active. */
  content: React.ReactNode;
}

export interface SettingsLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  sections: SettingsSection[];
  /** Controlled active section id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

export function SettingsLayout({
  title = "Settings",
  description,
  sections,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: SettingsLayoutProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? sections[0]?.id);
  const active = value ?? internal;

  function select(id: string) {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  }

  const activeSection = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="space-y-0.5">
        {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <Separator />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-1/5">
          <nav
            className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1"
            aria-label="Settings sections"
          >
            {sections.map((section) => {
              const isActive = section.id === active;
              return (
                <button
                  key={section.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => select(section.id)}
                  className={cn(
                    buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                    "justify-start whitespace-nowrap",
                  )}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1">{activeSection?.content}</div>
      </div>
    </div>
  );
}
