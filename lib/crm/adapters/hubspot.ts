/**
 * HubSpot CRM adapter.
 *
 * Wraps the HubSpot integration adapter (`lib/integrations/hubspot`) in the
 * Syntheon `CrmAdapter` contract: normalizes contacts, maps canonical
 * lifecycle stages to HubSpot's `lifecyclestage`, and stores tags in a
 * multi-line `syntheon_tags` property (HubSpot has no first-class tags on
 * contacts). Lazy-imports the integration so this module never throws at
 * import when HubSpot is unconfigured.
 */
import { hasEnv } from "../../integrations/types";
import type {
  CrmAdapter,
  Contact,
  LifecycleStage,
  UpsertResult,
} from "../types";

/** Canonical → HubSpot lifecyclestage. */
const LIFECYCLE_MAP: Record<LifecycleStage, string> = {
  subscriber: "subscriber",
  lead: "lead",
  marketing_qualified_lead: "marketingqualifiedlead",
  sales_qualified_lead: "salesqualifiedlead",
  opportunity: "opportunity",
  customer: "customer",
  evangelist: "evangelist",
  churned: "other",
};

/** Shape of the integration module we depend on (for the injectable seam). */
export interface HubSpotModule {
  isConfigured(): boolean;
  upsertContact(
    email: string,
    properties?: Record<string, string>,
  ): Promise<{ id: string; properties: Record<string, string> }>;
  setLifecycleStage(
    contactId: string,
    stage: string,
  ): Promise<{ id: string; properties: Record<string, string> }>;
}

let _module: HubSpotModule | null = null;

/** Test seam: inject the HubSpot integration module (reset with `null`). */
export function __setHubSpotModule(m: HubSpotModule | null): void {
  _module = m;
}

async function mod(): Promise<HubSpotModule> {
  if (_module) return _module;
  return (await import("../../integrations/hubspot")) as HubSpotModule;
}

function contactProperties(contact: Contact): Record<string, string> {
  const props: Record<string, string> = { ...(contact.properties ?? {}) };
  if (contact.firstName) props.firstname = contact.firstName;
  if (contact.lastName) props.lastname = contact.lastName;
  if (contact.company) props.company = contact.company;
  if (contact.phone) props.phone = contact.phone;
  if (contact.source) props.syntheon_source = contact.source;
  return props;
}

export const hubspotAdapter: CrmAdapter = {
  id: "hubspot",

  isConfigured() {
    return hasEnv("HUBSPOT_ACCESS_TOKEN");
  },

  async upsertContact(contact: Contact): Promise<UpsertResult> {
    const email = contact.email.trim().toLowerCase();
    const m = await mod();
    const before = await m
      .upsertContact(email, {})
      .then((r) => r.id)
      .catch(() => null);
    const res = await m.upsertContact(email, contactProperties(contact));
    // HubSpot has no create/update flag on upsert; infer via presence check.
    return { id: res.id, created: before === null, email };
  },

  async trackLifecycle(email: string, stage: LifecycleStage): Promise<void> {
    const m = await mod();
    const contact = await m.upsertContact(email.trim().toLowerCase(), {});
    await m.setLifecycleStage(contact.id, LIFECYCLE_MAP[stage]);
  },

  async tagContact(email: string, tags: string[]): Promise<void> {
    const m = await mod();
    const key = email.trim().toLowerCase();
    const existing = await m.upsertContact(key, {});
    const prior = existing.properties?.syntheon_tags ?? "";
    const merged = Array.from(
      new Set([...prior.split(";").filter(Boolean), ...tags]),
    ).join(";");
    await m.upsertContact(key, { syntheon_tags: merged });
  },

  async getContact(email: string): Promise<Contact | null> {
    const m = await mod();
    try {
      const res = await m.upsertContact(email.trim().toLowerCase(), {});
      const p = res.properties ?? {};
      return {
        id: res.id,
        email,
        firstName: p.firstname,
        lastName: p.lastname,
        company: p.company,
        phone: p.phone,
        source: p.syntheon_source,
      };
    } catch {
      return null;
    }
  },
};
