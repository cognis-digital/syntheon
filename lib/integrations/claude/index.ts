/**
 * Claude adapter — chat + streaming via @anthropic-ai/sdk.
 *
 * Default model is claude-opus-4-8 with adaptive thinking. The SDK reads
 * ANTHROPIC_API_KEY from env; this adapter never throws at import time.
 *
 * Env: ANTHROPIC_API_KEY
 */
import Anthropic from "@anthropic-ai/sdk";
import { hasEnv, IntegrationError, requireEnv } from "../types";

export const CLAUDE_ENV = ["ANTHROPIC_API_KEY"] as const;

export const DEFAULT_MODEL = "claude-opus-4-8";

export function isConfigured(): boolean {
  return hasEnv("ANTHROPIC_API_KEY");
}

let _client: Anthropic | null = null;

/** Build (and cache) the Anthropic client. */
export function getClaude(): Anthropic {
  const key = requireEnv("claude", "ANTHROPIC_API_KEY");
  if (!_client) _client = new Anthropic({ apiKey: key });
  return _client;
}

/** Test seam: inject a mock Anthropic client. */
export function __setClaude(client: Anthropic | null): void {
  _client = client;
}

export interface ChatOptions {
  messages: Anthropic.MessageParam[];
  system?: string;
  model?: string;
  maxTokens?: number;
  /** adaptive thinking (default) or off */
  thinking?: boolean;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
}

/**
 * `thinking: {type: "adaptive"}`, `output_config`, and `effort` are the
 * opus-4-8 request surface. Typed as extras on top of the SDK params so the
 * adapter carries the correct runtime shape even on an SDK release that
 * predates those fields (see DEPS_NEEDED.md — the SDK upgrade types them
 * natively).
 */
type AdaptiveParams = Anthropic.MessageCreateParamsNonStreaming & {
  thinking?: { type: "adaptive" } | { type: "disabled" };
  output_config?: { effort: "low" | "medium" | "high" | "xhigh" | "max" };
};

function buildParams(opts: ChatOptions): AdaptiveParams {
  if (!opts.messages || opts.messages.length === 0) {
    throw new IntegrationError("claude", "messages is required", "bad_request");
  }
  const params: AdaptiveParams = {
    model: opts.model ?? DEFAULT_MODEL,
    max_tokens: opts.maxTokens ?? 16000,
    messages: opts.messages,
    // Adaptive thinking is the only on-mode for opus-4-8; default it on.
    thinking: opts.thinking === false ? { type: "disabled" } : { type: "adaptive" },
  };
  if (opts.system) params.system = opts.system;
  if (opts.effort) params.output_config = { effort: opts.effort };
  return params;
}

/** Single-shot chat. Returns concatenated text from the response. */
export async function chat(opts: ChatOptions): Promise<{
  text: string;
  stopReason: string | null;
  raw: Anthropic.Message;
}> {
  const client = getClaude();
  const response = await client.messages.create(buildParams(opts));
  const stopReason: string | null = response.stop_reason;
  // opus-4-8 may decline with stop_reason "refusal" (not in older SDK unions);
  // handle it before reading content so we never index an empty array.
  if (stopReason === "refusal") {
    return { text: "", stopReason, raw: response };
  }
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return { text, stopReason, raw: response };
}

/**
 * Streaming chat. Yields text deltas; use for long outputs and to avoid
 * request timeouts. Streams default to a larger max_tokens.
 */
export async function* stream(
  opts: ChatOptions,
): AsyncGenerator<string, void, unknown> {
  const client = getClaude();
  const params = buildParams({ maxTokens: 64000, ...opts });
  const s = client.messages.stream(params);
  for await (const event of s) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}
