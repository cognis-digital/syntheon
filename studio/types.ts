/**
 * Syntheon — shared build contract.
 *
 * This file is the stable, minimal TypeScript contract shared between the
 * registry/CLI lane (which produces a {@link BuildBlueprint} and expands it
 * into a {@link GenerationUnit}[] plan) and the generation-engine / harness
 * lanes (`studio/ai`, `studio/harness`) which consume that plan.
 *
 * Keep it minimal and stable — both lanes depend on it. Additive changes only.
 */

/** Categories a feature can belong to. Drives grouping in the menu and plan. */
export type FeatureCategory =
  | "core"
  | "pages"
  | "auth"
  | "payments"
  | "scheduling"
  | "email"
  | "crm"
  | "integrations"
  | "ai"
  | "identity"
  | "theme";

/** The kind of artifact a generation unit produces. */
export type UnitKind =
  | "component" // a UI primitive or block (components/ui|blocks)
  | "route" // a page / layout under app/
  | "api" // a route handler / webhook under app/api
  | "integration" // a typed adapter under lib/integrations
  | "module" // a feature module under lib/*
  | "config" // a config / env / tokens file
  | "test"; // a test file

/**
 * A single feature the user can select from the menu. Features are the
 * catalog entries in `studio/registry/features.ts`.
 */
export interface FeatureSpec {
  id: string;
  label: string;
  description: string;
  category: FeatureCategory;
  /** Other feature ids this feature requires (auto-included when selected). */
  requires?: string[];
  /** Integration ids this feature pulls in. */
  integrations?: string[];
  /** Component ids this feature relies on. */
  components?: string[];
  /** Environment variables the generated code will read. */
  env?: string[];
  /**
   * The generation units this feature contributes. Paths are project-relative
   * (e.g. `app/(marketing)/page.tsx`). The planner clones these into the plan.
   */
  units: UnitTemplate[];
}

/** A unit as declared on a feature (before plan expansion / id assignment). */
export interface UnitTemplate {
  kind: UnitKind;
  /** Project-relative path of the file to generate. */
  path: string;
  /** One-line natural-language spec handed to the coder model. */
  spec: string;
  /** Project-relative paths this unit imports / depends on (ordering hint). */
  dependsOn?: string[];
  /** Optional curated template id used as the fallback substrate. */
  template?: string;
}

/**
 * A resolved, ordered unit of generation. This is the atomic work item the
 * planner emits and the coder/harness loop consumes (one component / route /
 * handler / adapter / test per unit).
 */
export interface GenerationUnit extends UnitTemplate {
  /** Stable unique id within a plan (typically the path). */
  id: string;
  /** The feature that contributed this unit. */
  featureId: string;
  /** Ordering index after topological sort (0 = generated first). */
  order: number;
}

/** A single feature selection from the menu, with any per-feature choice. */
export interface FeatureSelection {
  featureId: string;
  /** For select-style features, the chosen provider/option id (e.g. "stripe"). */
  choice?: string;
}

/** Theme customization captured from the menu. */
export interface ThemeConfig {
  /** Brand color as an HSL triple string, e.g. "262 83% 58%". */
  brandColor: string;
  /** Corner radius in rem, e.g. "0.65rem". */
  radius: string;
  /** Font family key, e.g. "inter". */
  font: string;
  /** Ship with dark-mode support. */
  darkMode: boolean;
}

/**
 * The blueprint compiled from menu selections and persisted to
 * `syntheon.config.json`. This is the single input to `resolvePlan` and,
 * downstream, to the generation engine.
 */
export interface BuildBlueprint {
  /** Schema version for forward compatibility. */
  version: 1;
  /** Human name of the app being generated. */
  name: string;
  /** Project archetype (drives base pages and defaults). */
  projectType: string;
  /** All selected features (with per-feature choices). */
  features: FeatureSelection[];
  /** Theme tokens. */
  theme: ThemeConfig;
  /** Optional cloud-model escalation for units failing local repair. */
  cloudEscalation?: boolean;
}

/** A fully expanded, ordered build plan — the handoff to `studio/ai`. */
export interface BuildPlan {
  blueprint: BuildBlueprint;
  units: GenerationUnit[];
  /** Aggregated env vars across all units (deduped). */
  env: string[];
  /** Integration ids pulled in by the selection (deduped). */
  integrations: string[];
}

/**
 * The documented interface the CLI expects from the generation engine
 * (`studio/ai`). The ai lane implements and exports `runGeneration`. The CLI
 * imports this defensively so it remains useful (dry-run) when the engine is
 * absent.
 */
export interface GenerationEngine {
  runGeneration(
    plan: BuildPlan,
    hooks?: GenerationHooks,
  ): Promise<GenerationResult>;
}

/** Progress callbacks the CLI passes to the engine for streaming output. */
export interface GenerationHooks {
  onUnitStart?: (unit: GenerationUnit) => void;
  onUnitDone?: (unit: GenerationUnit, ok: boolean) => void;
  onLog?: (message: string) => void;
}

/** Outcome summary returned by the engine. */
export interface GenerationResult {
  ok: boolean;
  generated: number;
  failed: number;
  fellBackToTemplate: string[];
}
