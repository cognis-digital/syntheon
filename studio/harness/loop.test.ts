import { describe, it, expect } from "vitest";
import {
  generateAndRepairUnit,
  runRepairLoop,
  verifyProject,
  type RepairLoopOptions,
  type WriteSink,
} from "./loop.js";
import { memoryFileSource } from "../ai/context.js";
import {
  FakeChatClient,
  FakeRunner,
  allGreen,
  tscFailThenPass,
  fencedCode,
  unit,
  SAMPLE_COMPONENT,
  OK,
} from "../ai/__testkit.js";
import type { LoopEvent } from "../ai/contracts.js";
import type { GateTool, RunResult } from "./gates.js";

function harness(over: {
  responses: string[];
  gates: Partial<Record<GateTool, RunResult[]>>;
  maxRetries?: number;
  templates?: Record<string, string>;
}) {
  const memory = new Map<string, string>();
  const source = memoryFileSource(memory);
  const written: Record<string, string> = {};
  const sink: WriteSink = {
    write: (p, c) => {
      written[p] = c;
      memory.set(p, c);
    },
    loadTemplate: (id) => over.templates?.[id],
  };
  const fakeRunner = new FakeRunner(over.gates);
  const events: LoopEvent[] = [];
  const opts: RepairLoopOptions = {
    client: new FakeChatClient(over.responses),
    cwd: ".",
    source,
    sink,
    runner: fakeRunner.runner,
    maxRetries: over.maxRetries,
    onEvent: (e) => events.push(e),
  };
  return { opts, written, events, fakeRunner };
}

