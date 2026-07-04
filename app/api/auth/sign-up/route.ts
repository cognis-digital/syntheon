import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/auth/store";
import { writeSessionToken, type CookieStore } from "@/lib/auth/cookies";

/**
 * Self-hosted sign-up endpoint the fallback auth form POSTs to (used when Clerk
 * is not configured). Creates a user, mints a session, and sets the session
 * cookie. Runs on the Node runtime so the scrypt/node:sqlite store is available.
 */
export const runtime = "nodejs";

const WEEK_SEC = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid request body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const firstName = body.firstName ? String(body.firstName) : undefined;
  const lastName = body.lastName ? String(body.lastName) : undefined;

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  try {
    const user = store.createUser({ email, password, firstName, lastName });
    const session = store.createSession(user.id);
    writeSessionToken((await cookies()) as unknown as CookieStore, session.token, WEEK_SEC);
    return NextResponse.json(
      { ok: true, user: { id: user.id, email: user.email } },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "sign-up failed";
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("already exists") ? 409 : 400 },
    );
  }
}
