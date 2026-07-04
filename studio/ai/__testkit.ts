/**
 * Syntheon — test kit for the generation engine.
 *
 * Fakes that let the whole engine run WITHOUT a live model or real tooling:
 *  - {@link FakeChatClient}: returns scripted responses per call.
 *  - {@link FakeRunner}: returns scripted tool output keyed by tool.
 *  - builders for plans/units.
 *
 * (This is a shared test helper — the `__` prefix keeps it out of the way; it is
 * imported only by *.test.ts files and never ships in a generated app.)
 */

import type {
  BuildPlan,
  BuildBlueprint,
  GenerationUnit,
  UnitKind,
} from "./contracts.js";
import type { ChatClient, ChatMessage, ChatOptions } from "./ollama.js";
import type { GateTool, Runner, RunResult } from "../harness/gates.js";

/** A chat client that replays a fixed script of responses. */
export class FakeChatClient implements ChatClient {
  readonly defaultModel = "fake-model";
  readonly label = "fake";
  calls: { messages: ChatMessage[]; options: ChatOptions }[] = [];
  private i = 0;

  constructor(private responses: string[]) {}

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<string> {
    this.calls.push({ messages, options });
    const r = this.responses[Math.min(this.i, this.responses.length - 1)];
    this.i++;
    if (r === "__THROW__") throw new Error("fake model failure");
    return r;
  }
}

/** A runner that returns scripted RunResults per tool, advancing per call. */
export class FakeRunner {
  calls: { command: string; args: string[]; cwd: string }[] = [];
  private counters: Partial<Record<GateTool, number>> = {};

  constructor(private scripts: Partial<Record<GateTool, RunResult[]>>) {}

  get runner(): Runner {
    return async (command, args, cwd) => {
      this.calls.push({ command, args, cwd });
      const tool = toolOf(args);
      const seq = tool ? this.scripts[tool] : undefined;
      if (!seq || seq.length === 0) {
        return { exitCode: 0, stdout: "", stderr: "" };
      }
      const idx = this.counters[tool!] ?? 0;
      this.counters[tool!] = idx + 1;
      return seq[Math.min(idx, seq.length - 1)];
    };
  }
}

function toolOf(args: string[]): GateTool | undefined {
  if (args.includes("tsc")) return "tsc";
  if (args.includes("eslint")) return "eslint";
  if (args.includes("vitest")) return "vitest";
  if (args.includes("next") && args.includes("build")) return "next-build";
  return undefined;
}

export const OK: RunResult = { exitCode: 0, stdout: "", stderr: "" };

/** A passing result for all four gates. */
export function allGreen(): Partial<Record<GateTool, RunResult[]>> {
  return {
    tsc: [OK],
    eslint: [{ exitCode: 0, stdout: "[]", stderr: "" }],
    vitest: [{ exitCode: 0, stdout: '{"success":true,"numFailedTests":0}', stderr: "" }],
    "next-build": [OK],
  };
}

/** A tsc failure then a pass, so the loop repairs once. */
export function tscFailThenPass(): Partial<Record<GateTool, RunResult[]>> {
  return {
    tsc: [
      {
        exitCode: 2,
        stdout: "app/x.tsx(3,10): error TS2345: bad type.",
        stderr: "",
      },
      OK,
    ],
    eslint: [{ exitCode: 0, stdout: "[]", stderr: "" }],
    vitest: [{ exitCode: 0, stdout: '{"success":true,"numFailedTests":0}', stderr: "" }],
  };
}

export function unit(
  path: string,
  overrides: Partial<GenerationUnit> = {},
): GenerationUnit {
  const kind: UnitKind =
    overrides.kind ??
    (path.includes("/api/")
      ? "api"
      : path.startsWith("app/")
        ? "route"
        : path.startsWith("components/")
          ? "component"
          : path.startsWith("lib/integrations/")
            ? "integration"
            : path.startsWith("lib/")
              ? "module"
              : path.endsWith(".test.tsx") || path.endsWith(".test.ts")
                ? "test"
                : "config");
  return {
    id: path,
    path,
    kind,
    spec: `spec for ${path}`,
    featureId: "test",
    order: 0,
    ...overrides,
  };
}

export function blueprint(over: Partial<BuildBlueprint> = {}): BuildBlueprint {
  return {
    version: 1,
    name: "Test App",
    projectType: "saas",
    features: [],
    theme: { brandColor: "262 83% 58%", radius: "0.65rem", font: "inter", darkMode: true },
    ...over,
  };
}

export function plan(units: GenerationUnit[], over: Partial<BuildPlan> = {}): BuildPlan {
  return {
    blueprint: blueprint(),
    units,
    env: [],
    integrations: [],
    ...over,
  };
}

/** A fenced code block a coder would emit. */
export function fencedCode(code: string, lang = "tsx"): string {
  return "```" + lang + "\n" + code + "\n```";
}

export const SAMPLE_COMPONENT = `import * as React from "react";
export function Widget(): React.ReactElement {
  return <div className="text-primary">hi</div>;
}`;
