import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  joinWaitlist,
  approveWaitlist,
  rejectWaitlist,
  listWaitlist,
  onWaitlistJoin,
  __setWaitlistBackend,
  __setClerkForwarder,
} from "./waitlist";

describe("waitlist", () => {
  beforeEach(() => {
    // Fresh in-memory backend each test.
    const rows = new Map<string, import("./waitlist").WaitlistRecord>();
    __setWaitlistBackend({
      insert: (r) => void rows.set(r.id, r),
      findByEmail: (e) => [...rows.values()].find((x) => x.email === e) ?? null,
      update: (id, patch) => {
        const cur = rows.get(id);
        if (!cur) return null;
        const next = { ...cur, ...patch };
        rows.set(id, next);
        return next;
      },
      list: () => [...rows.values()],
      clear: () => rows.clear(),
    });
    __setClerkForwarder(null);
  });
  afterEach(() => {
    __setWaitlistBackend(null);
    __setClerkForwarder(null);
    vi.restoreAllMocks();
  });

  it("rejects an invalid email without throwing", async () => {
    const r = await joinWaitlist("not-an-email");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/invalid/);
  });

  it("records a pending entry", async () => {
    const r = await joinWaitlist("Person@Example.com", { source: "hero" });
    expect(r.ok).toBe(true);
    expect(r.record?.email).toBe("person@example.com");
    expect(r.record?.status).toBe("pending");
    expect(r.record?.source).toBe("hero");
  });

  it("is idempotent per email", async () => {
    const a = await joinWaitlist("dup@x.co");
    const b = await joinWaitlist("dup@x.co");
    expect(b.alreadyJoined).toBe(true);
    expect(b.record?.id).toBe(a.record?.id);
    expect(listWaitlist()).toHaveLength(1);
  });

  it("notifies listeners on join", async () => {
    const seen: string[] = [];
    const off = onWaitlistJoin((r) => void seen.push(r.email));
    await joinWaitlist("hook@x.co");
    expect(seen).toContain("hook@x.co");
    off();
    await joinWaitlist("after@x.co");
    expect(seen).not.toContain("after@x.co");
  });

  it("forwards to Clerk when a forwarder is set", async () => {
    const forwarder = vi.fn().mockResolvedValue(undefined);
    __setClerkForwarder(forwarder);
    const r = await joinWaitlist("fwd@x.co");
    expect(forwarder).toHaveBeenCalledWith("fwd@x.co");
    expect(r.forwardedToClerk).toBe(true);
  });

  it("still succeeds locally if Clerk forwarding fails", async () => {
    __setClerkForwarder(vi.fn().mockRejectedValue(new Error("clerk down")));
    const r = await joinWaitlist("resilient@x.co");
    expect(r.ok).toBe(true);
    expect(r.forwardedToClerk).toBe(false);
  });

  it("approves and rejects entries", async () => {
    const r = await joinWaitlist("approve@x.co");
    const id = r.record!.id;
    expect(approveWaitlist(id)?.status).toBe("approved");
    expect(rejectWaitlist(id)?.status).toBe("rejected");
  });
});
