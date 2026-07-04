import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface Feature {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface FeatureGridProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  subheading?: string;
  features: Feature[];
  /** Columns at the `lg` breakpoint. */
  columns?: 2 | 3 | 4;
}

const columnClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({
  heading,
  subheading,
  features,
  columns = 3,
  className,
  ...props
}: FeatureGridProps) {
  return (
    <section className={cn("w-full py-16 md:py-24", className)} {...props}>
      <div className="container">
        {(heading || subheading) && (
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
            {heading && (
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {heading}
              </h2>
            )}
            {subheading && <p className="text-pretty text-muted-foreground">{subheading}</p>}
          </div>
        )}
        <div className={cn("grid grid-cols-1 gap-6", columnClass[columns])}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="h-full">
                <CardHeader>
                  {Icon && (
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