describe("generateAndRepairUnit", () => {
  it("accepts a unit on the first attempt when gates are green", async () => {
    const { opts, written, events } = harness({
      responses: [fencedCode(SAMPLE_COMPONENT)],
      gates: allGreen(),
    });
    const outcome = await generateAndRepairUnit(unit("components/ui/widget.tsx"), opts);
    expect(outcome.ok).toBe(true);
    expect(outcome.attempts).toBe(1);
    expect(outcome.fellBackToTemplate).toBe(false);
    expect(written["components/ui/widget.tsx"]).toContain("Widget");
    expect(events.some((e) => e.type === "unit-done" && e.ok)).toBe(true);
  });

  it("repairs after a failing gate then succeeds", async () => {
    const { opts, events } = harness({
      responses: [fencedCode("export const bad = 1;"), fencedCode(SAMPLE_COMPONENT)],
      gates: tscFailThenPass(),
    });
    const outcome = await generateAndRepairUnit(unit("app/x.tsx"), opts);
    expect(outcome.ok).toBe(true);
    expect(outcome.attempts).toBe(2);
    const gateEvents = events.filter((e) => e.type === "gate");
    expect(gateEvents[0].ok).toBe(false);
    expect(gateEvents[1].ok).toBe(true);
  });

  it("feeds diagnostics back to the coder on the repair pass", async () => {
    const client = new FakeChatClient([
      fencedCode("export const bad = 1;"),
      fencedCode(SAMPLE_COMPONENT),
    ]);
    const memory = new Map<string, string>();
    const written: Record<string, string> = {};
    const fakeRunner = new FakeRunner(tscFailThenPass());
    await generateAndRepairUnit(unit("app/x.tsx"), {
      client,
      cwd: ".",
      source: memoryFileSource(memory),
      sink: { write: (p, c) => { written[p] = c; memory.set(p, c); } },
      runner: fakeRunner.runner,
    });
    // Second coder call must contain the failing diagnostics text.
    const secondCall = client.calls[1];
    const joined = secondCall.messages.map((m) => m.content).join("\n");
    expect(joined).toContain("TS2345");
    expect(joined).toContain("harness rejected");
  });

  it("falls back to template after exhausting retries", async () => {
    const { opts, written, events } = harness({
      responses: [fencedCode("export const stillBad = 1;")],
      gates: {
        tsc: [{ exitCode: 2, stdout: "app/x.tsx(1,1): error TS2345: no.", stderr: "" }],
      },
      maxRetries: 3,
      templates: { "widget.tpl.tsx": "export const FROM_TEMPLATE = true;" },
    });
    const outcome = await generateAndRepairUnit(
      unit("app/x.tsx", { template: "widget.tpl.tsx" }),
      opts,
    );
    expect(outcome.ok).toBe(false);
    expect(outcome.fellBackToTemplate).toBe(true);
    expect(outcome.attempts).toBe(3);
    expect(written["app/x.tsx"]).toContain("FROM_TEMPLATE");
    expect(events.some((e) => e.type === "fallback")).toBe(true);
  });

  it("flags exhaustion with no template (no fallback code)", async () => {
    const { opts, events } = harness({
      responses: [fencedCode("export const stillBad = 1;")],
      gates: { tsc: [{ exitCode: 2, stdout: "app/x.tsx(1,1): error TS1: no.", stderr: "" }] },
      maxRetries: 2,
    });
    const outcome = await generateAndRepairUnit(unit("app/x.tsx"), opts);
    expect(outcome.ok).toBe(false);
    expect(outcome.fellBackToTemplate).toBe(false);
    expect(events.some((e) => e.type === "fallback")).toBe(true);
  });

  it("retries when the model returns non-code, then a template rescues", async () => {
    const { opts, written } = harness({
      responses: ["I cannot help with that."], // never usable
      gates: allGreen(),
      maxRetries: 2,
      templates: { "t.tpl": "export const T = 1;" },
    });
    const outcome = await generateAndRepairUnit(
      unit("app/y.tsx", { template: "t.tpl" }),
      opts,
    );
    expect(outcome.fellBackToTemplate).toBe(true);
    expect(written["app/y.tsx"]).toContain("export const T");
  });

  it("survives a coder that throws and keeps retrying", async () => {
    const { opts } = harness({
      responses: ["__THROW__", fencedCode(SAMPLE_COMPONENT)],
      gates: allGreen(),
      maxRetries: 3,
    });
    const outcome = await generateAndRepairUnit(unit("components/ui/z.tsx"), opts);
    expect(outcome.ok).toBe(true);
    expect(outcome.attempts).toBe(2);
  });
});

describe("runRepairLoop", () => {
  it("processes all units and reports per-unit outcomes", async () => {
    const { opts, events } = harness({
      responses: [fencedCode(SAMPLE_COMPONENT)],
      gates: allGreen(),
    });
    const outcomes = await runRepairLoop(
      [unit("components/ui/a.tsx"), unit("components/ui/b.tsx")],
      opts,
    );
    expect(outcomes).toHaveLength(2);
    expect(outcomes.every((o) => o.ok)).toBe(true);
    expect(events.some((e) => e.type === "plan")).toBe(true);
    expect(events.some((e) => e.type === "done")).toBe(true);
  });
});

describe("verifyProject", () => {
  it("returns clean verdict when all four gates pass", async () => {
    const fake = new FakeRunner(allGreen());
    const verdict = await verifyProject(".", fake.runner);
    expect(verdict.ok).toBe(true);
    // all four gates run (continueOnFail)
    expect(fake.calls).toHaveLength(4);
  });

  it("returns dirty verdict and aggregates errors across gates", async () => {
    const fake = new FakeRunner({
      tsc: [OK],
      eslint: [{ exitCode: 1, stdout: '[{"filePath":"a.tsx","messages":[{"ruleId":"r","severity":2,"message":"m"}]}]', stderr: "" }],
      vitest: [{ exitCode: 0, stdout: '{"success":true,"numFailedTests":0}', stderr: "" }],
      "next-build": [OK],
    });
    const verdict = await verifyProject(".", fake.runner);
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.tool === "eslint")).toBe(true);
  });
});
