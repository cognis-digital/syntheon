/**
 * Syntheon playground — pure, framework-free selection model.
 *
 * This module mirrors the real `studio` CLI menu: the visitor picks a project
 * type + a set of features grouped by category (single-choice `select` groups
 * like Auth/Payments, and `multiselect` groups like Pages/Integrations) plus a
 * theme. Everything here is deterministic and side-effect free so it can drive
 * the in-browser experience AND be unit-tested directly. The heavy lifting —
 * expanding a selection into an ordered file plan — is delegated to the SAME
 * `resolvePlan` the CLI uses, so the blueprint on screen is genuinely real.
 */
import {
  FEATURES,
  MENU_GROUPS,
  PROJECT_TYPES,
  getFeature,
  resolvePlan,
  type MenuGroup,
} from "@/studio/registry";
import { blueprintSchema, DEFAULT_THEME } from "@/studio/config/schema";
import type {
  BuildBlueprint,
  BuildPlan,
  FeatureCategory,
  FeatureSpec,
  ThemeConfig,
} from "@/studio/types";

/** A curated brand-color preset (HSL triple + a hex swatch for the UI). */
export interface BrandPreset {
  id: string;
  label: string;
  /** HSL triple string, e.g. "262 83% 58%" — the token contract format. */
  hsl: string;
  /** Hex mirror for native color inputs and swatches. */
  hex: string;
}

/**
 * The playground brand palette. Violet is the Syntheon default (first entry);
 * the rest let a visitor watch the whole app re-theme live.
 */
export const BRAND_PRESETS: readonly BrandPreset[] = [
  { id: "violet", label: "Syntheon violet", hsl: "262 83% 58%", hex: "#7c3aed" },
  { id: "indigo", label: "Indigo", hsl: "239 84% 67%", hex: "#615cf5" },
  { id: "blue", label: "Blue", hsl: "217 91% 60%", hex: "#3b82f6" },
  { id: "emerald", label: "Emerald", hsl: "160 84% 39%", hex: "#10b981" },
  { id: "rose", label: "Rose", hsl: "347 77% 50%", hex: "#e11d48" },
  { id: "amber", label: "Amber", hsl: "38 92% 50%", hex: "#f59e0b" },
] as const;

/** The playground's own selection state (framework-agnostic). */
export interface PlaygroundState {
  name: string;
  projectType: string;
  /**
   * Chosen feature ids per menu category. For `select` groups this holds 0 or 1
   * id; for `multiselect` groups it can hold many. Core features are implicit.
   */
  selections: Record<FeatureCategory, string[]>;
  theme: ThemeConfig;
}

/** The menu categories a visitor can interact with (core is implicit). */
export const SELECTABLE_CATEGORIES: readonly FeatureCategory[] =
  MENU_GROUPS.map((g) => g.category);

/** Features for a category, in catalog order. */
export function featuresIn(category: FeatureCategory): FeatureSpec[] {
  return FEATURES.filter((f) => f.category === category);
}

/** The menu group descriptor for a category, if it is user-selectable. */
export function groupFor(category: FeatureCategory): MenuGroup | undefined {
  return MENU_GROUPS.find((g) => g.category === category);
}

function emptySelections(): Record<FeatureCategory, string[]> {
  const out = {} as Record<FeatureCategory, string[]>;
  for (const g of MENU_GROUPS) out[g.category] = [];
  return out;
}

/**
 * The initial state. Seeds the pages implied by the project archetype (matching
 * the CLI's `PROJECT_TYPES.defaultPages`) plus a batteries-included default so
 * the first paint is already impressive, not empty.
 */
export function initialState(projectType = "saas"): PlaygroundState {
  const selections = emptySelections();
  const type = PROJECT_TYPES[projectType] ?? PROJECT_TYPES.saas;
  // Seed default pages for the archetype.
  for (const pageId of type.defaultPages) {
    const feature = getFeature(pageId);
    if (feature) selections[feature.category].push(pageId);
  }
  // Batteries-included defaults for a punchy first render.
  applyDefaultPicks(selections);
  return {
    name: "my-syntheon-app",
    projectType,
    selections,
    theme: { ...DEFAULT_THEME },
  };
}

/** Sensible non-page defaults (only fill empty groups). */
function applyDefaultPicks(selections: Record<FeatureCategory, string[]>): void {
  const seed: Partial<Record<FeatureCategory, string[]>> = {
    auth: ["auth-clerk"],
    payments: ["pay-stripe"],
    email: ["email-resend"],
    ai: ["ai-ollama"],
    integrations: ["int-slack"],
  };
  for (const [cat, ids] of Object.entries(seed) as [
    FeatureCategory,
    string[],
  ][]) {
    if (selections[cat] && selections[cat].length === 0) {
      selections[cat] = ids.filter((id) => getFeature(id));
    }
  }
}

/**
 * Toggle a feature in a category, honoring the group's cardinality: `select`
 * groups keep at most one pick (choosing a new one replaces the old; choosing
 * the same one clears it), `multiselect` groups add/remove freely. Returns a
 * new state (never mutates its input).
 */
