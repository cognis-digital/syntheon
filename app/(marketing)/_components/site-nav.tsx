import Link from "next/link";
import { Github } from "lucide-react";

import { Navbar } from "@/components/blocks/navbar";
import { Button } from "@/components/ui/button";

/** Canonical GitHub home for the project. */
export const GITHUB_URL = "https://github.com/cognis-digital/syntheon";

/** Primary marketing navigation, shared across every marketing route. */
export const marketingLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#engine" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

/**
 * The marketing site header. Composes the shared `Navbar` block with
 * Syntheon-specific brand, links, and calls to action. Page-specific glue only
 * — the reusable primitive lives in `@/components/blocks/navbar`.
 */
export function SiteNav() {
  return (
    <Navbar
      brand={
        <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-[0.4rem] bg-gradient-to-br from-primary to-accent"
          />
          Syntheon
        </span>
      }
      links={marketingLinks}
      actions={
        <>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button asChild>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Github />
              Star on GitHub
            </a>
          </Button>
        </>
      }
    />
  );
}
