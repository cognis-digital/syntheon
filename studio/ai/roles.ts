/**
 * Syntheon — model-role configuration.
 *
 * The fleet is specialized by role (DESIGN.md §4): a strong reasoning model
 * plans, a coding model writes units, a text model writes copy, a vision model
 * handles images. Every role is overridable via env or explicit config so a
 * different local fleet (or cloud) drops in without code changes.
 */

export type ModelRole = "planner" | "coder" | "copywriter" | "vision";

export interface RoleConfig {
  /** Ollama model tag for each role. */
  planner: string;
  coder: string;
  copywriter: string;
  vision: string;
  /** Default sampling temperature per role. */
  temperature: Record<ModelRole, number>;
}

/** The default local fleet installed on this box (DESIGN.md §4). */
export const DEFAULT_ROLES: RoleConfig = {
  planner: "deepseek-r1:14b",
  coder:
    "zfujicute/OmniCoder-Qwen3.5-9B-Claude-4.6-Opus-Uncensored-v2-GGUF:latest",
  copywriter: "qwen3:latest",
  vision: "llava:latest",
  temperature: {
    // Planning wants a little exploration; coding wants determinism.
    planner: 0.3,
    coder: 0.1,
    copywriter: 0.6,
    vision: 0.2,
  },
};

/** Fallback secondaries when a primary is unavailable. */
export const ROLE_FALLBACKS: Record<ModelRole, string[]> = {
  planner: ["qwen3:latest", "llama3:latest"],
  coder: ["qwen3:latest", "deepseek-r1:14b"],
  copywriter: ["llama3:latest", "qwen3:latest"],
  vision: ["llava:latest"],
};

/**
 * Resolve the effective role config from an optional override plus env vars.
 * Env keys: SYNTHEON_MODEL_PLANNER / _CODER / _COPYWRITER / _VISION.
 */
export function resolveRoles(override?: Partial<RoleConfig>): RoleConfig {
  const base: RoleConfig = {
    ...DEFAULT_ROLES,
    temperature: { ...DEFAULT_ROLES.temperature },
  };
  base.planner = process.env.SYNTHEON_MODEL_PLANNER ?? base.planner;
  base.coder = process.env.SYNTHEON_MODEL_CODER ?? base.coder;
  base.copywriter = process.env.SYNTHEON_MODEL_COPYWRITER ?? base.copywriter;
  base.vision = process.env.SYNTHEON_MODEL_VISION ?? base.vision;
  if (override) {
    const { temperature, ...rest } = override;
    Object.assign(base, rest);
    if (temperature) {
      base.temperature = { ...base.temperature, ...temperature };
    }
  }
  return base;
}

/**
 * Pick the best available model for a role given the list of pulled models.
 * Returns the primary if present, else the first available fallback, else the
 * primary (caller decides whether the fleet is usable at all).
 */
export function pickModelForRole(
  role: ModelRole,
  roles: RoleConfig,
  available: string[],
): string {
  const primary = roles[role];
  if (available.length === 0) return primary;
  if (available.includes(primary)) return primary;
  for (const fb of ROLE_FALLBACKS[role]) {
    if (available.includes(fb)) return fb;
  }
  return primary;
}
