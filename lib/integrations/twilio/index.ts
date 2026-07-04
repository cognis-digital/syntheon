/**
 * Twilio adapter — send SMS + OTP (Verify) via the REST API using fetch
 * (HTTP Basic auth with Account SID + Auth Token). No SDK dependency.
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER,
 *      TWILIO_VERIFY_SERVICE_SID
 */
import { env, hasEnv, requireEnv } from "../types";

export const TWILIO_ENV = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM_NUMBER",
  "TWILIO_VERIFY_SERVICE_SID",
] as const;

const TWILIO_API = "https://api.twilio.com/2010-04-01";
const VERIFY_API = "https://verify.twilio.com/v2";

export function isConfigured(): boolean {
  return hasEnv("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

function authHeader(): string {
  const sid = requireEnv("twilio", "TWILIO_ACCOUNT_SID");
  const token = requireEnv("twilio", "TWILIO_AUTH_TOKEN");
  return `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`;
}

async function form<T>(url: string, params: Record<string, string>): Promise<T> {
  const res = await _fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });
  if (!res.ok) throw new Error(`[twilio] ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

/** Send an SMS. `from` defaults to TWILIO_FROM_NUMBER. */
export async function sendSms(
  to: string,
  body: string,
  from?: string,
): Promise<{ sid: string; status: string }> {
  const sid = requireEnv("twilio", "TWILIO_ACCOUNT_SID");
  const fromNumber = from ?? env("TWILIO_FROM_NUMBER");
  if (!fromNumber) throw new Error("[twilio] no from and TWILIO_FROM_NUMBER unset");
  const res = await form<{ sid: string; status: string }>(
    `${TWILIO_API}/Accounts/${sid}/Messages.json`,
    { To: to, From: fromNumber, Body: body },
  );
  return { sid: res.sid, status: res.status };
}

/** Start an OTP verification (SMS channel by default) via Verify. */
export async function startVerification(
  to: string,
  channel: "sms" | "call" | "email" = "sms",
): Promise<{ sid: string; status: string }> {
  const serviceSid = requireEnv("twilio", "TWILIO_VERIFY_SERVICE_SID");
  return form<{ sid: string; status: string }>(
    `${VERIFY_API}/Services/${serviceSid}/Verifications`,
    { To: to, Channel: channel },
  );
}

/** Check an OTP code; `approved` when it matches. */
export async function checkVerification(
  to: string,
  code: string,
): Promise<{ status: string; approved: boolean }> {
  const serviceSid = requireEnv("twilio", "TWILIO_VERIFY_SERVICE_SID");
  const res = await form<{ status: string }>(
    `${VERIFY_API}/Services/${serviceSid}/VerificationCheck`,
    { To: to, Code: code },
  );
  return { status: res.status, approved: res.status === "approved" };
}
