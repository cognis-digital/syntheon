/**
 * Local-DB CRM adapter.
 *
 * The always-available fallback: an in-process contact book keyed by email.
 * Needs no external service and no env keys, so contact sync + lifecycle work
 * out of the box. A real deployment can point the same interface at HubSpot by
 * providing keys; the local adapter is also useful in dev and tests.
 */
import type {
  CrmAdapter,
  Contact,
  LifecycleStage,
  UpsertResult,
} from "../types";

interface LocalRecord extends Contact {
  id: string;
  lifecycle?: LifecycleStage;
  tags: string[];
  updatedAt: number;
}

export interface LocalStore {
  get(email: string): LocalRecord | null;
  put(rec: LocalRecord): void;
  clear(): void;
  all(): LocalRecord[];
}

function memoryStore(): LocalStore {
  const rows = new Map<string, LocalRecord>();
  return {
    get: (email) => rows.get(email) ?? null,
    put: (rec) => void rows.set(rec.email, rec),
    clear: () => rows.clear(),
    all: () => [...rows.values()],
  };
}

let _store: LocalStore | null = null;
function store(): LocalStore {
  if (!_store) _store = memoryStore();
  return _store;
}

/** Test seam: inject a store (reset with `null`). */
export function __setLocalStore(s: LocalStore | null): void {
  _store = s;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const localAdapter: CrmAdapter = {
  id: "local",

  isConfigured() {
    return true;
  },

  async upsertContact(contact: Contact): Promise<UpsertResult> {
    const email = normalizeEmail(contact.email);
    const existing = store().get(email);
    const rec: LocalRecord = {
      ...(existing ?? { tags: [] as string[] }),
      ...contact,
      email,
      id: existing?.id ?? `loc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      tags: existing?.tags ?? [],
      properties: { ...(existing?.properties ?? {}), ...(contact.properties ?? {}) },
      updatedAt: Date.now(),
    };
    store().put(rec);
    return { id: rec.id, created: !existing, email };
  },

  async trackLifecycle(email: string, stage: LifecycleStage): Promise<void> {
    const key = normalizeEmail(email);
    const existing = store().get(key);
    const rec: LocalRecord = existing
      ? { ...existing, lifecycle: stage, updatedAt: Date.now() }
      : {
          id: `loc_${Date.now().toString(36)}`,
          email: key,
          lifecycle: stage,
          tags: [],
          updatedAt: Date.now(),
        };
    store().put(rec);
  },

  async tagContact(email: string, tags: string[]): Promise<void> {
    const key = normalizeEmail(email);
    const existing = store().get(key);
    const base: LocalRecord = existing ?? {
      id: `loc_${Date.now().toString(36)}`,
      email: key,
      tags: [],
      updatedAt: Date.now(),
    };
    const merged = Array.from(new Set([...base.tags, ...tags]));
    store().put({ ...base, tags: merged, updatedAt: Date.now() });
  },

  async getContact(email: string): Promise<Contact | null> {
    const rec = store().get(normalizeEmail(email));
    if (!rec) return null;
    const { lifecycle: _lifecycle, tags: _tags, updatedAt: _updatedAt, ...contact } = rec;
    void _lifecycle;
    void _tags;
    void _updatedAt;
    return contact;
  },
};

/** Local-only helper: read the full record (with tags + lifecycle). */
export function getLocalRecord(email: string): LocalRecord | null {
  return store().get(normalizeEmail(email));
}
