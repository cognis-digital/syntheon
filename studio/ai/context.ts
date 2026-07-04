/**
 * Syntheon — context assembler.
 *
 * The coder gets ONLY the neighbors it needs (DESIGN.md §4): the unit's declared
 * dependencies, sibling files in the same directory, imported types, and the
 * design tokens. Keeping the prompt small keeps a 9B model on-target.
 */

import { dirname } from "node:path";
import type { GenerationUnit } from "./contracts.js";

/** A snippet of an existing/generated file offered to the coder. */
export interface ContextFile {
  path: string;
  content: string;
  /** Why this file is in context (dependency, sibling, tokens). */
  reason: "dependency" | "sibling" | "tokens" | "types";
}

/** The assembled context for a single unit. */
export interface AssembledContext {
  unit: GenerationUnit;
  files: ContextFile[];
  /** Design-token summary text (always included, kept short). */
  designTokens: string;
  /** Approximate character budget the assembler honored. */
  budgetChars: number;
}

/**
 * A read-only view of files the engine already knows about: on-disk repo files
 * plus units generated earlier in this run. Injected so tests need no fs.
 */
export interface FileSource {
  /** Return file content or undefined if it does not exist. */
  read(path: string): string | undefined;
  /** List project-relative paths (for sibling discovery). */
  list(): string[];
}

/** Build a FileSource from an in-memory map (used by generated units + tests). */
export function memoryFileSource(files: Map<string, string>): FileSource {
  return {
    read: (p) => files.get(normalize(p)),
    list: () => [...files.keys()],
  };
}

/** Compact summary of the Cognis-violet token contract (DESIGN.md §2). */
export const DESIGN_TOKENS_SUMMARY = `Design tokens (HSL CSS vars via Tailwind semantic names — edit values, never names):
- --primary 262 83% 58% (light) / 262 83% 66% (dark): primary actions, links, focus
- --accent 271 91% 65% / 271 91% 70%: highlights, gradients
- --muted 260 30% 96% / 260 20% 16%: secondary surfaces
- --destructive 0 84% 60% / 0 72% 51%; --radius 0.65rem
- Font: Inter (--font-sans). Headings: tracking-tight text-balance. Body: text-pretty, <=65ch.
- a11y: visible focus ring (--ring), keyboard operable, correct ARIA, Radix primitives.
- Wide content scrolls in its own overflow-x-auto; page body never scrolls sideways.`;

const DEFAULT_BUDGET = 12_000;

/**
 * Assemble context for a unit. Priority order (highest first) so truncation
 * drops the least-important neighbors:
 *   1. declared dependencies (dependsOn)
 *   2. sibling files in the same directory
 *   3. design tokens (always kept, cheap)
 */
export function assembleContext(
  unit: GenerationUnit,
  source: FileSource,
  budgetChars = DEFAULT_BUDGET,
): AssembledContext {
  const files: ContextFile[] = [];
  const seen = new Set<string>();
  let used = 0;

  const tryAdd = (
    path: string,
    reason: ContextFile["reason"],
  ): void => {
    const norm = normalize(path);
    if (norm === normalize(unit.path)) return; // never include the target itself
    if (seen.has(norm)) return;
    const content = source.read(norm);
    if (content === undefined) return;
    const cost = content.length + norm.length + 16;
    if (used + cost > budgetChars) return;
    seen.add(norm);
    used += cost;
    files.push({ path: norm, content, reason });
  };

  // 1. Declared dependencies.
  for (const dep of unit.dependsOn ?? []) tryAdd(dep, "dependency");

  // 2. Siblings in the same directory (typed props / patterns to match).
  const dir = dirname(normalize(unit.path));
  for (const p of source.list()) {
    if (dirname(normalize(p)) === dir) tryAdd(p, "sibling");
  }

  return {
    unit,
    files,
    designTokens: DESIGN_TOKENS_SUMMARY,
    budgetChars,
  };
}

/** Render assembled context into a compact prompt block for the coder. */
export function renderContext(ctx: AssembledContext): string {
  const parts: string[] = [ctx.designTokens];
  for (const f of ctx.files) {
    parts.push(
      `\n// ---- ${f.reason}: ${f.path} ----\n${clip(f.content, 4_000)}`,
    );
  }
  return parts.join("\n");
}

function clip(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max)}\n// ...(truncated)...`;
}

function normalize(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}
