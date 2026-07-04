import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  sendEmail,
  sendTemplate,
  setEmailTransport,
  activeProvider,
} from "./index";
import {
  logTransport,
  resendTransport,
  gmailTransport,
  clearSentLog,
  sentLog,
  __setResendModule,
  __setGmailModule,
} from "./transports";

const OLD_ENV = { ...process.env };

describe("email transport selection", () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.GMAIL_CLIENT_ID;
    delete process.env.GMAIL_CLIENT_SECRET;
    delete process.env.GMAIL_REFRESH_TOKEN;
    setEmailTransport(null);
    clearSentLog();
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    setEmailTransport(null);
    __setResendModule(null);
    __setGmailModule(null);
    clearSentLog();
    vi.restoreAllMocks();
  });

  it("falls back to the log transport with no keys", () => {
    expect(activeProvider()).toBe("log");
  });

  it("selects Resend when its key is present", () => {
    process.env.RESEND_API_KEY = "re_x";
    expect(activeProvider()).toBe("resend");
  });

  it("selects Gmail when only Gmail keys are present", () => {
    process.env.GMAIL_CLIENT_ID = "a";
    process.env.GMAIL_CLIENT_SECRET = "b";
    process.env.GMAIL_REFRESH_TOKEN = "c";
    expect(activeProvider()).toBe("gmail");
  });

  it("log transport records sends without dispatching", async () => {
    const res = await sendEmail({ to: "a@b.c", subject: "Hi", text: "yo" });
    expect(res.provider).toBe("log");
    expect(res.simulated).toBe(true);
    expect(sentLog).toHaveLength(1);
    expect(sentLog[0].subject).toBe("Hi");
  });

  it("sendTemplate renders subject + html from the template", async () => {
    setEmailTransport(logTransport);
    const res = await sendTemplate("welcome", { firstName: "Ada" }, { to: "ada@x.co" });
    expect(res.provider).toBe("log");
    expect(sentLog[0].subject).toMatch(/Welcome to Syntheon/);
    expect(sentLog[0].html).toContain("Ada");
  });

  it("resend transport delegates to the integration module", async () => {
    const sendEmailMock = vi.fn().mockResolvedValue({ id: "em_9" });
    __setResendModule({ isConfigured: () => true, sendEmail: sendEmailMock });
    setEmailTransport(resendTransport);
    const res = await sendEmail({ to: "a@b.c", subject: "S", html: "<p>x</p>" });
    expect(res.id).toBe("em_9");
    expect(res.provider).toBe("resend");
    expect(sendEmailMock).toHaveBeenCalled();
  });

  it("gmail transport maps html + delegates to the module", async () => {
    const sendEmailMock = vi.fn().mockResolvedValue({ id: "gm_1" });
    __setGmailModule({ isConfigured: () => true, sendEmail: sendEmailMock });
    setEmailTransport(gmailTransport);
    const res = await sendEmail({ to: "a@b.c", subject: "S", html: "<b>hi</b>" });
    expect(res.id).toBe("gm_1");
    expect(res.provider).toBe("gmail");
    expect(sendEmailMock.mock.calls[0][0]).toMatchObject({ html: true, body: "<b>hi</b>" });
  });
});
