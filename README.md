# Hexagonal

A dark design system for e621 surfaces, built as CDN-able web components.
Amber on navy, anchored in a repeating hexagonal tile, and built for dense pages
of tags, text and thumbnails.

## Use

```html
<script type="module" src="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal.min.js"></script>

<hex-page>
  <hex-card>
    <hex-button icon="download">Export</hex-button>
    <hex-username role-color="admin" verified>sam_h</hex-username>
  </hex-card>
</hex-page>
```

Each release is uploaded under its own version and cached immutably, so pin the
version you want and it will never change under you.

Importing the bundle:

- registers every `<hex-*>` custom element
- injects the design tokens onto `:root`, so consumer CSS can use `var(--hex-*)`
- inlines the brand textures as base64 data URIs

The bundle injects tokens at runtime. Anything that runs **before** the
JavaScript lands cannot use `var(--hex-*)`.

Optional bundled fonts (Verdana, Paulistana Ipe):

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-fonts.css" />
```

Without it the system falls back to the Verdana installed on the OS.

## Before the bundle arrives

A page that renders before the bundle evaluates has two problems, and a stylesheet
for each. Both are optional, and both stop mattering once the bundle runs.

**The page is blank.** Tokens normally arrive with the bundle, so the palette does
not exist yet and a dark design system starts out white. Link the tokens and paint
with them:

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-tokens.css" />
<style>html { background: var(--hex-color-background) }</style>
```

The bundle detects tokens that are already present and leaves them alone, so
linking the stylesheet costs nothing beyond the request.

**The layout jumps.** Custom elements have no size until their definition loads,
so content shifts when they upgrade. `preflight.css` reserves the measured box of
every component ahead of time:

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-preflight.css" />
```

It carries literal values rather than tokens, so it works on its own, and each
rule stops applying as soon as that element is defined.

## Components

**Surfaces** &middot; `hex-card` `hex-dialog` `hex-page` `hex-section`

**Layout** &middot; `hex-divider` `hex-skeleton` `hex-spinner`

**Form** &middot; `hex-autocomplete` `hex-button` `hex-checkbox` `hex-input` `hex-radio-group` `hex-select` `hex-switch` `hex-textarea`

**Overlay** &middot; `hex-menu` `hex-popover` `hex-tooltip`

**Content** &middot; `hex-alert` `hex-code` `hex-markup` `hex-quote` `hex-spoiler`

**Tokens** &middot; `hex-chip` `hex-kbd` `hex-status-pill` `hex-tag`

**User** &middot; `hex-avatar` `hex-username`

**Brand** &middot; `hex-chexagon` `hex-icon` `hex-logo`



Slotted into a parent rather than used alone: `hex-listbox` `hex-menu-item` `hex-option` `hex-radio`.



Run `yarn dev` for the component book: every component with its props, guidance and live examples.

## Rendering DText

`dmark` emits ordinary HTML carrying `dtext-*` classes. Wrap it in `<hex-markup>`
for typography, and pass `dmarkHandlers` to its renderer so quotes, spoilers,
sections and code render as components with their own reveal, collapse and
keyboard behaviour rather than as inert markup.

```js
import { renderAstToHtml, htmlHandlers } from "@clynamic/dmark";
import { dmarkHandlers } from "hexagonal";

const html = renderAstToHtml(ast, { ...htmlHandlers, ...dmarkHandlers });
```

## Extending

Build a component in the same style by extending the exported bases. Lit's
authoring primitives are re-exported, so extenders never install lit themselves
and there is only ever one copy on the page.

```js
import { HexFieldElement, html, css } from "hexagonal";

class PostRating extends HexFieldElement {
  static styles = HexFieldElement.styles;
  // ...
}
```

- `HexElement`: the base for any component
- `HexFormElement`: adds form participation through `ElementInternals`
- `HexFieldElement`: adds the field chrome, meaning label, hint, error, icon, size and affixes
- `fieldStyles` and `hostReset`: the shared stylesheets
- every component class, for subclassing or typing

Existing components expose `::part` for restyling from ordinary CSS:

```css
hex-input::part(control) { border-radius: 0 }
hex-button::part(base)   { letter-spacing: 0.04em }
```

Icons can be added at runtime. Icons already on the page pick them up.

```js
import { registerIcon, svg } from "hexagonal";
registerIcon("blip", svg`<circle cx="12" cy="12" r="8" />`);
```

## Develop

```sh
yarn install
yarn dev            # watch + serve the book at http://localhost:47312
yarn build          # dist bundles, types, fonts.css, preflight.css, book.js
yarn check          # fmt:check + lint + typecheck
yarn test           # component behaviour, real chromium via playwright
yarn test:preflight # upgrade layout shift, against the built bundle
yarn test:all       # both
yarn test:mutation  # stryker over the component suite
```

Tests run in a real browser because these components only mean anything with
shadow DOM, `ElementInternals`, the popover top layer and real layout. jsdom has
no layout engine, so a geometry assertion under it would be a lie.

Toolchain: **Lit 3**, **TypeScript**, **esbuild** for the bundle, **tsc** for
declarations, **oxlint + oxfmt**, **vitest + playwright** for tests, **stryker**
for mutation testing.

## Output

- `dist/hexagonal.js`: ESM bundle carrying the Lit runtime and every element. Injects tokens on import.
- `dist/hexagonal.min.js`: the minified build
- `dist/hexagonal-tokens.css`: the design tokens, for use before the bundle loads
- `dist/hexagonal-preflight.css`: the layout-shift reservations described above
- `dist/hexagonal-fonts.css`: optional bundled brand fonts
- `dist/types/`: the `.d.ts` declarations

`yarn build` prints the current bundle sizes.
