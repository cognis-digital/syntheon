"use client";

// Hover card built on @radix-ui/react-popover (react-hover-card is not installed).
// Opens on pointer-enter / focus, closes on leave / blur. See DEPS_NEEDED.md.
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

interface HoverCardContextValue {
  setOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
  timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}
const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

export interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function HoverCard({
  children,
  openDelay = 200,
  closeDelay = 150,
  open,
  defaultOpen,
  onOpenChange,
}: HoverCardProps) {
  const [internal, setInternal] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternal(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  return (
    <HoverCardContext.Provider value={{ setOpen, openDelay, closeDelay, timer }}>
      <PopoverPrimitive.Root open={isControlled ? open : internal} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
    </HoverCardContext.Provider>
  );
}

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => {
  const ctx = React.useContext(HoverCardContext);
  const schedule = (open: boolean) => {
    if (!ctx) return;
    if (ctx.timer.current) clearTimeout(ctx.timer.current);
    ctx.timer.current = setTimeout(() => ctx.setOpen(open), open ? ctx.openDelay : ctx.closeDelay);
  };
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
      onFocus={() => ctx?.setOpen(true)}
      onBlur={() => ctx?.setOpen(false)}
      {...props}
    />
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const ctx = React.useContext(HoverCardContext);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={() => ctx?.setOpen(true)}
        onMouseLeave={() => ctx?.setOpen(false)}
        className={cn(
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
