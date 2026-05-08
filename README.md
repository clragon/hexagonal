# Hexagonal

The Hexagonal Design System as CDN-able web components.

## Use

```html
<script type="module" src="https://your-cdn/hexagonal.js"></script>

<hex-page>
  <hex-card>
    <hex-button variant="primary" icon="download">Export</hex-button>
    <hex-username role-color="admin" verified>sam_h</hex-username>
  </hex-card>
</hex-page>
```

Importing the bundle:

- registers every `<hex-*>` custom element
- injects the design tokens onto `:root` so consumer-side CSS can use `var(--hex-*)`
- bundles the brand textures (hex-tile, hex-texture) inline as base64 data URIs

Optional bundled fonts (Verdana, Paulistana Ipe):

```html
<link rel="stylesheet" href="https://your-cdn/hexagonal-fonts.css" />
```

Without that stylesheet, the system falls back to the Verdana installed on the user's OS.

## Components

| Tag | Purpose |
| --- | --- |
| `<hex-page>` | Full-bleed page surface (navy + tiled hex bg) |
| `<hex-card>` | Standard card surface with hex-texture watermark |
| `<hex-button>` | 5 variants (primary, secondary, ghost, text-primary, danger), 3 sizes, optional icon |
| `<hex-input>` | Text input with label, hint, error, optional icon |
| `<hex-checkbox>` | Boolean toggle |
| `<hex-icon>` | 28 inline Lucide-style stroke icons + the brand hex/chexagon |
| `<hex-logo>` | Wordmark + mark, or `mark-only` for tight spaces |
| `<hex-chexagon>` | Verified badge (hex shape + check) |
| `<hex-chip>` | Generic chip (filter, removable, pill, active states) |
| `<hex-tag>` | Category-tinted tag (8 categories) |
| `<hex-status-pill>` | healthy / degraded / failing / idle |
| `<hex-kbd>` | Keyboard shortcut chip |
| `<hex-avatar>` | Stroke-only rounded square, 5 sizes, role-tinted |
| `<hex-username>` | Role-tinted username (with strike for blocked, verified badge slot) |
| `<hex-quote>` | Inline rounded quote block, 3 variants |
| `<hex-section>` | Collapsible panel with title + optional badge |
| `<hex-code>` | Inline `<code>` or `block` `<pre>` |
| `<hex-spoiler>` | Censor that reveals on hover (desktop) or tap (mobile) |
| `<hex-alert>` | Banner with variant tint, icon, heading, actions slot, close button |

## Develop

```sh
yarn install
yarn dev           # watch mode + serve the book at http://localhost:47312
yarn build         # build dist/hexagonal.js + .min.js + types + fonts.css + book.js
yarn check         # fmt:check + lint + typecheck
yarn fmt           # apply oxfmt formatting
yarn lint          # oxlint
yarn typecheck     # tsc --noEmit
```

Toolchain:

- **Lit 3** for the components
- **TypeScript** for the source
- **esbuild** bundles to `dist/hexagonal.js` (ESM)
- **tsc** emits `dist/types/*.d.ts`
- **oxlint + oxfmt** for lint and format

## Output

- `dist/hexagonal.js`: ESM bundle (Lit runtime + every `<hex-*>` element + design tokens injected on import; brand textures inlined as base64 data URIs)
- `dist/hexagonal.min.js`: minified
- `dist/hexagonal-fonts.css`: optional bundled brand fonts (Verdana + Paulistana Ipe). Skip if you're fine with the OS-installed Verdana fallback.
- `dist/types/`: `.d.ts` declarations

`yarn build` prints the current bundle sizes.
