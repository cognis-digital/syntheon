/**
 * Syntheon — generation-engine local contracts.
 *
 * The stable, cross-lane build contract lives in `@/studio/types` (owned by the
 * registry/CLI lane). This module re-exports the pieces the `studio/ai` and
 * `studio/harness` lanes consume, and adds the engine-internal types those
 * lanes need but the shared contract does not define.
 *
 * INTEGRATION NOTE: `studio/types.ts` already exists and is authoritative. If it
 * is ever absent during isolated development, define a minimal compatible shim
 * here. Today it is present, so we import directly and only *add* internal types.
 */

export type {
  FeatureCategory,
  UnitKind,
  FeatureSpec,
  UnitTemplate,
  GenerationUnit,
  FeatureSelection,
  ThemeConfig,
  BuildBlueprint,
  BuildPlan,
  GenerationEngine,
  GenerationHooks,
  GenerationResult,
} from "@/studio/types";

import type { GenerationUnit } from "@/studio/types";

/** The tools the harness can run, in the DESIGN.md §8 gate order. */
export type GateTool = "tsc" | "eslint" | "vitest" | "next-build";

/** A single structured diagnostic parsed from a tool's raw output. */
export interface Diagnostic {
  tool: GateTool;
  /** Project-relative file path, or undefined for project-level diagnostics. */
  file?: string;
  line?: number;
  col?: number;
  /** Severity as reported by the tool. */
  severity: "error" | "warning";
  message: string;
  /** Rule / error code where available (e.g. TS2345, eslint rule id). */
  code?: string;
}

/** Result of running one gate (one tool). */
export interface GateResult {
  tool: GateTool;
  ok: boolean;
  diagnostics: Diagnostic[];
  /** Raw combined stdout+stderr, retained for debugging / model feedback. */
  raw: string;
  /** Milliseconds the gate took. */
  durationMs: number;
  /** True when the tool could not run at all (missing binary, crash). */
  skipped?: boolean;
}

/** Aggregate verdict from running one or more gates. */
export interface HarnessVerdict {
  ok: boolean;
  results: GateResult[];
  /** Flattened error-severity diagnostics across all gates. */
  errors: Diagnostic[];
}

/** A candidate produced by the coder for one unit. */
export interface CodeCandidate {
  unit: GenerationUnit;
  /** The extracted source code (fences stripped, validated non-empty). */
  code: string;
  /** The raw model response, for debugging. */
  raw: string;
  /** Which model produced it. */
  model: string;
  /** True when this came from the deterministic template fallback. */
  fromTemplate?: boolean;
}

/** Per-unit outcome from the repair loop. */
export interface UnitOutcome {
  unit: GenerationUnit;
  ok: boolean;
  /** How many coder attempts were made before success/exhaustion. */
  attempts: number;
  /** Whether the unit fell back to its curated template. */
  fellBackToTemplate: boolean;
  /** Final code written for the unit (or undefined if nothing usable). */
  code?: string;
  /** Diagnostics remaining at exhaustion, if any. */
  remaining?: Diagnostic[];
}

/** Progress events emitted by the loop (a superset of GenerationHooks). */
export interface LoopEvent {
  type:
    | "plan"
    | "unit-start"
    | "attempt"
    | "gate"
    | "unit-done"
    | "fallback"
    | "log"
    | "done";
  message: string;
  unit?: GenerationUnit;
  attempt?: number;
  ok?: boolean;
  verdict?: HarnessVerdict;
}

export type LoopEventSink = (event: LoopEvent) => void;
