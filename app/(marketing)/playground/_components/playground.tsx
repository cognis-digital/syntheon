"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Sparkles, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { FeatureCategory } from "@/studio/types";
import {
  countFiles,
  initialState,
  planFor,
  planToTree,
  setBrandColor,
  setName,
  setProjectType,
  toConfigJson,
  runCommand,
  toggleFeature,
  type PlaygroundState,
} from "@/lib/playground/model";

import { FeatureMenu } from "./feature-menu";
import { BlueprintTree } from "./blueprint-tree";
import { Pipeline } from "./pipeline";
import { ThemePreview } from "./theme-preview";
import { ConfigPanel } from "./config-panel";

const GITHUB_URL = "https://github.com/cognis-digital/syntheon";

type Action =
  | { type: "toggle"; category: FeatureCategory; featureId: string }
  | { type: "projectType"; projectType: string }
  | { type: "brand"; hsl: string }
  | { type: "name"; name: string };

function reducer(state: PlaygroundState, action: Action): PlaygroundState {
  switch (action.type) {
    case "toggle":
      return toggleFeature(state, action.category, action.featureId);
    case "projectType":
      return setProjectType(state, action.projectType);
    case "brand":
      return setBrandColor(state, action.hsl);
    case "name":
      return setName(state, action.name);
    default:
      return state;
  }
}

/**
 * The in-browser Syntheon playground. Everything runs client-side and offline:
 * the menu drives the SAME registry `resolvePlan` the CLI uses, so the live
 * blueprint, config, and file tree are all real. Motion is gated on
 * prefers-reduced-motion throughout.
 */
export function Playground() {
  const reduce = useReducedMotion();
  const [state, dispatch] = React.useReducer(reducer, undefined, () =>
    initialState("saas"),
  );

  // Derive the real plan / tree / config from the current selection.
  const { tree, fileCount, configJson, cmd } = React.useMemo(() => {
    const plan = planFor(state);
    const t = planToTree(plan);
    return {
      tree: t,
      fileCount: countFiles(t),
      configJson: toConfigJson(state),
      cmd: runCommand(state),
    };
  }, [state]);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.4 },
      };

  return (
    <div className="w-full">
      <Toaster />

      {/* Header */}
      <div className="border-b bg-gradient-to-b from-primary/10 via-accent/5 to-transparent">
        <div className="container flex flex-col items-center gap-4 py-14 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive · runs entirely in your browser
          </span>
          <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Build your app in the{" "}
            <span className="text-primary">Syntheon</span> playground
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
            Pick a project type and the features you want. Watch the real build
            plan, the generation pipeline, and a live-themed preview assemble
            instantly — then copy the exact config and run it locally.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <Github /> Star on GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-8 py-10">
        {/* Two-column: menu (left) + live blueprint / pipeline (right) */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <motion.section
            {...fade}
            aria-labelledby="menu-heading"
            className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-5 shadow-sm backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <h2 id="menu-heading" className="text-sm font-semibold">
                Configure your build
              </h2>
            </div>
            <FeatureMenu
              state={state}
              onToggle={(category, featureId) =>
                dispatch({ type: "toggle", category, featureId })
              }
              onProjectType={(projectType) =>
                dispatch({ type: "projectType", projectType })
              }
            />
          </motion.section>

          <motion.div
            {...fade}
            className="flex flex-col gap-6"
            aria-live="polite"
          >
            <Pipeline fileCount={fileCount} />
            <BlueprintTree root={tree} fileCount={fileCount} />
          </motion.div>
        </div>

        {/* Live theme preview */}
        <motion.section {...fade} aria-labelledby="preview-heading">
          <div className="mb-3 flex items-center gap-2">
            <h2 id="preview-heading" className="text-sm font-semibold">
              Live preview
            </h2>
            <span className="text-xs text-muted-foreground">
              real components — toggle theme &amp; swap the brand color
            </span>
          </div>
          <ThemePreview
            brandColor={state.theme.brandColor}
            onBrandColor={(hsl) => dispatch({ type: "brand", hsl })}
          />
        </motion.section>

        {/* Config + run command */}
        <motion.section {...fade} aria-labelledby="config-heading">
          <div className="mb-3 flex items-center gap-2">
            <h2 id="config-heading" className="text-sm font-semibold">
              Take it with you
            </h2>
            <span className="text-xs text-muted-foreground">
              the real config the CLI reads — copy and run
            </span>
          </div>
          <ConfigPanel configJson={configJson} runCommand={cmd} />
        </motion.section>
      </div>
    </div>
  );
}
