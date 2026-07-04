/**
 * Resend adapter — transactional email + broadcasts. React-email friendly:
 * pass a rendered html string (or `react` element, which the SDK renders).
 *
 * Env: RESEND_API_KEY, EMAIL_FROM
 */
import { Resend } from "resend";
import type { ReactElement } from "react";
import { env, hasEnv, IntegrationError, requireEnv } from "../types";

export const RESEND_ENV = ["RESEND_API_KEY", "EMAIL_FROM"] as const;

export function isConfigured(): boolean {
  return hasEnv("RESEND_API_KEY");
}

let _client: Resend | null = null;

/** Build (and cache) the Resend client. */
export function getResend(): Resend {
  const key = requireEnv("resend", "RESEND_API_KEY");
  if (!_client) _client = new Resend(key);
  return _client;
}

/** Test seam: inject a mock Resend client. */
export function __setResend(client: Resend | null): void {
  _client = client;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  from?: string;
  html?: string;
  text?: string;
  /** a React element (react-email); rendered by the SDK */
  react?: ReactElement;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/** Send a transactional email. */
export async function sendEmail(opts: SendEmailOptions): Promise<{ id: string }> {
  const from = opts.from ?? env("EMAIL_FROM");
  if (!from) {
    throw new IntegrationError("resend", "no from and EMAIL_FROM unset", "bad_request");
  }
  if (!opts.html && !opts.text && !opts.react) {
    throw new IntegrationError("resend", "one of html/text/react is required", "bad_request");
  }
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    react: opts.react,
    replyTo: opts.replyTo,
    cc: opts.cc,
    bcc: opts.bcc,
  } as Parameters<Resend["emails"]["send"]>[0]);
  if (error) throw new IntegrationError("resend", error.message, "provider_error");
  return { id: data?.id ?? "" };
}

export interface BroadcastOptions {
  audienceId: string;
  subject: string;
  from?: string;
  html?: string;
  react?: ReactElement;
}

/** Create a broadcast to an audience (marketing/newsletter). */
export async function createBroadcast(
  opts: BroadcastOptions,
): Promise<{ id: string }> {
  const from = opts.from ?? env("EMAIL_FROM");
  if (!from) {
    throw new IntegrationError("resend", "no from and EMAIL_FROM unset", "bad_request");
  }
  const resend = getResend();
  const { data, error } = await resend.broadcasts.create({
    audienceId: opts.audienceId,
    from,
    subject: opts.subject,
    html: opts.html,
    react: opts.react,
  } as Parameters<Resend["broadcasts"]["create"]>[0]);
  if (error) throw new IntegrationError("resend", error.message, "provider_error");
  return { id: data?.id ?? "" };
}

/** Send a previously created broadcast. */
export async function sendBroadcast(broadcastId: string): Promise<{ id: string }> {
  const resend = getResend();
  const { data, error } = await resend.broadcasts.send(broadcastId);
  if (error) throw new IntegrationError("resend", error.message, "provider_error");
  return { id: data?.id ?? broadcastId };
}

/** Add a contact to an audience (for automation sequences). */
export async function addContact(
  audienceId: string,
  email: string,
  extra: { firstName?: string; lastName?: string; unsubscribed?: boolean } = {},
): Promise<{ id: string }> {
  const resend = getResend();
  const { data, error } = await resend.contacts.create({
    audienceId,
    email,
    firstName: extra.firstName,
    lastName: extra.lastName,
    unsubscribed: extra.unsubscribed,
  });
  if (error) throw new IntegrationError("resend", error.message, "provider_error");
  return { id: data?.id ?? "" };
}
