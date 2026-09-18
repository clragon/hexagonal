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

The bundle is 34 KB gzipped and defines the `--hex-*` tokens on `:root`.

The fonts stylesheet embeds Verdana, at 108 KB gzipped. Windows and macOS install
the font.

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-fonts.css" />
```

## FOUC and layout shift

To prevent both, link the tokens and preflight stylesheets:

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-tokens.css" />
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-preflight.css" />
<style>html { background: var(--hex-color-background) }</style>
```

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

The component book carries props, guidance and live examples:
<https://clragon.github.io/hexagonal/>. `yarn dev` serves it locally.

## Rendering DText

`dmark` emits ordinary HTML carrying `dtext-*` classes. Wrap it in `<hex-markup>`
for typography, and pass `dmarkHandlers` to its renderer so quotes, spoilers,
sections and code render as components.

```js
import { renderAstToHtml, htmlHandlers } from "@clynamic/dmark";
import { dmarkHandlers } from "hexagonal";

const html = renderAstToHtml(ast, { ...htmlHandlers, ...dmarkHandlers });
```

## Extending

Build a component in the same style by extending the exported bases. Import
lit's `html` and `css` from hexagonal instead of installing lit.

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

The toolchain is Lit 3 and TypeScript, bundled by esbuild, with tsc emitting
declarations. oxlint and oxfmt handle lint and format, vitest and playwright run
the tests in a real browser, and stryker mutates them.
