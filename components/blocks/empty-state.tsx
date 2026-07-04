import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center",
        className,
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {action && (
            <Button asChild={!!action.href} onClick={action.onClick}>
              {action.href ? <a href={action.href}>{action.label}</a> : <span>{action.label}</span>}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" asChild={!!secondaryAction.href} onClick={secondaryAction.onClick}>
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              ) : (
                <span>{secondaryAction.label}</span>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
