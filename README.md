# Hexagonal

A design for a blue honeycomb world.

## Use

The bundle is 34 KB gzipped.

```html
<script type="module" src="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal.min.js"></script>

<hex-page>
  <hex-card>
    <hex-button icon="download">Export</hex-button>
    <hex-username role-color="admin" verified>NotMeNotYou</hex-username>
  </hex-card>
</hex-page>
```

Tokens are defined as `--hex-*` on `:root`.

## Stylesheets

To prevent FOUC and layout shift, link the tokens and preflight stylesheets:

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-tokens.css" />
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-preflight.css" />
<style>html { background: var(--hex-color-background) }</style>
```

The fonts stylesheet serves Verdana, at 108 KB gzipped. Windows and macOS come
with the font installed.

```html
<link rel="stylesheet" href="https://libs.cdn.clynamic.net/hexagonal/0.2.0/hexagonal-fonts.css" />
```

## Components

| Group | Components |
| --- | --- |
| Surfaces | [`hex-card`][card] [`hex-dialog`][dialog] [`hex-page`][page] [`hex-section`][section] |
| Layout | [`hex-divider`][divider] [`hex-skeleton`][skeleton] [`hex-spinner`][spinner] |
| Form | [`hex-autocomplete`][autocomplete] [`hex-button`][button] [`hex-checkbox`][checkbox] [`hex-input`][input] [`hex-radio-group`][radio-group] [`hex-radio`][radio-group] [`hex-select`][select] [`hex-option`][select] [`hex-switch`][switch] [`hex-textarea`][textarea] |
| Overlay | [`hex-menu`][menu] [`hex-menu-item`][menu] [`hex-popover`][popover] [`hex-tooltip`][tooltip] |
| Content | [`hex-alert`][alert] [`hex-code`][code] [`hex-markup`][markup] [`hex-quote`][quote] [`hex-spoiler`][spoiler] |
| Tokens | [`hex-chip`][chip] [`hex-kbd`][kbd] [`hex-status-pill`][status-pill] [`hex-tag`][tag] |
| User | [`hex-avatar`][avatar] [`hex-username`][username] |
| Brand | [`hex-chexagon`][chexagon] [`hex-icon`][icon] [`hex-logo`][logo] |

[alert]: https://clragon.github.io/hexagonal/#alert
[autocomplete]: https://clragon.github.io/hexagonal/#autocomplete
[avatar]: https://clragon.github.io/hexagonal/#avatar
[button]: https://clragon.github.io/hexagonal/#button
[card]: https://clragon.github.io/hexagonal/#card
[checkbox]: https://clragon.github.io/hexagonal/#checkbox
[chexagon]: https://clragon.github.io/hexagonal/#chexagon
[chip]: https://clragon.github.io/hexagonal/#chip
[code]: https://clragon.github.io/hexagonal/#code
[dialog]: https://clragon.github.io/hexagonal/#dialog
[divider]: https://clragon.github.io/hexagonal/#divider
[icon]: https://clragon.github.io/hexagonal/#icon
[input]: https://clragon.github.io/hexagonal/#input
[kbd]: https://clragon.github.io/hexagonal/#kbd
[logo]: https://clragon.github.io/hexagonal/#logo
[markup]: https://clragon.github.io/hexagonal/#markup
[menu]: https://clragon.github.io/hexagonal/#menu
[page]: https://clragon.github.io/hexagonal/#page
[popover]: https://clragon.github.io/hexagonal/#popover
[quote]: https://clragon.github.io/hexagonal/#quote
[radio-group]: https://clragon.github.io/hexagonal/#radio-group
[section]: https://clragon.github.io/hexagonal/#section
[select]: https://clragon.github.io/hexagonal/#select
[skeleton]: https://clragon.github.io/hexagonal/#skeleton
[spinner]: https://clragon.github.io/hexagonal/#spinner
[spoiler]: https://clragon.github.io/hexagonal/#spoiler
[status-pill]: https://clragon.github.io/hexagonal/#status-pill
[switch]: https://clragon.github.io/hexagonal/#switch
[tag]: https://clragon.github.io/hexagonal/#tag
[textarea]: https://clragon.github.io/hexagonal/#textarea
[tooltip]: https://clragon.github.io/hexagonal/#tooltip
[username]: https://clragon.github.io/hexagonal/#username

The [component book](https://clragon.github.io/hexagonal/) carries props, guidance
and live examples.

## Rendering DText

[dmark](https://github.com/clragon/dmark) parses DText into ordinary HTML
carrying `dtext-*` classes. Wrap it in `<hex-markup>` for typography, and pass
`dmarkHandlers` to its renderer so quotes, spoilers, sections and code render as
components.

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
- `HexListbox`: highlight state, movement, typeahead and click-to-select, for a combobox-like control
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
yarn dev            # book at http://localhost:47312, rebuilt on change
yarn build          # dist bundles, types, fonts.css, preflight.css, book.js
yarn verify         # fmt, lint, types
yarn test           # component behaviour, in chromium
yarn test:preflight # upgrade layout shift, against the built bundle
yarn test:mutation  # stryker over the component suite
```

The toolchain is Lit 3 and TypeScript, bundled by esbuild, with tsc emitting
declarations. oxlint and oxfmt handle lint and format, vitest and playwright run
the tests in chromium, and stryker mutates them.
