"use client";

// A lightweight, dependency-free data table (sorting + optional row selection) built on the
// table primitives. For heavy use cases, swap in @tanstack/react-table behind the same props.
import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<T> {
  /** Unique key; also used as the default accessor when `cell` is absent. */
  key: string;
  header: React.ReactNode;
  /** Render the cell. Defaults to `String(row[key])`. */
  cell?: (row: T) => React.ReactNode;
  /** Enable click-to-sort on this column. Requires `sortValue` or a primitive accessor. */
  sortable?: boolean;
  /** Value used for sorting; defaults to `row[key]`. */
  sortValue?: (row: T) => string | number;
  className?: string;
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Stable row key. Defaults to array index. */
  getRowId?: (row: T, index: number) => string;
  emptyMessage?: React.ReactNode;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  emptyMessage = "No results.",
  className,
  ...props
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const accessor = col.sortValue ?? ((row: T) => row[col.key] as string | number);
    const copy = [...data];
    copy.sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sort, columns]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  return (
    <div className={cn("rounded-md border", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              return (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                      aria-label={`Sort by ${typeof col.header === "string" ? col.header : col.key}`}
                    >
                      {col.header}
                      {isSorted ? (
                        sort?.dir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row, i) => (
              <TableRow key={getRowId ? getRowId(row, i) : i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell ? col.cell(row) : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
