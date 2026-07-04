/**
 * Persona webhook endpoint. Verifies the Persona-Signature header and
 * interprets inquiry.* events.
 */
import { NextResponse } from "next/server";
import { handleWebhook, isConfigured } from "@/lib/integrations/persona/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return NextResponse.json({ error: "persona not configured" }, { status: 503 });
  }
  const signature = req.headers.get("persona-signature");
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
