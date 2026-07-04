import type { Metadata } from "next";

import { LegalPage } from "../_components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — Syntheon",
  description:
    "The terms under which you may use the Syntheon software and website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="January 2026">
      <p>
        These terms govern your use of the Syntheon software and website. By using them, you agree
        to what follows. This is provided for transparency and is not legal advice.
      </p>

      <h2>License</h2>
      <p>
        The Syntheon open-source project is provided under the license in the repository. Code you
        generate with Syntheon is yours — the tool copies components into your project and imposes
        no runtime dependency or claim on your output.
      </p>

      <h2>No warranty</h2>
      <p>
        The software is provided &ldquo;as is,&rdquo; without warranty of any kind. While the
        verification harness enforces typecheck, lint, test, and build gates, you are responsible
        for reviewing and testing generated code before deploying it to production.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not use Syntheon to build systems that violate applicable law, infringe others&apos;
        rights, or facilitate abuse. Syntheon does not scrape data for resale, and does not handle
        third-party credentials on your behalf — you bring and control your own keys.
      </p>

      <h2>Paid tiers</h2>
      <p>
        Team and Enterprise subscriptions are billed as described on the pricing page. Integrations
        that require paid third-party accounts (such as Stripe or Clerk) are your responsibility
        under those providers&apos; terms.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms; material changes will be reflected in the &ldquo;last
        updated&rdquo; date. Continued use after a change constitutes acceptance.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms? Email legal@syntheon.dev.</p>
    </LegalPage>
  );
}
