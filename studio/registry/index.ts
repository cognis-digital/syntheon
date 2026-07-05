/**
 * Syntheon registry — public surface + the planner.
 *
 * `resolvePlan(blueprint)` is the bridge between the menu and the generation
 * engine: it expands the selected features (plus their required features and
 * component dependencies) into a single, topologically ordered
 * `GenerationUnit[]` with aggregated env vars and integrations.
 */
import type {
  BuildBlueprint,
  BuildPlan,
  GenerationUnit,
  UnitTemplate,
} from "../types.js";
import {
  CORE_FEATURE_IDS,
  FEATURES,
  getFeature,
} from "./features.js";
import { COMPONENTS, expandComponents, getComponent } from "./components.js";
import { INTEGRATIONS, getIntegration } from "./integrations.js";

export * from "./features.js";
export * from "./components.js";
export * from "./integrations.js";

/**
 * Transitively collect all feature ids implied by a selection: the selected
 * features plus everything they `require` (and core features, always). Throws
 * on a dangling `requires` reference so the registry stays honest.
 */
export function collectFeatureIds(selectedIds: Iterable<string>): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const feature = getFeature(id);
    if (!feature) {
      throw new Error(`Unknown feature "${id}" in selection.`);
    }
    for (const req of feature.requires ?? []) {
      if (!getFeature(req)) {
        throw new Error(`Feature "${id}" requires unknown feature "${req}".`);
      }
      visit(req);
    }
    result.push(id);
  };
  for (const id of CORE_FEATURE_IDS) visit(id);
  for (const id of selectedIds) visit(id);
  return result;
}

/**
 * Expand a blueprint into an ordered build plan. Units are ordered so that any
 * unit appears after every unit listed in its `dependsOn`, and component
 * dependency units precede the features that consume them. Duplicate paths
 * (e.g. a shared `lib/email/sequences.ts` or `app/api/ai/chat/route.ts`) are
 * de-duplicated — first declaration wins.
 */
export function resolvePlan(blueprint: BuildBlueprint): BuildPlan {
  const featureIds = collectFeatureIds(
    blueprint.features.map((f) => f.featureId),
  );

  // 1. Gather component ids referenced by the resolved features, expanded to
  //    include transitive `uses`. Each becomes a component unit.
  const componentIds = new Set<string>();
  for (const fid of featureIds) {
    for (const cid of getFeature(fid)?.components ?? []) componentIds.add(cid);
  }
  const expandedComponentIds = expandComponents(componentIds);

  // 2. Build the raw unit list: component units first, then feature units.
  const byPath = new Map<string, GenerationUnit>();
  const addUnit = (tpl: UnitTemplate, featureId: string) => {
    if (byPath.has(tpl.path)) return; // first declaration wins
    byPath.set(tpl.path, {
      ...tpl,
      id: tpl.path,
      featureId,
      order: -1, // assigned after topo sort
    });
  };

  for (const cid of expandedComponentIds) {
    const comp = getComponent(cid);
    if (!comp) continue;
    addUnit(
      {
        kind: "component",
        path: comp.path,
        spec: `${comp.label} ${comp.kind === "ui" ? "UI primitive" : "block"} — typed props, dark-mode correct, a11y-checked.`,
        dependsOn: (comp.uses ?? [])
          .map((u) => getComponent(u)?.path)
          .filter((p): p is string => Boolean(p)),
      },
      "core-app-shell",
    );
  }

  for (const fid of featureIds) {
    const feature = getFeature(fid);
    if (!feature) continue;
    for (const unit of feature.units) addUnit(unit, fid);
  }

  // 3. Topologically sort by dependsOn (paths present in the plan).
  const units = topoSort([...byPath.values()], byPath);

  // 4. Aggregate env + integrations (deduped, stable order).
  const env = uniqueOrdered(
    featureIds.flatMap((fid) => getFeature(fid)?.env ?? []),
  );
  const integrations = uniqueOrdered(
    featureIds.flatMap((fid) => getFeature(fid)?.integrations ?? []),
  );
  for (const iid of integrations) {
    if (!getIntegration(iid)) {
      throw new Error(`Feature references unknown integration "${iid}".`);
    }
  }

  return { blueprint, units, env, integrations };
}

/**
 * Kahn topological sort. Edges only count when the dependency is itself a unit
 * in the plan (external / not-selected deps are ignored). Ties break by the
 * original insertion order for a stable, deterministic plan. Cycles throw.
 */
