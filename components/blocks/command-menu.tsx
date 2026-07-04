"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export interface CommandMenuAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  shortcut?: string;
  keywords?: string[];
  onSelect?: () => void;
}

export interface CommandMenuGroup {
  heading?: string;
  items: CommandMenuAction[];
}

export interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups: CommandMenuGroup[];
  placeholder?: string;
  emptyMessage?: string;
  /** Bind Cmd/Ctrl+K to toggle. Only used in uncontrolled mode. */
  enableShortcut?: boolean;
}

export function CommandMenu({
  open: openProp,
  onOpenChange,
  groups,
  placeholder = "Type a command or search…",
  emptyMessage = "No results found.",
  enableShortcut = true,
}: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (isControlled || !enableShortcut) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setInternalOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isControlled, enableShortcut]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {groups.map((group, gi) => (
          <React.Fragment key={group.heading ?? gi}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${(item.keywords ?? []).join(" ")}`}
                    onSelect={() => {
                      item.onSelect?.();
                      setOpen(false);
                    }}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                        {item.shortcut}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
