/**
 * Discord adapter — post messages via a channel Webhook.
 *
 * Env: DISCORD_WEBHOOK_URL
 */
import { hasEnv, requireEnv } from "../types";

export const DISCORD_ENV = ["DISCORD_WEBHOOK_URL"] as const;

export function isConfigured(): boolean {
  return hasEnv("DISCORD_WEBHOOK_URL");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

export interface DiscordMessage {
  content: string;
  username?: string;
  avatarUrl?: string;
  /** rich embeds */
  embeds?: unknown[];
}

/** Post a message to the configured Discord webhook. */
export async function sendMessage(
  message: string | DiscordMessage,
  url?: string,
): Promise<{ ok: boolean; status: number }> {
  const target = url ?? requireEnv("discord", "DISCORD_WEBHOOK_URL");
  const body: Record<string, unknown> =
    typeof message === "string"
      ? { content: message }
      : {
          content: message.content,
          username: message.username,
          avatar_url: message.avatarUrl,
          embeds: message.embeds,
        };
  const res = await _fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}
