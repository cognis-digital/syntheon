"use client";

import * as React from "react";
import {
  ArrowRight,
  Check,
  Rocket,
  Terminal,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/blocks/empty-state";
import { Stats } from "@/components/blocks/stats";
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { LogoCloud } from "@/components/blocks/logo-cloud";

/**
 * Static registry powering the Syntheon component gallery (issue #4).
 *
 * Each entry maps a component in the owned library to a category, a short
 * description, and a `render` function that returns a live preview. Some entries
 * expose `controls` — declarative prop knobs the gallery turns into inputs and
 * feeds back into `render(props)`. The registry is maintained by hand so the
 * gallery is deterministic and never reflects on the module graph at runtime.
 *
 * Entries are plain data + a render closure; adding a component is a one-object
 * append. Previews use only components that exist in the library today.
 */

export type GalleryCategory =
  | "Inputs"
  | "Display"
  | "Feedback"
  | "Navigation"
  | "Blocks";

/** A single prop control the gallery renders as an interactive knob. */
export type Control =
  | { kind: "text"; name: string; label: string; default: string }
  | { kind: "boolean"; name: string; label: string; default: boolean }
  | {
      kind: "select";
      name: string;
      label: string;
      options: string[];
      default: string;
    };

export interface GalleryEntry {
  id: string;
  name: string;
  category: GalleryCategory;
  description: string;
  /** Import path shown to the user (where the source lives). */
  source: string;
  /** Optional interactive prop controls. */
  controls?: Control[];
  /** Render the preview given the current control values. */
  render: (props: Record<string, unknown>) => React.ReactNode;
}

/** Coerce a control map to a typed helper set for render closures. */
function str(props: Record<string, unknown>, key: string, fallback = ""): string {
  const v = props[key];
  return typeof v === "string" ? v : fallback;
}
function bool(props: Record<string, unknown>, key: string, fallback = false): boolean {
  const v = props[key];
  return typeof v === "boolean" ? v : fallback;
}

export const GALLERY: readonly GalleryEntry[] = [
  // ── Inputs ────────────────────────────────────────────────────────────────
  {
    id: "button",
    name: "Button",
    category: "Inputs",
    description: "The primary action element, with variants and sizes.",
    source: "components/ui/button.tsx",
    controls: [
      {
        kind: "select",
        name: "variant",
        label: "Variant",
        options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
        default: "default",
      },
      {
        kind: "select",
        name: "size",
        label: "Size",
        options: ["sm", "default", "lg"],
        default: "default",
      },
      { kind: "text", name: "label", label: "Label", default: "Get started" },
      { kind: "boolean", name: "disabled", label: "Disabled", default: false },
    ],
    render: (p) => (
      <Button
        variant={str(p, "variant", "default") as "default"}
        size={str(p, "size", "default") as "default"}
        disabled={bool(p, "disabled")}
      >
        {str(p, "label", "Get started")}
        <ArrowRight />
      </Button>
    ),
  },
  {
    id: "input",
    name: "Input",
    category: "Inputs",
    description: "A single-line text field.",
    source: "components/ui/input.tsx",
    controls: [
      { kind: "text", name: "placeholder", label: "Placeholder", default: "you@example.com" },
      { kind: "boolean", name: "disabled", label: "Disabled", default: false },
    ],
    render: (p) => (
      <div className="w-full max-w-xs">
        <Input
          placeholder={str(p, "placeholder", "you@example.com")}
          disabled={bool(p, "disabled")}
          aria-label="Preview input"
        />
      </div>
    ),
  },
  {
    id: "textarea",
    name: "Textarea",
    category: "Inputs",
    description: "A multi-line text field.",
    source: "components/ui/textarea.tsx",
    render: () => (
      <div className="w-full max-w-xs">
        <Textarea rows={3} placeholder="Tell us about your app…" aria-label="Preview textarea" />
      </div>
    ),
  },
  {
    id: "switch",
    name: "Switch",
    category: "Inputs",
    description: "A binary on/off toggle.",
    source: "components/ui/switch.tsx",
    render: () => (
      <div className="flex items-center gap-2">
        <Switch id="gallery-switch" defaultChecked />
        <Label htmlFor="gallery-switch">Local-first mode</Label>
      </div>
    ),
  },
  {
    id: "checkbox",
    name: "Checkbox",
    category: "Inputs",
    description: "A single checkable box with a label.",
    source: "components/ui/checkbox.tsx",
    render: () => (
      <div className="flex items-center gap-2">
        <Checkbox id="gallery-checkbox" defaultChecked />
        <Label htmlFor="gallery-checkbox">Verify before accept</Label>
      </div>
    ),
  },

  // ── Display ─────────────────────────────────────────────────────────────
  {
    id: "badge",
    name: "Badge",
    category: "Display",
    description: "A compact status or category label.",
    source: "components/ui/badge.tsx",
    controls: [
      {
        kind: "select",
        name: "variant",
        label: "Variant",
        options: ["default", "secondary", "outline", "destructive"],
        default: "default",
      },
      { kind: "text", name: "label", label: "Label", default: "Verified" },
    ],
    render: (p) => (
      <Badge variant={str(p, "variant", "default") as "default"}>
        {str(p, "label", "Verified")}
      </Badge>
    ),
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Display",
    description: "A user image with a text fallback.",
    source: "components/ui/avatar.tsx",
    render: () => (
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-primary/10 text-primary">SY</AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "card",
    name: "Card",
    category: "Display",
    description: "A bordered surface for grouped content.",
    source: "components/ui/card.tsx",
    render: () => (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-base">Aurora Analytics</CardTitle>
          <CardDescription>Generated in 42s · 412 units</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          A verified full-stack app you own outright.
        </CardContent>
      </Card>
    ),
  },
  {
    id: "avatar-separator",
    name: "Separator",
    category: "Display",
    description: "A thin divider between content.",
    source: "components/ui/separator.tsx",
    render: () => (
      <div className="flex flex-col gap-2 text-sm">
        <span>Local generation</span>
        <Separator />
        <span>Owned output</span>
      </div>
    ),
  },
  {
    id: "progress",
    name: "Progress",
    category: "Display",
    description: "A determinate progress bar.",
    source: "components/ui/progress.tsx",
    controls: [
      {
        kind: "select",
        name: "value",
        label: "Value",
        options: ["25", "50", "75", "100"],
        default: "75",
      },
    ],
    render: (p) => (
      <div className="w-full max-w-xs">
        <Progress value={Number(str(p, "value", "75"))} />
      </div>
    ),
  },

  // ── Feedback ──────────────────────────────────────────────────────────────
  {
    id: "alert",
    name: "Alert",
    category: "Feedback",
    description: "A callout for important, contextual information.",
    source: "components/ui/alert.tsx",
    render: () => (
      <Alert className="max-w-md">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          Every generated unit passes typecheck, lint, test, and build.
        </AlertDescription>
      </Alert>
    ),
  },
  {
    id: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    description: "A loading placeholder for pending content.",
    source: "components/ui/skeleton.tsx",
    render: () => (
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    ),
  },
  {
    id: "spinner",
    name: "Spinner",
    category: "Feedback",
    description: "An indeterminate loading indicator.",
    source: "components/ui/spinner.tsx",
    render: () => (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> Generating…
      </div>
    ),
  },
  {
    id: "empty-state",
    name: "Empty state",
    category: "Feedback",
    description: "A friendly placeholder with a primary action.",
    source: "components/blocks/empty-state.tsx",
    render: () => (
      <EmptyState
        className="w-full max-w-md p-8"
        icon={Rocket}
        title="No projects yet"
        description="Launch the builder to generate your first app."
        action={{ label: "New project" }}
      />
    ),
  },

  // ── Navigation ──────────────────────────────────────────────────────────
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Switch between related panels.",
    source: "components/ui/tabs.tsx",
    render: () => (
      <Tabs defaultValue="overview" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-2 text-sm text-muted-foreground">
          Project overview and generation activity.
        </TabsContent>
        <TabsContent value="units" className="pt-2 text-sm text-muted-foreground">
          Every unit generated and verified.
        </TabsContent>
      </Tabs>
    ),
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "Navigation",
    description: "Vertically stacked, expandable sections.",
    source: "components/ui/accordion.tsx",
    render: () => (
      <Accordion type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="a">
          <AccordionTrigger>Is my code really mine?</AccordionTrigger>
          <AccordionContent>
            Yes — Syntheon copies source into your repo. No runtime dependency.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Does it run offline?</AccordionTrigger>
          <AccordionContent>
            Generation runs against a local model. Cloud is optional.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },

  // ── Blocks ────────────────────────────────────────────────────────────────
  {
    id: "stats",
    name: "Stats",
    category: "Blocks",
    description: "A row of headline metrics.",
    source: "components/blocks/stats.tsx",
    render: () => (
      <div className="w-full">
        <Stats
          className="py-4"
          stats={[
            { label: "Units generated", value: "533" },
            { label: "Gate pass rate", value: "98.7%" },
            { label: "GitHub stars", value: "1.2k" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "feature-grid",
    name: "Feature grid",
    category: "Blocks",
    description: "A responsive grid of feature cards.",
    source: "components/blocks/feature-grid.tsx",
    render: () => (
      <div className="w-full">
        <FeatureGrid
          features={[
            { icon: Terminal, title: "Local-first", description: "Runs on your machine." },
            { icon: Check, title: "Verified", description: "Four gates, every unit." },
            { icon: Rocket, title: "You own it", description: "A normal repo, yours." },
          ]}
        />
      </div>
    ),
  },
  {
    id: "logo-cloud",
    name: "Logo cloud",
    category: "Blocks",
    description: "A row of muted brand/word marks.",
    source: "components/blocks/logo-cloud.tsx",
    render: () => (
      <div className="w-full">
        <LogoCloud logos={["Aurora", "Harbor", "Fieldnote", "Northwind", "Vertex"]} />
      </div>
    ),
  },
];

/** The distinct categories present in the registry, in display order. */
export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Inputs",
  "Display",
  "Feedback",
  "Navigation",
  "Blocks",
];

/** Default control values for an entry (used to seed the interactive state). */
export function defaultControlValues(
  entry: GalleryEntry,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const c of entry.controls ?? []) values[c.name] = c.default;
  return values;
}
