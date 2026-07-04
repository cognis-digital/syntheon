/**
 * Syntheon — planner.
 *
 * Takes a {@link BuildPlan} (or the raw units from `resolvePlan`) and produces a
 * validated, dependency-ordered {@link GenerationUnit}[]. A reasoning model may
 * refine the *ordering* among independent units, but the deterministic
 * topological sort is authoritative and always runs — the model can only
 * reorder within the constraints, never break them. If the model is down or
 * returns garbage, we fall back to the deterministic order cleanly.
 */

import type { BuildPlan, GenerationUnit } from "./contracts.js";
import type { ChatClient } from "./ollama.js";
import { resolveRoles, type RoleConfig } from "./roles.js";

// contracts re-exports the shared GenerationUnit; ollama defines ChatClient.
type Client = ChatClient;

export interface PlannerOptions {
  /** Reasoning client; when omitted or down, deterministic order is used. */
  client?: Client;
  roles?: Partial<RoleConfig>;
  /** Log sink. */
  onLog?: (msg: string) => void;
}

/**
 * Produce the final ordered unit list for a plan.
 * Always returns a valid topological order; model refinement is best-effort.
 */
export async function planUnits(
  plan: BuildPlan,
  opts: PlannerOptions = {},
): Promise<GenerationUnit[]> {
  const log = opts.onLog ?? (() => {});
  const base = topoSort(plan.units, log);

  if (!opts.client) {
    log("Planner: no reasoning model provided — using deterministic order.");
    return reindex(base);
  }

  try {
    const roles = resolveRoles(opts.roles);
    const refined = await refineWithModel(base, plan, opts.client, roles, log);
    // Validate the model's suggestion preserves all deps; else keep base.
    if (refined && isValidOrder(refined, plan.units)) {
      log("Planner: applied model-refined ordering.");
      return reindex(refined);
    }
    log("Planner: model ordering invalid or empty — keeping deterministic order.");
  } catch (err) {
    log(
      `Planner: model refinement failed (${err instanceof Error ? err.message : String(err)}) — deterministic order.`,
    );
  }
  return reindex(base);
}

/**
 * Deterministic dependency-respecting order. Kahn's algorithm over dependsOn
 * edges (restricted to units actually in the plan), with a stable tiebreak:
 * config/types first, then components, then modules/integrations, then
 * routes/api, then tests — mirroring a sensible build order. Cycles are broken
 * by dropping the offending edge and warning.
 */
export function topoSort(
  units: GenerationUnit[],
  log: (m: string) => void = () => {},
): GenerationUnit[] {
  const byPath = new Map<string, GenerationUnit>();
  for (const u of units) byPath.set(norm(u.path), u);

  const indeg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const u of units) {
    const id = norm(u.path);
    indeg.set(id, indeg.get(id) ?? 0);
    for (const dep of u.dependsOn ?? []) {
      const depId = norm(dep);
      if (!byPath.has(depId)) continue; // external dep — ignore for ordering
      adj.set(depId, [...(adj.get(depId) ?? []), id]);
      indeg.set(id, (indeg.get(id) ?? 0) + 1);
    }
  }

  // Ready set ordered by kind rank then path for stability.
  const rank = (u: GenerationUnit): number =>
    ({ config: 0, component: 1, module: 2, integration: 2, api: 3, route: 3, test: 4 })[
      u.kind
    ] ?? 5;
  const cmp = (a: string, b: string): number => {
    const ua = byPath.get(a)!;
    const ub = byPath.get(b)!;
    return rank(ua) - rank(ub) || a.localeCompare(b);
  };

  const ready = [...indeg.entries()]
    .filter(([, d]) => d === 0)
    .map(([id]) => id)
    .sort(cmp);
  const out: GenerationUnit[] = [];
  const done = new Set<string>();

  while (ready.length) {
    const id = ready.shift()!;
    if (done.has(id)) continue;
    done.add(id);
    out.push(byPath.get(id)!);
    const nexts: string[] = [];
    for (const nx of adj.get(id) ?? []) {
      indeg.set(nx, (indeg.get(nx) ?? 1) - 1);
      if ((indeg.get(nx) ?? 0) === 0) nexts.push(nx);
    }
    for (const nx of nexts) ready.push(nx);
    ready.sort(cmp);
  }

  // Any remaining units are in a cycle: append in stable order with a warning.
  if (out.length < units.length) {
    const remaining = units.filter((u) => !done.has(norm(u.path)));
    log(
      `Planner: dependency cycle detected among ${remaining.length} unit(s); appending in stable order.`,
    );
    remaining.sort((a, b) => cmp(norm(a.path), norm(b.path)));
    out.push(...remaining);
  }

  return out;
}

