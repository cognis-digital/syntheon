/**
 * OpenAI adapter — chat completions + embeddings via the openai SDK.
 *
 * Env: OPENAI_API_KEY
 */
import OpenAI from "openai";
import { hasEnv, IntegrationError, requireEnv } from "../types";

export const OPENAI_ENV = ["OPENAI_API_KEY"] as const;

export const DEFAULT_CHAT_MODEL = "gpt-4o";
export const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";

export function isConfigured(): boolean {
  return hasEnv("OPENAI_API_KEY");
}

let _client: OpenAI | null = null;

/** Build (and cache) the OpenAI client. */
export function getOpenAI(): OpenAI {
  const key = requireEnv("openai", "OPENAI_API_KEY");
  if (!_client) _client = new OpenAI({ apiKey: key });
  return _client;
}

/** Test seam: inject a mock OpenAI client. */
export function __setOpenAI(client: OpenAI | null): void {
  _client = client;
}

export interface ChatOptions {
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/** Single-shot chat completion. Returns the first choice's text. */
export async function chat(opts: ChatOptions): Promise<{
  text: string;
  finishReason: string | null;
  raw: OpenAI.Chat.ChatCompletion;
}> {
  if (!opts.messages || opts.messages.length === 0) {
    throw new IntegrationError("openai", "messages is required", "bad_request");
  }
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: opts.model ?? DEFAULT_CHAT_MODEL,
    messages: opts.messages,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
  });
  const choice = response.choices[0];
  return {
    text: choice?.message?.content ?? "",
    finishReason: choice?.finish_reason ?? null,
    raw: response,
  };
}

/** Streaming chat completion — yields content deltas. */
export async function* stream(
  opts: ChatOptions,
): AsyncGenerator<string, void, unknown> {
  const client = getOpenAI();
  const s = await client.chat.completions.create({
    model: opts.model ?? DEFAULT_CHAT_MODEL,
    messages: opts.messages,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
    stream: true,
  });
  for await (const chunk of s) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

/** Create embeddings for one or many strings. */
export async function embed(
  input: string | string[],
  model = DEFAULT_EMBEDDING_MODEL,
): Promise<number[][]> {
  const client = getOpenAI();
  const response = await client.embeddings.create({ model, input });
  return response.data.map((d) => d.embedding);
}
