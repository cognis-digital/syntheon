/**
 * Public entry point for the Syntheon generation engine.
 *
 * The builder CLI dynamically imports this barrel (`./ai/index.js`) and looks
 * for `runGeneration`; keeping the public surface here decouples the CLI from
 * the engine's internal module layout.
 */
export { runGeneration, engine } from "./generate";
export type { RunGenerationOptions } from "./generate";

export {
  DEFAULT_ROLES,
  ROLE_FALLBACKS,
  resolveRoles,
  pickModelForRole,
} from "./roles";
export type { ModelRole, RoleConfig } from "./roles";

export { OllamaClient, CloudClient, isOllamaUp, listOllamaModels } from "./ollama";
export type {
  ChatClient,
  ChatMessage,
  ChatOptions,
  OllamaClientConfig,
  CloudClientConfig,
  CloudProvider,
} from "./ollama";
