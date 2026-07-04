/**
 * Gmail adapter — send + read via the Gmail API (OAuth2 refresh-token flow),
 * using googleapis. Suited to transactional email from a Google Workspace box.
 *
 * Env: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
 */
import { google, type gmail_v1 } from "googleapis";
import { hasEnv, IntegrationError, requireEnv } from "../types";

export const GMAIL_ENV = [
  "GMAIL_CLIENT_ID",
  "GMAIL_CLIENT_SECRET",
  "GMAIL_REFRESH_TOKEN",
] as const;

export function isConfigured(): boolean {
  return hasEnv("GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN");
}

let _client: gmail_v1.Gmail | null = null;

/** Build (and cache) an authenticated Gmail client. */
export function getGmail(): gmail_v1.Gmail {
  if (_client) return _client;
  const clientId = requireEnv("gmail", "GMAIL_CLIENT_ID");
  const clientSecret = requireEnv("gmail", "GMAIL_CLIENT_SECRET");
  const refreshToken = requireEnv("gmail", "GMAIL_REFRESH_TOKEN");
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  _client = google.gmail({ version: "v1", auth: oauth2 });
  return _client;
}

/** Test seam: inject a mock Gmail client. */
export function __setGmail(client: gmail_v1.Gmail | null): void {
  _client = client;
}

export interface SendOptions {
  to: string | string[];
  subject: string;
  /** plaintext or html; pass `html: true` for html */
  body: string;
  html?: boolean;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

/** Encode headers + body into an RFC 2822 base64url message. */
export function buildRawMessage(opts: SendOptions): string {
  const toList = Array.isArray(opts.to) ? opts.to.join(", ") : opts.to;
  const headers = [
    `To: ${toList}`,
    opts.from ? `From: ${opts.from}` : null,
    opts.cc ? `Cc: ${Array.isArray(opts.cc) ? opts.cc.join(", ") : opts.cc}` : null,
    opts.bcc ? `Bcc: ${Array.isArray(opts.bcc) ? opts.bcc.join(", ") : opts.bcc}` : null,
    opts.replyTo ? `Reply-To: ${opts.replyTo}` : null,
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: ${opts.html ? "text/html" : "text/plain"}; charset=UTF-8`,
  ].filter(Boolean);
  const message = `${headers.join("\r\n")}\r\n\r\n${opts.body}`;
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Send an email; returns the created message id. */
export async function sendEmail(opts: SendOptions): Promise<{ id: string }> {
  if (!opts.to || (Array.isArray(opts.to) && opts.to.length === 0)) {
    throw new IntegrationError("gmail", "no recipient", "bad_request");
  }
  const gmail = getGmail();
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: buildRawMessage(opts) },
  });
  return { id: res.data.id ?? "" };
}

export interface MessageSummary {
  id: string;
  threadId: string;
  snippet: string;
}

/** List message summaries matching a Gmail search query. */
export async function listMessages(
  query = "",
  maxResults = 20,
): Promise<MessageSummary[]> {
  const gmail = getGmail();
  const res = await gmail.users.messages.list({ userId: "me", q: query, maxResults });
  const ids = res.data.messages ?? [];
  const out: MessageSummary[] = [];
  for (const m of ids) {
    if (!m.id) continue;
    const full = await gmail.users.messages.get({ userId: "me", id: m.id, format: "metadata" });
    out.push({
      id: m.id,
      threadId: full.data.threadId ?? "",
      snippet: full.data.snippet ?? "",
    });
  }
  return out;
}