export function toggleFeature(
  state: PlaygroundState,
  category: FeatureCategory,
  featureId: string,
): PlaygroundState {
  const group = groupFor(category);
  if (!group) return state;
  const current = state.selections[category] ?? [];
  let next: string[];
  if (group.kind === "select") {
    next = current.includes(featureId) ? [] : [featureId];
  } else {
    next = current.includes(featureId)
      ? current.filter((id) => id !== featureId)
      : [...current, featureId];
  }
  return {
    ...state,
    selections: { ...state.selections, [category]: next },
  };
}

/** Switch project archetype, reseeding default pages but keeping other picks. */
export function setProjectType(
  state: PlaygroundState,
  projectType: string,
): PlaygroundState {
  const type = PROJECT_TYPES[projectType];
  if (!type) return state;
  const pageIds = type.defaultPages.filter((id) => getFeature(id));
  return {
    ...state,
    projectType,
    selections: { ...state.selections, pages: pageIds },
  };
}

/** Update the brand color from a preset or a raw HSL triple. */
export function setBrandColor(
  state: PlaygroundState,
  hsl: string,
): PlaygroundState {
  return { ...state, theme: { ...state.theme, brandColor: hsl } };
}

/** Toggle dark mode support in the theme. */
export function setDarkMode(
  state: PlaygroundState,
  darkMode: boolean,
): PlaygroundState {
  return { ...state, theme: { ...state.theme, darkMode } };
}

/** Rename the app (used in the emitted config + run command). */
export function setName(state: PlaygroundState, name: string): PlaygroundState {
  return { ...state, name };
}

/** Flatten the per-category selections into an ordered, deduped id list. */
export function selectedFeatureIds(state: PlaygroundState): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of MENU_GROUPS) {
    for (const id of state.selections[g.category] ?? []) {
      if (!seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
  }
  return out;
}

/**
 * Compile the current playground state into a real {@link BuildBlueprint} —
 * the exact shape written to `syntheon.config.json` and fed to `resolvePlan`.
 */
export function toBlueprint(state: PlaygroundState): BuildBlueprint {
  return {
    version: 1,
    name: state.name.trim() || "my-syntheon-app",
    projectType: state.projectType,
    features: selectedFeatureIds(state).map((featureId) => {
      const feature = getFeature(featureId);
      // Single-choice groups carry the pick as `choice` (mirrors the CLI).
      const isSelect = feature && groupFor(feature.category)?.kind === "select";
      return isSelect ? { featureId, choice: featureId } : { featureId };
    }),
    theme: { ...state.theme },
    cloudEscalation: false,
  };
}

/** Resolve the real ordered build plan for the current state. */
export function planFor(state: PlaygroundState): BuildPlan {
  return resolvePlan(toBlueprint(state));
}

/** The pretty-printed `syntheon.config.json` a visitor can copy. */
export function toConfigJson(state: PlaygroundState): string {
  return JSON.stringify(toBlueprint(state), null, 2) + "\n";
}

/**
 * Validate the emitted config against the real zod schema. The playground
 * should never produce an invalid blueprint; this is the guardrail (and a test
 * hook) that proves it.
 */
export function isValidBlueprint(state: PlaygroundState): boolean {
  return blueprintSchema.safeParse(toBlueprint(state)).success;
}

/** The "run this locally" command block for the current selection. */
export function runCommand(state: PlaygroundState): string {
  const name = state.name.trim() || "my-syntheon-app";
  return [
    "git clone https://github.com/cognis-digital/syntheon",
    `cd syntheon && npm install`,
    `npm run studio -- --config syntheon.config.json --name ${shellSafe(name)}`,
  ].join("\n");
}

function shellSafe(value: string): string {
  return /^[A-Za-z0-9._-]+$/.test(value) ? value : JSON.stringify(value);
}

/** A single node in the derived file tree. */
export interface FileNode {
  name: string;
  path: string;
  /** Present on directories. */
  children?: FileNode[];
  /** Present on leaves — the unit kind, for iconography. */
  kind?: string;
  /** The generating feature, for grouping/labels. */
  featureId?: string;
}

/**
 * Fold the ordered plan units into a nested file tree (directories collapsed),
 * for the "live blueprint" pane. Directories sort before files; both sort
 * alphabetically for a stable, screenshot-friendly render.
 */
export function planToTree(plan: BuildPlan): FileNode {
  const root: FileNode = { name: "", path: "", children: [] };
  for (const unit of plan.units) {
    const parts = unit.path.split("/");
    let node = root;
    let acc = "";
    parts.forEach((part, i) => {
      acc = acc ? `${acc}/${part}` : part;
      const leaf = i === parts.length - 1;
      node.children ??= [];
      let child = node.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: acc,
          ...(leaf
            ? { kind: unit.kind, featureId: unit.featureId }
            : { children: [] }),
        };
        node.children.push(child);
      }
      node = child;
    });
  }
  sortTree(root);
  return root;
}

function sortTree(node: FileNode): void {
  if (!node.children) return;
  node.children.sort((a, b) => {
    const aDir = a.children ? 0 : 1;
    const bDir = b.children ? 0 : 1;
    if (aDir !== bDir) return aDir - bDir;
    return a.name.localeCompare(b.name);
  });
  for (const child of node.children) sortTree(child);
}

/** Count leaf files (generation units) in a tree. */
export function countFiles(node: FileNode): number {
  if (!node.children) return 1;
  return node.children.reduce((sum, c) => sum + countFiles(c), 0);
}
