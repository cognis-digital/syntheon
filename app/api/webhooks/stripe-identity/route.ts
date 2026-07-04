/**
 * Stripe Identity webhook endpoint. Verifies + interprets identity
 * verification session events. Returns 503 when Stripe isn't configured.
 */
import { NextResponse } from "next/server";
import { handleIdentityWebhook, isConfigured } from "@/lib/integrations/stripe-identity/index";

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
    const result = handleIdentityWebhook(payload, signature);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "invalid signature" },
      { status: 400 },
    );
  }
}
