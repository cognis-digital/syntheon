import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as hubspot from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe("hubspot adapter", () => {
  beforeEach(() => {
    process.env.HUBSPOT_ACCESS_TOKEN = "pat-na1-x";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    hubspot.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the access token", () => {
    expect(hubspot.isConfigured()).toBe(true);
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    expect(hubspot.isConfigured()).toBe(false);
  });

  it("creates a contact when none exists", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ results: [] })) // search
      .mockResolvedValueOnce(jsonResponse({ id: "c1", properties: { email: "a@b.c" } })); // create
    hubspot.__setFetch(f as unknown as typeof fetch);
    const c = await hubspot.upsertContact("a@b.c", { firstname: "A" });
    expect(c.id).toBe("c1");
    expect(f.mock.calls[1][0]).toContain("/crm/v3/objects/contacts");
    expect(f.mock.calls[1][1].method).toBe("POST");
  });

  it("updates a contact when it exists", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ results: [{ id: "c9", properties: {} }] }))
      .mockResolvedValueOnce(jsonResponse({ id: "c9", properties: { email: "a@b.c" } }));
    hubspot.__setFetch(f as unknown as typeof fetch);
    const c = await hubspot.upsertContact("a@b.c");
    expect(c.id).toBe("c9");
    expect(f.mock.calls[1][1].method).toBe("PATCH");
  });

  it("sets lifecycle stage", async () => {
    hubspot.__setFetch(
      vi.fn().mockResolvedValue(jsonResponse({ id: "c1", properties: { lifecyclestage: "customer" } })) as unknown as typeof fetch,
    );
    const c = await hubspot.setLifecycleStage("c1", "customer");
    expect(c.properties.lifecyclestage).toBe("customer");
  });

  it("creates a deal", async () => {
    hubspot.__setFetch(
      vi.fn().mockResolvedValue(jsonResponse({ id: "d1", properties: { dealname: "New" } })) as unknown as typeof fetch,
    );
    const d = await hubspot.createDeal({ dealname: "New" });
    expect(d.id).toBe("d1");
  });
});
