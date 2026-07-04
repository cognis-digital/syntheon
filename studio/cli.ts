#!/usr/bin/env tsx
/**
 * Syntheon CLI — the menu-driven builder entry point.
 *
 *   npx tsx studio/cli.ts            interactive menu → syntheon.config.json
 *   npx tsx studio/cli.ts --yes      non-interactive defaults (SaaS)
 *   npx tsx studio/cli.ts --config f load a blueprint from a file
 *   npx tsx studio/cli.ts build      load config + run the generation engine
 *                                    (dry-run plan if the engine is absent)
 *
 * The argv parsing and command dispatch live here; the interactive prompt flow
 * lives in `interactive.ts` (testable) and blueprint I/O in `config/`.
 */
import { resolve } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import * as clack from "@clack/prompts";
import type { BuildBlueprint, BuildPlan, GenerationHooks } from "./types.js";
import { clackPrompter, PromptCancelled } from "./prompts.js";
import { runInteractive } from "./interactive.js";
import {
  CONFIG_FILENAME,
  DEFAULT_BLUEPRINT,
  loadBlueprint,
  parseBlueprint,
  saveBlueprint,
  serializeBlueprint,
} from "./config/index.js";
import { getFeature, getIntegration, resolvePlan } from "./registry/index.js";

const VIOLET = (s: string) => pc.magenta(pc.bold(s));

interface Args {
  command: "menu" | "build";
  yes: boolean;
  configPath?: string;
  outPath: string;
  dryRun: boolean;
  help: boolean;
}

export function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "menu",
    yes: false,
    outPath: CONFIG_FILENAME,
    dryRun: false,
    help: false,
  };
  const rest = [...argv];
  if (rest[0] === "build") {
    args.command = "build";
    rest.shift();
  } else if (rest[0] === "menu") {
    rest.shift();
  }
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--yes" || a === "-y") args.yes = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--config" || a === "-c") args.configPath = rest[++i];
    else if (a.startsWith("--config=")) args.configPath = a.slice("--config=".length);
    else if (a === "--out" || a === "-o") args.outPath = rest[++i];
    else if (a.startsWith("--out=")) args.outPath = a.slice("--out=".length);
  }
  return args;
}

const HELP = `
${VIOLET("Syntheon")} — the open-source, local-AI full-stack web app builder.

${pc.bold("Usage")}
  npx tsx studio/cli.ts [command] [options]

${pc.bold("Commands")}
  menu            Interactive menu → writes ${CONFIG_FILENAME} (default)
  build           Load config, resolve the plan, run the generation engine

${pc.bold("Options")}
  -y, --yes       Non-interactive; use batteries-included SaaS defaults
  -c, --config    Path to an existing blueprint JSON to load
  -o, --out       Output config path (default: ${CONFIG_FILENAME})
      --dry-run   For build: print the resolved plan, do not generate
  -h, --help      Show this help

${pc.dim("You own every line. No code leaves your machine.")}
`;

/**
 * Resolve a blueprint from args without prompting where possible:
 *   --config  → load + validate that file
 *   --yes     → the default SaaS blueprint
 *   otherwise → run the interactive menu
 */
export async function resolveBlueprint(args: Args): Promise<BuildBlueprint> {
  if (args.configPath) {
    return loadBlueprint(resolve(args.configPath));
  }
  if (args.yes) {
    return parseBlueprint(structuredClone(DEFAULT_BLUEPRINT));
  }
  const blueprint = await runInteractive(clackPrompter);
  return parseBlueprint(blueprint);
}

/** Render a resolved plan as human-readable text (used for dry-run). */
export function renderPlan(plan: BuildPlan): string {
  const lines: string[] = [];
  lines.push(`Plan for ${pc.bold(plan.blueprint.name)} (${plan.blueprint.projectType})`);
  lines.push("");
  lines.push(pc.bold(`Features (${plan.blueprint.features.length} selected):`));
  for (const sel of plan.blueprint.features) {
    const f = getFeature(sel.featureId);
    lines.push(`  • ${f?.label ?? sel.featureId}${sel.choice ? pc.dim(` [${sel.choice}]`) : ""}`);
  }
  lines.push("");
  lines.push(pc.bold(`Generation units (${plan.units.length}, in order):`));
  for (const u of plan.units) {
    lines.push(`  ${String(u.order + 1).padStart(3)}. ${pc.dim(`[${u.kind}]`)} ${u.path}`);
  }
  lines.push("");
  if (plan.integrations.length) {
    lines.push(pc.bold(`Integrations (${plan.integrations.length}):`));
    for (const id of plan.integrations) {
      const spec = getIntegration(id);
      lines.push(`  • ${spec?.label ?? id}${spec?.paid ? pc.dim(" (bring your own key)") : ""}`);
    }
    lines.push("");
  }
  if (plan.env.length) {
    lines.push(pc.bold(`Environment variables to set (${plan.env.length}):`));
    lines.push(plan.env.map((e) => `  ${e}`).join("\n"));
  }
  return lines.join("\n");
}

