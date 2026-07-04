/**
 * Email automation-sequence engine for Syntheon.
 *
 * Define a sequence as an ordered list of steps; each step has a delay (from
 * enrollment) and an optional condition. Enroll a contact, then run the
 * scheduler `tick()` — it sends any steps that are now due and whose condition
 * holds, advancing per-enrollment state. The tick is a pure-ish function of an
 * injected clock and an injected send fn, so it is fully testable without real
 * sends or real time.
 *
 * Built-in sequences: welcome-drip, onboarding, win-back. Callers can register
 * their own with `defineSequence`.
 */
import type { TemplateKey } from "./templates";
import type { EmailMessage, SendResult } from "./types";

/** Facts about a contact the engine evaluates conditions against. */
export interface ContactContext {
  email: string;
  firstName?: string;
  /** arbitrary flags the app updates over the contact's lifetime */
  attributes?: Record<string, unknown>;
}

/** A condition gates whether a step sends. Returns true to send. */
export type StepCondition = (ctx: ContactContext) => boolean;

export interface SequenceStep {
  /** stable id, unique within the sequence */
  id: string;
  /** template to render + send */
  template: TemplateKey;
  /** props passed to the template; may derive from the contact context */
  props?: (ctx: ContactContext) => Record<string, unknown>;
  /** delay from enrollment before this step is eligible */
  delay: { ms: number };
  /** optional gate; when it returns false the step is SKIPPED (not retried) */
  condition?: StepCondition;
}

export interface Sequence {
  id: string;
  label: string;
  steps: SequenceStep[];
}

/** Convenience delay builders. */
export const delay = {
  ms: (n: number) => ({ ms: n }),
  minutes: (n: number) => ({ ms: n * 60_000 }),
  hours: (n: number) => ({ ms: n * 3_600_000 }),
  days: (n: number) => ({ ms: n * 86_400_000 }),
};

/* -------------------------------------------------------------------------- */
/* Registry                                                                   */
/* -------------------------------------------------------------------------- */

const _sequences = new Map<string, Sequence>();

/** Register (or replace) a sequence. */
export function defineSequence(seq: Sequence): Sequence {
  _sequences.set(seq.id, seq);
  return seq;
}

export function getSequence(id: string): Sequence | undefined {
  return _sequences.get(id);
}

export function listSequences(): Sequence[] {
  return [..._sequences.values()];
}

/* -------------------------------------------------------------------------- */
/* Enrollment state                                                           */
/* -------------------------------------------------------------------------- */

export type StepOutcome = "sent" | "skipped";

export interface Enrollment {
  id: string;
  sequenceId: string;
  contact: ContactContext;
  enrolledAt: number;
  /** index of the next step to consider */
  cursor: number;
  status: "active" | "completed" | "cancelled";
  /** history keyed by step id */
  history: { stepId: string; at: number; outcome: StepOutcome; sendId?: string }[];
}

export interface EnrollmentStore {
  put(e: Enrollment): void;
  get(id: string): Enrollment | null;
  active(): Enrollment[];
  clear(): void;
}

function memoryEnrollmentStore(): EnrollmentStore {
  const rows = new Map<string, Enrollment>();
  return {
    put: (e) => void rows.set(e.id, e),
    get: (id) => rows.get(id) ?? null,
    active: () => [...rows.values()].filter((e) => e.status === "active"),
    clear: () => rows.clear(),
  };
}

let _store: EnrollmentStore | null = null;
function store(): EnrollmentStore {
  if (!_store) _store = memoryEnrollmentStore();
  return _store;
}

/** Test seam: inject an enrollment store (reset with `null`). */
export function __setEnrollmentStore(s: EnrollmentStore | null): void {
  _store = s;
}

/* -------------------------------------------------------------------------- */
/* Engine                                                                     */
/* -------------------------------------------------------------------------- */

/** Injected clock — defaults to Date.now, overridable in tests. */
export type Clock = () => number;

/** Injected send fn — defaults to the active transport via `lib/email`. */
export type SendFn = (message: EmailMessage) => Promise<SendResult>;

export interface EngineDeps {
  clock?: Clock;
  send?: SendFn;
  /** render a template key + props to an email body */
  render?: (
    template: TemplateKey,
    props: Record<string, unknown>,
  ) => { subject: string; html: string; text: string };
}

