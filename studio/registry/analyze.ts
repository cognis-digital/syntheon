/**
 * Syntheon — build-plan analysis + machine-readable export.
 *
 * The registry can already expand a {@link BuildBlueprint} into an ordered
 * {@link BuildPlan} (see `resolvePlan`). This module adds a *read-only* analysis
 * layer on top of that plan: it summarizes the shape of the work (units by kind,
 * paid vs. free integrations, required env vars, dependency depth) and can emit
 * the whole thing as a stable, JSON-serializable object.
 *
 * Everything here is pure — no I/O, no side effects, no model calls — so it is
 * cheap to run, trivially testable, and safe to consume from CI or other tools.
 * It powers the `studio explain` command and the `--json` output mode.
 *
 * Additive only: this file introduces new exports and changes nothing existing.
 */
import type {
  BuildPlan,
  FeatureSelection,
  GenerationUnit,
  ThemeConfig,
  UnitKind,
} from "../types.js";
import { getIntegration } from "./integrations.js";

/** Every {@link UnitKind}, in a stable display order. */
export const UNIT_KINDS: readonly UnitKind[] = [
  "config",
  "component",
  "module",
  "integration",
  "api",
  "route",
  "test",
] as const;

/** A compact, human- and machine-friendly summary of a resolved build plan. */
export interface PlanAnalysis {
  /** App name from the blueprint. */
  name: string;
  /** Project archetype (e.g. "saas"). */
  projectType: string;
  /** Distinct features that actually contribute at least one unit. */
  featureCount: number;
  /** Total generation units in the plan. */
  unitCount: number;
  /** Unit totals per kind. Every kind is present (0 when unused). */
  unitsByKind: Record<UnitKind, number>;
  /** Total integrations pulled in. */
  integrationCount: number;
  /** Integration ids that require a paid account / external service. */
  paidIntegrations: string[];
  /** Integration ids that are free / self-hostable / local. */
  freeIntegrations: string[];
  /** Number of distinct env vars the generated code will read. */
  envCount: number;
  /**
   * Longest dependency chain length measured in units (1 when there are units
   * but no in-plan edges, 0 for an empty plan). A proxy for how "deep" the
   * generation order is — deeper plans have more sequential bottlenecks.
   */
  dependencyDepth: number;
  /** Units with no in-plan dependencies (can be generated first / in parallel). */
  rootCount: number;
  /** Units nothing else in the plan depends on (safe to generate last). */
  leafCount: number;
}

/** One unit, flattened to a stable JSON shape. */
export interface SerializableUnit {
  id: string;
  path: string;
  kind: UnitKind;
  featureId: string;
  order: number;
  /** Only dependencies that are themselves units in this plan. */
  dependsOn: string[];
}

/** One integration, flattened with the fields consumers care about. */
export interface SerializableIntegration {
  id: string;
  label: string;
  paid: boolean;
  env: string[];
}

/**
 * A stable, JSON-serializable projection of a {@link BuildPlan}. This is the
 * documented contract for `--json` output and the plugin/tooling surface: field
 * names and ordering are deterministic so downstream diffs are meaningful.
 */
export interface SerializablePlan {
  blueprint: {
    version: number;
    name: string;
    projectType: string;
    features: FeatureSelection[];
    theme: ThemeConfig;
    cloudEscalation?: boolean;
  };
  units: SerializableUnit[];
  env: string[];
  integrations: SerializableIntegration[];
  analysis: PlanAnalysis;
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}

/** In-plan dependency edges only: deps that resolve to a unit in the plan. */
function inPlanDeps(unit: GenerationUnit, present: Set<string>): string[] {
  return (unit.dependsOn ?? [])
    .map(normalizePath)
    .filter((d) => present.has(d));
}

/**
 * Longest dependency chain (in units) across the plan. Computed with a memoized
 * DFS over the in-plan edges; the topological order the planner emits guarantees
 * the graph is acyclic, but we guard against cycles defensively so a malformed
 * plan yields a finite answer instead of hanging.
 */
export function dependencyDepth(units: GenerationUnit[]): number {
  if (units.length === 0) return 0;
  const present = new Set(units.map((u) => normalizePath(u.path)));
  const byPath = new Map(units.map((u) => [normalizePath(u.path), u]));
  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  const depthOf = (path: string): number => {
    const cached = memo.get(path);
    if (cached !== undefined) return cached;
    if (visiting.has(path)) return 1; // cycle guard — treat as leaf-ish
    visiting.add(path);
    const unit = byPath.get(path);
    const deps = unit ? inPlanDeps(unit, present) : [];
    let best = 0;
    for (const d of deps) best = Math.max(best, depthOf(d));
    visiting.delete(path);
    const result = best + 1;
    memo.set(path, result);
    return result;
  };

  let max = 0;
  for (const p of present) max = Math.max(max, depthOf(p));
  return max;
}

