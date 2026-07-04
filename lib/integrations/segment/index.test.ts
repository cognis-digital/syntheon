import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as segment from "./index";

const OLD_ENV = { ...process.env };

describe("segment adapter", () => {
  beforeEach(() => {
    process.env.SEGMENT_WRITE_KEY = "wk_test";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    segment.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the write key", () => {
    expect(segment.isConfigured()).toBe(true);
    delete process.env.SEGMENT_WRITE_KEY;
    expect(segment.isConfigured()).toBe(false);
  });

  it("tracks an event with basic auth", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    segment.__setFetch(f as unknown as typeof fetch);
    const res = await segment.track("Signed Up", { userId: "u1" }, { plan: "pro" });
    expect(res.ok).toBe(true);
    const [url, init] = f.mock.calls[0];
    expect(url).toContain("/track");
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^Basic /);
    expect(JSON.parse(init.body as string)).toMatchObject({ event: "Signed Up", userId: "u1" });
  });

  it("identifies a user", async () => {
    segment.__setFetch(vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response) as unknown as typeof fetch);
    const res = await segment.identify({ userId: "u1" }, { email: "a@b.c" });
    expect(res.ok).toBe(true);
  });

  it("requires an identity", async () => {
    await expect(segment.track("X", {})).rejects.toThrow(/userId or anonymousId/);
  });
});
