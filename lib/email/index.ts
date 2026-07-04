/**
 * Syntheon email — the provider-agnostic entry point.
 *
 *   import { sendEmail, sendTemplate } from "@/lib/email";
 *
 * Transport selection: Resend when configured, else Gmail when configured, else
 * the always-available log transport (records sends in memory, never dispatches
 * — perfect for dev/test and for keeping the build green with no keys).
 *
 * Every function degrades gracefully and never throws at import time.
 */
import type { EmailTransport, EmailMessage, SendResult } from "./types";
import {
  resendTransport,
  gmailTransport,
  logTransport,
} from "./transports";
import { templates, type TemplateKey } from "./templates";

export type { EmailMessage, SendResult, EmailTransport } from "./types";
export type { RenderedTemplate } from "./types";
export * from "./templates";
export * from "./sequences";

let _override: EmailTransport | null = null;

/** Test/advanced seam: force a specific transport (reset with `null`). */
export function setEmailTransport(transport: EmailTransport | null): void {
  _override = transport;
}

/** Resolve the active transport: override → Resend → Gmail → log. */
export function activeTransport(): EmailTransport {
  if (_override) return _override;
  if (resendTransport.isConfigured()) return resendTransport;
  if (gmailTransport.isConfigured()) return gmailTransport;
  return logTransport;
}

export function activeProvider(): EmailTransport["id"] {
  return activeTransport().id;
}

/** Send a ready-made message through the active transport. */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  return activeTransport().send(message);
}

/**
 * Render a named template and send it. The template's subject/html/text are
 * used unless explicitly overridden by `message`.
 */
export async function sendTemplate<K extends TemplateKey>(
  key: K,
  props: Parameters<(typeof templates)[K]>[0],
  message: Omit<EmailMessage, "subject" | "html" | "text"> &
    Partial<Pick<EmailMessage, "subject">>,
): Promise<SendResult> {
  // Each template function accepts its own props object; the union of param
  // types is widened here, so cast at the single call site.
  const render = templates[key] as (p: unknown) => {
    subject: string;
    html: string;
    text: string;
  };
  const rendered = render(props);
  return sendEmail({
    ...message,
    subject: message.subject ?? rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}
