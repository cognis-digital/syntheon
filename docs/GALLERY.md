# Component gallery

The Syntheon component gallery lives at [`/gallery`](http://localhost:3000/gallery)
and is a searchable, categorized browser of the owned component library — the same
components a generated app copies into your repo. Every tile renders a **live**
preview you can flip between light and dark and, where it makes sense, tweak props
on the fly.

It is built entirely from the existing UI library — **no new dependencies** — and
degrades gracefully: if a component isn't ready yet, its tile shows a small
"preview unavailable" notice rather than crashing the page.

## Where it lives

```
app/(marketing)/gallery/
├── page.tsx                       # the /gallery route (server component)
├── _data/gallery-registry.tsx     # the static registry (hand-maintained)
└── _components/
    ├── gallery-browser.tsx        # search + category filter + grid
    └── preview-tile.tsx           # one tile: preview + light/dark + prop knobs
```

## The registry

`gallery-registry.tsx` is a hand-maintained array of `GalleryEntry` objects. Each
entry is plain data plus a `render` closure:

```tsx
{
  id: "button",
  name: "Button",
  category: "Inputs",
  description: "The primary action element, with variants and sizes.",
  source: "components/ui/button.tsx",
  controls: [
    { kind: "select", name: "variant", label: "Variant",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
      default: "default" },
    { kind: "text", name: "label", label: "Label", default: "Get started" },
    { kind: "boolean", name: "disabled", label: "Disabled", default: false },
  ],
  render: (p) => <Button variant={p.variant} disabled={p.disabled}>{p.label}</Button>,
}
```

Categories: **Inputs · Display · Feedback · Navigation · Blocks**.

### Prop controls

`controls` is optional. Three kinds are supported and render as live knobs:

| kind | UI | value type |
|---|---|---|
| `text` | text input | `string` |
| `boolean` | switch | `boolean` |
| `select` | dropdown | `string` (one of `options`) |

The gallery seeds state from each control's `default` (via `defaultControlValues`)
and feeds the current values into `render(props)` on every change.

## Light / dark preview

Each tile has its own light/dark toggle, independent of the site theme. The
preview surface applies a scoped `.dark` class; because the token contract is
redefined under `.dark` in `app/globals.css`, semantic Tailwind classes
(`bg-background`, `text-foreground`, `dark:…`) resolve correctly inside the
subtree — so you see exactly how a component looks in both themes side by side.

## Adding a component

1. Import the component in `gallery-registry.tsx`.
2. Append one `GalleryEntry` — pick a category, write a one-line description, set
   `source`, add any `controls`, and return a preview from `render`.
3. That's it. The browser, counts, and category tabs update automatically.

The registry has a colocated test (`gallery-registry.test.tsx`) that renders every
entry's preview with default props and asserts none throw — so a broken entry is
caught by `npm test`.
