"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { PROJECT_TYPES } from "@/studio/registry";
import type { FeatureCategory } from "@/studio/types";
import {
  featuresIn,
  groupFor,
  SELECTABLE_CATEGORIES,
  type PlaygroundState,
} from "@/lib/playground/model";

export interface FeatureMenuProps {
  state: PlaygroundState;
  onToggle: (category: FeatureCategory, featureId: string) => void;
  onProjectType: (projectType: string) => void;
  className?: string;
}

/**
 * The feature menu — a faithful, keyboard-accessible mirror of the `studio`
 * CLI. Project archetype first, then one group per menu category. `select`
 * groups render as a single-choice list (radio semantics); `multiselect`
 * groups as toggle chips (checkbox semantics). Every control is a real
 * `<button>` with `aria-pressed` / `role="radio"` state and a visible focus
 * ring.
 */
export function FeatureMenu({
  state,
  onToggle,
  onProjectType,
  className,
}: FeatureMenuProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Project type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Project type
        </legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project type">
          {Object.entries(PROJECT_TYPES).map(([id, { label }]) => {
            const active = state.projectType === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onProjectType(id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {SELECTABLE_CATEGORIES.map((category) => (
        <MenuGroupSection
          key={category}
          category={category}
          state={state}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function MenuGroupSection({
  category,
  state,
  onToggle,
}: {
  category: FeatureCategory;
  state: PlaygroundState;
  onToggle: (category: FeatureCategory, featureId: string) => void;
}) {
  const group = groupFor(category);
  const features = featuresIn(category);
  if (!group || features.length === 0) return null;
  const selected = state.selections[category] ?? [];
  const isRadio = group.kind === "select";

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {group.label}
        <span className="rounded bg-muted px-1.5 py-0.5 text-[0.6rem] font-normal normal-case tracking-normal text-muted-foreground">
          {isRadio ? "choose one" : "choose any"}
        </span>
      </legend>
      <div
        className="grid gap-2 sm:grid-cols-2"
        role={isRadio ? "radiogroup" : "group"}
        aria-label={group.label}
      >
        {features.map((feature) => {
          const active = selected.includes(feature.id);
          return (
            <button
              key={feature.id}
              type="button"
              role={isRadio ? "radio" : undefined}
              aria-checked={isRadio ? active : undefined}
              aria-pressed={isRadio ? undefined : active}
              onClick={() => onToggle(category, feature.id)}
              className={cn(
                "group flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/50",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                  isRadio ? "rounded-full" : "rounded-[0.3rem]",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 text-transparent",
                )}
              >
                <Check className="h-3 w-3" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1 text-sm font-medium leading-none">
                  {feature.label}
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 text-primary opacity-0 transition-opacity",
                      active && "opacity-100",
                    )}
                    aria-hidden
                  />
                </span>
                <span className="text-xs leading-snug text-muted-foreground">
                  {feature.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
