import type { Metadata } from "next";

import { GalleryBrowser } from "./_components/gallery-browser";

export const metadata: Metadata = {
  title: "Component gallery — Syntheon",
  description:
    "Browse Syntheon's owned component library — searchable, categorized, with light/dark previews and live prop controls.",
};

/**
 * The Syntheon component gallery (issue #4): a searchable, categorized browser
 * of the owned UI library with per-tile light/dark preview and live prop
 * controls. Built entirely from existing components — the code you'd own.
 */
export default function GalleryPage() {
  return (
    <div className="container flex flex-col gap-8 py-12 md:py-16">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Component gallery
        </h1>
        <p className="text-pretty text-muted-foreground">
          Every component below ships in your generated app as source you own —
          no runtime dependency on Syntheon. Search, filter by category, preview
          in light or dark, and tweak props live.
        </p>
      </header>

      <GalleryBrowser />
    </div>
  );
}