/**
 * Analyze a resolved build plan into a {@link PlanAnalysis}. Pure and cheap.
 */
export function analyzePlan(plan: BuildPlan): PlanAnalysis {
  const unitsByKind = Object.fromEntries(
    UNIT_KINDS.map((k) => [k, 0]),
  ) as Record<UnitKind, number>;
  for (const u of plan.units) {
    unitsByKind[u.kind] = (unitsByKind[u.kind] ?? 0) + 1;
  }

  const featureIds = new Set(plan.units.map((u) => u.featureId));

  const paidIntegrations: string[] = [];
  const freeIntegrations: string[] = [];
  for (const id of plan.integrations) {
    const spec = getIntegration(id);
    // Unknown integrations are conservatively treated as paid (safer default
    // for a "what will this cost me" read); resolvePlan already rejects truly
    // unknown ids, so in practice spec is always defined here.
    if (spec ? spec.paid : true) paidIntegrations.push(id);
    else freeIntegrations.push(id);
  }

  const present = new Set(plan.units.map((u) => normalizePath(u.path)));
  const dependedUpon = new Set<string>();
  let rootCount = 0;
  for (const u of plan.units) {
    const deps = inPlanDeps(u, present);
    if (deps.length === 0) rootCount++;
    for (const d of deps) dependedUpon.add(d);
  }
  const leafCount = plan.units.filter(
    (u) => !dependedUpon.has(normalizePath(u.path)),
  ).length;

  return {
    name: plan.blueprint.name,
    projectType: plan.blueprint.projectType,
    featureCount: featureIds.size,
    unitCount: plan.units.length,
    unitsByKind,
    integrationCount: plan.integrations.length,
    paidIntegrations,
    freeIntegrations,
    envCount: plan.env.length,
    dependencyDepth: dependencyDepth(plan.units),
    rootCount,
    leafCount,
  };
}

/**
 * Project a {@link BuildPlan} into its stable {@link SerializablePlan} form.
 * Units are emitted in generation order; integrations are enriched with their
 * catalog metadata. Suitable for `JSON.stringify` and machine consumption.
 */
export function planToSerializable(plan: BuildPlan): SerializablePlan {
  const present = new Set(plan.units.map((u) => normalizePath(u.path)));
  const units: SerializableUnit[] = [...plan.units]
    .sort((a, b) => a.order - b.order)
    .map((u) => ({
      id: u.id,
      path: normalizePath(u.path),
      kind: u.kind,
      featureId: u.featureId,
      order: u.order,
      dependsOn: inPlanDeps(u, present),
    }));

  const integrations: SerializableIntegration[] = plan.integrations.map((id) => {
    const spec = getIntegration(id);
    return {
      id,
      label: spec?.label ?? id,
      paid: spec ? spec.paid : true,
      env: spec?.env ?? [],
    };
  });

  return {
    blueprint: {
      version: plan.blueprint.version,
      name: plan.blueprint.name,
      projectType: plan.blueprint.projectType,
      features: plan.blueprint.features,
      theme: plan.blueprint.theme,
      ...(plan.blueprint.cloudEscalation !== undefined
        ? { cloudEscalation: plan.blueprint.cloudEscalation }
        : {}),
    },
    units,
    env: [...plan.env],
    integrations,
    analysis: analyzePlan(plan),
  };
}

/** The whole serializable plan as a pretty-printed JSON string (+ newline). */
export function planToJSON(plan: BuildPlan): string {
  return JSON.stringify(planToSerializable(plan), null, 2) + "\n";
}

/**
 * Render a {@link PlanAnalysis} as a compact, human-readable report. No color
 * codes so it is safe to pipe, snapshot, or embed in CI logs.
 */
export function renderAnalysis(analysis: PlanAnalysis): string {
  const lines: string[] = [];
  lines.push(`${analysis.name} — ${analysis.projectType}`);
  lines.push("");
  lines.push(
    `Features contributing units : ${analysis.featureCount}`,
  );
  lines.push(`Generation units            : ${analysis.unitCount}`);
  const kinds = UNIT_KINDS.filter((k) => analysis.unitsByKind[k] > 0)
    .map((k) => `${k}=${analysis.unitsByKind[k]}`)
    .join("  ");
  if (kinds) lines.push(`  by kind                   : ${kinds}`);
  lines.push(
    `Dependency depth            : ${analysis.dependencyDepth}` +
      ` (roots=${analysis.rootCount}, leaves=${analysis.leafCount})`,
  );
  lines.push(
    `Integrations                : ${analysis.integrationCount}` +
      ` (${analysis.paidIntegrations.length} bring-your-own-key, ${analysis.freeIntegrations.length} free/local)`,
  );
  if (analysis.paidIntegrations.length) {
    lines.push(`  keys needed               : ${analysis.paidIntegrations.join(", ")}`);
  }
  lines.push(`Environment variables       : ${analysis.envCount}`);
  return lines.join("\n");
}
