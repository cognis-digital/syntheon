/**
 * Syntheon — top-level generation orchestrator.
 *
 * Wires planner → repair loop over all units. Implements the {@link GenerationEngine}
 * contract the CLI expects (`runGeneration(plan, hooks)`). Resumable: progress
 * is persisted to `studio/.cache/<name>.json` so a re-run skips already-green
 * units. `--dry-run` (via options) plans without generating.
 *
 * Degrades gracefully: if Ollama is down, `runGeneration` reports it clearly and
 * (for dry-run) still emits the deterministic plan.
 */

import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import type {
  BuildPlan,
  GenerationHooks,
  GenerationResult,
  UnitOutcome,
  LoopEvent,
} from "./contracts.js";
import { OllamaClient, isOllamaUp, listOllamaModels, type ChatClient } from "./ollama.js";
import { resolveRoles, pickModelForRole, type RoleConfig } from "./roles.js";
import { planUnits } from "./planner.js";
import { memoryFileSource, type FileSource } from "./context.js";
import {
  runRepairLoop,
  verifyProject,
  type RepairLoopOptions,
  type WriteSink,
} from "../harness/loop.js";
import type { Runner } from "../harness/gates.js";

export interface RunGenerationOptions {
  cwd?: string;
  /** Plan only, no generation. */
  dryRun?: boolean;
  /** Inject a chat client (tests / cloud). Default: real Ollama coder client. */
  client?: ChatClient;
  /** Reasoning client for the planner (default: same fleet, planner model). */
  plannerClient?: ChatClient;
  runner?: Runner;
  roles?: Partial<RoleConfig>;
  maxRetries?: number;
  /** Disable reading/writing the resume cache (tests). */
  noCache?: boolean;
  /** Where to persist generated files. Default: real fs under cwd. */
  sink?: WriteSink;
  /** File source for context assembly. Default: fs-backed. */
  source?: FileSource;
  onEvent?: (e: LoopEvent) => void;
}

interface CacheState {
  version: 1;
  name: string;
  completed: string[]; // unit ids that passed
  fellBack: string[];
}

/**
 * The engine entrypoint the CLI calls. Signature matches
 * {@link GenerationEngine.runGeneration}; extra options are optional.
 */
