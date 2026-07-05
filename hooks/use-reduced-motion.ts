"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Whether the user has requested reduced motion. Built on {@link useMediaQuery}
 * so it stays SSR-safe (returns `false` on the server, hydrates to the real
 * preference). Every animated surface in the playground gates on this.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
