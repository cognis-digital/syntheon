import type { Metadata } from "next";

import { LegalPage } from "../_components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Syntheon",
  description:
    "How Syntheon handles data. Short version: the open-source builder runs locally and sends nothing anywhere.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="January 2026">
      <p>
        Syntheon is a local-first, open-source tool. This policy explains what the software does and
        does not do with your data. It is provided for transparency and is not legal advice.
      </p>

      <h2>The builder runs on your machine</h2>
      <p>
        The Syntheon generation engine executes locally against your own model fleet. Your source
        code, prompts, and menu selections do not leave your machine. There is no telemetry in the
        open-source tier — no usage tracking, no phone-home.
      </p>

      <h2>Optional cloud model escalation</h2>
      <p>
        If you explicitly enable cloud model escalation (off by default), the specific unit that
        failed local repair — its code and diagnostics — is sent to the provider you configured
        (for example Claude or OpenAI), under that provider&apos;s terms. Nothing is escalated
        without your opt-in.
      </p>

      <h2>Third-party integrations</h2>
      <p>
        Integration adapters (Stripe, Clerk, HubSpot, and others) act only with credentials you
        supply, and communicate directly with those services on your behalf. Keys are read from your
        environment and are never committed or transmitted to Syntheon.
      </p>

      <h2>The marketing website</h2>
      <p>
        This website may use privacy-respecting, aggregate analytics to understand traffic. It does
        not sell personal data. Contact us to exercise any data rights available in your
        jurisdiction.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email privacy@syntheon.dev or open a discussion on GitHub.
      </p>
    </LegalPage>
  );
}
