import type { Metadata } from "next";

import { Playground } from "./_components/playground";

export const metadata: Metadata = {
  title: "Playground — try Syntheon in your browser",
  description:
    "Configure a full-stack app the way the Syntheon CLI does — pick features, watch the real build plan and generation pipeline, preview live-themed components, and copy the exact syntheon.config.json to run locally. No install, no backend.",
};

/**
 * The viral centerpiece: a fully client-side, offline-capable playground that
 * mirrors the `studio` CLI using the same registry. Statically renderable — the
 * interactive surface lives entirely in the `Playground` client component.
 */
export default function PlaygroundPage() {
  return <Playground />;
}
