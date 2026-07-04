import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  defineSequence,
  enroll,
  tick,
  cancelEnrollment,
  updateContext,
  delay,
  __setEnrollmentStore,
  getSequence,
  listSequences,
  type Enrollment,
  type EngineDeps,
} from "./sequences";

/** A controllable virtual clock. */
function fakeClock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
    set: (ms: number) => {
      t = ms;
    },
  };
}

/** A render stub that just echoes template + props. */
const render: NonNullable<EngineDeps["render"]> = (template, props) => ({
  subject: `subj:${template}`,
  html: `<p>${template}:${JSON.stringify(props)}</p>`,
  text: `${template}`,
});

describe("sequence engine", () => {
  let sends: { to: string | string[]; subject: string }[];
  const send = vi.fn(async (m: { to: string | string[]; subject: string }) => {
    sends.push({ to: m.to, subject: m.subject });
    return { id: `send_${sends.length}`, provider: "log" as const, simulated: true };
  });

  beforeEach(() => {
    sends = [];
    send.mockClear();
    // Fresh in-memory enrollment store per test.
    const rows = new Map<string, Enrollment>();
    __setEnrollmentStore({
      put: (e) => void rows.set(e.id, e),
      get: (id) => rows.get(id) ?? null,
      active: () => [...rows.values()].filter((e) => e.status === "active"),
      clear: () => rows.clear(),
    });
    defineSequence({
      id: "test-seq",
      label: "Test",
      steps: [
        { id: "s0", template: "welcome", delay: delay.ms(0) },
        { id: "s1", template: "welcome", delay: delay.days(1) },
        {
          id: "s2",
          template: "welcome",
          delay: delay.days(3),
          condition: (c) => c.attributes?.activated !== true,
        },
      ],
    });
  });
  afterEach(() => {
    __setEnrollmentStore(null);
    vi.restoreAllMocks();
  });

  it("built-in sequences are registered", () => {
    const ids = listSequences().map((s) => s.id);
    expect(ids).toContain("welcome-drip");
    expect(ids).toContain("onboarding");
    expect(ids).toContain("win-back");
  });

  it("enroll into an unknown sequence throws", () => {
    expect(() => enroll("nope", { email: "a@b.c" })).toThrow(/unknown sequence/);
  });

  it("sends the day-0 step on the first tick, nothing more", async () => {
    const clock = fakeClock(0);
    enroll("test-seq", { email: "a@b.c" }, clock.now);
    const r = await tick({ clock: clock.now, send, render });
    expect(r.sent).toBe(1);
    expect(sends).toHaveLength(1);
    expect(sends[0].subject).toBe("subj:welcome");
  });

  it("does not resend an already-sent step on a later tick", async () => {
    const clock = fakeClock(0);
    enroll("test-seq", { email: "a@b.c" }, clock.now);
    await tick({ clock: clock.now, send, render });
    clock.advance(delay.hours(1).ms); // still before day 1
    const r = await tick({ clock: clock.now, send, render });
    expect(r.sent).toBe(0);
    expect(sends).toHaveLength(1);
  });

  it("advances to the next step once its delay elapses", async () => {
    const clock = fakeClock(0);
    enroll("test-seq", { email: "a@b.c" }, clock.now);
    await tick({ clock: clock.now, send, render }); // s0
    clock.advance(delay.days(1).ms);
    await tick({ clock: clock.now, send, render }); // s1
    expect(sends).toHaveLength(2);
  });

  it("fires multiple due steps in one tick after a long gap", async () => {
    const clock = fakeClock(0);
    enroll("test-seq", { email: "a@b.c" }, clock.now);
    clock.advance(delay.days(5).ms); // all three due
    const r = await tick({ clock: clock.now, send, render });
    expect(r.sent).toBe(3);
    expect(r.completed).toBe(1);
  });

  it("skips a step whose condition is false and still completes", async () => {
    const clock = fakeClock(0);
    const e = enroll("test-seq", { email: "a@b.c" }, clock.now);
    updateContext(e.id, { attributes: { activated: true } });
    clock.advance(delay.days(5).ms);
    const r = await tick({ clock: clock.now, send, render });
    expect(r.sent).toBe(2); // s0 + s1
    expect(r.skipped).toBe(1); // s2 gated off
    expect(r.completed).toBe(1);
  });

  it("does nothing for a cancelled enrollment", async () => {
    const clock = fakeClock(0);
    const e = enroll("test-seq", { email: "a@b.c" }, clock.now);
    cancelEnrollment(e.id);
    const r = await tick({ clock: clock.now, send, render });
    expect(r.processed).toBe(0);
    expect(sends).toHaveLength(0);
  });

  it("records send history with outcomes and ids", async () => {
    const clock = fakeClock(0);
    enroll("test-seq", { email: "a@b.c" }, clock.now);
    const r = await tick({ clock: clock.now, send, render });
    expect(r.actions[0]).toMatchObject({ stepId: "s0", outcome: "sent" });
    expect(r.actions[0].sendId).toBeTruthy();
  });

  it("built-in onboarding gates the getting-started step on verified", async () => {
    const seq = getSequence("onboarding")!;
    const clock = fakeClock(0);
    const e = enroll("onboarding", { email: "o@x.co" }, clock.now);
    // day 0: verify sends
    await tick({ clock: clock.now, send, render });
    clock.advance(delay.hours(1).ms);
    // not verified => second step skipped
    let r = await tick({ clock: clock.now, send, render });
    expect(r.skipped).toBe(1);
    expect(seq.steps).toHaveLength(2);
    void e;
    r = await tick({ clock: clock.now, send, render });
    expect(r.processed).toBe(0); // completed, no longer active
  });
});
