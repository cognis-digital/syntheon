import { describe, it, expect } from "vitest";
import {
  parseTsc,
  parseEslint,
  parseVitest,
  parseNextBuild,
  parseGateOutput,
  runGate,
  runGates,
  FAST_GATES,
  FULL_GATES,
} from "./gates.js";
import { FakeRunner, allGreen, OK } from "../ai/__testkit.js";

describe("parseTsc", () => {
  it("parses the parenthesized (line,col) form", () => {
    const out = parseTsc(
      "src/foo.ts(12,5): error TS2345: Argument of type 'string' is not assignable.",
    );
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      tool: "tsc",
      file: "src/foo.ts",
      line: 12,
      col: 5,
      severity: "error",
      code: "TS2345",
    });
    expect(out[0].message).toContain("Argument of type");
  });

  it("parses the colon (file:line:col - error) form", () => {
    const out = parseTsc("app/x.tsx:3:10 - error TS1005: ';' expected.");
    expect(out[0]).toMatchObject({ file: "app/x.tsx", line: 3, col: 10, code: "TS1005" });
  });

  it("distinguishes warnings from errors", () => {
    const out = parseTsc("a.ts(1,1): warning TS6133: unused.");
    expect(out[0].severity).toBe("warning");
  });

  it("ignores non-diagnostic lines", () => {
    expect(parseTsc("Compiling...\nDone.")).toHaveLength(0);
  });

  it("parses multiple diagnostics", () => {
    const out = parseTsc(
      "a.ts(1,1): error TS1: x.\nb.ts(2,2): error TS2: y.",
    );
    expect(out).toHaveLength(2);
  });
});

describe("parseEslint", () => {
  it("parses JSON reporter output with error + warning severities", () => {
    const json = JSON.stringify([
      {
        filePath: "/repo/app/page.tsx",
        messages: [
          { ruleId: "no-unused-vars", severity: 2, message: "x unused", line: 4, column: 7 },
          { ruleId: "prefer-const", severity: 1, message: "use const", line: 5, column: 1 },
        ],
      },
    ]);
    const out = parseEslint(json);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ severity: "error", code: "no-unused-vars", line: 4 });
    expect(out[1].severity).toBe("warning");
  });

  it("returns [] for empty eslint output", () => {
    expect(parseEslint("[]")).toHaveLength(0);
  });

  it("tolerates surrounding noise around the JSON array", () => {
    const out = parseEslint(
      'warning noise\n[{"filePath":"a.tsx","messages":[{"ruleId":"r","severity":2,"message":"m"}]}]\ntrailing',
    );
    expect(out).toHaveLength(1);
  });
});

describe("parseVitest", () => {
  it("extracts failed assertions from the JSON reporter", () => {
    const report = JSON.stringify({
      success: false,
      numFailedTests: 1,
      testResults: [
        {
          name: "/repo/x.test.ts",
          assertionResults: [
            {
              title: "does a thing",
              fullName: "widget does a thing",
              status: "failed",
              failureMessages: ["AssertionError: expected 1 to be 2\n at /repo/x.test.ts:9:3"],
            },
            { title: "passes", status: "passed" },
          ],
        },
      ],
    });
    const out = parseVitest(report, report);
    expect(out).toHaveLength(1);
    expect(out[0].tool).toBe("vitest");
    expect(out[0].file).toContain("x.test.ts");
    expect(out[0].line).toBe(9);
    expect(out[0].message).toContain("widget does a thing");
  });

  it("returns [] when all tests pass", () => {
    const report = '{"success":true,"numFailedTests":0,"testResults":[]}';
    expect(parseVitest(report, report)).toHaveLength(0);
  });

  it("falls back to a summary when JSON lacks assertion detail", () => {
    const report = '{"success":false,"numFailedTests":3,"testResults":[]}';
    const out = parseVitest(report, report);
    expect(out).toHaveLength(1);
    expect(out[0].message).toContain("3");
  });

  it("detects failure from raw text when no JSON present", () => {
    const out = parseVitest("", "FAIL x.test.ts\nError: boom");
    expect(out).toHaveLength(1);
    expect(out[0].severity).toBe("error");
  });
});

