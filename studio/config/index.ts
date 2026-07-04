/**
 * Syntheon config lane — public surface.
 *
 * Load/save helpers for `syntheon.config.json` plus the schema exports. All
 * disk I/O for the blueprint funnels through here so the CLI stays thin.
 */
import { readFile, writeFile } from "node:fs/promises";
import type { BuildBlueprint } from "../types.js";
import { parseBlueprint } from "./schema.js";

export * from "./schema.js";

/** Default on-disk config filename. */
export const CONFIG_FILENAME = "syntheon.config.json";

/** Read + validate a blueprint from a JSON file. */
export async function loadBlueprint(path: string): Promise<BuildBlueprint> {
  const raw = await readFile(path, "utf8");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`Config at ${path} is not valid JSON.`);
  }
  return parseBlueprint(json);
}

/** Validate + write a blueprint to a JSON file (pretty-printed). */
export async function saveBlueprint(
  path: string,
  blueprint: BuildBlueprint,
): Promise<void> {
  const validated = parseBlueprint(blueprint);
  await writeFile(path, JSON.stringify(validated, null, 2) + "\n", "utf8");
}

/** Serialize a blueprint to the exact JSON string that would be written. */
export function serializeBlueprint(blueprint: BuildBlueprint): string {
  return JSON.stringify(parseBlueprint(blueprint), null, 2) + "\n";
}
