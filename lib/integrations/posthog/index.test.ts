import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as posthog from "./index";

const OLD_ENV = { ...process.env };

describe("posthog adapter", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    posthog.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the project key", () => {
    expect(posthog.isConfigured()).toBe(true);
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    expect(posthog.isConfigured()).toBe(false);
  });

  it("captures an event with the api key in the body", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    posthog.__setFetch(f as unknown as typeof fetch);
    const res = await posthog.capture("clicked", "u1", { button: "cta" });
    expect(res.ok).toBe(true);
    const body = JSON.parse(f.mock.calls[0][1].body as string);
    expect(body).toMatchObject({ api_key: "phc_test", event: "clicked", distinct_id: "u1" });
  });

  it("uses the default host when unset and custom host when set", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    posthog.__setFetch(f as unknown as typeof fetch);
    await posthog.capture("e", "u1");
    expect(f.mock.calls[0][0]).toContain("us.i.posthog.com");

    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://eu.i.posthog.com";
    await posthog.capture("e", "u1");
    expect(f.mock.calls[1][0]).toContain("eu.i.posthog.com");
  });

  it("identify sends a $set on $identify", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    posthog.__setFetch(f as unknown as typeof fetch);
    await posthog.identify("u1", { email: "a@b.c" });
    const body = JSON.parse(f.mock.calls[0][1].body as string);
    expect(body.event).toBe("$identify");
    expect(body.properties.$set).toEqual({ email: "a@b.c" });
  });

  it("requires a distinctId", async () => {
    await expect(posthog.capture("e", "")).rejects.toThrow(/distinctId/);
  });
});
