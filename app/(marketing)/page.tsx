import type { Metadata } from "next";

import { FeatureGrid } from "@/components/blocks/feature-grid";
import { LogoCloud } from "@/components/blocks/logo-cloud";
import { PricingTable } from "@/components/blocks/pricing-table";
import { Faq } from "@/components/blocks/faq";
import { Cta } from "@/components/blocks/cta";
import { Stats } from "@/components/blocks/stats";
import { TestimonialWall } from "@/components/blocks/testimonial-wall";

import { GITHUB_URL } from "./_components/site-nav";
import { HeroShowcase } from "./_components/hero-showcase";
import { EngineSection } from "./_components/engine-section";
import {
  FEATURES,
  INTEGRATIONS,
  PRICING_TIERS,
  FAQ_ITEMS,
  TESTIMONIALS,
} from "./_components/content";

export const metadata: Metadata = {
  title: "Syntheon — build your app, own every line",
  description:
    "The open-source, local-AI full-stack web app builder. Pick features from a menu; the local model generates and debugs the code until zero errors. No cloud dependency, no lock-in.",
};

export default function LandingPage() {
  return (
    <>
      {/* Hero — leads with the interactive playground */}
      <section className="relative w-full overflow-hidden pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-gradient-to-b from-primary/10 via-accent/5 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl"
        />
        <HeroShowcase githubUrl={GITHUB_URL} />
      </section>

      {/* Integration logo cloud */}
      <div id="integrations" className="scroll-mt-20 border-y bg-muted/30">
        <LogoCloud
          heading="Typed adapters for the services you already use"
          logos={INTEGRATIONS.map((name) => (
            <span key={name} className="text-base font-semibold tracking-tight">
              {name}
            </span>
          ))}
        />
      </div>

      {/* Feature grid — the pillars */}
      <div id="features" className="scroll-mt-20">
        <FeatureGrid
          heading="A builder that respects your codebase"
          subheading="Curated substrate for quality, local AI for personalization, and a verification harness that refuses to ship red."
          features={FEATURES}
          columns={4}
        />
      </div>

      {/* Stats band */}
      <div className="border-y bg-muted/30">
        <Stats
          stats={[
            { value: "50+", label: "typed UI primitives", description: "each with a test" },
            { value: "18+", label: "integration adapters", description: "bring your own keys" },
            { value: "4", label: "verification gates", description: "typecheck · lint · test · build" },
            { value: "$0", label: "to self-host", description: "no telemetry, no lock-in" },
          ]}
        />
      </div>

      {/* How the engine works */}
      <EngineSection />

      {/* Social proof */}
      <div className="border-t bg-muted/20">
        <TestimonialWall
          heading="Built by people who don't trust unverified AI output"
          subheading="Early-access placeholders — replace with your own once you ship."
          testimonials={TESTIMONIALS}
        />
      </div>

      {/* Pricing */}
      <div id="pricing" className="scroll-mt-20">
        <PricingTable
          heading="Free to own. Priced for teams."
          subheading="Start on the open-source tier and self-host forever. Upgrade when you want shared registries, cloud escalation, or enterprise controls."
          tiers={PRICING_TIERS}
        />
      </div>

      {/* FAQ */}
      <Faq
        heading="Questions, answered honestly"
        subheading="No dark patterns, no overclaiming — here's exactly how it works."
        items={FAQ_ITEMS}
      />

      {/* Final CTA */}
      <Cta
        variant="banner"
        title="Clone it. Run it locally. Own every line."
        description="Syntheon is open source. Try the interactive playground, star the repo, run the menu-driven builder against your local model, and ship an app you fully control."
        primaryAction={{ label: "Try it live", href: "/playground" }}
        secondaryAction={{ label: "Star on GitHub", href: GITHUB_URL }}
      />
    </>
  );
}
