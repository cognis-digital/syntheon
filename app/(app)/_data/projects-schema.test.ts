import { describe, it, expect } from "vitest";

import {
  parseProjectForm,
  projectFormSchema,
  PROJECT_TYPES,
  PROJECT_STATUSES,
  STATUS_META,
} from "./projects-schema";

describe("projects schema", () => {
  it("accepts a valid payload and applies defaults", () => {
    const result = parseProjectForm({ name: "Nova" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.values.name).toBe("Nova");
      expect(result.values.type).toBe("SaaS");
      expect(result.values.status).toBe("draft");
      expect(result.values.description).toBe("");
    }
  });

  it("rejects a too-short name with a field error", () => {
    const result = parseProjectForm({ name: "N" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toMatch(/2 characters/);
  });

  it("rejects an unknown type", () => {
    const result = parseProjectForm({ name: "Nova", type: "Nope" });
    expect(result.ok).toBe(false);
  });

  it("trims the name via the schema", () => {
    const parsed = projectFormSchema.parse({ name: "  Nova  " });
    expect(parsed.name).toBe("Nova");
  });

  it("has status metadata for every status", () => {
    for (const s of PROJECT_STATUSES) {
      expect(STATUS_META[s]).toBeDefined();
      expect(STATUS_META[s].label.length).toBeGreaterThan(0);
    }
  });

  it("exposes a non-empty type catalog", () => {
    expect(PROJECT_TYPES.length).toBeGreaterThan(0);
    expect(PROJECT_TYPES).toContain("SaaS");
  });
});
