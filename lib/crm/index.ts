/**
 * Syntheon CRM — the provider-agnostic entry point.
 *
 *   import { upsertContact, trackLifecycle, tagContact } from "@/lib/crm";
 *
 * Provider selection: HubSpot when its keys are present, otherwise the built-in
 * local adapter. Also exposes `syncSignup` — the auth → CRM mapping that turns
 * a new sign-up or waitlist join into a contact with the right lifecycle stage.
 *
 * Every function degrades gracefully: with no provider configured, calls hit
 * the local adapter and never throw.
 */
import type {
  CrmAdapter,
  Contact,
  LifecycleStage,
  UpsertResult,
} from "./types";
import { hubspotAdapter } from "./adapters/hubspot";
import { localAdapter } from "./adapters/local";

export type {
  Contact,
  LifecycleStage,
  UpsertResult,
  CrmAdapter,
} from "./types";

let _override: CrmAdapter | null = null;

/** Test/advanced seam: force a specific adapter (reset with `null`). */
export function setCrmAdapter(adapter: CrmAdapter | null): void {
  _override = adapter;
}

/** Resolve the active adapter: override → HubSpot (if configured) → local. */
export function activeAdapter(): CrmAdapter {
  if (_override) return _override;
  if (hubspotAdapter.isConfigured()) return hubspotAdapter;
  return localAdapter;
}

export function activeProvider(): CrmAdapter["id"] {
  return activeAdapter().id;
}

/** Create-or-update a contact keyed by email. */
export async function upsertContact(contact: Contact): Promise<UpsertResult> {
  return activeAdapter().upsertContact(contact);
}

/** Move a contact to a lifecycle stage. */
export async function trackLifecycle(
  email: string,
  stage: LifecycleStage,
): Promise<void> {
  return activeAdapter().trackLifecycle(email, stage);
}

/** Attach tags to a contact. */
export async function tagContact(
  email: string,
  tags: string[],
): Promise<void> {
  return activeAdapter().tagContact(email, tags);
}

/** Read a contact back, or null. */
export async function getContact(email: string): Promise<Contact | null> {
  return activeAdapter().getContact(email);
}

/**
 * Map an auth event to the CRM: upsert the contact and set its lifecycle stage.
 * Wire this to the waitlist `onWaitlistJoin` hook and to your sign-up handler.
 *
 * - `signup`   → lifecycle `lead`
 * - `waitlist` → lifecycle `subscriber`
 * - `customer` → lifecycle `customer`
 */
export async function syncSignup(
  contact: Contact,
  event: "signup" | "waitlist" | "customer" = "signup",
): Promise<UpsertResult> {
  const stage: LifecycleStage =
    event === "waitlist" ? "subscriber" : event === "customer" ? "customer" : "lead";
  const result = await upsertContact({
    ...contact,
    source: contact.source ?? event,
  });
  try {
    await trackLifecycle(contact.email, stage);
    await tagContact(contact.email, [`syntheon:${event}`]);
  } catch {
    // Lifecycle/tag are enrichment; a failure must not lose the contact.
  }
  return result;
}
