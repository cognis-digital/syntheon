"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileCode2,
  FileCog,
  FileJson,
  FlaskConical,
  Folder,
  Plug,
  Puzzle,
  Route,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { FileNode } from "@/lib/playground/model";

/** Icon + tint for each generation-unit kind. */
function leafIcon(kind?: string) {
  switch (kind) {
    case "route":
      return { Icon: Route, tint: "text-sky-500" };
    case "api":
      return { Icon: Plug, tint: "text-amber-500" };
    case "integration":
      return { Icon: Plug, tint: "text-emerald-500" };
    case "module":
      return { Icon: FileCog, tint: "text-violet-500" };
    case "config":
      return { Icon: FileJson, tint: "text-muted-foreground" };
    case "test":
      return { Icon: FlaskConical, tint: "text-pink-500" };
    case "component":
      return { Icon: Puzzle, tint: "text-primary" };
    default:
      return { Icon: FileCode2, tint: "text-muted-foreground" };
  }
}

interface RowProps {
  node: FileNode;
  depth: number;
  index: number;
  animate: boolean;
}

function TreeRow({ node, depth, index, animate }: RowProps) {
  const isDir = Boolean(node.children);
  const { Icon, tint } = isDir
    ? { Icon: Folder, tint: "text-primary/70" }
    : leafIcon(node.kind);

  const content = (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1 font-mono text-xs leading-relaxed",
        isDir ? "font-medium text-foreground" : "text-muted-foreground",
      )}
      style={{ paddingLeft: `${depth * 0.9 + 0.5}rem` }}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", tint)} aria-hidden />
      <span className="truncate">{node.name}</span>
      {!isDir && node.kind ? (
        <span className="ml-auto shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-muted-foreground">
          {node.kind}
        </span>
      ) : null}
    </div>
  );

  return animate ? (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.012, 0.4) }}
    >
      {content}
    </motion.li>
  ) : (
    <li>{content}</li>
  );
}

/** Recursively flatten the tree into ordered rows so animation delays cascade. */
function flatten(
  node: FileNode,
  depth: number,
  acc: { node: FileNode; depth: number }[],
): void {
  for (const child of node.children ?? []) {
    acc.push({ node: child, depth });
    if (child.children) flatten(child, depth + 1, acc);
  }
}

export interface BlueprintTreeProps {
  root: FileNode;
  fileCount: number;
  className?: string;
}

/**
 * The "live blueprint" pane: the real ordered file tree `resolvePlan` would
 * generate for the current selection, rendered as a code-editor-style explorer.
 */
export function BlueprintTree({
  root,
  fileCount,
  className,
}: BlueprintTreeProps) {
  const reduce = useReducedMotion();
  const rows = React.useMemo(() => {
    const acc: { node: FileNode; depth: number }[] = [];
    flatten(root, 0, acc);
    return acc;
  }, [root]);

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Folder className="h-3.5 w-3.5 text-primary/70" aria-hidden />
          Live blueprint
        </span>
        <span
          className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary"
          aria-live="polite"
        >
          {fileCount} files
        </span>
      </div>
      <ul
        className="max-h-[26rem] flex-1 overflow-y-auto py-2"
        aria-label="Generated file tree"
      >
        {rows.map(({ node, depth }, i) => (
          <TreeRow
            key={node.path}
            node={node}
            depth={depth}
            index={i}
            animate={!reduce}
          />
        ))}
      </ul>
    </div>
  );
}
