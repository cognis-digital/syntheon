/**
 * Email transports for Syntheon.
 *
 * Three transports implement the one `EmailTransport` contract:
 *   - resend: wraps `lib/integrations/resend`
 *   - gmail:  wraps `lib/integrations/gmail`
 *   - log:    always-available no-op that records sends in memory (dev/test)
 *
 * Integration modules are lazy-imported so unconfigured transports never pull
 * their SDK and never throw at import time.
 */
import { hasEnv } from "../integrations/types";
import type { EmailTransport, EmailMessage, SendResult } from "./types";

/* -------------------------------------------------------------------------- */
/* Injectable seams for the two real transports                               */
/* -------------------------------------------------------------------------- */

export interface ResendModule {
  isConfigured(): boolean;
  sendEmail(opts: {
    to: string | string[];
    subject: string;
    from?: string;
    html?: string;
    text?: string;
    react?: import("react").ReactElement;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
  }): Promise<{ id: string }>;
}

export interface GmailModule {
  isConfigured(): boolean;
  sendEmail(opts: {
    to: string | string[];
    subject: string;
    body: string;
    html?: boolean;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
  }): Promise<{ id: string }>;
}

let _resend: ResendModule | null = null;
let _gmail: GmailModule | null = null;
export function __setResendModule(m: ResendModule | null): void {
  _resend = m;
}
export function __setGmailModule(m: GmailModule | null): void {
  _gmail = m;
}

async function resendMod(): Promise<ResendModule> {
  return _resend ?? ((await import("../integrations/resend")) as ResendModule);
}
async function gmailMod(): Promise<GmailModule> {
  return _gmail ?? ((await import("../integrations/gmail")) as GmailModule);
}

/* -------------------------------------------------------------------------- */
/* resend                                                                     */
/* -------------------------------------------------------------------------- */

export const resendTransport: EmailTransport = {
  id: "resend",
  isConfigured() {
    return hasEnv("RESEND_API_KEY");
  },
  async send(message: EmailMessage): Promise<SendResult> {
    const mod = await resendMod();
    const { id } = await mod.sendEmail(message);
    return { id, provider: "resend" };
  },
};

/* -------------------------------------------------------------------------- */
/* gmail                                                                      */
/* -------------------------------------------------------------------------- */

export const gmailTransport: EmailTransport = {
  id: "gmail",
  isConfigured() {
    return hasEnv("GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN");
  },
  async send(message: EmailMessage): Promise<SendResult> {
    const mod = await gmailMod();
    const isHtml = Boolean(message.html);
    const body = message.html ?? message.text ?? "";
    const { id } = await mod.sendEmail({
      to: message.to,
      subject: message.subject,
      body,
      html: isHtml,
      from: message.from,
      cc: message.cc,
      bcc: message.bcc,
      replyTo: message.replyTo,
    });
    return { id, provider: "gmail" };
  },
};

/* -------------------------------------------------------------------------- */
/* log (fallback)                                                             */
/* -------------------------------------------------------------------------- */

/** Every message the log transport "sent" — inspectable in dev/test. */
export const sentLog: (EmailMessage & { id: string })[] = [];

export const logTransport: EmailTransport = {
  id: "log",
  isConfigured() {
    return true;
  },
  async send(message: EmailMessage): Promise<SendResult> {
    const id = `log_${Date.now().toString(36)}_${sentLog.length}`;
    sentLog.push({ ...message, id });
    return { id, provider: "log", simulated: true };
  },
};

/** Reset the in-memory log (test helper). */
export function clearSentLog(): void {
  sentLog.length = 0;
}
