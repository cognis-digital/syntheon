import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CtaProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  variant?: "card" | "banner";
}

export function Cta({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "card",
  className,
  ...props
}: CtaProps) {
  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="container">
        <div
          className={cn(
            "flex flex-col items-center gap-6 rounded-2xl px-6 py-12 text-center md:px-12",
            variant === "card"
              ? "border bg-card"
              : "bg-gradient-to-r from-primary to-accent text-primary-foreground",
          )}
        >
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "max-w-[60ch] text-pretty",
                variant === "banner" ? "text-primary-foreground/90" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            {primaryAction && (
              <Button
                size="lg"
                variant={variant === "banner" ? "secondary" : "default"}
                asChild={!!primaryAction.href}
                onClick={primaryAction.onClick}
              >
                {primaryAction.href ? (
                  <a href={primaryAction.href}>{primaryAction.label}</a>
                ) : (
                  <span>{primaryAction.label}</span>
                )}
              </Button>
            )}
            {secondaryAction && (
              <Button
                size="lg"
                variant="outline"
                asChild={!!secondaryAction.href}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.href ? (
                  <a href={secondaryAction.href}>{secondaryAction.label}</a>
                ) : (
                  <span>{secondaryAction.label}</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
