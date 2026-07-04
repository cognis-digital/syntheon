"use client";

// @radix-ui/react-toggle is not installed; accessible native equivalent (aria-pressed).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 min-w-8",
        lg: "h-10 px-3 min-w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, variant, size, pressed, defaultPressed, onPressedChange, onClick, ...props },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultPressed ?? false);
    const isControlled = pressed !== undefined;
    const on = isControlled ? pressed : internal;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={on}
        data-state={on ? "on" : "off"}
        className={cn(toggleVariants({ variant, size }), className)}
        onClick={(event) => {
          const next = !on;
          if (!isControlled) setInternal(next);
          onPressedChange?.(next);
          onClick?.(event);
        }}
        {...props}
      />
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
