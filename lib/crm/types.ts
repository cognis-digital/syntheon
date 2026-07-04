/**
 * Provider-agnostic CRM contracts for Syntheon.
 *
 * The app calls the interface in `lib/crm/index.ts`; a concrete adapter
 * (HubSpot when configured, otherwise a local-DB adapter) fulfils it. Adapters
 * never throw at import time and degrade gracefully when unconfigured.
 */

/** A normalized CRM contact. `email` is the natural key across providers. */
export interface Contact {
  /** provider-native id once persisted */
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  /** where this contact originated: signup, waitlist, import, ... */
  source?: string;
  /** free-form custom fields, mapped per provider */
  properties?: Record<string, string>;
}

/**
 * A canonical lifecycle stage. Adapters map these to provider-native stages
 * (e.g. HubSpot `lifecyclestage`). Kept small and vendor-neutral.
 */
export type LifecycleStage =
  | "subscriber"
  | "lead"
  | "marketing_qualified_lead"
  | "sales_qualified_lead"
  | "opportunity"
  | "customer"
  | "evangelist"
  | "churned";

export interface UpsertResult {
  id: string;
  /** true when the contact was created (vs. updated) */
  created: boolean;
  email: string;
}

/** The interface every CRM adapter implements. */
export interface CrmAdapter {
  readonly id: "hubspot" | "local";
  isConfigured(): boolean;
  /** create-or-update a contact keyed by email */
  upsertContact(contact: Contact): Promise<UpsertResult>;
  /** move a contact (by email) to a lifecycle stage */
  trackLifecycle(email: string, stage: LifecycleStage): Promise<void>;
  /** attach one or more tags to a contact (by email) */
  tagContact(email: string, tags: string[]): Promise<void>;
  /** read a contact back (by email), or null */
  getContact(email: string): Promise<Contact | null>;
}
