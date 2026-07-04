import { describe, it, expect } from "vitest";

import { parseArgs, renderFeatureList } from "./cli.js";
import { resolveFeatureAddition } from "./registry/index.js";
import { runGeneration } from "./ai/generate.js";
import { memoryFileSource, type FileSource } from "./ai/context.js";
import type { WriteSink } from "./harness/loop.js";
import {
  FakeChatClient,
  FakeRunner,
  allGreen,
  fencedCode,
  SAMPLE_COMPONENT,
} from "./ai/__testkit.js";

function memSink(memory: Map<string, string>): WriteSink {
  return { write: (p, c) => memory.set(p, c), loadTemplate: () => undefined };
}

describe("studio add — argv parsing", () => {
  it("parses `add <feature>`", () => {
    const args = parseArgs(["add", "page-blog"]);
    expect(args.command).toBe("add");
    expect(args.featureId).toBe("page-blog");
    expect(args.list).toBe(false);
  });

  it("parses `add --list`", () => {
    const args = parseArgs(["add", "--list"]);
    expect(args.command).toBe("add");
    expect(args.list).toBe(true);
    expect(args.featureId).toBeUndefined();
  });

  it("parses `add <feature> --dry-run`", () => {
    const args = parseArgs(["add", "pay-stripe", "--dry-run"]);
    expect(args.featureId).toBe("pay-stripe");
    expect(args.dryRun).toBe(true);
  });

  it("does not treat a leading flag as the feature id", () => {
    const args = parseArgs(["add", "--dry-run", "page-blog"]);
    expect(args.featureId).toBe("page-blog");
    expect(args.dryRun).toBe(true);
  });
});

describe("studio add — feature list", () => {
  it("lists addable features and excludes core", () => {
    const list = renderFeatureList();
    expect(list).toContain("page-blog");
    expect(list).toContain("pay-stripe");
    expect(list).not.toContain("core-app-shell");
  });
});

describe("studio add — end to end through the engine (fake model)", () => {
  it("generates only the new feature's units and verifies them green", async () => {
    const plan = resolveFeatureAddition("page-blog");
    expect(plan.units.length).toBeGreaterThan(0);

    const memory = new Map<string, string>();
    const source: FileSource = memoryFileSource(memory);
    const res = await runGeneration(plan, undefined, {
      // One scripted response reused for every unit; the fake runner reports
      // all four gates green, so each unit is accepted on the first attempt.
      client: new FakeChatClient([fencedCode(SAMPLE_COMPONENT)]),
      runner: new FakeRunner(allGreen()).runner,
      source,
      sink: memSink(memory),
      noCache: true,
    });

    expect(res.ok).toBe(true);
    expect(res.failed).toBe(0);
    expect(res.generated).toBe(plan.units.length);
    // The blog route was written by the loop.
    expect(memory.has("app/(marketing)/blog/page.tsx")).toBe(true);
  });

  it("repairs a unit that first fails a gate, then reports success", async () => {
    const plan = resolveFeatureAddition("page-blog");
    const memory = new Map<string, string>();

    // tsc fails once (per unit) then passes → the loop repairs and accepts.
    const runner = new FakeRunner({
      tsc: [
        { exitCode: 2, stdout: "x.tsx(1,1): error TS2345: nope.", stderr: "" },
        { exitCode: 0, stdout: "", stderr: "" },
      ],
      eslint: [{ exitCode: 0, stdout: "[]", stderr: "" }],
      vitest: [{ exitCode: 0, stdout: '{"success":true,"numFailedTests":0}', stderr: "" }],
      "next-build": [{ exitCode: 0, stdout: "", stderr: "" }],
    }).runner;

    const res = await runGeneration(plan.units.length ? { ...plan, units: plan.units.slice(0, 1) } : plan, undefined, {
      client: new FakeChatClient([fencedCode(SAMPLE_COMPONENT)]),
      runner,
      source: memoryFileSource(memory),
      sink: memSink(memory),
      noCache: true,
      maxRetries: 3,
    });

    expect(res.ok).toBe(true);
    expect(res.generated).toBe(1);
  });
});
