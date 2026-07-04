/**
 * Waitlist store + join flow.
 *
 * When Clerk is configured, joins are forwarded to Clerk's hosted waitlist so
 * they show up in the dashboard. Otherwise (and always, as a local mirror)
 * entries are recorded in a self-hosted store so the feature works with zero
 * external services. Joining also emits a hook the CRM/email lanes subscribe to
 * (sign-up → contact, waitlist → drip), passed in to avoid a hard cross-lane
 * import cycle.
 *
 * Nothing throws at import time. `joinWaitlist` is safe to call with no keys.
 */
import { hasEnv } from "../integrations/types";

export type WaitlistStatus = "pending" | "approved" | "rejected";

export interface WaitlistRecord {
  id: string;
  email: string;
  status: WaitlistStatus;
  createdAt: number;
  /** where the signup came from (utm/source), free-form */
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface WaitlistBackend {
  insert(r: WaitlistRecord): void;
  findByEmail(email: string): WaitlistRecord | null;
  update(id: string, patch: Partial<WaitlistRecord>): WaitlistRecord | null;
  list(): WaitlistRecord[];
  clear(): void;
}

function memoryBackend(): WaitlistBackend {
  const rows = new Map<string, WaitlistRecord>();
  return {
    insert: (r) => void rows.set(r.id, r),
    findByEmail: (email) =>
      [...rows.values()].find((r) => r.email === email) ?? null,
    update: (id, patch) => {
      const cur = rows.get(id);
      if (!cur) return null;
      const next = { ...cur, ...patch };
      rows.set(id, next);
      return next;
    },
    list: () => [...rows.values()].sort((a, b) => a.createdAt - b.createdAt),
    clear: () => rows.clear(),
  };
}

let _backend: WaitlistBackend | null = null;
function backend(): WaitlistBackend {
  if (!_backend) _backend = memoryBackend();
  return _backend;
}

/** Test seam: inject a backend (reset with `null`). */
export function __setWaitlistBackend(b: WaitlistBackend | null): void {
  _backend = b;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Optional forwarder to Clerk's hosted waitlist. Injectable for tests. */
export type ClerkForwarder = (email: string) => Promise<void>;
let _clerkForwarder: ClerkForwarder | null = null;
export function __setClerkForwarder(f: ClerkForwarder | null): void {
  _clerkForwarder = f;
}

/** Fired after a successful local join — CRM/email lanes hook in here. */
export type WaitlistListener = (r: WaitlistRecord) => void | Promise<void>;
const _listeners: WaitlistListener[] = [];
export function onWaitlistJoin(listener: WaitlistListener): () => void {
  _listeners.push(listener);
  return () => {
    const i = _listeners.indexOf(listener);
    if (i >= 0) _listeners.splice(i, 1);
  };
}

export interface JoinResult {
  ok: boolean;
  record?: WaitlistRecord;
  /** true when this email was already on the list (idempotent) */
  alreadyJoined?: boolean;
  error?: string;
  /** whether the entry was also forwarded to Clerk */
  forwardedToClerk?: boolean;
}

/**
 * Join the waitlist. Idempotent per email. Records locally, mirrors to Clerk
 * when configured, and notifies listeners. Never throws for a bad email — it
 * returns `{ ok: false, error }`.
 */
export async function joinWaitlist(
  email: string,
  opts: { source?: string; metadata?: Record<string, unknown> } = {},
): Promise<JoinResult> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) {
    return { ok: false, error: "invalid email" };
  }

  const existing = backend().findByEmail(normalized);
  if (existing) {
    return { ok: true, record: existing, alreadyJoined: true };
  }

  const record: WaitlistRecord = {
    id: `wl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    email: normalized,
    status: "pending",
    createdAt: Date.now(),
    source: opts.source,
    metadata: opts.metadata,
  };
  backend().insert(record);

  let forwardedToClerk = false;
  const forwarder =
    _clerkForwarder ??
    (hasEnv("CLERK_SECRET_KEY") ? defaultClerkForwarder : null);
  if (forwarder) {
    try {
      await forwarder(normalized);
      forwardedToClerk = true;
    } catch {
      // Local record still stands; forwarding is best-effort.
    }
  }

  for (const l of _listeners) {
    try {
      await l(record);
    } catch {
      /* listener errors never fail the join */
    }
  }

  return { ok: true, record, forwardedToClerk };
}

/** Approve a pending entry (admin action). Returns the updated record. */
export function approveWaitlist(id: string): WaitlistRecord | null {
  return backend().update(id, { status: "approved" });
}

/** Reject a pending entry (admin action). */
export function rejectWaitlist(id: string): WaitlistRecord | null {
  return backend().update(id, { status: "rejected" });
}

/** List all waitlist entries (oldest first). */
export function listWaitlist(): WaitlistRecord[] {
  return backend().list();
}

/** Default Clerk forwarder — lazy-imports the Clerk integration adapter. */
async function defaultClerkForwarder(email: string): Promise<void> {
  const clerk = await import("../integrations/clerk");
  await clerk.addToWaitlist(email);
}