/** Ask the reasoning model to reorder independent units. Best-effort. */
async function refineWithModel(
  base: GenerationUnit[],
  plan: BuildPlan,
  client: Client,
  roles: RoleConfig,
  log: (m: string) => void,
): Promise<GenerationUnit[] | undefined> {
  const paths = base.map((u) => norm(u.path));
  const listing = base
    .map(
      (u) =>
        `- ${norm(u.path)} [${u.kind}] deps: ${(u.dependsOn ?? []).map(norm).join(", ") || "none"}`,
    )
    .join("\n");

  const system =
    "You are Syntheon's build planner. You order code-generation units so that " +
    "every file is generated after the files it depends on. Respond with ONLY a " +
    'JSON object of the form {"order": ["path", ...]} listing every path exactly once.';
  const user =
    `App: ${plan.blueprint.name} (${plan.blueprint.projectType}).\n` +
    `Units (${base.length}):\n${listing}\n\n` +
    "Return the best generation order as JSON. Dependencies must come first.";

  const raw = await client.chat(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { model: roles.planner, json: true, temperature: roles.temperature.planner },
  );

  const order = parseOrder(raw, paths);
  if (!order) return undefined;
  log(`Planner: model returned ${order.length} ordered paths.`);
  const byPath = new Map(base.map((u) => [norm(u.path), u]));
  return order.map((p) => byPath.get(p)!);
}

/** Parse a model JSON response into a complete permutation of `paths`. */
export function parseOrder(raw: string, paths: string[]): string[] | undefined {
  const json = extractJson(raw);
  if (!json) return undefined;
  let obj: unknown;
  try {
    obj = JSON.parse(json);
  } catch {
    return undefined;
  }
  const arr = Array.isArray(obj)
    ? obj
    : (obj as { order?: unknown }).order;
  if (!Array.isArray(arr)) return undefined;
  const wanted = new Set(paths);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of arr) {
    const p = norm(String(item));
    if (wanted.has(p) && !seen.has(p)) {
      seen.add(p);
      result.push(p);
    }
  }
  // Must be a full permutation to be trusted.
  return result.length === paths.length ? result : undefined;
}

/** Validate that no unit precedes one of its (in-plan) dependencies. */
export function isValidOrder(
  order: GenerationUnit[],
  all: GenerationUnit[],
): boolean {
  const inPlan = new Set(all.map((u) => norm(u.path)));
  const pos = new Map<string, number>();
  order.forEach((u, i) => pos.set(norm(u.path), i));
  if (pos.size !== all.length) return false;
  for (const u of order) {
    const here = pos.get(norm(u.path))!;
    for (const dep of u.dependsOn ?? []) {
      const d = norm(dep);
      if (!inPlan.has(d)) continue;
      const dp = pos.get(d);
      if (dp === undefined || dp > here) return false;
    }
  }
  return true;
}

function reindex(units: GenerationUnit[]): GenerationUnit[] {
  return units.map((u, i) => ({ ...u, order: i }));
}

function extractJson(raw: string): string | undefined {
  // deepseek-r1 emits <think>...</think>; strip it first.
  const noThink = raw.replace(/<think>[\s\S]*?<\/think>/gi, "");
  const start = noThink.indexOf("{");
  const arrStart = noThink.indexOf("[");
  const s =
    start === -1 ? arrStart : arrStart === -1 ? start : Math.min(start, arrStart);
  if (s === -1) return undefined;
  const open = noThink[s];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  for (let i = s; i < noThink.length; i++) {
    if (noThink[i] === open) depth++;
    else if (noThink[i] === close) {
      depth--;
      if (depth === 0) return noThink.slice(s, i + 1);
    }
  }
  return undefined;
}

function norm(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}
