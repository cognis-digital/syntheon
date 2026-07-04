/**
 * Syntheon — verification gates (DESIGN.md §8).
 *
 * Runs, in order, `tsc --noEmit` → `eslint` → `vitest run` → `next build` via
 * execa, and parses each tool's output into structured {@link Diagnostic}s.
 * tsc / eslint / vitest can be scoped to a subset of files for fast per-unit
 * checks; the full `next build` is reserved for whole-project checkpoints.
 *
 * A {@link Runner} is injected so tests can run gates against canned tool output
 * without spawning real processes.
 */

import { execa } from "execa";
import type {
  GateTool,
  Diagnostic,
  GateResult,
  HarnessVerdict,
} from "../ai/contracts.js";

export type { GateTool, Diagnostic, GateResult, HarnessVerdict };

/** Result of running an external command. */
export interface RunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  /** True if the binary could not be spawned at all. */
  failedToStart?: boolean;
}

/** Injectable command runner. Default uses execa against the real repo. */
export type Runner = (
  command: string,
  args: string[],
  cwd: string,
) => Promise<RunResult>;

export const defaultRunner: Runner = async (command, args, cwd) => {
  try {
    const res = await execa(command, args, {
      cwd,
      reject: false,
      all: false,
      preferLocal: true,
      windowsHide: true,
    });
    return {
      exitCode: res.exitCode ?? 1,
      stdout: res.stdout ?? "",
      stderr: res.stderr ?? "",
    };
  } catch (err) {
    return {
      exitCode: 127,
      stdout: "",
      stderr: err instanceof Error ? err.message : String(err),
      failedToStart: true,
    };
  }
};

export interface GateContext {
  /** Project root. */
  cwd: string;
  runner?: Runner;
  /** Restrict tsc/eslint/vitest to these project-relative files (fast path). */
  files?: string[];
}

/** Run a single gate. */
export async function runGate(
  tool: GateTool,
  ctx: GateContext,
): Promise<GateResult> {
  const runner = ctx.runner ?? defaultRunner;
  const start = Date.now();
  let cmd: [string, string[]];
  switch (tool) {
    case "tsc":
      cmd = ["npx", ["tsc", "--noEmit", "--pretty", "false"]];
      break;
    case "eslint":
      cmd = [
        "npx",
        [
          "eslint",
          "--format",
          "json",
          ...(ctx.files?.length ? ctx.files : ["."]),
        ],
      ];
      break;
    case "vitest":
      cmd = [
        "npx",
        [
          "vitest",
          "run",
          "--reporter=json",
          ...(ctx.files?.length ? ctx.files : []),
        ],
      ];
      break;
    case "next-build":
      cmd = ["npx", ["next", "build"]];
      break;
  }
  const res = await runner(cmd[0], cmd[1], ctx.cwd);
  const raw = `${res.stdout}\n${res.stderr}`.trim();
  const durationMs = Date.now() - start;

  if (res.failedToStart) {
    return {
      tool,
      ok: false,
      skipped: true,
      raw,
      durationMs,
      diagnostics: [
        {
          tool,
          severity: "error",
          message: `Could not run ${tool}: ${res.stderr || "binary not found"}`,
        },
      ],
    };
  }

  const diagnostics = parseGateOutput(tool, res);
  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const ok = res.exitCode === 0 && errorCount === 0;
  return { tool, ok, diagnostics, raw, durationMs };
}

/**
 * Run gates in DESIGN.md §8 order. By default runs all four; pass `only` to
 * run a subset (the loop uses the fast three for per-unit checks). Stops early
 * on the first failing gate unless `continueOnFail` is set.
 */
export async function runGates(
  ctx: GateContext,
  only: GateTool[] = ["tsc", "eslint", "vitest", "next-build"],
  continueOnFail = false,
): Promise<HarnessVerdict> {
  const results: GateResult[] = [];
  for (const tool of only) {
    const r = await runGate(tool, ctx);
    results.push(r);
    if (!r.ok && !continueOnFail) break;
  }
  const errors = results.flatMap((r) =>
    r.diagnostics.filter((d) => d.severity === "error"),
  );
  return { ok: results.every((r) => r.ok), results, errors };
}

/** The fast per-unit gate set (no full next build). */
export const FAST_GATES: GateTool[] = ["tsc", "eslint", "vitest"];
/** The full checkpoint gate set. */
export const FULL_GATES: GateTool[] = ["tsc", "eslint", "vitest", "next-build"];

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/** Route to the right parser for a tool. Exported for tests. */
export function parseGateOutput(tool: GateTool, res: RunResult): Diagnostic[] {
  const text = `${res.stdout}\n${res.stderr}`;
  switch (tool) {
    case "tsc":
      return parseTsc(text);
    case "eslint":
      return parseEslint(res.stdout || res.stderr);
    case "vitest":
      return parseVitest(res.stdout || res.stderr, text);
    case "next-build":
      return parseNextBuild(text);
  }
}

/**
 * Parse `tsc --noEmit --pretty false` output. Lines look like:
 *   src/foo.ts(12,5): error TS2345: Argument of type ...
 * (Also handles the no-parens form `file:line:col - error TSxxxx: ...`.)
 */