describe("parseNextBuild", () => {
  it("captures Failed to compile markers", () => {
    const out = parseNextBuild("Failed to compile.\n./app/page.tsx\nType error: nope");
    expect(out.some((d) => d.tool === "next-build")).toBe(true);
    expect(out[0].severity).toBe("error");
  });

  it("reuses embedded tsc-style errors and retags them next-build", () => {
    const out = parseNextBuild("app/x.tsx(2,3): error TS2322: no.");
    const tagged = out.find((d) => d.code === "TS2322");
    expect(tagged?.tool).toBe("next-build");
  });
});

describe("parseGateOutput routing", () => {
  it("routes each tool to its parser", () => {
    expect(parseGateOutput("tsc", { exitCode: 1, stdout: "a.ts(1,1): error TS1: x.", stderr: "" })).toHaveLength(1);
    expect(parseGateOutput("eslint", { exitCode: 0, stdout: "[]", stderr: "" })).toHaveLength(0);
  });
});

describe("runGate", () => {
  it("reports ok when tool exits 0 with no error diagnostics", async () => {
    const fake = new FakeRunner(allGreen());
    const r = await runGate("tsc", { cwd: ".", runner: fake.runner });
    expect(r.ok).toBe(true);
    expect(r.diagnostics).toHaveLength(0);
  });

  it("reports not-ok and diagnostics on failure", async () => {
    const fake = new FakeRunner({
      tsc: [{ exitCode: 2, stdout: "a.ts(1,1): error TS2345: bad.", stderr: "" }],
    });
    const r = await runGate("tsc", { cwd: ".", runner: fake.runner });
    expect(r.ok).toBe(false);
    expect(r.diagnostics[0].code).toBe("TS2345");
  });

  it("marks the gate skipped when the binary fails to start", async () => {
    const runner = async () => ({ exitCode: 127, stdout: "", stderr: "not found", failedToStart: true });
    const r = await runGate("eslint", { cwd: ".", runner });
    expect(r.skipped).toBe(true);
    expect(r.ok).toBe(false);
  });

  it("scopes eslint to provided files", async () => {
    const fake = new FakeRunner(allGreen());
    await runGate("eslint", { cwd: ".", runner: fake.runner, files: ["app/a.tsx"] });
    expect(fake.calls[0].args).toContain("app/a.tsx");
  });

  it("runs a whole-project eslint (dot) when no files scoped", async () => {
    const fake = new FakeRunner(allGreen());
    await runGate("eslint", { cwd: ".", runner: fake.runner });
    expect(fake.calls[0].args).toContain(".");
  });
});

describe("runGates ordering", () => {
  it("runs in DESIGN §8 order and stops on first failure", async () => {
    const fake = new FakeRunner({
      tsc: [{ exitCode: 2, stdout: "a.ts(1,1): error TS1: x.", stderr: "" }],
      eslint: [OK],
    });
    const verdict = await runGates({ cwd: ".", runner: fake.runner }, FULL_GATES);
    expect(verdict.ok).toBe(false);
    // Only tsc ran before the loop stopped.
    expect(fake.calls).toHaveLength(1);
    expect(fake.calls[0].args).toContain("tsc");
  });

  it("continues through all gates when continueOnFail", async () => {
    const fake = new FakeRunner({
      tsc: [{ exitCode: 2, stdout: "a.ts(1,1): error TS1: x.", stderr: "" }],
      eslint: [{ exitCode: 0, stdout: "[]", stderr: "" }],
      vitest: [{ exitCode: 0, stdout: '{"success":true,"numFailedTests":0}', stderr: "" }],
      "next-build": [OK],
    });
    const verdict = await runGates({ cwd: ".", runner: fake.runner }, FULL_GATES, true);
    expect(verdict.ok).toBe(false);
    expect(fake.calls).toHaveLength(4);
  });

  it("all green yields ok verdict", async () => {
    const fake = new FakeRunner(allGreen());
    const verdict = await runGates({ cwd: ".", runner: fake.runner }, FAST_GATES);
    expect(verdict.ok).toBe(true);
    expect(verdict.errors).toHaveLength(0);
  });
});
