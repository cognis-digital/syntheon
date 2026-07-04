/**
 * Transactional email templates for Syntheon.
 *
 * Each template is a pure function of typed props → `RenderedTemplate`
 * (subject + html + text). They use a shared, inline-styled layout so they
 * render correctly in email clients (no external CSS) and carry the Cognis
 * violet accent. No react-email dependency required; these compose plain HTML
 * strings and are trivially testable. They can still be passed as `html` to any
 * transport.
 *
 * The palette mirrors DESIGN.md §2 (primary violet `hsl(262 83% 58%)`).
 */
import type { RenderedTemplate } from "./types";

const BRAND = "Syntheon";
const PRIMARY = "#7c3aed"; // hsl(262 83% 58%) — Cognis violet
const FG = "#0f0a1e";
const MUTED = "#6b7280";

/** HTML-escape a string for safe interpolation into email markup. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface LayoutOptions {
  heading: string;
  bodyHtml: string;
  cta?: { label: string; url: string };
  footerNote?: string;
}

/** Wrap body content in the branded, email-safe layout. */
function layout({ heading, bodyHtml, cta, footerNote }: LayoutOptions): string {
  const button = cta
    ? `<tr><td style="padding:8px 0 24px;">
         <a href="${escapeHtml(cta.url)}"
            style="display:inline-block;background:${PRIMARY};color:#ffffff;
                   text-decoration:none;padding:12px 22px;border-radius:10px;
                   font-weight:600;font-size:15px;">${escapeHtml(cta.label)}</a>
       </td></tr>`
    : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:#f5f3ff;
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;padding:32px 0;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0"
       style="background:#ffffff;border-radius:16px;padding:32px;max-width:480px;
              box-shadow:0 1px 3px rgba(16,10,30,0.08);">
  <tr><td style="padding-bottom:16px;">
    <span style="font-weight:800;font-size:20px;letter-spacing:-0.02em;color:${PRIMARY};">${BRAND}</span>
  </td></tr>
  <tr><td style="font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${FG};padding-bottom:12px;">
    ${escapeHtml(heading)}
  </td></tr>
  <tr><td style="font-size:15px;line-height:1.6;color:${FG};padding-bottom:20px;">
    ${bodyHtml}
  </td></tr>
  ${button}
  <tr><td style="border-top:1px solid #ede9fe;padding-top:16px;font-size:12px;color:${MUTED};">
    ${escapeHtml(footerNote ?? `You are receiving this because you signed up for ${BRAND}.`)}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

/* -------------------------------------------------------------------------- */
/* Templates                                                                  */
/* -------------------------------------------------------------------------- */

export interface WelcomeProps {
  firstName?: string;
  dashboardUrl?: string;
}

export function welcomeEmail(props: WelcomeProps = {}): RenderedTemplate {
  const name = props.firstName ? `, ${props.firstName}` : "";
  const subject = `Welcome to ${BRAND}`;
  const bodyHtml = `You're in${escapeHtml(name)}. ${BRAND} lets you build a full-stack app
    from a menu — your local AI generates and debugs the code until it's green, and you own
    every line. Pick your features and let's build.`;
  const text = `Welcome to ${BRAND}${props.firstName ? `, ${props.firstName}` : ""}.

You're in. ${BRAND} lets you build a full-stack app from a menu — your local AI generates and debugs the code until it's green, and you own every line.

${props.dashboardUrl ? `Get started: ${props.dashboardUrl}` : ""}`.trim();
  return {
    subject,
    html: layout({
      heading: subject,
      bodyHtml,
      cta: props.dashboardUrl
        ? { label: "Open your dashboard", url: props.dashboardUrl }
        : undefined,
    }),
    text,
  };
}

export interface VerifyProps {
  verifyUrl: string;
  firstName?: string;
  code?: string;
}

export function verifyEmail(props: VerifyProps): RenderedTemplate {
  const subject = `Verify your ${BRAND} email`;
  const codeLine = props.code
    ? `<p style="font-size:14px;color:${MUTED};margin:8px 0 0;">Or enter this code:
        <strong style="color:${FG};letter-spacing:2px;">${escapeHtml(props.code)}</strong></p>`
    : "";
  const bodyHtml = `Confirm your email address to activate your ${BRAND} account.
    This link expires in 24 hours.${codeLine}`;
  const text = `Verify your ${BRAND} email.

Confirm your email by opening: ${props.verifyUrl}
${props.code ? `Or enter this code: ${props.code}` : ""}
This link expires in 24 hours.`.trim();
  return {
    subject,
    html: layout({
      heading: "Confirm your email",
      bodyHtml,
      cta: { label: "Verify email", url: props.verifyUrl },
    }),
    text,
  };
}

export interface ResetProps {
  resetUrl: string;
  firstName?: string;
}

export function resetPasswordEmail(props: ResetProps): RenderedTemplate {
  const subject = `Reset your ${BRAND} password`;
  const bodyHtml = `We received a request to reset your ${BRAND} password. Click below to
    choose a new one. If you didn't request this, you can safely ignore this email — your
    password won't change. This link expires in 1 hour.`;
  const text = `Reset your ${BRAND} password.

Choose a new password: ${props.resetUrl}
If you didn't request this, ignore this email. This link expires in 1 hour.`;
  return {
    subject,
    html: layout({
      heading: "Reset your password",
      bodyHtml,
      cta: { label: "Reset password", url: props.resetUrl },
      footerNote: `If you didn't request a password reset, no action is needed.`,
    }),
    text,
  };
}

export interface WaitlistApprovedProps {
  firstName?: string;
  activateUrl?: string;
}

export function waitlistApprovedEmail(
  props: WaitlistApprovedProps = {},
): RenderedTemplate {
  const name = props.firstName ? `, ${props.firstName}` : "";
  const subject = `You're off the ${BRAND} waitlist`;
  const bodyHtml = `Good news${escapeHtml(name)} — your spot on the ${BRAND} waitlist is
    approved. Your account is ready to activate. Welcome aboard.`;
  const text = `You're off the ${BRAND} waitlist${props.firstName ? `, ${props.firstName}` : ""}!

Your account is ready to activate.
${props.activateUrl ? `Activate: ${props.activateUrl}` : ""}`.trim();
  return {
    subject,
    html: layout({
      heading: "You're approved 🎉",
      bodyHtml,
      cta: props.activateUrl
        ? { label: "Activate your account", url: props.activateUrl }
        : undefined,
    }),
    text,
  };
}

/** Registry of templates by key, for the sequence engine to resolve by name. */
export const templates = {
  welcome: welcomeEmail,
  verify: verifyEmail,
  reset: resetPasswordEmail,
  "waitlist-approved": waitlistApprovedEmail,
} as const;

export type TemplateKey = keyof typeof templates;
