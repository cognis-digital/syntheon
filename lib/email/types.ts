/**
 * Provider-agnostic transactional email contracts for Syntheon.
 *
 * The app calls the interface in `lib/email/index.ts`; a concrete transport
 * (Resend when configured, Gmail as an alternative, or a no-op "log" transport
 * as the always-available fallback) fulfils it. Nothing throws at import time.
 */
import type { ReactElement } from "react";

/** A ready-to-send message. Provide at least one of html/text/react. */
export interface EmailMessage {
  to: string | string[];
  subject: string;
  from?: string;
  html?: string;
  text?: string;
  react?: ReactElement;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/** The outcome of a send. `provider` names the transport that handled it. */
export interface SendResult {
  id: string;
  provider: EmailTransport["id"];
  /** true when nothing was actually dispatched (unconfigured/log transport) */
  simulated?: boolean;
}

/** The interface every email transport implements. */
export interface EmailTransport {
  readonly id: "resend" | "gmail" | "log";
  isConfigured(): boolean;
  send(message: EmailMessage): Promise<SendResult>;
}

/** A rendered template: subject + html + a plaintext alternative. */
export interface RenderedTemplate {
  subject: string;
  html: string;
  text: string;
}
