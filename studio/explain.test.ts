import { describe, it, expect, afterEach } from "vitest";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseArgs, main } from "./cli.js";
import type { BuildBlueprint } from "./types.js";

const validBlueprint: BuildBlueprint = {
  version: 1,
  name: "temp-app",
  projectType: "saas",
  features: [{ featureId: "page-landing" }, { featureId: "pay-stripe" }],
  theme: { brandColor: "262 83% 58%", radius: "0.65rem", font: "inter", darkMode: true },
};

const tmpDirs: string[] = [];
function writeConfig(obj: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), "syntheon-explain-"));
  tmpDirs.push(dir);
  const path = join(dir, "syntheon.config.json");
  writeFileSync(path, JSON.stringify(obj, null, 2), "utf8");
  return path;
}

/** Run main() while capturing everything written to stdout/stderr. */
async function capture(
  argv: string[],
): Promise<{ code: number; out: string; err: string }> {
  let out = "";
  let err = "";
  const origOut = process.stdout.write.bind(process.stdout);
  const origErr = process.stderr.write.bind(process.stderr);
  process.stdout.write = ((chunk: string | Uint8Array) => {
    out += chunk.toString();
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array) => {
    err += chunk.toString();
    return true;
  }) as typeof process.stderr.write;
  try {
    const code = await main(argv);
    return { code, out, err };
  } finally {
    process.stdout.write = origOut;
    process.stderr.write = origErr;
  }
}

afterEach(() => {
  while (tmpDirs.length) {
    const d = tmpDirs.pop()!;
    try {
      rmSync(d, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  }
});

describe("cli argv — new commands", () => {
  it("parses `explain`", () => {
    expect(parseArgs(["explain"]).command).toBe("explain");
  });
  it("parses `doctor`", () => {
    expect(parseArgs(["doctor"]).command).toBe("doctor");
  });
  it("parses `--json`", () => {
    expect(parseArgs(["explain", "--json"]).json).toBe(true);
    expect(parseArgs(["explain"]).json).toBe(false);
  });
  it("carries --json onto build/add dry-runs", () => {
    const a = parseArgs(["build", "--dry-run", "--json"]);
    expect(a.command).toBe("build");
    expect(a.dryRun).toBe(true);
    expect(a.json).toBe(true);
  });
});

describe("explain command", () => {
  it("emits a valid serialized plan as JSON with --yes --json", async () => {
    const { code, out } = await capture(["explain", "--yes", "--json"]);
    expect(code).toBe(0);
    const parsed = JSON.parse(out);
    expect(parsed.blueprint.name).toBe("my-syntheon-app");
    expect(parsed.units.length).toBeGreaterThan(0);
    expect(parsed.analysis.unitCount).toBe(parsed.units.length);
    // The default SaaS carries paid integrations.
    expect(parsed.analysis.paidIntegrations.length).toBeGreaterThan(0);
  });

  it("prints a human report (no JSON) without --json", async () => {
    const { code, out } = await capture(["explain", "--yes"]);
    expect(code).toBe(0);
    expect(out).toContain("Generation units");
    expect(out).toContain("Plan for");
    // Not JSON.
    expect(() => JSON.parse(out)).toThrow();
  });

  it("explains a config file passed with --config", async () => {
    const path = writeConfig(validBlueprint);
    const { code, out } = await capture(["explain", "--config", path, "--json"]);
    expect(code).toBe(0);
    const parsed = JSON.parse(out);
    expect(parsed.blueprint.name).toBe("temp-app");
    expect(parsed.integrations.some((i: { id: string }) => i.id === "stripe")).toBe(true);
  });

  it("fails cleanly with a JSON error when no blueprint is available", async () => {
    const missing = join(tmpdir(), "definitely-missing-syntheon.config.json");
    const { code, out } = await capture(["explain", "--config", missing, "--json"]);
    expect(code).toBe(1);
    const parsed = JSON.parse(out);
    expect(parsed.ok).toBe(false);
    expect(typeof parsed.error).toBe("string");
  });
});

describe("doctor command", () => {
  it("reports a healthy registry with --yes --json (exit 0)", async () => {
    const { code, out } = await capture(["doctor", "--yes", "--json"]);
    expect(code).toBe(0);
    const parsed = JSON.parse(out);
    expect(parsed.ok).toBe(true);
    expect(parsed.registry.ok).toBe(true);
    expect(parsed.registry.problems).toEqual([]);
    expect(parsed.config.ok).toBe(true);
  });

  it("prints a human health report without --json", async () => {
    const { code, out } = await capture(["doctor", "--yes"]);
    expect(code).toBe(0);
    expect(out).toContain("Registry: OK");
    expect(out).toContain("All checks passed.");
  });

  it("treats a missing config as 'not checked' but still passes the registry", async () => {
    const missing = join(tmpdir(), "definitely-missing-syntheon.config.json");
    const { code, out } = await capture(["doctor", "--config", missing, "--json"]);
    expect(code).toBe(0);
    const parsed = JSON.parse(out);
    expect(parsed.ok).toBe(true);
    expect(parsed.config.checked).toBe(false);
  });

  it("flags an invalid config (unknown feature id) and exits non-zero", async () => {
    const bad = writeConfig({ ...validBlueprint, features: [{ featureId: "no-such-feature" }] });
    const { code, out } = await capture(["doctor", "--config", bad, "--json"]);
    expect(code).toBe(1);
    const parsed = JSON.parse(out);
    expect(parsed.ok).toBe(false);
    expect(parsed.config.ok).toBe(false);
    expect(typeof parsed.config.error).toBe("string");
  });

  it("flags a structurally malformed config (bad theme) and exits non-zero", async () => {
    const bad = writeConfig({ ...validBlueprint, theme: { brandColor: "not-hsl", radius: "x", font: "inter", darkMode: true } });
    const { code } = await capture(["doctor", "--config", bad, "--json"]);
    expect(code).toBe(1);
  });
});

describe("build/add dry-run --json (pure JSON, no banner)", () => {
  it("build --yes --dry-run --json emits a parseable plan and nothing else", async () => {
    const { code, out } = await capture(["build", "--yes", "--dry-run", "--json"]);
    expect(code).toBe(0);
    // The whole stdout must be valid JSON — no clack banner leaked in.
    const parsed = JSON.parse(out);
    expect(parsed.units.length).toBeGreaterThan(0);
    expect(parsed.analysis.unitCount).toBe(parsed.units.length);
  });

  it("add <feature> --dry-run --json emits only that feature's new units", async () => {
    const { code, out } = await capture(["add", "page-blog", "--dry-run", "--json"]);
    expect(code).toBe(0);
    const parsed = JSON.parse(out);
    const paths = parsed.units.map((u: { path: string }) => u.path);
    expect(paths).toContain("app/(marketing)/blog/page.tsx");
    // The always-present app shell is not part of an addition.
    expect(paths).not.toContain("app/layout.tsx");
  });

  it("add of an unknown feature returns a JSON error and exits non-zero", async () => {
    const { code, out } = await capture(["add", "no-such-feature", "--dry-run", "--json"]);
    expect(code).toBe(1);
    const parsed = JSON.parse(out);
    expect(parsed.ok).toBe(false);
  });
});
