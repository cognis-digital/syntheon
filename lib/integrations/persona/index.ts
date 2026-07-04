/**
 * Persona adapter — KYC/AML: create an inquiry + verify webhooks.
 *
 * Persona signs webhooks with HMAC-SHA256 over the raw body, in the
 * `Persona-Signature` header formatted `t=<ts>,v1=<sig>`.
 *
 * Env: PERSONA_API_KEY, PERSONA_TEMPLATE_ID, PERSONA_WEBHOOK_SECRET
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { env, hasEnv, requireEnv } from "../types";

export const PERSONA_ENV = [
  "PERSONA_API_KEY",
  "PERSONA_TEMPLATE_ID",
  "PERSONA_WEBHOOK_SECRET",
] as const;

const PERSONA_API = "https://api.withpersona.com/api/v1";

export function isConfigured(): boolean {
  return hasEnv("PERSONA_API_KEY");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

export interface CreateInquiryOptions {
  templateId?: string;
  referenceId?: string;
  fields?: Record<string, unknown>;
}

export interface Inquiry {
  id: string;
  status: string;
}

/** Create a Persona inquiry; returns its id + status. */
export async function createInquiry(
  opts: CreateInquiryOptions = {},
): Promise<Inquiry> {
  const key = requireEnv("persona", "PERSONA_API_KEY");
  const templateId = opts.templateId ?? env("PERSONA_TEMPLATE_ID");
  if (!templateId) {
    throw new Error("[persona] no templateId and PERSONA_TEMPLATE_ID unset");
  }
  const res = await _fetch(`${PERSONA_API}/inquiries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Persona-Version": "2023-01-05",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          "inquiry-template-id": templateId,
          "reference-id": opts.referenceId,
          fields: opts.fields,
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`[persona] ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { data: { id: string; attributes: { status: string } } };
  return { id: body.data.id, status: body.data.attributes.status };
}

/** Verify the `Persona-Signature` header (t=,v1= HMAC over raw body). */
export function verifyWebhookSignature(payload: string, header: string): boolean {
  const secret = requireEnv("persona", "PERSONA_WEBHOOK_SECRET");
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.trim().split("=") as [string, string]),
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface PersonaWebhookResult {
  name: string;
  handled: boolean;
  inquiryId?: string;
  status?: string;
  payload: unknown;
}

/** Verify + parse a Persona webhook (inquiry.* events). */
export function handleWebhook(payload: string, signatureHeader: string): PersonaWebhookResult {
  if (!verifyWebhookSignature(payload, signatureHeader)) {
    throw new Error("[persona] invalid webhook signature");
  }
  const body = JSON.parse(payload) as {
    data?: {
      attributes?: {
        name?: string;
        payload?: { data?: { id?: string; attributes?: { status?: string } } };
      };
    };
  };
  const name = body.data?.attributes?.name ?? "";
  const inner = body.data?.attributes?.payload?.data;
  return {
    name,
    handled: name.startsWith("inquiry."),
    inquiryId: inner?.id,
    status: inner?.attributes?.status,
    payload: body.data?.attributes?.payload,
  };
}
