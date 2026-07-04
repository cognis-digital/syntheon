import { describe, it, expect, beforeEach } from "vitest";

import { projectsStore, __setProjectsBackend } from "./projects-store";

const ALICE = "usr_alice";
const BOB = "usr_bob";

describe("projectsStore", () => {
  beforeEach(() => {
    // Fresh in-memory backend per test (also resets the per-owner seed guard).
    __setProjectsBackend(null);
    projectsStore.reset();
  });

  it("seeds a demo set for a first-time owner, newest first", () => {
    const list = projectsStore.list(ALICE);
    expect(list.length).toBe(3);
    // sorted by updatedAt desc
    for (let i = 1; i < list.length; i++) {
      expect(list[i - 1].updatedAt).toBeGreaterThanOrEqual(list[i].updatedAt);
    }
    expect(list.every((p) => p.ownerId === ALICE)).toBe(true);
  });

  it("scopes projects by owner", () => {
    projectsStore.list(ALICE); // seed alice
    projectsStore.create({ ownerId: BOB, name: "Bob's app" });
    const bob = projectsStore.list(BOB);
    // Bob is seeded on first list PLUS his created one — filter to his created.
    expect(bob.some((p) => p.name === "Bob's app")).toBe(true);
    expect(bob.every((p) => p.ownerId === BOB)).toBe(true);
    const alice = projectsStore.list(ALICE);
    expect(alice.some((p) => p.name === "Bob's app")).toBe(false);
  });

  it("creates a project with defaults and trims input", () => {
    const p = projectsStore.create({
      ownerId: ALICE,
      name: "  Nova  ",
      description: "  hi  ",
    });
    expect(p.name).toBe("Nova");
    expect(p.description).toBe("hi");
    expect(p.type).toBe("SaaS");
    expect(p.status).toBe("draft");
    expect(p.units).toBe(0);
    expect(p.id).toMatch(/^prj_/);
    expect(projectsStore.find(p.id)?.name).toBe("Nova");
  });

  it("updates only an owner's project and bumps updatedAt", async () => {
    const p = projectsStore.create({ ownerId: ALICE, name: "Nova" });
    await new Promise((r) => setTimeout(r, 2));
    const updated = projectsStore.update(p.id, ALICE, {
      name: "Nova Pro",
      status: "live",
    });
    expect(updated?.name).toBe("Nova Pro");
    expect(updated?.status).toBe("live");
    expect(updated!.updatedAt).toBeGreaterThanOrEqual(p.updatedAt);
  });

  it("refuses to update a project owned by someone else", () => {
    const p = projectsStore.create({ ownerId: ALICE, name: "Nova" });
    const result = projectsStore.update(p.id, BOB, { name: "hijack" });
    expect(result).toBeNull();
    expect(projectsStore.find(p.id)?.name).toBe("Nova");
  });

  it("deletes only an owner's project", () => {
    const p = projectsStore.create({ ownerId: ALICE, name: "Nova" });
    expect(projectsStore.remove(p.id, BOB)).toBe(false);
    expect(projectsStore.remove(p.id, ALICE)).toBe(true);
    expect(projectsStore.find(p.id)).toBeNull();
  });

  it("does not re-seed after the owner empties their workspace", () => {
    const seeded = projectsStore.list(ALICE);
    for (const p of seeded) projectsStore.remove(p.id, ALICE);
    expect(projectsStore.list(ALICE)).toEqual([]);
  });
});
