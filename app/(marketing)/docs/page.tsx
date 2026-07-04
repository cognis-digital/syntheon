import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  Palette,
  FolderTree,
  Cpu,
  ListChecks,
  Blocks,
  Plug,
  ShieldCheck,
  Scale,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GITHUB_URL } from "../_components/site-nav";

export const metadata: Metadata = {
  title: "Docs — Syntheon",
  description:
    "Documentation for Syntheon: philosophy, design tokens, repository layout, the generation engine, the menu-driven builder, the component catalog, integrations, and the verification harness.",
};

/** Docs index mirrors the sections of DESIGN.md, the single source of truth. */
const TOPICS: {
  n: string;
  title: string;
  description: string;
  icon: typeof Compass;
  href: string;
}[] = [
  {
    n: "01",
    title: "Philosophy",
    description:
      "You own the code. Templates anchor quality; AI personalizes. Nothing ships unverified. Local-first, no lock-in.",
    icon: Compass,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#1-philosophy`,
  },
  {
    n: "02",
    title: "Design tokens",
    description:
      "The Cognis violet palette as HSL CSS variables, Inter type, spacing/layout rules, motion, and accessibility.",
    icon: Palette,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#2-design-tokens`,
  },
  {
    n: "03",
    title: "Repository layout",
    description:
      "How the app, components, lib, studio, and docs trees are organized — and how lane ownership keeps agents from colliding.",
    icon: FolderTree,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#3-repository-layout`,
  },
  {
    n: "04",
    title: "The generation engine",
    description:
      "Planner → coder → harness → integrate. Unit granularity, typed contracts, the repair loop, and model roles.",
    icon: Cpu,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#4-the-generation-engine`,
  },
  {
    n: "05",
    title: "Menu-driven builder",
    description:
      "The interactive TUI: project type, pages, auth, payments, scheduling, email, CRM, integrations, AI, and theme.",
    icon: ListChecks,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#5-menu-driven-builder`,
  },
  {
    n: "06",
    title: "Component & block catalog",
    description:
      "50+ typed UI primitives and composed blocks — every one dark-mode correct, a11y-checked, and shipped with a test.",
    icon: Blocks,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#6-component--block-catalog-target`,
  },
  {
    n: "07",
    title: "Integration catalog",
    description:
      "Each integration is a typed adapter with a client factory, webhook handler, env scaffold, setup guide, and tests.",
    icon: Plug,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#7-integration-catalog`,
  },
  {
    n: "08",
    title: "The verification harness",
    description:
      "typecheck → lint → test → build, on every unit and the whole project. The zero-errors guarantee, enforced in CI.",
    icon: ShieldCheck,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#8-the-verification-harness-zero-errors-guarantee`,
  },
  {
    n: "09",
    title: "Non-goals & honesty",
    description:
      "What Syntheon does not claim, how paid integrations ship, and the lines we won't cross.",
    icon: Scale,
    href: `${GITHUB_URL}/blob/main/DESIGN.md#9-non-goals--honesty`,
  },
];

export default function DocsPage() {
  return (
    <div className="container max-w-5xl py-16 md:py-20">
      <header className="mb-10 flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Documentation</p>
        <h1 className="text-balance text-4xl font-bold tracking-tight">Build with Syntheon</h1>
        <p className="max-w-[65ch] text-pretty text-muted-foreground">
          Syntheon&apos;s design system and generation architecture live in a single source of
          truth,{" "}
          <a
            href={`${GITHUB_URL}/blob/main/DESIGN.md`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            DESIGN.md
          </a>
          . Every contributor and every generation agent reads it first. The topics below map to its
          sections.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.n} className="group h-full transition-colors hover:border-primary/50">
              <Link href={topic.href} className="block h-full focus:outline-none">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">§{topic.n}</span>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          );
        })}
      </div>

      <section className="mt-12 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold tracking-tight">Quickstart</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Clone the repo, install dependencies, and launch the menu-driven builder against your
          local model.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border bg-[hsl(260_30%_8%)] p-4 font-mono text-xs text-violet-100/90">
          <code>{`git clone ${GITHUB_URL}
cd syntheon
npm install
npm run studio   # pick your features from the menu`}</code>
        </pre>
      </section>
    </div>
  );
}
