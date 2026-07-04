/**
 * Slack adapter — post messages via an Incoming Webhook.
 *
 * Env: SLACK_WEBHOOK_URL
 */
import { hasEnv, requireEnv } from "../types";

export const SLACK_ENV = ["SLACK_WEBHOOK_URL"] as const;

export function isConfigured(): boolean {
  return hasEnv("SLACK_WEBHOOK_URL");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

export interface SlackMessage {
  text: string;
  /** Block Kit blocks (optional, override text rendering) */
  blocks?: unknown[];
  username?: string;
  iconEmoji?: string;
  channel?: string;
}

/** Post a message to the configured Incoming Webhook. */
export async function sendMessage(
  message: string | SlackMessage,
  url?: string,
): Promise<{ ok: boolean; status: number }> {
  const target = url ?? requireEnv("slack", "SLACK_WEBHOOK_URL");
  const body: Record<string, unknown> =
    typeof message === "string"
      ? { text: message }
      : {
          text: message.text,
          blocks: message.blocks,
          username: message.username,
          icon_emoji: message.iconEmoji,
          channel: message.channel,
        };
  const res = await _fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}
