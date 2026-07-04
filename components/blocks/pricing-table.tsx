import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface PricingTier {
  name: string;
  price: string;
  /** e.g. "/mo" */
  period?: string;
  description?: string;
  features: string[];
  cta?: { label: string; href?: string; onClick?: () => void };
  highlighted?: boolean;
  badge?: string;
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  subheading?: string;
  tiers: PricingTier[];
}

export function PricingTable({
  heading,
  subheading,
  tiers,
  className,
  ...props
}: PricingTableProps) {
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
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <Card
              key={i}
              className={cn(
                "flex flex-col",
                tier.highlighted && "border-primary shadow-lg ring-1 ring-primary",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.badge && <Badge>{tier.badge}</Badge>}
                </div>
                {tier.description && <CardDescription>{tier.description}</CardDescription>}
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="flex flex-col gap-3 text-sm">
                  {tier.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.cta && (
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    asChild={!!tier.cta.href}
                    onClick={tier.cta.onClick}
                  >
                    {tier.cta.href ? (
                      <a href={tier.cta.href}>{tier.cta.label}</a>
                    ) : (
                      <span>{tier.cta.label}</span>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