export function parseTsc(text: string): Diagnostic[] {
  const out: Diagnostic[] = [];
  const reParen =
    /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.*)$/;
  const reColon =
    /^(.+?):(\d+):(\d+)\s+-\s+(error|warning)\s+(TS\d+):\s+(.*)$/;
  for (const line of text.split(/\r?\n/)) {
    const m = reParen.exec(line) ?? reColon.exec(line);
    if (!m) continue;
    out.push({
      tool: "tsc",
      file: m[1].trim(),
      line: Number(m[2]),
      col: Number(m[3]),
      severity: m[4] as "error" | "warning",
      code: m[5],
      message: m[6].trim(),
    });
  }
  return out;
}

/** Parse `eslint --format json` output. */
export function parseEslint(stdout: string): Diagnostic[] {
  const json = firstJsonArray(stdout);
  if (!json) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const out: Diagnostic[] = [];
  for (const file of parsed as EslintFileResult[]) {
    for (const m of file.messages ?? []) {
      out.push({
        tool: "eslint",
        file: file.filePath,
        line: m.line,
        col: m.column,
        severity: m.severity === 2 ? "error" : "warning",
        code: m.ruleId ?? undefined,
        message: m.message,
      });
    }
  }
  return out;
}

interface EslintFileResult {
  filePath: string;
  messages?: {
    ruleId: string | null;
    severity: number;
    message: string;
    line?: number;
    column?: number;
  }[];
}

/**
 * Parse `vitest run --reporter=json`. The JSON reporter emits an object with
 * `testResults[].assertionResults[]`; failures carry `failureMessages`. We also
 * scavenge stack lines like `file:line:col` from failure messages for locations.
 */
export function parseVitest(stdout: string, fullText: string): Diagnostic[] {
  const json = firstJsonObject(stdout);
  if (json) {
    try {
      const parsed = JSON.parse(json) as VitestReport;
      const out: Diagnostic[] = [];
      for (const f of parsed.testResults ?? []) {
        for (const a of f.assertionResults ?? []) {
          if (a.status === "failed") {
            const msg = (a.failureMessages ?? []).join("\n");
            const loc = firstStackLocation(msg);
            out.push({
              tool: "vitest",
              file: loc?.file ?? f.name,
              line: loc?.line,
              col: loc?.col,
              severity: "error",
              message: `${a.fullName || a.title}: ${firstLine(msg)}`.trim(),
            });
          }
        }
      }
      if (out.length) return out;
      // A run with numFailedTests>0 but no assertion detail: surface a summary.
      if ((parsed.numFailedTests ?? 0) > 0 || parsed.success === false) {
        return [
          {
            tool: "vitest",
            severity: "error",
            message: `vitest reported ${parsed.numFailedTests ?? "some"} failing test(s).`,
          },
        ];
      }
      return [];
    } catch {
      // fall through to text scan
    }
  }
  // No JSON (e.g. crash before reporter): detect obvious failure text.
  if (/\bFAIL\b|failed|Error:/i.test(fullText) && !/\b0 failed\b/i.test(fullText)) {
    return [
      {
        tool: "vitest",
        severity: "error",
        message: `vitest failed: ${firstLine(fullText)}`,
      },
    ];
  }
  return [];
}

interface VitestReport {
  success?: boolean;
  numFailedTests?: number;
  testResults?: {
    name: string;
    assertionResults?: {
      title: string;
      fullName?: string;
      status: string;
      failureMessages?: string[];
    }[];
  }[];
}

/**
 * Parse `next build` output. Next surfaces TS/ESLint errors inline plus its own
 * "Failed to compile" / "Error:" markers. We reuse the tsc parser for embedded
 * type errors and add a project-level diagnostic for build failure markers.
 */
export function parseNextBuild(text: string): Diagnostic[] {
  const out: Diagnostic[] = parseTsc(text).map((d) => ({
    ...d,
    tool: "next-build" as const,
  }));
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/Failed to compile/i.test(line) || /^\s*Error:/.test(line)) {
      const detail = lines
        .slice(i, i + 4)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      out.push({
        tool: "next-build",
        severity: "error",
        message: detail.slice(0, 300),
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function firstLine(s: string): string {
  return (s.split(/\r?\n/).find((l) => l.trim()) ?? "").trim();
}

function firstStackLocation(
  msg: string,
): { file: string; line?: number; col?: number } | undefined {
  // Matches paths in stack frames: (/abs/path/file.ts:12:5) or file.ts:12:5
  const re = /([A-Za-z]:[\\/][^\s():]+\.(?:tsx?|jsx?)|[^\s():]+\.(?:tsx?|jsx?)):(\d+):(\d+)/;
  const m = re.exec(msg);
  if (!m) return undefined;
  return { file: m[1], line: Number(m[2]), col: Number(m[3]) };
}

function firstJsonArray(s: string): string | undefined {
  return sliceBalanced(s, "[", "]");
}
function firstJsonObject(s: string): string | undefined {
  return sliceBalanced(s, "{", "}");
}
function sliceBalanced(s: string, open: string, close: string): string | undefined {
  const start = s.indexOf(open);
  if (start === -1) return undefined;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }
  return undefined;
}
