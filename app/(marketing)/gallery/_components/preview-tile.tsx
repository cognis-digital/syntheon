"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  defaultControlValues,
  type Control,
  type GalleryEntry,
} from "../_data/gallery-registry";

/**
 * A single gallery tile: a component's live preview with a per-tile light/dark
 * toggle and, where the entry declares them, interactive prop controls. The
 * preview surface applies a scoped `.dark` class so dark mode is previewed
 * independently of the site theme; the CSS token contract is redefined under
 * `.dark`, so semantic Tailwind classes resolve correctly in the subtree.
 *
 * Rendering is defensive: if an entry's `render` throws, the tile shows a small
 * inline notice rather than taking down the page — so a not-yet-ready component
 * degrades gracefully.
 */
export function PreviewTile({ entry }: { entry: GalleryEntry }) {
  const [dark, setDark] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, unknown>>(() =>
    defaultControlValues(entry),
  );

  const toggleId = React.useId();

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{entry.name}</CardTitle>
          <Badge variant="outline">{entry.category}</Badge>
        </div>
        <CardDescription>{entry.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Preview surface */}
        <div
          className={cn(
            "relative flex min-h-[9rem] items-center justify-center rounded-lg border bg-background p-6 transition-colors",
            dark && "dark",
          )}
        >
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <Sun
              aria-hidden
              className={cn(
                "h-3.5 w-3.5",
                dark ? "text-muted-foreground" : "text-foreground",
              )}
            />
            <Switch
              id={toggleId}
              checked={dark}
              onCheckedChange={setDark}
              aria-label={`Preview ${entry.name} in ${dark ? "light" : "dark"} mode`}
            />
            <Moon
              aria-hidden
              className={cn(
                "h-3.5 w-3.5",
                dark ? "text-foreground" : "text-muted-foreground",
              )}
            />
          </div>
          <div className="flex w-full items-center justify-center text-foreground">
            <SafeRender entry={entry} values={values} />
          </div>
        </div>

        {/* Controls */}
        {entry.controls?.length ? (
          <div className="flex flex-col gap-3 border-t pt-4">
            {entry.controls.map((control) => (
              <ControlRow
                key={control.name}
                control={control}
                value={values[control.name]}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, [control.name]: v }))
                }
              />
            ))}
          </div>
        ) : null}

        <p className="mt-auto truncate font-mono text-xs text-muted-foreground">
          {entry.source}
        </p>
      </CardContent>
    </Card>
  );
}

/** Render an entry's preview, catching render errors so one tile can't crash. */
class SafeRender extends React.Component<
  { entry: GalleryEntry; values: Record<string, unknown> },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <span className="text-xs text-muted-foreground">
          Preview unavailable for this component yet.
        </span>
      );
    }
    return this.props.entry.render(this.props.values);
  }
}

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = React.useId();
  if (control.kind === "text") {
    return (
      <div className="grid grid-cols-[7rem_1fr] items-center gap-2">
        <Label htmlFor={id} className="text-xs">
          {control.label}
        </Label>
        <Input
          id={id}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-8"
        />
      </div>
    );
  }
  if (control.kind === "boolean") {
    return (
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-xs">
          {control.label}
        </Label>
        <Switch
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(v) => onChange(v)}
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[7rem_1fr] items-center gap-2">
      <Label htmlFor={id} className="text-xs">
        {control.label}
      </Label>
      <Select
        value={typeof value === "string" ? value : control.default}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger id={id} className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {control.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
