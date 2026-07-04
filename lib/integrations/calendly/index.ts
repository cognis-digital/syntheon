/**
 * Calendly adapter — scheduling embed URL builder + webhook verification.
 *
 * Calendly signs webhooks with an HMAC-SHA256 over `t={timestamp},v1={sig}`
 * in the `Calendly-Webhook-Signature` header, using the subscription's signing
 * key. We verify that signature and interpret `invitee.created` / `.canceled`.
 *
 * Env: NEXT_PUBLIC_CALENDLY_URL, CALENDLY_WEBHOOK_SIGNING_KEY
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { env, hasEnv, requireEnv } from "../types";

export const CALENDLY_ENV = [
  "NEXT_PUBLIC_CALENDLY_URL",
  "CALENDLY_WEBHOOK_SIGNING_KEY",
] as const;

export function isConfigured(): boolean {
  return hasEnv("NEXT_PUBLIC_CALENDLY_URL");
}

export interface EmbedOptions {
  /** override the base scheduling url (else NEXT_PUBLIC_CALENDLY_URL) */
  url?: string;
  prefill?: { name?: string; email?: string };
  /** UTM + custom answers passed through the querystring */
  utm?: Record<string, string>;
  hideEventTypeDetails?: boolean;
  hideGdprBanner?: boolean;
}

/** Build an embeddable Calendly scheduling URL with prefill + UTM. */
export function buildEmbedUrl(opts: EmbedOptions = {}): string {
  const base = opts.url ?? env("NEXT_PUBLIC_CALENDLY_URL");
  if (!base) {
    throw new Error("[calendly] no url and NEXT_PUBLIC_CALENDLY_URL unset");
  }
  const u = new URL(base);
  if (opts.prefill?.name) u.searchParams.set("name", opts.prefill.name);
  if (opts.prefill?.email) u.searchParams.set("email", opts.prefill.email);
  if (opts.hideEventTypeDetails) u.searchParams.set("hide_event_type_details", "1");
  if (opts.hideGdprBanner) u.searchParams.set("hide_gdpr_banner", "1");
  for (const [k, v] of Object.entries(opts.utm ?? {})) u.searchParams.set(k, v);
  return u.toString();
}

/**
 * Verify a Calendly webhook signature.
 * @param payload raw request body (string)
 * @param header value of the `Calendly-Webhook-Signature` header
 */
export function verifyWebhookSignature(payload: string, header: string): boolean {
  const key = requireEnv("calendly", "CALENDLY_WEBHOOK_SIGNING_KEY");
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.trim().split("=") as [string, string]),
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = createHmac("sha256", key).update(`${t}.${payload}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface CalendlyWebhookResult {
  event: string;
  handled: boolean;
  inviteeEmail?: string;
  eventUri?: string;
  payload: unknown;
}

/** Verify + parse a `scheduled_event` webhook (invitee.created / .canceled). */
export function handleWebhook(
  payload: string,
  signatureHeader: string,
): CalendlyWebhookResult {
  if (!verifyWebhookSignature(payload, signatureHeader)) {
    throw new Error("[calendly] invalid webhook signature");
  }
  const body = JSON.parse(payload) as {
    event: string;
    payload?: { email?: string; scheduled_event?: { uri?: string } };
  };
  const handled = body.event === "invitee.created" || body.event === "invitee.canceled";
  return {
    event: body.event,
    handled,
    inviteeEmail: body.payload?.email,
    eventUri: body.payload?.scheduled_event?.uri,
    payload: body.payload,
  };
}
