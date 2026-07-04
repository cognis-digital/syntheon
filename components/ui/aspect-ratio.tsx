"use client";

// @radix-ui/react-aspect-ratio is not installed; this is a small CSS-based equivalent
// with the same `ratio` prop. See DEPS_NEEDED.md.
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** width / height, e.g. 16 / 9. Defaults to 1. */
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    >
      {children}
    </div>
  ),
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
