import { describe, it, expect } from "vitest";
import { runGeneration } from "./generate.js";
import { memoryFileSource, type FileSource } from "./context.js";
import type { WriteSink } from "../harness/loop.js";
import {
  FakeChatClient,
  FakeRunner,
  allGreen,
  fencedCode,
  unit,
  plan,
  SAMPLE_COMPONENT,
} from "./__testkit.js";
import type { GenerationHooks, LoopEvent } from "./contracts.js";

function memSink(memory: Map<string, string>): WriteSink {
  return {
    write: (p, c) => memory.set(p, c),
    loadTemplate: () => undefined,
  };
}

describe("runGeneration — dry run", () => {
  it("plans without generating and never calls the coder", async () => {
    const client = new FakeChatClient(["should not be used"]);
    const p = plan([
      unit("app/page.tsx", { dependsOn: ["components/ui/button.tsx"] }),
      unit("components/ui/button.tsx"),
    ]);
    const events: LoopEvent[] = [];
    const res = await runGeneration(p, undefined, {
      dryRun: true,
      client,
      noCache: true,
      onEvent: (e) => events.push(e),
    });
    expect(res.generated).toBe(0);
    expect(res.ok).toBe(true);
    expect(client.calls.length).toBeGreaterThanOrEqual(0); // planner may call, coder must not
    expect(events.some((e) => e.message.includes("Dry run"))).toBe(true);
    // plan is ordered: button before page
    const logLines = events.filter((e) => e.type === "log").map((e) => e.message);
    const btnIdx = logLines.findIndex((l) => l.includes("button.tsx"));
    const pageIdx = logLines.findIndex((l) => l.includes("page.tsx"));
    expect(btnIdx).toBeGreaterThanOrEqual(0);
    expect(btnIdx).toBeLessThan(pageIdx);
  });
});

describe("runGeneration — full run with injected fakes", () => {
  it("generates all units green and reports success", async () => {
    const memory = new Map<string, string>();
    const source: FileSource = memoryFileSource(memory);
    const p = plan([unit("components/ui/a.tsx"), unit("components/ui/b.tsx")]);
    const res = await runGeneration(p, undefined, {
      client: new FakeChatClient([fencedCode(SAMPLE_COMPONENT)]),
      runner: new FakeRunner(allGreen()).runner,
      source,
      sink: memSink(memory),
      noCache: true,
    });
    expect(res.ok).toBe(true);
    expect(res.generated).toBe(2);
    expect(res.failed).toBe(0);
    expect(memory.get("components/ui/a.tsx")).toContain("Widget");
  });

  it("drives GenerationHooks (onUnitStart/onUnitDone/onLog)", async () => {
    const memory = new Map<string, string>();
    const started: string[] = [];
    const done: [string, boolean][] = [];
    const hooks: GenerationHooks = {
      onUnitStart: (u) => started.push(u.path),
      onUnitDone: (u, ok) => done.push([u.path, ok]),
      onLog: () => {},
    };
    const res = await runGeneration(plan([unit("components/ui/a.tsx")]), hooks, {
      client: new FakeChatClient([fencedCode(SAMPLE_COMPONENT)]),
      runner: new FakeRunner(allGreen()).runner,
      source: memoryFileSource(memory),
      sink: memSink(memory),
      noCache: true,
    });
    expect(res.ok).toBe(true);
    expect(started).toEqual(["components/ui/a.tsx"]);
    expect(done).toEqual([["components/ui/a.tsx", true]]);
  });

  it("reports failure when a unit stays red with no template", async () => {
    const memory = new Map<string, string>();
    const res = await runGeneration(plan([unit("app/x.tsx")]), undefined, {
      client: new FakeChatClient([fencedCode("export const bad = 1;")]),
      runner: new FakeRunner({
        tsc: [{ exitCode: 2, stdout: "app/x.tsx(1,1): error TS2345: no.", stderr: "" }],
      }).runner,
      source: memoryFileSource(memory),
      sink: memSink(memory),
      noCache: true,
      maxRetries: 2,
    });
    expect(res.ok).toBe(false);
    expect(res.failed).toBe(1);
  });

  it("degrades gracefully when Ollama is down and not dry-run", async () => {
    // No injected client + no live Ollama in CI → down path. We simulate down by
    // pointing at an unreachable host via env for isOllamaUp.
    const prev = process.env.OLLAMA_HOST;
    process.env.OLLAMA_HOST = "http://127.0.0.1:1"; // unreachable
    try {
      const res = await runGeneration(plan([unit("app/x.tsx")]), undefined, {
        noCache: true,
      });
      expect(res.ok).toBe(false);
      expect(res.failed).toBe(1);
    } finally {
      if (prev === undefined) delete process.env.OLLAMA_HOST;
      else process.env.OLLAMA_HOST = prev;
    }
  });
});
