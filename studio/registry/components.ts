/**
 * Syntheon component catalog.
 *
 * The UI primitives and composed blocks the builder can compose, mapped to
 * `components/ui/*` and `components/blocks/*` (DESIGN.md §6). Features reference
 * components by id; the planner uses these paths to emit component units and to
 * validate that no feature references a component that does not exist.
 */

export type ComponentKind = "ui" | "block";

export interface ComponentSpec {
  id: string;
  label: string;
  kind: ComponentKind;
  /** Project-relative source path. */
  path: string;
  /** Component ids this one composes / depends on. */
  uses?: string[];
}

/** shadcn-style UI primitives (components/ui). */
const UI: ComponentSpec[] = [
  "button",
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio-group",
  "switch",
  "slider",
  "dialog",
  "sheet",
  "drawer",
  "popover",
  "tooltip",
  "dropdown-menu",
  "context-menu",
  "command",
  "tabs",
  "accordion",
  "avatar",
  "badge",
  "card",
  "table",
  "data-table",
  "calendar",
  "date-picker",
  "sonner",
  "alert",
  "skeleton",
  "progress",
  "pagination",
  "breadcrumb",
  "form",
  "label",
].map((id) => ({
  id,
  label: id.replace(/-/g, " "),
  kind: "ui" as const,
  path: `components/ui/${id}.tsx`,
}));

/** Composed blocks (components/blocks). */
const BLOCKS: ComponentSpec[] = [
  { id: "hero", label: "Hero", kind: "block", path: "components/blocks/hero.tsx", uses: ["button"] },
  { id: "feature-grid", label: "Feature grid", kind: "block", path: "components/blocks/feature-grid.tsx", uses: ["card"] },
  { id: "bento", label: "Bento grid", kind: "block", path: "components/blocks/bento.tsx", uses: ["card"] },
  { id: "pricing-table", label: "Pricing table", kind: "block", path: "components/blocks/pricing-table.tsx", uses: ["button", "card", "badge"] },
  { id: "testimonial-wall", label: "Testimonial wall", kind: "block", path: "components/blocks/testimonial-wall.tsx", uses: ["avatar", "card"] },
  { id: "logo-cloud", label: "Logo cloud", kind: "block", path: "components/blocks/logo-cloud.tsx" },
  { id: "faq", label: "FAQ", kind: "block", path: "components/blocks/faq.tsx", uses: ["accordion"] },
  { id: "cta", label: "CTA", kind: "block", path: "components/blocks/cta.tsx", uses: ["button"] },
  { id: "footer", label: "Footer", kind: "block", path: "components/blocks/footer.tsx" },
  { id: "navbar", label: "Navbar", kind: "block", path: "components/blocks/navbar.tsx", uses: ["button", "sheet"] },
  { id: "stats", label: "Stats", kind: "block", path: "components/blocks/stats.tsx", uses: ["card"] },
  { id: "waitlist-form", label: "Waitlist / newsletter form", kind: "block", path: "components/blocks/waitlist-form.tsx", uses: ["form", "input", "button"] },
  { id: "auth-card", label: "Auth card", kind: "block", path: "components/blocks/auth-card.tsx", uses: ["card", "form", "input", "button"] },
  { id: "dashboard-shell", label: "Dashboard shell", kind: "block", path: "components/blocks/dashboard-shell.tsx", uses: ["sidebar-nav", "avatar"] },
  { id: "sidebar-nav", label: "Sidebar nav", kind: "block", path: "components/blocks/sidebar-nav.tsx", uses: ["button"] },
  { id: "settings-layout", label: "Settings layout", kind: "block", path: "components/blocks/settings-layout.tsx", uses: ["tabs", "card"] },
  { id: "empty-state", label: "Empty state", kind: "block", path: "components/blocks/empty-state.tsx", uses: ["button"] },
  { id: "cookie-consent", label: "Cookie consent", kind: "block", path: "components/blocks/cookie-consent.tsx", uses: ["button"] },
  { id: "modal-confirm", label: "Confirm modal", kind: "block", path: "components/blocks/modals/confirm.tsx", uses: ["dialog", "button"] },
  { id: "modal-form", label: "Form modal", kind: "block", path: "components/blocks/modals/form.tsx", uses: ["dialog", "form"] },
  { id: "modal-command", label: "Command modal", kind: "block", path: "components/blocks/modals/command.tsx", uses: ["command", "dialog"] },
  { id: "modal-wizard", label: "Multi-step wizard modal", kind: "block", path: "components/blocks/modals/wizard.tsx", uses: ["dialog", "progress", "button"] },
];

export const COMPONENTS: readonly ComponentSpec[] = [...UI, ...BLOCKS];

const COMPONENT_BY_ID = new Map(COMPONENTS.map((c) => [c.id, c]));

export function getComponent(id: string): ComponentSpec | undefined {
  return COMPONENT_BY_ID.get(id);
}

export function componentIds(): string[] {
  return COMPONENTS.map((c) => c.id);
}

/**
 * Expand a set of component ids to include transitive `uses` dependencies.
 * Returns component ids in dependency-first order (a component appears after
 * everything it uses).
 */
export function expandComponents(ids: Iterable<string>): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const spec = COMPONENT_BY_ID.get(id);
    if (!spec) return; // dangling refs are caught by registry integrity tests
    for (const dep of spec.uses ?? []) visit(dep);
    ordered.push(id);
  };
  for (const id of ids) visit(id);
  return ordered;
}
