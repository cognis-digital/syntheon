import * as React from "react";

import { cn } from "@/lib/utils";

export interface Stat {
  value: string;
  label: string;
  description?: string;
}

export interface StatsProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  stats: Stat[];
}

export function Stats({ heading, stats, className, ...props }: StatsProps) {
  return (
    <section className={cn("w-full py-16 md:py-24", className)} {...props}>
      <div className="container">
        {heading && (
          <h2 className="mb-10 text-center text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
        )}
        <dl
          className={cn(
            "grid grid-cols-2 gap-8 text-center",
            stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <dt className="order-2 text-sm font-medium text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                {stat.value}
              </dd>
              {stat.description && (
                <dd className="order-3 text-xs text-muted-foreground">{stat.description}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
