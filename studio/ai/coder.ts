/**
 * Syntheon — coder.
 *
 * Generates ONE unit against its typed contract + a small assembled context
 * (DESIGN.md §4). Enforces output shape: strips markdown fences, validates the
 * result is plausible TS/TSX, and on repair passes feeds back the failing code
 * plus structured diagnostics so the model fixes rather than rewrites blindly.
 */

import type {
  GenerationUnit,
  Diagnostic,
  CodeCandidate,
} from "./contracts.js";
import type { ChatClient, ChatMessage } from "./ollama.js";
import type { AssembledContext } from "./context.js";
import { renderContext } from "./context.js";
import { resolveRoles, type RoleConfig } from "./roles.js";

export interface CoderOptions {
  client: ChatClient;
  roles?: Partial<RoleConfig>;
  /** Override the coder model (else role config). */
  model?: string;
  /** Timeout for a single generation. */
  timeoutMs?: number;
}

export interface RepairInput {
  /** The previous candidate's code that failed the gates. */
  previousCode: string;
  /** Diagnostics the harness reported. */
  diagnostics: Diagnostic[];
}

/**
 * Generate (or repair) a unit. When `repair` is provided the prompt frames it
 * as a fix; otherwise a fresh generation.
 */
export async function generateUnit(
  unit: GenerationUnit,
  ctx: AssembledContext,
  opts: CoderOptions,
  repair?: RepairInput,
): Promise<CodeCandidate> {
  const roles = resolveRoles(opts.roles);
  const model = opts.model ?? roles.coder;
  const messages = buildMessages(unit, ctx, repair);
  const raw = await opts.client.chat(messages, {
    model,
    temperature: roles.temperature.coder,
    timeoutMs: opts.timeoutMs,
  });
  const code = extractCode(raw);
  return { unit, code, raw, model };
}

/** Build the chat messages for a generation or repair pass. */
export function buildMessages(
  unit: GenerationUnit,
  ctx: AssembledContext,
  repair?: RepairInput,
): ChatMessage[] {
  const system =
    "You are Syntheon's coder. You write ONE production-grade TypeScript/TSX " +
    "file for a Next.js (App Router) app that uses Tailwind + Radix + shadcn-style " +
    "components. Rules:\n" +
    "- Output ONLY the file's code inside a single fenced code block. No prose.\n" +
    "- Strict TypeScript: typed props, no `any`, no unused symbols.\n" +
    "- Respect the design tokens (semantic Tailwind names, never hard-coded hex).\n" +
    "- Keep imports to what exists in the provided context or standard deps.\n" +
    "- Accessibility: correct ARIA, keyboard support, visible focus.";

  const contextBlock = renderContext(ctx);
  const spec =
    `File to write: ${norm(unit.path)}\n` +
    `Kind: ${unit.kind}\n` +
    `Spec: ${unit.spec}\n` +
    (unit.dependsOn?.length
      ? `Depends on: ${unit.dependsOn.map(norm).join(", ")}\n`
      : "");

  const messages: ChatMessage[] = [{ role: "system", content: system }];

  if (!repair) {
    messages.push({
      role: "user",
      content:
        `Context:\n${contextBlock}\n\n${spec}\n` +
        "Write the complete file now, as a single fenced code block.",
    });
    return messages;
  }

  const diagText = formatDiagnostics(repair.diagnostics);
  messages.push({
    role: "user",
    content:
      `Context:\n${contextBlock}\n\n${spec}\n` +
      "Write the complete file as a single fenced code block.",
  });
  messages.push({
    role: "assistant",
    content: "```tsx\n" + repair.previousCode + "\n```",
  });
  messages.push({
    role: "user",
    content:
      "The verification harness rejected that file with these errors:\n\n" +
      diagText +
      "\n\nFix ALL of them. Return the complete corrected file as a single fenced " +
      "code block — not a diff, not an explanation.",
  });
  return messages;
}

/** Render diagnostics compactly for the model. */
export function formatDiagnostics(diags: Diagnostic[]): string {
  if (diags.length === 0) return "(no diagnostics)";
  return diags
    .slice(0, 40)
    .map((d) => {
      const loc = d.file
        ? `${norm(d.file)}${d.line ? `:${d.line}${d.col ? `:${d.col}` : ""}` : ""}`
        : "(project)";
      const code = d.code ? ` [${d.code}]` : "";
      return `- ${d.tool} ${d.severity} ${loc}${code}: ${d.message}`;
    })
    .join("\n");
}

/**
 * Extract code from a model response. Prefers the first fenced block; if none,
 * treats the whole response as code (after stripping <think> and stray prose
 * lines). Returns "" when nothing usable — caller treats that as a failed pass.
 */
export function extractCode(raw: string): string {
  const noThink = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Fenced block, optionally language-tagged.
  const fence = /```(?:tsx?|typescript|ts|jsx?|javascript|js)?\s*\n([\s\S]*?)```/i;
  const m = fence.exec(noThink);
  if (m && m[1].trim()) return m[1].trim();

  // No fence: if it looks like code (has import/export/function/const), keep it.
  if (/\b(import|export|function|const|class|interface|type)\b/.test(noThink)) {
    return noThink;
  }
  return "";
}

/**
 * Cheap syntactic plausibility check before spending a full harness run.
 * Not a compiler — just rejects obviously-empty / non-code output.
 */
export function looksLikeCode(code: string): boolean {
  if (code.trim().length < 8) return false;
  if (!/[;{}()=]/.test(code)) return false;
  return /\b(import|export|function|const|let|class|interface|type|return|=>)\b/.test(
    code,
  );
}

function norm(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}