/**
 * Attempt to load the generation engine from `studio/ai`. Returns null if the
 * lane is absent or does not yet export `runGeneration`, so the CLI stays
 * useful standalone (dry-run).
 */
async function loadEngine(): Promise<
  | { runGeneration: (plan: BuildPlan, hooks?: GenerationHooks) => Promise<{ ok: boolean; generated: number; failed: number; fellBackToTemplate: string[] }> }
  | null
> {
  try {
    const mod: unknown = await import("./ai/index.js");
    const candidate = mod as { runGeneration?: unknown };
    if (typeof candidate.runGeneration === "function") {
      return candidate as never;
    }
    return null;
  } catch {
    return null;
  }
}

async function runMenu(args: Args): Promise<number> {
  clack.intro(VIOLET(" Syntheon "));
  let blueprint: BuildBlueprint;
  try {
    blueprint = await resolveBlueprint(args);
  } catch (err) {
    if (err instanceof PromptCancelled) {
      clack.cancel("Cancelled. Nothing was written.");
      return 130;
    }
    clack.log.error((err as Error).message);
    return 1;
  }
  const outPath = resolve(args.outPath);
  await saveBlueprint(outPath, blueprint);

  const plan = resolvePlan(blueprint);
  clack.note(
    `${plan.units.length} units · ${plan.integrations.length} integrations · ${plan.env.length} env vars`,
    "Blueprint saved",
  );
  clack.log.info(`Wrote ${pc.bold(outPath)}`);
  clack.outro(
    `${VIOLET("Next:")} ${pc.dim("npx tsx studio/cli.ts build")} to generate. You own every line.`,
  );
  return 0;
}

async function runBuild(args: Args): Promise<number> {
  clack.intro(VIOLET(" Syntheon build "));
  let blueprint: BuildBlueprint;
  try {
    // build prefers an explicit --config, then the default config file, then --yes.
    const path = resolve(args.configPath ?? args.outPath);
    blueprint = args.yes
      ? parseBlueprint(structuredClone(DEFAULT_BLUEPRINT))
      : await loadBlueprint(path);
  } catch (err) {
    clack.log.error(
      `Could not load a blueprint (${(err as Error).message}). Run the menu first or pass --config / --yes.`,
    );
    return 1;
  }

  const plan = resolvePlan(blueprint);
  const engine = await loadEngine();

  if (!engine || args.dryRun) {
    if (!engine && !args.dryRun) {
      clack.log.warn("Generation engine (studio/ai) not available — showing the resolved plan (dry-run).");
    }
    p.note(renderPlan(plan), "Resolved plan");
    clack.outro(pc.dim("Dry-run only. No files were generated."));
    return 0;
  }

  const spin = clack.spinner();
  spin.start(`Generating ${plan.units.length} units`);
  const hooks: GenerationHooks = {
    onUnitStart: (u) => spin.message(`(${u.order + 1}/${plan.units.length}) ${u.path}`),
    onLog: (m) => clack.log.step(m),
  };
  try {
    const result = await engine.runGeneration(plan, hooks);
    spin.stop(
      result.ok
        ? `Generated ${result.generated} units`
        : `Generated ${result.generated}, ${result.failed} failed`,
    );
    if (result.fellBackToTemplate.length) {
      clack.log.warn(`${result.fellBackToTemplate.length} unit(s) fell back to template and are flagged for review.`);
    }
    clack.outro(result.ok ? VIOLET("Build complete. You own every line.") : "Build finished with failures.");
    return result.ok ? 0 : 1;
  } catch (err) {
    spin.stop("Generation failed.");
    clack.log.error((err as Error).message);
    return 1;
  }
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(HELP + "\n");
    return 0;
  }
  return args.command === "build" ? runBuild(args) : runMenu(args);
}

// Only auto-run when invoked directly (not when imported by tests).
const isMain = (() => {
  try {
    const entry = process.argv[1] ? resolve(process.argv[1]) : "";
    return entry.endsWith("cli.ts") || entry.endsWith("cli.js");
  } catch {
    return false;
  }
})();

if (isMain) {
  main().then((code) => {
    process.exitCode = code;
  });
}

export { renderPlan as _renderPlan };
