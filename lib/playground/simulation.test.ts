import { describe, it, expect } from "vitest";

import {
  GREEN_INDEX,
  isComplete,
  SIMULATION_STEPS,
  STEP_COUNT,
  statusAt,
  VERIFY_GATES,
} from "./simulation";

describe("playground simulation", () => {
  it("runs plan → generate → verify(×4) → green in order", () => {
    const phases = SIMULATION_STEPS.map((s) => s.phase);
    expect(phases[0]).toBe("plan");
    expect(phases[1]).toBe("generate");
    expect(phases.at(-1)).toBe("green");
    const verifySteps = SIMULATION_STEPS.filter((s) => s.phase === "verify");
    expect(verifySteps.map((s) => s.gate)).toEqual([...VERIFY_GATES]);
  });

  it("GREEN_INDEX is the last step and STEP_COUNT matches", () => {
    expect(STEP_COUNT).toBe(SIMULATION_STEPS.length);
    expect(GREEN_INDEX).toBe(SIMULATION_STEPS.length - 1);
  });

  it("no gate is green at the very start", () => {
    const status = statusAt(0);
    expect(status.phase).toBe("plan");
    expect(status.percent).toBe(0);
    expect(Object.values(status.gates).every((g) => !g)).toBe(true);
    expect(status.done).toBe(false);
  });

  it("gates flip green only after their verify step completes", () => {
    const typecheckIdx = SIMULATION_STEPS.findIndex(
      (s) => s.gate === "typecheck",
    );
    // On the typecheck step itself it is not yet passed…
    expect(statusAt(typecheckIdx).gates.typecheck).toBe(false);
    // …but once we advance past it, it is.
    expect(statusAt(typecheckIdx + 1).gates.typecheck).toBe(true);
  });

  it("reports every gate green and done at the terminal step", () => {
    const status = statusAt(GREEN_INDEX);
    expect(status.done).toBe(true);
    expect(status.percent).toBe(100);
    expect(Object.values(status.gates).every((g) => g)).toBe(true);
  });

  it("clamps out-of-range indices", () => {
    expect(statusAt(-5).phase).toBe("plan");
    expect(statusAt(999).done).toBe(true);
    expect(isComplete(GREEN_INDEX)).toBe(true);
    expect(isComplete(0)).toBe(false);
  });
});
