import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** e.g. "+12.5%" — sign drives the trend color/arrow. */
  delta?: string;
  hint?: string;
}

/** A single KPI card for the dashboard overview. */
export function StatCard({ label, value, icon: Icon, delta, hint }: StatCardProps) {
  const positive = delta ? !delta.trim().startsWith("-") : true;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(delta || hint) && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {delta && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  positive ? "text-green-600 dark:text-green-400" : "text-destructive",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {delta}
              </span>
            )}
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
