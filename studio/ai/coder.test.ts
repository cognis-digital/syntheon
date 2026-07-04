import { describe, it, expect } from "vitest";
import {
  extractCode,
  looksLikeCode,
  formatDiagnostics,
  buildMessages,
  generateUnit,
} from "./coder.js";
import { assembleContext, memoryFileSource } from "./context.js";
import { FakeChatClient, unit, fencedCode, SAMPLE_COMPONENT } from "./__testkit.js";
import type { Diagnostic } from "./contracts.js";

describe("extractCode", () => {
  it("extracts a tsx fenced block", () => {
    expect(extractCode(fencedCode(SAMPLE_COMPONENT))).toContain("Widget");
  });

  it("extracts a plain ``` block", () => {
    expect(extractCode("```\nexport const x = 1;\n```")).toBe("export const x = 1;");
  });

  it("strips <think> blocks before extracting", () => {
    const raw = "<think>plan</think>\n" + fencedCode("export const y = 2;");
    expect(extractCode(raw)).toBe("export const y = 2;");
  });

  it("keeps bare code when there is no fence", () => {
    expect(extractCode("export function f() { return 1; }")).toContain("function f");
  });

  it("returns empty string for pure prose", () => {
    expect(extractCode("Sure, I can help with that request.")).toBe("");
  });

  it("prefers the first fenced block", () => {
    const raw = fencedCode("export const a = 1;") + "\n" + fencedCode("export const b = 2;");
    expect(extractCode(raw)).toBe("export const a = 1;");
  });
});

describe("looksLikeCode", () => {
  it("accepts real code", () => {
    expect(looksLikeCode("export const x = 1;")).toBe(true);
  });
  it("rejects empty / trivial", () => {
    expect(looksLikeCode("")).toBe(false);
    expect(looksLikeCode("ok")).toBe(false);
  });
  it("rejects prose", () => {
    expect(looksLikeCode("I cannot do that right now")).toBe(false);
  });
});

describe("formatDiagnostics", () => {
  const diags: Diagnostic[] = [
    { tool: "tsc", file: "app/x.tsx", line: 3, col: 10, severity: "error", code: "TS2345", message: "bad type" },
    { tool: "eslint", severity: "warning", message: "project-level" },
  ];
  it("renders location, code, and message", () => {
    const out = formatDiagnostics(diags);
    expect(out).toContain("app/x.tsx:3:10");
    expect(out).toContain("TS2345");
    expect(out).toContain("bad type");
  });
  it("labels project-level diagnostics", () => {
    expect(formatDiagnostics(diags)).toContain("(project)");
  });
  it("handles empty list", () => {
    expect(formatDiagnostics([])).toContain("no diagnostics");
  });
});

describe("buildMessages", () => {
  const u = unit("components/ui/widget.tsx", { spec: "a widget" });
  const ctx = assembleContext(u, memoryFileSource(new Map()));

  it("produces a system + user message for fresh generation", () => {
    const msgs = buildMessages(u, ctx);
    expect(msgs[0].role).toBe("system");
    expect(msgs[1].role).toBe("user");
    expect(msgs[1].content).toContain("components/ui/widget.tsx");
    expect(msgs[1].content).toContain("a widget");
  });

  it("includes the design tokens in context", () => {
    const msgs = buildMessages(u, ctx);
    expect(msgs[1].content).toContain("--primary");
  });

  it("frames a repair with prior code + diagnostics", () => {
    const msgs = buildMessages(u, ctx, {
      previousCode: "export const bad = 1;",
      diagnostics: [{ tool: "tsc", severity: "error", message: "boom", code: "TS1" }],
    });
    expect(msgs.some((m) => m.role === "assistant" && m.content.includes("bad = 1"))).toBe(true);
    const last = msgs[msgs.length - 1];
    expect(last.content).toContain("harness rejected");
    expect(last.content).toContain("boom");
  });
});

describe("generateUnit", () => {
  it("generates code from a fenced model response", async () => {
    const client = new FakeChatClient([fencedCode(SAMPLE_COMPONENT)]);
    const u = unit("components/ui/widget.tsx");
    const ctx = assembleContext(u, memoryFileSource(new Map()));
    const candidate = await generateUnit(u, ctx, { client });
    expect(candidate.code).toContain("Widget");
    expect(candidate.model).toBeTruthy();
  });

  it("uses the coder temperature (deterministic) from role config", async () => {
    const client = new FakeChatClient([fencedCode(SAMPLE_COMPONENT)]);
    const u = unit("components/ui/widget.tsx");
    const ctx = assembleContext(u, memoryFileSource(new Map()));
    await generateUnit(u, ctx, { client });
    expect(client.calls[0].options.temperature).toBe(0.1);
  });
});
