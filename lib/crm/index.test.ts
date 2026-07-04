import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  upsertContact,
  trackLifecycle,
  tagContact,
  getContact,
  syncSignup,
  setCrmAdapter,
  activeProvider,
} from "./index";
import { localAdapter, __setLocalStore, getLocalRecord } from "./adapters/local";
import { hubspotAdapter, __setHubSpotModule } from "./adapters/hubspot";

const OLD_ENV = { ...process.env };

describe("CRM interface + local adapter", () => {
  beforeEach(() => {
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    setCrmAdapter(null);
    __setLocalStore(null);
    // reset local store
    localAdapter.upsertContact; // referenced to keep import
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    setCrmAdapter(null);
    __setLocalStore(null);
    __setHubSpotModule(null);
    vi.restoreAllMocks();
  });

  it("defaults to the local adapter when HubSpot is unconfigured", () => {
    expect(activeProvider()).toBe("local");
  });

  it("selects HubSpot when its token is present", () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "pat-123";
    expect(activeProvider()).toBe("hubspot");
  });

  it("upserts a contact (create then update)", async () => {
    const a = await upsertContact({ email: "New@X.co", firstName: "New" });
    expect(a.created).toBe(true);
    expect(a.email).toBe("new@x.co");
    const b = await upsertContact({ email: "new@x.co", company: "Acme" });
    expect(b.created).toBe(false);
    expect(b.id).toBe(a.id);
    const c = await getContact("new@x.co");
    expect(c?.firstName).toBe("New");
    expect(c?.company).toBe("Acme");
  });

  it("tracks lifecycle stage", async () => {
    await upsertContact({ email: "life@x.co" });
    await trackLifecycle("life@x.co", "customer");
    expect(getLocalRecord("life@x.co")?.lifecycle).toBe("customer");
  });

  it("tags a contact idempotently", async () => {
    await tagContact("tag@x.co", ["beta"]);
    await tagContact("tag@x.co", ["beta", "vip"]);
    expect(getLocalRecord("tag@x.co")?.tags.sort()).toEqual(["beta", "vip"]);
  });

  it("syncSignup upserts + sets lifecycle + tags", async () => {
    const res = await syncSignup(
      { email: "signup@x.co", firstName: "Sam" },
      "signup",
    );
    expect(res.created).toBe(true);
    const rec = getLocalRecord("signup@x.co");
    expect(rec?.lifecycle).toBe("lead");
    expect(rec?.tags).toContain("syntheon:signup");
    expect(rec?.source).toBe("signup");
  });

  it("syncSignup maps waitlist to subscriber", async () => {
    await syncSignup({ email: "wl@x.co" }, "waitlist");
    expect(getLocalRecord("wl@x.co")?.lifecycle).toBe("subscriber");
  });
});

describe("HubSpot adapter (mocked module)", () => {
  afterEach(() => {
    __setHubSpotModule(null);
    setCrmAdapter(null);
  });

  it("maps canonical lifecycle to HubSpot stage", async () => {
    const setLifecycleStage = vi
      .fn()
      .mockResolvedValue({ id: "1", properties: {} });
    __setHubSpotModule({
      isConfigured: () => true,
      upsertContact: vi
        .fn()
        .mockResolvedValue({ id: "1", properties: {} }),
      setLifecycleStage,
    });
    setCrmAdapter(hubspotAdapter);
    await trackLifecycle("hs@x.co", "marketing_qualified_lead");
    expect(setLifecycleStage).toHaveBeenCalledWith("1", "marketingqualifiedlead");
  });

  it("upserts a contact through the integration module", async () => {
    const upsert = vi.fn().mockResolvedValue({ id: "42", properties: {} });
    __setHubSpotModule({
      isConfigured: () => true,
      upsertContact: upsert,
      setLifecycleStage: vi.fn().mockResolvedValue({ id: "42", properties: {} }),
    });
    setCrmAdapter(hubspotAdapter);
    const res = await upsertContact({ email: "map@x.co", firstName: "Map" });
    expect(res.id).toBe("42");
    // properties mapped to HubSpot names
    const call = upsert.mock.calls.at(-1);
    expect(call?.[1]).toMatchObject({ firstname: "Map" });
  });
});
