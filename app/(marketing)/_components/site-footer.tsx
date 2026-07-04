import { Github } from "lucide-react";

import { Footer } from "@/components/blocks/footer";
import { GITHUB_URL } from "./site-nav";

/**
 * The marketing site footer. Composes the shared `Footer` block with
 * Syntheon's link columns. Page-specific data only.
 */
export function SiteFooter() {
  return (
    <Footer
      brand={
        <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-[0.4rem] bg-gradient-to-br from-primary to-accent"
          />
          Syntheon
        </span>
      }
      description="The open-source, local-AI full-stack web app builder. Pick your features from a menu; the model generates and debugs the code until zero errors. You own every line."
      social={
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Syntheon on GitHub"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-5 w-5" />
        </a>
      }
      columns={[
        {
          title: "Product",
          links: [
            { label: "Features", href: "/#features" },
            { label: "How it works", href: "/#engine" },
            { label: "Pricing", href: "/pricing" },
            { label: "Integrations", href: "/#integrations" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Docs", href: "/docs" },
            { label: "Blog", href: "/blog" },
            { label: "GitHub", href: GITHUB_URL },
            { label: "Changelog", href: "/blog" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "License", href: `${GITHUB_URL}/blob/main/LICENSE` },
          ],
        },
      ]}
    />
  );
}
