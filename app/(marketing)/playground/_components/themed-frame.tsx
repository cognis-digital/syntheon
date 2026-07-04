"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A self-contained theming boundary for the live component previews.
 *
 * It writes the full Syntheon token set (light or dark, mirroring
 * `app/globals.css`) as inline CSS variables on a wrapper, applies the `.dark`
 * class so Tailwind `dark:` variants resolve *inside the frame only*, and
 * overrides the brand tokens (`--primary`, `--ring`, `--accent`) with the
 * visitor's chosen color. This lets the preview flip light/dark and swap brand
 * color independently of the surrounding page — no global theme provider, no
 * flash, fully edge-safe.
 */

type Tokens = Record<string, string>;

const LIGHT: Tokens = {
  "--background": "0 0% 100%",
  "--foreground": "260 25% 11%",
  "--card": "0 0% 100%",
  "--card-foreground": "260 25% 11%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "260 25% 11%",
  "--primary": "262 83% 58%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "260 30% 96%",
  "--secondary-foreground": "260 25% 20%",
  "--muted": "260 30% 96%",
  "--muted-foreground": "260 10% 45%",
  "--accent": "271 91% 65%",
  "--accent-foreground": "0 0% 100%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "260 20% 90%",
  "--input": "260 20% 90%",
  "--ring": "262 83% 58%",
  "--radius": "0.65rem",
};

const DARK: Tokens = {
  "--background": "260 30% 6%",
  "--foreground": "260 15% 96%",
  "--card": "260 28% 9%",
  "--card-foreground": "260 15% 96%",
  "--popover": "260 28% 9%",
  "--popover-foreground": "260 15% 96%",
  "--primary": "262 83% 66%",
  "--primary-foreground": "260 30% 6%",
  "--secondary": "260 20% 16%",
  "--secondary-foreground": "260 15% 96%",
  "--muted": "260 20% 16%",
  "--muted-foreground": "260 10% 62%",
  "--accent": "271 91% 70%",
  "--accent-foreground": "260 30% 6%",
  "--destructive": "0 72% 51%",
  "--destructive-foreground": "260 15% 96%",
  "--border": "260 20% 18%",
  "--input": "260 20% 18%",
  "--ring": "262 83% 66%",
  "--radius": "0.65rem",
};

export interface ThemedFrameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Brand color as an HSL triple, e.g. "262 83% 58%". Overrides primary/ring. */
  brandColor: string;
  /** Render in the dark token set. */
  dark?: boolean;
}

export function ThemedFrame({
  brandColor,
  dark = false,
  className,
  children,
  style,
  ...props
}: ThemedFrameProps) {
  const tokens = dark ? DARK : LIGHT;
  const vars = {
    ...tokens,
    "--primary": brandColor,
    "--ring": brandColor,
    "--accent": brandColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "bg-background text-foreground transition-colors duration-500",
        dark && "dark",
        className,
      )}
      style={{ ...vars, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
