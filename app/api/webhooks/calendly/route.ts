/**
 * Calendly webhook endpoint. Verifies the Calendly-Webhook-Signature header
 * and interprets invitee.created / invitee.canceled events.
 */
import { NextResponse } from "next/server";
import { handleWebhook, isConfigured } from "@/lib/integrations/calendly/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return NextResponse.json({ error: "calendly not configured" }, { status: 503 });
  }
  const signature = req.headers.get("calendly-webhook-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }
  const payload = await req.text();
  try {
    const result = handleWebhook(payload, signature);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "invalid signature" },
      { status: 400 },
    );
  }
}
