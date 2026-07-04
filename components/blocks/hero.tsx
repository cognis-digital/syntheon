import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Visual layout. */
  variant?: "centered" | "split" | "with-image" | "gradient" | "minimal";
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Media node (image/video) for the `split` and `with-image` variants. */
  media?: React.ReactNode;
}

function Actions({
  primaryAction,
  secondaryAction,
  align = "start",
}: {
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  align?: "start" | "center";
}) {
  if (!primaryAction && !secondaryAction) return null;
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row",
        align === "center" && "justify-center",
      )}
    >
      {primaryAction ? (
        <Button asChild={!!primaryAction.href} size="lg" onClick={primaryAction.onClick}>
          {primaryAction.href ? (
            <a href={primaryAction.href}>
              {primaryAction.label}
              <ArrowRight />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2">
              {primaryAction.label}
              <ArrowRight />
            </span>
          )}
        </Button>
      ) : null}
      {secondaryAction ? (
        <Button
          asChild={!!secondaryAction.href}
          size="lg"
          variant="outline"
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.href ? (
            <a href={secondaryAction.href}>{secondaryAction.label}</a>
          ) : (
            <span>{secondaryAction.label}</span>
          )}
        </Button>
      ) : null}
    </div>
  );
}

export function Hero({
  variant = "centered",
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  className,
  ...props
}: HeroProps) {
  const heading = (
    <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
      {title}
    </h1>
  );
  const desc = description ? (
    <p className="max-w-[65ch] text-pretty text-lg text-muted-foreground">{description}</p>
  ) : null;
  const eyebrowNode = eyebrow ? (
    <Badge variant="secondary" className="w-fit">
      {eyebrow}
    </Badge>
  ) : null;

  if (variant === "split" || variant === "with-image") {
    return (
      <section className={cn("w-full py-16 md:py-24", className)} {...props}>
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            {eyebrowNode}
            {heading}
            {desc}
            <Actions primaryAction={primaryAction} secondaryAction={secondaryAction} />
          </div>
          <div className="overflow-hidden rounded-xl border bg-muted">
            {media ?? <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20" />}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "gradient") {
    return (
      <section
        className={cn(
          "relative w-full overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-28",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-3xl"
        />
        <div className="container flex flex-col items-center gap-6 text-center">
          {eyebrowNode}
          {heading}
          {desc}
          <Actions primaryAction={primaryAction} secondaryAction={secondaryAction} align="center" />
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section className={cn("w-full py-12 md:py-16", className)} {...props}>
        <div className="container flex flex-col items-start gap-4">
          {eyebrowNode}
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {desc}
          <Actions primaryAction={primaryAction} secondaryAction={secondaryAction} />
        </div>
      </section>
    );
  }

  // centered (default)
  return (
    <section className={cn("w-full py-20 md:py-28", className)} {...props}>
      <div className="container flex flex-col items-center gap-6 text-center">
        {eyebrowNode}
        {heading}
        {desc}
        <Actions primaryAction={primaryAction} secondaryAction={secondaryAction} align="center" />
      </div>
    </section>
  );
}
