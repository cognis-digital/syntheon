/**
 * Syntheon playground — the generation simulation model.
 *
 * A deterministic, pure description of the pipeline the real harness runs for
 * every unit: PLAN → GENERATE → VERIFY (tsc · lint · test · build) → GREEN.
 * The UI advances an index through {@link SIMULATION_STEPS} on a timer; this
 * module has no timers or DOM of its own so the phase logic stays testable.
 *
 * It is explicitly a *preview* — timings are illustrative, not measured — but
 * the stages and gate names are exactly the ones the harness enforces.
 */

/** The four verification gates, in the order the harness runs them. */
export const VERIFY_GATES = ["typecheck", "lint", "test", "build"] as const;
export type VerifyGate = (typeof VERIFY_GATES)[number];

export type SimulationPhase = "plan" | "generate" | "verify" | "green";

/** One discrete step in the animated pipeline. */
export interface SimulationStep {
  phase: SimulationPhase;
  /** Short label shown in the pipeline log. */
  label: string;
  /** Which gate this step exercises (verify phase only). */
  gate?: VerifyGate;
  /** Suggested dwell time in ms (illustrative — the UI may scale it). */
  ms: number;
}

/** The canonical, ordered step list the pipeline plays through. */
export const SIMULATION_STEPS: readonly SimulationStep[] = [
  { phase: "plan", label: "Resolving blueprint → ordered unit plan", ms: 600 },
  { phase: "generate", label: "Generating units with the local model", ms: 900 },
  { phase: "verify", label: "tsc --noEmit", gate: "typecheck", ms: 700 },
  { phase: "verify", label: "eslint (0 errors)", gate: "lint", ms: 600 },
  { phase: "verify", label: "vitest run", gate: "test", ms: 700 },
  { phase: "verify", label: "next build", gate: "build", ms: 800 },
  { phase: "green", label: "All gates green — app ready", ms: 1200 },
] as const;

/** The number of discrete steps in the pipeline. */
export const STEP_COUNT = SIMULATION_STEPS.length;

/** The index of the terminal GREEN step. */
export const GREEN_INDEX = SIMULATION_STEPS.length - 1;

/**
 * A snapshot of pipeline status for a given step index. `stepIndex` clamps to
 * the valid range; anything `>= GREEN_INDEX` reports a fully green build.
 */
export interface SimulationStatus {
  phase: SimulationPhase;
  activeLabel: string;
  /** 0–100 progress across the whole pipeline. */
  percent: number;
  /** Per-gate pass state — true once that gate's step has completed. */
  gates: Record<VerifyGate, boolean>;
  /** True at the terminal GREEN step. */
  done: boolean;
}

/** Derive a UI-ready status snapshot from a raw step index. */
export function statusAt(stepIndex: number): SimulationStatus {
  const idx = Math.max(0, Math.min(stepIndex, GREEN_INDEX));
  const step = SIMULATION_STEPS[idx];
  const done = idx >= GREEN_INDEX;
  const gates = {} as Record<VerifyGate, boolean>;
  for (const gate of VERIFY_GATES) {
    const gateStepIndex = SIMULATION_STEPS.findIndex((s) => s.gate === gate);
    gates[gate] = done || idx > gateStepIndex;
  }
  return {
    phase: step.phase,
    activeLabel: step.label,
    percent: Math.round((idx / GREEN_INDEX) * 100),
    gates,
    done,
  };
}

/** Whether an index sits at or past the terminal state. */
export function isComplete(stepIndex: number): boolean {
  return stepIndex >= GREEN_INDEX;
}
