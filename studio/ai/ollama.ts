/**
 * Syntheon — typed local-AI client.
 *
 * A thin, dependency-light client for a local Ollama fleet plus an optional
 * cloud-escalation client (Anthropic / OpenAI) that is OFF by default and only
 * used when a unit fails local repair and the user opted in.
 *
 * Design goals:
 *  - No hard dependency on a live model: the engine takes a {@link ChatClient}
 *    so tests inject a fake that returns canned code.
 *  - Graceful degradation: {@link isOllamaUp} lets callers detect a down fleet
 *    and fall back deterministically with a clear message.
 */

/** A single chat turn. */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Options for a chat/generate call. */
export interface ChatOptions {
  model: string;
  /** When true, request JSON-formatted output (Ollama `format: "json"`). */
  json?: boolean;
  /** Sampling temperature (default per-role). */
  temperature?: number;
  /** Abort after this many ms (default 120_000). */
  timeoutMs?: number;
  /** Stop sequences. */
  stop?: string[];
  /** Streaming token callback; when provided the client streams. */
  onToken?: (token: string) => void;
}

/**
 * The minimal surface the engine depends on. Both the real Ollama client and
 * the cloud client implement it; tests provide a fake.
 */
export interface ChatClient {
  chat(messages: ChatMessage[], options: ChatOptions): Promise<string>;
  /** Which model this client will use if the caller does not override. */
  readonly defaultModel: string;
  /** Human label for logs. */
  readonly label: string;
}

const DEFAULT_OLLAMA_HOST =
  process.env.OLLAMA_HOST?.replace(/\/+$/, "") ?? "http://localhost:11434";
const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_RETRIES = 2;

/** Is a local Ollama server reachable? Never throws. */
export async function isOllamaUp(
  host: string = DEFAULT_OLLAMA_HOST,
  timeoutMs = 4_000,
): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${host}/api/tags`, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/** List models the local fleet has pulled. Returns [] when down. */
export async function listOllamaModels(
  host: string = DEFAULT_OLLAMA_HOST,
): Promise<string[]> {
  try {
    const res = await fetch(`${host}/api/tags`);
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: { name: string }[] };
    return (data.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}

export interface OllamaClientConfig {
  host?: string;
  defaultModel: string;
  retries?: number;
  label?: string;
}

/** A real Ollama chat client. */
export class OllamaClient implements ChatClient {
  readonly host: string;
  readonly defaultModel: string;
  readonly label: string;
  private readonly retries: number;

  constructor(config: OllamaClientConfig) {
    this.host = (config.host ?? DEFAULT_OLLAMA_HOST).replace(/\/+$/, "");
    this.defaultModel = config.defaultModel;
    this.retries = config.retries ?? DEFAULT_RETRIES;
    this.label = config.label ?? "ollama";
  }

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<string> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        return await this.chatOnce(messages, options, timeoutMs);
      } catch (err) {
        lastErr = err;
        // Do not retry on abort/timeout — the caller set the budget deliberately.
        if (err instanceof DOMException && err.name === "AbortError") throw err;
        if (attempt < this.retries) {
          await sleep(250 * (attempt + 1));
          continue;
        }
      }
    }
    throw new Error(
      `Ollama chat failed after ${this.retries + 1} attempt(s): ${errMessage(lastErr)}`,
    );
  }

  private async chatOnce(
    messages: ChatMessage[],
    options: ChatOptions,
    timeoutMs: number,
  ): Promise<string> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const stream = typeof options.onToken === "function";
    try {
      const res = await fetch(`${this.host}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: options.model ?? this.defaultModel,
          messages,
          stream,
          format: options.json ? "json" : undefined,
          options: {
            temperature: options.temperature ?? 0.2,
            stop: options.stop,
          },
        }),
      });
      if (!res.ok) {
        const body = await safeText(res);
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 500)}`);
      }
      if (!stream) {
        const data = (await res.json()) as {
          message?: { content?: string };
        };
        return data.message?.content ?? "";
      }
      return await this.readStream(res, options.onToken!);
    } finally {
      clearTimeout(t);
    }
  }

  private async readStream(
    res: Response,
    onToken: (token: string) => void,
  ): Promise<string> {
    if (!res.body) return "";
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let full = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        try {
          const obj = JSON.parse(line) as { message?: { content?: string } };
          const tok = obj.message?.content ?? "";
          if (tok) {
            full += tok;
            onToken(tok);
          }
        } catch {
          // partial / non-JSON keepalive line — ignore
        }
      }
    }
    return full;
  }
}

/**
 * Optional cloud-escalation client. Wraps @anthropic-ai/sdk or openai, loaded
 * lazily so the engine never imports them unless escalation is actually used.
 * OFF by default: constructed only when {@link BuildBlueprint.cloudEscalation}
 * is set and an API key is present in env.
 */
export type CloudProvider = "anthropic" | "openai";

export interface CloudClientConfig {
  provider: CloudProvider;
  model?: string;
  apiKey?: string;
}

export class CloudClient implements ChatClient {
  readonly defaultModel: string;
  readonly label: string;
  private readonly provider: CloudProvider;
  private readonly apiKey: string;

  constructor(config: CloudClientConfig) {
    this.provider = config.provider;
    this.apiKey =
      config.apiKey ??
      (config.provider === "anthropic"
        ? (process.env.ANTHROPIC_API_KEY ?? "")
        : (process.env.OPENAI_API_KEY ?? ""));
    this.defaultModel =
      config.model ??
      (config.provider === "anthropic"
        ? "claude-sonnet-4-5"
        : "gpt-4o");
    this.label = `cloud:${config.provider}`;
  }

  /** True when a key is available; escalation is skipped otherwise. */
  get available(): boolean {
    return this.apiKey.length > 0;
  }

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<string> {
    if (!this.available) {
      throw new Error(
        `Cloud escalation requested but no API key for ${this.provider}.`,
      );
    }
    if (this.provider === "anthropic") return this.chatAnthropic(messages, options);
    return this.chatOpenAI(messages, options);
  }

  private async chatAnthropic(
    messages: ChatMessage[],
    options: ChatOptions,
  ): Promise<string> {
    const mod = await import("@anthropic-ai/sdk");
    const Anthropic = mod.default;
    const client = new Anthropic({ apiKey: this.apiKey });
    const system = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    const turns = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
    const res = await client.messages.create({
      model: options.model ?? this.defaultModel,
      max_tokens: 4096,
      temperature: options.temperature ?? 0.2,
      system: system || undefined,
      messages: turns,
    });
    return res.content
      .filter((b): b is { type: "text"; text: string } => b.type === "text")
      .map((b) => b.text)
      .join("");
  }

  private async chatOpenAI(
    messages: ChatMessage[],
    options: ChatOptions,
  ): Promise<string> {
    const mod = await import("openai");
    const OpenAI = mod.default;
    const client = new OpenAI({ apiKey: this.apiKey });
    const res = await client.chat.completions.create({
      model: options.model ?? this.defaultModel,
      temperature: options.temperature ?? 0.2,
      response_format: options.json ? { type: "json_object" } : undefined,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    return res.choices[0]?.message?.content ?? "";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
