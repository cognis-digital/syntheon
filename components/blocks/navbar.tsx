"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand mark / logo node. Defaults to the Syntheon wordmark. */
  brand?: React.ReactNode;
  links?: NavLink[];
  /** Right-aligned actions (e.g. sign-in / get-started buttons). */
  actions?: React.ReactNode;
  sticky?: boolean;
}

const defaultBrand = (
  <span className="text-lg font-bold tracking-tight">Syntheon</span>
);

export function Navbar({
  brand = defaultBrand,
  links = [],
  actions,
  sticky = true,
  className,
  ...props
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        sticky && "sticky top-0",
        className,
      )}
      {...props}
    >
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            {brand}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">{actions}</div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{brand}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              {actions && <div className="mt-6 flex flex-col gap-2">{actions}</div>}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
