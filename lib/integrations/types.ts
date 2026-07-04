/**
 * Shared contracts for Syntheon integration adapters.
 *
 * Every adapter lives in `lib/integrations/<name>/` and exports:
 *   - a client factory (or typed methods bound to env),
 *   - an `isConfigured()` guard that returns false when required env is absent,
 *   - a webhook handler where the service posts back events.
 *
 * Adapters MUST NOT throw at import time. Reading missing env is fine; only the
 * point of first *use* (an actual API call) may throw a typed `IntegrationError`.
 */

export type IntegrationCategory =
  | "auth"
  | "payments"
  | "identity"
  | "scheduling"
  | "email"
  | "ai"
  | "crm"
  | "automation"
  | "messaging"
  | "analytics"
  | "content"
  | "data";

/** A single entry in the integration registry. */
export interface IntegrationMeta {
  /** stable machine id, matches the folder name */
  id: string;
  /** human label for menus */
  label: string;
  category: IntegrationCategory;
  /** env var names this adapter reads */
  env: readonly string[];
  /** true when every required env var is present and non-empty */
  isConfigured: () => boolean;
}

/** Thrown when an adapter method is called without the required configuration. */
export class IntegrationError extends Error {
  readonly integration: string;
  readonly code: string;
  constructor(integration: string, message: string, code = "not_configured") {
    super(`[${integration}] ${message}`);
    this.name = "IntegrationError";
    this.integration = integration;
    this.code = code;
  }
}

/** Read an env var, treating empty string as absent. Safe in browser + node. */
export function env(name: string): string | undefined {
  const v =
    typeof process !== "undefined" && process.env
      ? process.env[name]
      : undefined;
  return v && v.length > 0 ? v : undefined;
}

/** True only if all named env vars are present and non-empty. */
export function hasEnv(...names: string[]): boolean {
  return names.every((n) => env(n) !== undefined);
}

/** Assert config is present or throw a typed error at point of use. */
export function requireEnv(integration: string, name: string): string {
  const v = env(name);
  if (v === undefined) {
    throw new IntegrationError(
      integration,
      `missing required env var ${name}`,
    );
  }
  return v;
}
