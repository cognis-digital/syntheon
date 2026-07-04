import type { Metadata } from "next";
import {
  Boxes,
  CheckCircle2,
  GitCommitHorizontal,
  Timer,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { StatCard } from "../_components/stat-card";
import { GenerationChart, type ChartPoint } from "../_components/generation-chart";

export const metadata: Metadata = {
  title: "Dashboard — Syntheon",
};

const CHART_DATA: ChartPoint[] = [
  { label: "Mon", units: 42, passed: 40 },
  { label: "Tue", units: 68, passed: 66 },
  { label: "Wed", units: 91, passed: 90 },
  { label: "Thu", units: 74, passed: 73 },
  { label: "Fri", units: 118, passed: 116 },
  { label: "Sat", units: 53, passed: 53 },
  { label: "Sun", units: 87, passed: 86 },
];

const RECENT_UNITS: { name: string; kind: string; status: "passed" | "repaired" }[] = [
  { name: "app/(app)/settings/page.tsx", kind: "route", status: "passed" },
  { name: "components/blocks/pricing-table.tsx", kind: "block", status: "passed" },
  { name: "lib/integrations/stripe/index.ts", kind: "adapter", status: "repaired" },
  { name: "components/ui/data-table.tsx", kind: "primitive", status: "passed" },
  { name: "app/api/webhooks/clerk/route.ts", kind: "handler", status: "passed" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Generation activity across your Syntheon projects this week.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Units generated"
          value="533"
          icon={Boxes}
          delta="+18.2%"
          hint="vs last week"
        />
        <StatCard
          label="Gate pass rate"
          value="98.7%"
          icon={CheckCircle2}
          delta="+0.4%"
          hint="typecheck · lint · test · build"
        />
        <StatCard
          label="Avg. repairs / unit"
          value="0.9"
          icon={GitCommitHorizontal}
          delta="-0.3"
          hint="lower is better"
        />
        <StatCard
          label="Median build time"
          value="1.4s"
          icon={Timer}
          delta="-12%"
          hint="per unit rebuild"
        />
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generation throughput</CardTitle>
            <CardDescription>Units generated vs. units passing all four gates.</CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationChart data={CHART_DATA} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent units</CardTitle>
            <CardDescription>Latest accepted generations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y">
              {RECENT_UNITS.map((u) => (
                <li key={u.name} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.kind}</p>
                  </div>
                  <Badge variant={u.status === "passed" ? "secondary" : "outline"}>
                    {u.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