function topoSort(
  all: GenerationUnit[],
  byPath: Map<string, GenerationUnit>,
): GenerationUnit[] {
  const indexOf = new Map(all.map((u, i) => [u.path, i]));
  const deps = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  for (const u of all) {
    const present = (u.dependsOn ?? []).filter((d) => byPath.has(d));
    deps.set(u.path, present);
    indegree.set(u.path, 0);
  }
  for (const list of deps.values()) {
    for (const d of list) indegree.set(d, indegree.get(d)!); // ensure key
  }
  // indegree[u] = number of deps u waits on.
  for (const u of all) indegree.set(u.path, deps.get(u.path)!.length);

  // reverse adjacency: dep -> dependents
  const dependents = new Map<string, string[]>();
  for (const u of all) {
    for (const d of deps.get(u.path)!) {
      (dependents.get(d) ?? dependents.set(d, []).get(d)!).push(u.path);
    }
  }

  const ready = all
    .filter((u) => indegree.get(u.path) === 0)
    .map((u) => u.path)
    .sort((a, b) => indexOf.get(a)! - indexOf.get(b)!);

  const ordered: GenerationUnit[] = [];
  const queue = [...ready];
  while (queue.length) {
    // pop the smallest by original index for determinism
    queue.sort((a, b) => indexOf.get(a)! - indexOf.get(b)!);
    const path = queue.shift()!;
    const unit = byPath.get(path)!;
    unit.order = ordered.length;
    ordered.push(unit);
    for (const dependent of dependents.get(path) ?? []) {
      indegree.set(dependent, indegree.get(dependent)! - 1);
      if (indegree.get(dependent) === 0) queue.push(dependent);
    }
  }

  if (ordered.length !== all.length) {
    throw new Error("Dependency cycle detected in build plan.");
  }
  return ordered;
}

function uniqueOrdered(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const it of items) {
    if (!seen.has(it)) {
      seen.add(it);
      out.push(it);
    }
  }
  return out;
}

/**
 * Resolve the plan for adding ONE feature to an existing app (`studio add`).
 *
 * Produces a {@link BuildPlan} containing only the units the new feature
 * introduces — its own units plus any component/required-feature units — with
 * everything already present excluded. When an `existing` blueprint is given,
 * the addition is diffed against it (so shared units like `lib/email/sequences.ts`
 * or an existing `app/api/ai/chat/route.ts` aren't regenerated). Otherwise the
 * feature is resolved against the always-present core so the app shell isn't
 * regenerated.
 *
 * Throws if the feature id is unknown. The returned plan carries a synthetic
 * blueprint (single selection) so it flows through the existing engine unchanged.
 */
export function resolveFeatureAddition(
  featureId: string,
  existing?: BuildBlueprint,
): BuildPlan {
  const feature = getFeature(featureId);
  if (!feature) {
    throw new Error(
      `Unknown feature "${featureId}". Run \`studio add --list\` to see available features.`,
    );
  }

  const base: BuildBlueprint = existing ?? {
    version: 1,
    name: "my-syntheon-app",
    projectType: "saas",
    features: [],
    theme: {
      brandColor: "262 83% 58%",
      radius: "0.65rem",
      font: "inter",
      darkMode: true,
    },
  };

  const alreadySelected = base.features.some((f) => f.featureId === featureId);

  // Plan the app WITH and WITHOUT the new feature; the difference is the work.
  const withFeature = resolvePlan({
    ...base,
    features: alreadySelected
      ? base.features
      : [...base.features, { featureId }],
  });
  const without = resolvePlan(base);
  const existingPaths = new Set(without.units.map((u) => u.path));
  const existingEnv = new Set(without.env);
  const existingIntegrations = new Set(without.integrations);

  const units = withFeature.units
    .filter((u) => !existingPaths.has(u.path))
    .map((u, i) => ({ ...u, order: i }));
  const env = withFeature.env.filter((e) => !existingEnv.has(e));
  const integrations = withFeature.integrations.filter(
    (i) => !existingIntegrations.has(i),
  );

  const blueprint: BuildBlueprint = {
    ...base,
    name: `${base.name} + ${feature.label}`,
    features: [{ featureId }],
  };

  return { blueprint, units, env, integrations };
}

/**
 * Registry integrity check — verifies no feature references a component or
 * integration that does not exist, and no `requires` points at a missing
 * feature. Returns the list of problems (empty = healthy). Used by tests and
 * available at runtime for a `--check` affordance.
 */
export function checkRegistryIntegrity(): string[] {
  const problems: string[] = [];
  const componentIds = new Set(COMPONENTS.map((c) => c.id));
  const integrationIds = new Set(INTEGRATIONS.map((i) => i.id));
  const featureIdSet = new Set(FEATURES.map((f) => f.id));

  for (const f of FEATURES) {
    for (const c of f.components ?? []) {
      if (!componentIds.has(c)) problems.push(`Feature "${f.id}" references unknown component "${c}".`);
    }
    for (const i of f.integrations ?? []) {
      if (!integrationIds.has(i)) problems.push(`Feature "${f.id}" references unknown integration "${i}".`);
    }
    for (const r of f.requires ?? []) {
      if (!featureIdSet.has(r)) problems.push(`Feature "${f.id}" requires unknown feature "${r}".`);
    }
    if (f.units.length === 0) problems.push(`Feature "${f.id}" contributes no units.`);
  }
  for (const c of COMPONENTS) {
    for (const u of c.uses ?? []) {
      if (!componentIds.has(u)) problems.push(`Component "${c.id}" uses unknown component "${u}".`);
    }
  }
  return problems;
}
