import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface BentoItem {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Column span at md+ (1–3). Defaults to 1. */
  colSpan?: 1 | 2 | 3;
  /** Row span at md+ (1–2). Defaults to 1. */
  rowSpan?: 1 | 2;
  media?: React.ReactNode;
}

export interface BentoProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  items: BentoItem[];
}

const colSpanClass: Record<1 | 2 | 3, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
};
const rowSpanClass: Record<1 | 2, string> = {
  1: "md:row-span-1",
  2: "md:row-span-2",
};

export function Bento({ heading, items, className, ...props }: BentoProps) {
  return (
    <section className={cn("w-full py-16 md:py-24", className)} {...props}>
      <div className="container">
        {heading && (
          <h2 className="mb-10 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="grid auto-rows-[14rem] grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card
                key={i}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden p-6",
                  colSpanClass[item.colSpan ?? 1],
                  rowSpanClass[item.rowSpan ?? 1],
                )}
              >
                {item.media && (
                  <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
                    {item.media}
                  </div>
                )}
                {Icon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="mt-auto">
                  <h3 className="font-semibold tracking-tight">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
