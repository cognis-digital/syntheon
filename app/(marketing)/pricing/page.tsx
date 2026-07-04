import type { Metadata } from "next";

import { PricingTable } from "@/components/blocks/pricing-table";
import { Faq } from "@/components/blocks/faq";
import { Cta } from "@/components/blocks/cta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GITHUB_URL } from "../_components/site-nav";
import { PRICING_TIERS, FAQ_ITEMS } from "../_components/content";

export const metadata: Metadata = {
  title: "Pricing — Syntheon",
  description:
    "Syntheon is free and open source to self-host forever. Team and Enterprise tiers add shared registries, cloud model escalation, SSO, and support.",
};

const COMPARISON: { capability: string; oss: string; team: string; ent: string }[] = [
  { capability: "Menu-driven builder", oss: "Yes", team: "Yes", ent: "Yes" },
  { capability: "Local generation engine", oss: "Yes", team: "Yes", ent: "Yes" },
  { capability: "Verification harness", oss: "Yes", team: "Yes", ent: "Yes" },
  { capability: "Integration adapters", oss: "All", team: "All", ent: "All + custom" },
  { capability: "Shared registry", oss: "—", team: "Yes", ent: "Yes" },
  { capability: "Cloud model escalation", oss: "—", team: "Optional", ent: "Optional" },
  { capability: "SSO / SAML + RBAC", oss: "—", team: "—", ent: "Yes" },
  { capability: "Air-gapped deploy", oss: "Self-host", team: "Self-host", ent: "Managed" },
  { capability: "Support", oss: "Community", team: "Priority", ent: "SLA" },
];

export default function PricingPage() {
  return (
    <>
      <PricingTable
        className="pt-16 md:pt-24"
        heading="Free to own. Priced for teams."
        subheading="Start on the open-source tier and self-host forever. Upgrade when you want shared registries, cloud escalation, or enterprise controls."
        tiers={PRICING_TIERS}
      />

      {/* Comparison table */}
      <section className="w-full py-8">
        <div className="container max-w-4xl">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <caption className="sr-only">Plan comparison</caption>
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Capability
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Open Source
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Team
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.capability} className="border-t">
                    <th scope="row" className="px-4 py-3 text-left font-medium">
                      {row.capability}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{row.oss}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.team}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise callout */}
      <section id="enterprise" className="w-full scroll-mt-20 py-8">
        <div className="container max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise & regulated deployments</CardTitle>
              <CardDescription>
                Air-gapped fleets, SSO/SAML, custom registries, and a support SLA. Talk to us about
                a deployment that never leaves your network.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reach out at{" "}
              <a
                href="mailto:sales@syntheon.dev"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                sales@syntheon.dev
              </a>{" "}
              or open a discussion on{" "}
              <a
                href={GITHUB_URL}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                GitHub
              </a>
              .
            </CardContent>
          </Card>
        </div>
      </section>

      <Faq heading="Pricing questions" items={FAQ_ITEMS} />

      <Cta
        variant="card"
        title="Not sure which tier?"
        description="Start free on the open-source tier — nothing to lose, and you keep every line either way."
        primaryAction={{ label: "Clone on GitHub", href: GITHUB_URL }}
        secondaryAction={{ label: "Read the docs", href: "/docs" }}
      />
    </>
  );
}
