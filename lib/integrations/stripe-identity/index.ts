/**
 * Stripe Identity adapter — document + selfie KYC via VerificationSession.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 */
import type Stripe from "stripe";
import { getStripe, constructWebhookEvent, isConfigured as stripeConfigured } from "../stripe/index";

export const STRIPE_IDENTITY_ENV = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

export function isConfigured(): boolean {
  return stripeConfigured();
}

export interface IdentitySessionOptions {
  /** which checks to run */
  type?: "document" | "id_number";
  /** where to send the user after verification */
  returnUrl?: string;
  /** require a live selfie matched against the document */
  requireLiveSelfie?: boolean;
  /** require the ID number matches (US SSN etc.) */
  requireIdNumber?: boolean;
  metadata?: Record<string, string>;
}

export interface IdentitySessionResult {
  id: string;
  clientSecret: string | null;
  url: string | null;
  status: string;
}

/** Create a KYC verification session; hand `url` or `clientSecret` to the client. */
export async function createVerificationSession(
  opts: IdentitySessionOptions = {},
): Promise<IdentitySessionResult> {
  const stripe = getStripe();
  const session = await stripe.identity.verificationSessions.create({
    type: opts.type ?? "document",
    return_url: opts.returnUrl,
    metadata: opts.metadata,
    options: {
      document: {
        require_live_capture: opts.requireLiveSelfie ?? true,
        require_matching_selfie: opts.requireLiveSelfie ?? true,
        require_id_number: opts.requireIdNumber ?? false,
      },
    },
  });
  return {
    id: session.id,
    clientSecret: session.client_secret,
    url: session.url,
    status: session.status,
  };
}

/** Retrieve the current state of a verification session. */
export async function getVerificationSession(
  id: string,
): Promise<{ id: string; status: string; verifiedOutputs: unknown }> {
  const stripe = getStripe();
  const session = await stripe.identity.verificationSessions.retrieve(id);
  return {
    id: session.id,
    status: session.status,
    verifiedOutputs: session.verified_outputs ?? null,
  };
}

export interface IdentityWebhookResult {
  type: string;
  sessionId?: string;
  status?: "verified" | "requires_input" | "processing" | "canceled" | string;
  handled: boolean;
}

/** Verify + interpret an Identity webhook event. */
export function handleIdentityWebhook(
  payload: string | Buffer,
  signature: string,
): IdentityWebhookResult {
  const event = constructWebhookEvent(payload, signature);
  const handled = event.type.startsWith("identity.verification_session.");
  const obj = event.data.object as Stripe.Identity.VerificationSession;
  return {
    type: event.type,
    sessionId: handled ? obj.id : undefined,
    status: handled ? obj.status : undefined,
    handled,
  };
}
