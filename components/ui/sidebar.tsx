"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (onOpenChange) onOpenChange(value);
      else setInternalOpen(value);
    },
    [onOpenChange],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((v) => !v);
    else setOpen(!open);
  }, [isMobile, open, setOpen]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        ref={ref}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn("flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { side?: "left" | "right" }
>(({ side = "left", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className="w-[--sidebar-width] bg-card p-0"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      data-state={state}
      className={cn(
        "hidden h-svh flex-col border-r bg-card text-card-foreground transition-[width] duration-200 ease-linear md:flex",
        state === "expanded" ? "w-[--sidebar-width]" : "w-[--sidebar-width-icon]",
        side === "right" && "order-last border-l border-r-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn("relative flex min-h-svh flex-1 flex-col bg-background", className)}
      {...props}
    />
  ),
);
SidebarInset.displayName = "SidebarInset";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2", className)}
      {...props}
    />
  ),
);
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex w-full flex-col p-2", className)} {...props} />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-8 shrink-0 items-center px-2 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full text-sm", className)} {...props} />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex w-full flex-col gap-1", className)} {...props} />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("relative", className)} {...props} />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { isActive?: boolean; asChild?: boolean }
>(({ className, isActive, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-ring transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn("mx-2 w-auto bg-border", className)} {...props} />
));
SidebarSeparator.displayName = "SidebarSeparator";

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
};
