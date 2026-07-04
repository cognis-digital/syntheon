import { describe, it, expect, afterEach } from "vitest";
import {
  DEFAULT_ROLES,
  resolveRoles,
  pickModelForRole,
} from "./roles.js";

const ENV_KEYS = [
  "SYNTHEON_MODEL_PLANNER",
  "SYNTHEON_MODEL_CODER",
  "SYNTHEON_MODEL_COPYWRITER",
  "SYNTHEON_MODEL_VISION",
];

afterEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
});

describe("resolveRoles", () => {
  it("returns the default fleet with no overrides", () => {
    const r = resolveRoles();
    expect(r.planner).toBe(DEFAULT_ROLES.planner);
    expect(r.coder).toContain("OmniCoder");
    expect(r.copywriter).toBe("qwen3:latest");
    expect(r.vision).toBe("llava:latest");
  });

  it("applies env overrides", () => {
    process.env.SYNTHEON_MODEL_CODER = "custom-coder";
    expect(resolveRoles().coder).toBe("custom-coder");
  });

  it("applies explicit overrides above env", () => {
    process.env.SYNTHEON_MODEL_PLANNER = "env-planner";
    expect(resolveRoles({ planner: "arg-planner" }).planner).toBe("arg-planner");
  });

  it("merges temperature overrides without dropping defaults", () => {
    const r = resolveRoles({ temperature: { coder: 0.05 } as never });
    expect(r.temperature.coder).toBe(0.05);
    expect(r.temperature.planner).toBe(DEFAULT_ROLES.temperature.planner);
  });

  it("does not mutate DEFAULT_ROLES", () => {
    resolveRoles({ coder: "x" });
    expect(DEFAULT_ROLES.coder).toContain("OmniCoder");
  });
});

describe("pickModelForRole", () => {
  const roles = resolveRoles();

  it("returns the primary when available", () => {
    expect(pickModelForRole("planner", roles, [roles.planner])).toBe(roles.planner);
  });

  it("falls back to a secondary when the primary is absent", () => {
    expect(pickModelForRole("planner", roles, ["qwen3:latest"])).toBe("qwen3:latest");
  });

  it("returns the primary when the available list is empty (unknown fleet)", () => {
    expect(pickModelForRole("coder", roles, [])).toBe(roles.coder);
  });

  it("returns primary when neither primary nor fallbacks are available", () => {
    expect(pickModelForRole("vision", roles, ["something-else"])).toBe(roles.vision);
  });
});
