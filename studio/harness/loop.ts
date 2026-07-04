/**
 * Syntheon — the repair loop (DESIGN.md §4 + §8).
 *
 * For each unit: generate → run scoped fast gates → on failure feed the code +
 * diagnostics back to the coder and regenerate (bounded retries, default 6) →
 * on exhaustion fall back to the unit's curated template and flag it → on
 * success integrate and continue. Emits progress events for the CLI to stream.
 *
 * Also exposes {@link verifyProject}, which runs all four gates on the whole
 * repo and returns a clean/dirty verdict.
 *
 * The loop takes an injected {@link ChatClient} and {@link Runner}, so it is
 * fully testable without a live model or real tooling.
 */

import type {
  GenerationUnit,
  UnitOutcome,
  LoopEvent,
  LoopEventSink,
  HarnessVerdict,
} from "../ai/contracts.js";
import type { ChatClient } from "../ai/ollama.js";
import type { FileSource } from "../ai/context.js";
import { assembleContext } from "../ai/context.js";
import {
  generateUnit,
  looksLikeCode,
  type CoderOptions,
} from "../ai/coder.js";
import type { RoleConfig } from "../ai/roles.js";
import {
  runGates,
  FAST_GATES,
  FULL_GATES,
  type GateContext,
  type Runner,
} from "./gates.js";

export interface WriteSink {
  /** Persist a unit's code (real fs, or an in-memory map in tests). */
  write(path: string, code: string): void;
  /** Load a unit's curated template for fallback; undefined if none. */
  loadTemplate?(templateId: string): string | undefined;
}

export interface RepairLoopOptions {
  client: ChatClient;
  cwd: string;
  /** File source used to assemble per-unit context (updated as units land). */
  source: FileSource;
  /** Where generated code is persisted. */
  sink: WriteSink;
  /** Command runner for gates (default execa). */
  runner?: Runner;
  roles?: Partial<RoleConfig>;
  /** Max coder attempts per unit before template fallback. Default 6. */
  maxRetries?: number;
  /** Which gates to run per unit. Default FAST_GATES (no next build). */
  perUnitGates?: typeof FAST_GATES;
  /** Progress sink. */
  onEvent?: LoopEventSink;
  /** Per-generation timeout. */
  timeoutMs?: number;
}

const DEFAULT_MAX_RETRIES = 6;

/**
 * Generate and repair a single unit until the fast gates pass or retries are
 * exhausted (then fall back to template + flag). Writes the accepted code via
 * the sink and returns the outcome.
 */
export async function generateAndRepairUnit(
  unit: GenerationUnit,
  opts: RepairLoopOptions,
): Promise<UnitOutcome> {
  const emit = opts.onEvent ?? (() => {});
  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;
  const perUnit = opts.perUnitGates ?? FAST_GATES;
  const coderOpts: CoderOptions = {
    client: opts.client,
    roles: opts.roles,
    timeoutMs: opts.timeoutMs,
  };

  emit({ type: "unit-start", unit, message: `Generating ${unit.path}` });

  let previousCode = "";
  let lastVerdict: HarnessVerdict | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    emit({
      type: "attempt",
      unit,
      attempt,
      message: `Attempt ${attempt}/${maxRetries} for ${unit.path}`,
    });

    const ctx = assembleContext(unit, opts.source);
    let candidate;
    try {
      candidate = await generateUnit(
        unit,
        ctx,
        coderOpts,
        attempt === 1 || !previousCode
          ? undefined
          : { previousCode, diagnostics: lastVerdict?.errors ?? [] },
      );
    } catch (err) {
      emit({
        type: "log",
        unit,
        message: `Coder error on ${unit.path}: ${msg(err)}`,
      });
      continue; // try again until retries exhaust
    }

    if (!looksLikeCode(candidate.code)) {
      emit({
        type: "log",
        unit,
        message: `Attempt ${attempt}: model returned no usable code.`,
      });
      previousCode = candidate.code || previousCode;
      continue;
    }

    // Write the candidate so scoped gates can see it, then verify.
    opts.sink.write(unit.path, candidate.code);
    previousCode = candidate.code;

    const gateCtx: GateContext = {
      cwd: opts.cwd,
      runner: opts.runner,
      files: [unit.path, ...(unit.dependsOn ?? [])],
    };
    const verdict = await runGates(gateCtx, perUnit);
    lastVerdict = verdict;
    emit({
      type: "gate",
      unit,
      attempt,
      ok: verdict.ok,
      verdict,
      message: verdict.ok
        ? `Gates green for ${unit.path}`
        : `${verdict.errors.length} error(s) on ${unit.path}`,
    });

    if (verdict.ok) {
      emit({
        type: "unit-done",
        unit,
        ok: true,
        message: `Accepted ${unit.path} after ${attempt} attempt(s).`,
      });
      return {
        unit,
        ok: true,
        attempts: attempt,
        fellBackToTemplate: false,
        code: candidate.code,
      };
    }
  }

  // Exhausted: fall back to curated template, flag for review.
  const template = unit.template
    ? opts.sink.loadTemplate?.(unit.template)
    : undefined;
  if (template) {
    opts.sink.write(unit.path, template);
    emit({
      type: "fallback",
      unit,
      ok: false,
      message: `Fell back to template "${unit.template}" for ${unit.path} (flagged).`,
    });
    return {
      unit,
      ok: false,
      attempts: maxRetries,
      fellBackToTemplate: true,
      code: template,
      remaining: lastVerdict?.errors,
    };
  }

  emit({
    type: "fallback",
    unit,
    ok: false,
    message: `Exhausted retries for ${unit.path} with no template — flagged.`,
  });
  return {
    unit,
    ok: false,
    attempts: maxRetries,
    fellBackToTemplate: false,
    code: previousCode || undefined,
    remaining: lastVerdict?.errors,
  };
}

/**
 * Run the repair loop across an ordered unit list. Stops nothing on failure —
 * a failing unit falls back and the build proceeds so the tree never stays red.
 */
export async function runRepairLoop(
  units: GenerationUnit[],
  opts: RepairLoopOptions,
): Promise<UnitOutcome[]> {
  const emit = opts.onEvent ?? (() => {});
  const outcomes: UnitOutcome[] = [];
  emit({
    type: "plan",
    message: `Repair loop over ${units.length} unit(s).`,
  });
  for (const unit of units) {
    outcomes.push(await generateAndRepairUnit(unit, opts));
  }
  const ok = outcomes.filter((o) => o.ok).length;
  emit({
    type: "done",
    message: `Loop complete: ${ok}/${units.length} units green.`,
  });
  return outcomes;
}

/**
 * Run all four gates on the whole project (DESIGN.md §8 checkpoint) and return
 * a clean/dirty verdict.
 */
export async function verifyProject(
  cwd: string,
  runner?: Runner,
): Promise<HarnessVerdict> {
  return runGates({ cwd, runner }, FULL_GATES, /*continueOnFail*/ true);
}

/** Adapt a LoopEventSink into the GenerationHooks the CLI passes. */
export function toHookAdapter(
  onEvent: LoopEventSink,
): (e: LoopEvent) => void {
  return onEvent;
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
