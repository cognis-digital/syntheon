/**
 * Stripe webhook endpoint. Verifies the signature against STRIPE_WEBHOOK_SECRET
 * and routes the event. Returns 503 when Stripe isn't configured.
 *
 * Stripe needs the raw request body for signature verification — do not parse
 * JSON before verifying.
 */
import { NextResponse } from "next/server";
import { constructWebhookEvent, handleWebhookEvent, isConfigured } from "@/lib/integrations/stripe/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return NextResponse.json({ error: "stripe not configured" }, { status: 503 });
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing stripe-signature" }, { status: 400 });
  }
  const payload = await req.text();
  try {
    const event = constructWebhookEvent(payload, signature);
    const result = handleWebhookEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "invalid signature" },
      { status: 400 },
    );
  }
}
