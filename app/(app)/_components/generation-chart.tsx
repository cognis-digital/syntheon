"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartPoint {
  label: string;
  units: number;
  passed: number;
}

/**
 * Units-generated-vs-passed area chart for the dashboard overview. Uses the
 * theme tokens via CSS variables so it stays on-brand in light and dark.
 */
export function GenerationChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="fillUnits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillPassed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--popover-foreground))",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="units"
            name="Generated"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#fillUnits)"
          />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed gates"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            fill="url(#fillPassed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
