import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as airtable from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe("airtable adapter", () => {
  beforeEach(() => {
    process.env.AIRTABLE_API_KEY = "pat_x";
    process.env.AIRTABLE_BASE_ID = "app123";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    airtable.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires key + base", () => {
    expect(airtable.isConfigured()).toBe(true);
    delete process.env.AIRTABLE_BASE_ID;
    expect(airtable.isConfigured()).toBe(false);
  });

  it("lists records with filter", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ records: [{ id: "rec1", fields: {} }] }));
    airtable.__setFetch(f as unknown as typeof fetch);
    const recs = await airtable.listRecords("Contacts", { filterByFormula: "TRUE()" });
    expect(recs[0].id).toBe("rec1");
    expect(f.mock.calls[0][0]).toContain("/app123/Contacts?filterByFormula=");
    expect((f.mock.calls[0][1].headers as Record<string, string>).Authorization).toBe("Bearer pat_x");
  });

  it("creates a record", async () => {
    airtable.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ id: "rec2", fields: { Name: "A" } })) as unknown as typeof fetch);
    const rec = await airtable.createRecord("Contacts", { Name: "A" });
    expect(rec.id).toBe("rec2");
  });

  it("updates a record via PATCH", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ id: "rec2", fields: { Name: "B" } }));
    airtable.__setFetch(f as unknown as typeof fetch);
    const rec = await airtable.updateRecord("Contacts", "rec2", { Name: "B" });
    expect(rec.fields.Name).toBe("B");
    expect(f.mock.calls[0][1].method).toBe("PATCH");
  });

  it("deletes a record", async () => {
    airtable.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ id: "rec2", deleted: true })) as unknown as typeof fetch);
    const res = await airtable.deleteRecord("Contacts", "rec2");
    expect(res.deleted).toBe(true);
  });
});