export async function runGeneration(
  plan: BuildPlan,
  hooks?: GenerationHooks,
  options: RunGenerationOptions = {},
): Promise<GenerationResult> {
  const cwd = resolve(options.cwd ?? process.cwd());
  const emit = makeEmitter(hooks, options.onEvent);

  // 1. Health check + model selection.
  const up = options.client ? true : await isOllamaUp();
  if (!up && !options.dryRun) {
    emit({
      type: "log",
      message:
        "Syntheon: local Ollama is not reachable at " +
        (process.env.OLLAMA_HOST ?? "http://localhost:11434") +
        ". Start Ollama (`ollama serve`) or pass --dry-run to plan only.",
    });
    return {
      ok: false,
      generated: 0,
      failed: plan.units.length,
      fellBackToTemplate: [],
    };
  }

  const roles = resolveRoles(options.roles);
  if (!options.client && up) {
    const available = await listOllamaModels();
    roles.coder = pickModelForRole("coder", roles, available);
    roles.planner = pickModelForRole("planner", roles, available);
  }

  // 2. Plan (always runs — deterministic even without a model).
  const plannerClient =
    options.plannerClient ??
    options.client ??
    (up ? new OllamaClient({ defaultModel: roles.planner, label: "planner" }) : undefined);

  const ordered = await planUnits(plan, {
    client: plannerClient,
    roles,
    onLog: (m) => emit({ type: "log", message: m }),
  });
  emit({
    type: "plan",
    message: `Planned ${ordered.length} unit(s) for "${plan.blueprint.name}".`,
  });

  if (options.dryRun) {
    for (const u of ordered) {
      emit({
        type: "log",
        message: `  [${u.order}] ${u.kind} ${u.path}`,
      });
    }
    emit({ type: "done", message: "Dry run: plan only, nothing generated." });
    return {
      ok: true,
      generated: 0,
      failed: 0,
      fellBackToTemplate: [],
    };
  }

  // 3. Resume cache.
  const cachePath = join(cwd, "studio", ".cache", `${slug(plan.blueprint.name)}.json`);
  const cache = options.noCache ? emptyCache(plan) : loadCache(cachePath, plan);
  const completed = new Set(cache.completed);
  const remaining = ordered.filter((u) => !completed.has(u.id));
  if (completed.size) {
    emit({
      type: "log",
      message: `Resuming: ${completed.size} unit(s) already green, ${remaining.length} to go.`,
    });
  }

  // 4. Coder client + sink/source.
  const coderClient =
    options.client ??
    new OllamaClient({ defaultModel: roles.coder, label: "coder" });

  const memory = new Map<string, string>();
  const source: FileSource = options.source ?? memoryFileSource(memory);
  const sink: WriteSink =
    options.sink ?? fsWriteSink(cwd, memory);

  const loopOpts: RepairLoopOptions = {
    client: coderClient,
    cwd,
    source,
    sink,
    runner: options.runner,
    roles,
    maxRetries: options.maxRetries,
    onEvent: emit,
  };

  // 5. Run the loop, persisting progress after each unit.
  const outcomes: UnitOutcome[] = [];
  for (const unit of remaining) {
    const [o] = await runRepairLoop([unit], loopOpts);
    outcomes.push(o);
    if (o.ok) cache.completed.push(o.unit.id);
    if (o.fellBackToTemplate) cache.fellBack.push(o.unit.id);
    if (!options.noCache) saveCache(cachePath, cache);
  }

  const generated = outcomes.filter((o) => o.ok).length;
  const fellBack = outcomes.filter((o) => o.fellBackToTemplate).map((o) => o.unit.id);
  const failed = outcomes.filter((o) => !o.ok).length;

  // 6. Whole-project checkpoint (best-effort; reported, not fatal to summary).
  emit({ type: "log", message: "Running full-project verification checkpoint..." });
  const project = await verifyProject(cwd, options.runner);
  emit({
    type: "done",
    ok: project.ok,
    verdict: project,
    message: project.ok
      ? `Build green. Generated ${generated}, fell back ${fellBack.length}.`
      : `Build has ${project.errors.length} project-level issue(s); ${fellBack.length} unit(s) flagged.`,
  });

  return {
    ok: project.ok && failed === 0,
    generated,
    failed,
    fellBackToTemplate: fellBack,
  };
}

/** The engine object the CLI can import as a GenerationEngine. */
export const engine = { runGeneration };

// ---------------------------------------------------------------------------
// cache + sinks
// ---------------------------------------------------------------------------

function loadCache(path: string, plan: BuildPlan): CacheState {
  if (existsSync(path)) {
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as CacheState;
      if (parsed.name === plan.blueprint.name) return parsed;
    } catch {
      // corrupt cache — start fresh
    }
  }
  return emptyCache(plan);
}

function emptyCache(plan: BuildPlan): CacheState {
  return { version: 1, name: plan.blueprint.name, completed: [], fellBack: [] };
}

function saveCache(path: string, state: CacheState): void {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(state, null, 2), "utf8");
  } catch {
    // non-fatal: cache is an optimization
  }
}

/** A sink that writes to disk under cwd and mirrors into the context memory. */
function fsWriteSink(cwd: string, memory: Map<string, string>): WriteSink {
  return {
    write(path, code) {
      memory.set(norm(path), code);
      const abs = join(cwd, path);
      try {
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(abs, code, "utf8");
      } catch {
        // if the fs write fails, the in-memory copy still lets gates run
      }
    },
    loadTemplate(templateId) {
      const abs = join(cwd, "studio", "templates", templateId);
      try {
        return existsSync(abs) ? readFileSync(abs, "utf8") : undefined;
      } catch {
        return undefined;
      }
    },
  };
}

function makeEmitter(
  hooks: GenerationHooks | undefined,
  extra: ((e: LoopEvent) => void) | undefined,
): (e: LoopEvent) => void {
  return (e: LoopEvent) => {
    extra?.(e);
    if (!hooks) return;
    if (e.type === "unit-start" && e.unit) hooks.onUnitStart?.(e.unit);
    else if (e.type === "unit-done" && e.unit) hooks.onUnitDone?.(e.unit, e.ok ?? false);
    else if (e.type === "fallback" && e.unit) hooks.onUnitDone?.(e.unit, false);
    hooks.onLog?.(e.message);
  };
}

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "app";
}

function norm(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}
