"use client";

import * as React from "react";
import { Moon, Sun, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { BRAND_PRESETS } from "@/lib/playground/model";
import { ThemedFrame } from "./themed-frame";

export interface ThemePreviewProps {
  brandColor: string;
  onBrandColor: (hsl: string) => void;
  className?: string;
}

/**
 * Live component previews rendered from the REAL `@/components/*` library,
 * inside a self-contained {@link ThemedFrame}. A light/dark toggle and a brand
 * swatch row re-theme the preview instantly — the exact tokens the generated
 * app ships with.
 */
export function ThemePreview({
  brandColor,
  onBrandColor,
  className,
}: ThemePreviewProps) {
  const [dark, setDark] = React.useState(true);

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Live component preview
        </span>
        <div className="flex items-center gap-3">
          {/* Brand swatches */}
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Brand color">
            {BRAND_PRESETS.map((preset) => {
              const active = preset.hsl === brandColor;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={preset.label}
                  aria-label={preset.label}
                  onClick={() => onBrandColor(preset.hsl)}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full ring-offset-2 ring-offset-card transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "ring-2 ring-foreground/40" : "hover:scale-110",
                  )}
                  style={{ backgroundColor: preset.hex }}
                >
                  {active ? <Check className="h-3 w-3 text-white" /> : null}
                </button>
              );
            })}
          </div>
          {/* Light/dark toggle */}
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-pressed={dark}
            aria-label={dark ? "Switch preview to light mode" : "Switch preview to dark mode"}
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            {dark ? "Dark" : "Light"}
          </button>
        </div>
      </div>

      <ThemedFrame brandColor={brandColor} dark={dark} className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header row: badge + buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge>New</Badge>
            <Badge variant="secondary">v0.1</Badge>
            <span className="ml-auto flex gap-2">
              <Button size="sm" variant="outline">
                Docs
              </Button>
              <Button size="sm">Get started</Button>
            </span>
          </div>

          {/* Card with a mini pricing / usage widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your workspace</CardTitle>
              <CardDescription>Themed by the token you picked.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Build progress</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} />
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Local generation</span>
                  <span className="text-xs text-muted-foreground">
                    Runs on your machine
                  </span>
                </div>
                <Switch defaultChecked aria-label="Local generation" />
              </div>
            </CardContent>
          </Card>
        </div>
      </ThemedFrame>
    </div>
  );
}
