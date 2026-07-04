/**
 * Cal.com adapter — open-source scheduling. Booking link builder + API client
 * (v2 REST) + webhook verification.
 *
 * Cal.com signs webhooks with HMAC-SHA256 over the raw body using the
 * per-subscription secret, sent in `X-Cal-Signature-256`.
 *
 * Env: NEXT_PUBLIC_CALCOM_LINK, CALCOM_API_KEY, CALCOM_WEBHOOK_SECRET
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { env, hasEnv, requireEnv } from "../types";

export const CALCOM_ENV = [
  "NEXT_PUBLIC_CALCOM_LINK",
  "CALCOM_API_KEY",
  "CALCOM_WEBHOOK_SECRET",
] as const;

const CALCOM_API = "https://api.cal.com/v2";

export function isConfigured(): boolean {
  return hasEnv("NEXT_PUBLIC_CALCOM_LINK");
}

export interface BookingLinkOptions {
  /** override base link, else NEXT_PUBLIC_CALCOM_LINK (e.g. https://cal.com/acme/30min) */
  link?: string;
  name?: string;
  email?: string;
  /** extra querystring answers */
  query?: Record<string, string>;
}

/** Build a Cal.com booking link with prefill. */
export function buildBookingLink(opts: BookingLinkOptions = {}): string {
  const base = opts.link ?? env("NEXT_PUBLIC_CALCOM_LINK");
  if (!base) throw new Error("[cal-com] no link and NEXT_PUBLIC_CALCOM_LINK unset");
  const u = new URL(base);
  if (opts.name) u.searchParams.set("name", opts.name);
  if (opts.email) u.searchParams.set("email", opts.email);
  for (const [k, v] of Object.entries(opts.query ?? {})) u.searchParams.set(k, v);
  return u.toString();
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

async function calApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = requireEnv("cal-com", "CALCOM_API_KEY");
  const res = await _fetch(`${CALCOM_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "cal-api-version": "2024-08-13",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`[cal-com] ${res.status} ${path}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

export interface CalBooking {
  id: number;
  uid: string;
  status: string;
}

/** List bookings from the Cal.com API. */
export async function listBookings(
  params: { status?: string; take?: number } = {},
): Promise<CalBooking[]> {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.take) q.set("take", String(params.take));
  const qs = q.toString();
  const res = await calApi<{ data: CalBooking[] }>(`/bookings${qs ? `?${qs}` : ""}`);
  return res.data;
}

/** Cancel a booking by uid. */
export async function cancelBooking(uid: string, reason?: string): Promise<CalBooking> {
  const res = await calApi<{ data: CalBooking }>(`/bookings/${uid}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancellationReason: reason ?? "" }),
  });
  return res.data;
}

/** Verify the `X-Cal-Signature-256` HMAC over the raw body. */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = requireEnv("cal-com", "CALCOM_WEBHOOK_SECRET");
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface CalWebhookResult {
  triggerEvent: string;
  handled: boolean;
  bookingUid?: string;
  payload: unknown;
}

/** Verify + parse a Cal.com webhook (BOOKING_CREATED / CANCELLED / RESCHEDULED). */
export function handleWebhook(payload: string, signature: string): CalWebhookResult {
  if (!verifyWebhookSignature(payload, signature)) {
    throw new Error("[cal-com] invalid webhook signature");
  }
  const body = JSON.parse(payload) as {
    triggerEvent: string;
    payload?: { uid?: string };
  };
  const handled = [
    "BOOKING_CREATED",
    "BOOKING_CANCELLED",
    "BOOKING_RESCHEDULED",
  ].includes(body.triggerEvent);
  return {
    triggerEvent: body.triggerEvent,
    handled,
    bookingUid: body.payload?.uid,
    payload: body.payload,
  };
}
