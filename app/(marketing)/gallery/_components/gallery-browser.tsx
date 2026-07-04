"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/blocks/empty-state";

import {
  GALLERY,
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from "../_data/gallery-registry";
import { PreviewTile } from "./preview-tile";

type Filter = "All" | GalleryCategory;

/**
 * The searchable, categorized component browser (issue #4). Filters the static
 * gallery registry by free-text query and category, and renders a responsive
 * grid of live preview tiles. Self-contained: built entirely from the owned UI
 * library, no new dependencies.
 */
export function GalleryBrowser() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("All");

  const filters: Filter[] = React.useMemo(
    () => ["All", ...GALLERY_CATEGORIES],
    [],
  );

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return GALLERY.filter((entry) => {
      const matchesFilter = filter === "All" || entry.category === filter;
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components…"
            className="pl-9"
            aria-label="Search components"
          />
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter by category"
        >
          {filters.map((f) => {
            const active = filter === f;
            const count =
              f === "All"
                ? GALLERY.length
                : GALLERY.filter((e) => e.category === f).length;
            return (
              <Button
                key={f}
                role="tab"
                aria-selected={active}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f}
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className="ml-1.5"
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {results.length} component{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No components match"
          description="Try a different search term or category."
          action={{
            label: "Clear",
            onClick: () => {
              setQuery("");
              setFilter("All");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((entry) => (
            <PreviewTile key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
