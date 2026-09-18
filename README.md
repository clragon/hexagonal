# Hexagonal

A design for a blue honeycomb world.

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

Each release uploads under its own version and caches immutably, so a pinned
version stays byte-identical.

Importing the bundle:

- registers every `<hex-*>` custom element
- injects the design tokens onto `:root`, so consumer CSS can use `var(--hex-*)`
- inlines the brand textures as base64 data URIs

The bundle injects tokens at runtime, so CSS that runs before the script cannot
use `var(--hex-*)`.

The fonts stylesheet embeds Verdana for body text and Paulistana Ipe for the
wordmark. It costs 120 KB gzipped, against 34 KB for the bundle itself. Omitting
it leaves body text to the Verdana installed on the machine.

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-fonts.css" />
```

## The first paint

A page that renders before the bundle evaluates starts blank and then shifts.

Tokens arrive with the bundle, so the page renders white until the script runs.
Linking the tokens supplies the palette earlier:

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-tokens.css" />
<style>html { background: var(--hex-color-background) }</style>
```

The bundle detects tokens that are already present and leaves them alone, so
linking the stylesheet costs nothing beyond the request.

Custom elements have no size until their definition loads, so content shifts when
they upgrade. `preflight.css` holds that space with measured values:

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-preflight.css" />
```

It carries literal values, so it works on its own. Each rule stops applying as
soon as that element is defined.

## Components

| Group | Components |
| --- | --- |
| Surfaces | `hex-card` `hex-dialog` `hex-page` `hex-section` |
| Layout | `hex-divider` `hex-skeleton` `hex-spinner` |
| Form | `hex-autocomplete` `hex-button` `hex-checkbox` `hex-input` `hex-radio-group` `hex-select` `hex-switch` `hex-textarea` |
| Overlay | `hex-menu` `hex-popover` `hex-tooltip` |
| Content | `hex-alert` `hex-code` `hex-markup` `hex-quote` `hex-spoiler` |
| Tokens | `hex-chip` `hex-kbd` `hex-status-pill` `hex-tag` |
| User | `hex-avatar` `hex-username` |
| Brand | `hex-chexagon` `hex-icon` `hex-logo` |

These four slot into a parent: `hex-listbox` `hex-menu-item` `hex-option` `hex-radio`.



`yarn dev` serves the component book, which carries props, guidance and live
examples.

## Rendering DText

`dmark` emits ordinary HTML carrying `dtext-*` classes. Wrap it in `<hex-markup>`
for typography, and pass `dmarkHandlers` to its renderer so quotes, spoilers,
sections and code render as components carrying their own reveal, collapse and
keyboard behaviour.

```js
import { renderAstToHtml, htmlHandlers } from "@clynamic/dmark";
import { dmarkHandlers } from "hexagonal";

const html = renderAstToHtml(ast, { ...htmlHandlers, ...dmarkHandlers });
```

## Extending

Build a component in the same style by extending the exported bases. Lit's
authoring primitives are re-exported, so extenders skip installing lit and the
page holds one copy.

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

Tests run in a real browser because these components depend on shadow DOM,
`ElementInternals`, the popover top layer and layout. jsdom has no layout engine
and cannot measure geometry.

The toolchain is Lit 3 and TypeScript, bundled by esbuild, with tsc emitting
declarations. oxlint and oxfmt handle lint and format, vitest and playwright run
the tests, and stryker mutates them.

## Output

- `dist/hexagonal.js`: ESM bundle carrying the Lit runtime and every element. Injects tokens on import.
- `dist/hexagonal.min.js`: the minified build
- `dist/hexagonal-tokens.css`: the design tokens, for use before the bundle loads
- `dist/hexagonal-preflight.css`: the layout-shift reservations described above
- `dist/hexagonal-fonts.css`: optional bundled brand fonts
- `dist/types/`: the `.d.ts` declarations

`yarn build` prints the current bundle sizes.