/** Enroll a contact into a sequence. Returns the new enrollment. */
export function enroll(
  sequenceId: string,
  contact: ContactContext,
  clock: Clock = Date.now,
): Enrollment {
  const seq = getSequence(sequenceId);
  if (!seq) throw new Error(`unknown sequence: ${sequenceId}`);
  const enrollment: Enrollment = {
    id: `enr_${clock().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    sequenceId,
    contact,
    enrolledAt: clock(),
    cursor: 0,
    status: "active",
    history: [],
  };
  store().put(enrollment);
  return enrollment;
}

/** Cancel an active enrollment (e.g. contact converted / unsubscribed). */
export function cancelEnrollment(id: string): void {
  const e = store().get(id);
  if (e && e.status === "active") {
    e.status = "cancelled";
    store().put(e);
  }
}

/** Update the contact context on an enrollment (drives conditions). */
export function updateContext(
  id: string,
  patch: Partial<ContactContext> & {
    attributes?: Record<string, unknown>;
  },
): Enrollment | null {
  const e = store().get(id);
  if (!e) return null;
  e.contact = {
    ...e.contact,
    ...patch,
    attributes: { ...(e.contact.attributes ?? {}), ...(patch.attributes ?? {}) },
  };
  store().put(e);
  return e;
}

export interface TickResult {
  processed: number;
  sent: number;
  skipped: number;
  completed: number;
  actions: {
    enrollmentId: string;
    stepId: string;
    outcome: StepOutcome;
    sendId?: string;
  }[];
}

/**
 * Advance one enrollment as far as it can go at time `now`: send every step
 * that is due (delay elapsed) and whose condition holds; skip steps whose
 * condition fails; stop at the first not-yet-due step. Multiple steps can fire
 * in a single tick if they're all due (e.g. after a long gap).
 */
async function advance(
  enrollment: Enrollment,
  seq: Sequence,
  now: number,
  send: SendFn,
  render: NonNullable<EngineDeps["render"]>,
  result: TickResult,
): Promise<void> {
  while (enrollment.cursor < seq.steps.length) {
    const step = seq.steps[enrollment.cursor];
    const dueAt = enrollment.enrolledAt + step.delay.ms;
    if (now < dueAt) break; // not due yet; try again next tick

    const props = step.props ? step.props(enrollment.contact) : {};
    const shouldSend = step.condition ? step.condition(enrollment.contact) : true;

    if (shouldSend) {
      const body = render(step.template, {
        firstName: enrollment.contact.firstName,
        ...props,
      });
      const res = await send({
        to: enrollment.contact.email,
        subject: body.subject,
        html: body.html,
        text: body.text,
      });
      enrollment.history.push({
        stepId: step.id,
        at: now,
        outcome: "sent",
        sendId: res.id,
      });
      result.sent += 1;
      result.actions.push({
        enrollmentId: enrollment.id,
        stepId: step.id,
        outcome: "sent",
        sendId: res.id,
      });
    } else {
      enrollment.history.push({ stepId: step.id, at: now, outcome: "skipped" });
      result.skipped += 1;
      result.actions.push({
        enrollmentId: enrollment.id,
        stepId: step.id,
        outcome: "skipped",
      });
    }
    enrollment.cursor += 1;
  }

  if (enrollment.cursor >= seq.steps.length) {
    enrollment.status = "completed";
    result.completed += 1;
  }
  store().put(enrollment);
}

/**
 * Run the scheduler once over all active enrollments. Deterministic and
 * side-effect-free except for the injected `send`, so tests drive it with a
 * fake clock + mock send and assert on `TickResult`.
 */
export async function tick(deps: EngineDeps = {}): Promise<TickResult> {
  const now = (deps.clock ?? Date.now)();
  const send = deps.send ?? (await defaultSend());
  const render = deps.render ?? (await defaultRender());
  const result: TickResult = {
    processed: 0,
    sent: 0,
    skipped: 0,
    completed: 0,
    actions: [],
  };
  for (const enrollment of store().active()) {
    const seq = getSequence(enrollment.sequenceId);
    if (!seq) {
      enrollment.status = "cancelled";
      store().put(enrollment);
      continue;
    }
    result.processed += 1;
    await advance(enrollment, seq, now, send, render, result);
  }
  return result;
}

/** Default send: the active transport from `lib/email`. */
async function defaultSend(): Promise<SendFn> {
  const mod = await import("./index");
  return (message) => mod.sendEmail(message);
}

/** Default render: resolve a template from the registry. */
async function defaultRender(): Promise<NonNullable<EngineDeps["render"]>> {
  const { templates } = await import("./templates");
  return (template, props) => {
    const fn = templates[template] as (p: unknown) => {
      subject: string;
      html: string;
      text: string;
    };
    return fn(props);
  };
}

/* -------------------------------------------------------------------------- */
/* Built-in sequences                                                         */
/* -------------------------------------------------------------------------- */

/** welcome-drip: welcome now, nudge at day 3 (only if not yet activated). */
export const welcomeDrip = defineSequence({
  id: "welcome-drip",
  label: "Welcome drip",
  steps: [
    {
      id: "welcome",
      template: "welcome",
      delay: delay.ms(0),
      props: (c) => ({ firstName: c.firstName }),
    },
    {
      id: "nudge-day-3",
      template: "welcome",
      delay: delay.days(3),
      // Only nudge people who haven't activated yet.
      condition: (c) => c.attributes?.activated !== true,
    },
  ],
});

/** onboarding: verify immediately, then a getting-started welcome at 1 hour. */
export const onboarding = defineSequence({
  id: "onboarding",
  label: "Onboarding",
  steps: [
    {
      id: "verify",
      template: "verify",
      delay: delay.ms(0),
      props: (c) => ({
        verifyUrl:
          (c.attributes?.verifyUrl as string) ??
          "https://example.com/verify",
        firstName: c.firstName,
      }),
    },
    {
      id: "getting-started",
      template: "welcome",
      delay: delay.hours(1),
      condition: (c) => c.attributes?.verified === true,
      props: (c) => ({
        firstName: c.firstName,
        dashboardUrl:
          (c.attributes?.dashboardUrl as string) ??
          "https://example.com/app",
      }),
    },
  ],
});

/** win-back: re-engage a churned contact at day 1 and day 7, if still churned. */
export const winBack = defineSequence({
  id: "win-back",
  label: "Win-back",
  steps: [
    {
      id: "win-back-1",
      template: "waitlist-approved",
      delay: delay.days(1),
      condition: (c) => c.attributes?.reactivated !== true,
    },
    {
      id: "win-back-2",
      template: "waitlist-approved",
      delay: delay.days(7),
      condition: (c) => c.attributes?.reactivated !== true,
    },
  ],
});
