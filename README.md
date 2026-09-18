# Hexagonal

A dark design system for e621 surfaces, built as CDN-able web components.
Amber on navy, anchored in a repeating hexagonal tile, and built for dense pages
of tags, text and thumbnails.

## Use

```html
<script type="module" src="https://your-cdn/hexagonal.js"></script>

<hex-page>
  <hex-card>
    <hex-button icon="download">Export</hex-button>
    <hex-username role-color="admin" verified>sam_h</hex-username>
  </hex-card>
</hex-page>
```

Importing the bundle:

- registers every `<hex-*>` custom element
- injects the design tokens onto `:root`, so consumer CSS can use `var(--hex-*)`
- inlines the brand textures as base64 data URIs

The bundle injects tokens at runtime. Anything that runs **before** the
JavaScript lands cannot use `var(--hex-*)`.

Optional bundled fonts (Verdana, Paulistana Ipe):

```html
<link rel="stylesheet" href="https://your-cdn/hexagonal-fonts.css" />
```

Without it the system falls back to the Verdana installed on the OS.

## Preventing layout shift

Custom elements have no size until their definition loads, so a page that renders
before the bundle arrives will jump when it upgrades. `preflight.css` reserves the
measured box of every component ahead of time:

```html
<link rel="stylesheet" href="https://your-cdn/hexagonal-preflight.css" />
```

It is plain CSS with literal values, no tokens, and it stops applying the moment
each element is defined. Load it in `<head>` if the markup can appear before the
bundle does.

## Components

**Surfaces**

| Tag | |
| --- | --- |
| `<hex-card>` | Standard card surface with the brand hex-texture watermark fading down from the top |
| `<hex-dialog>` | Modal for a decision that has to be made before anything else can continue |
| `<hex-page>` | Full-bleed page surface |
| `<hex-section>` | Collapsible section |

**Layout**

| Tag | |
| --- | --- |
| `<hex-divider>` | Rule separating content |
| `<hex-skeleton>` | Placeholder that reserves the exact box its content will occupy |
| `<hex-spinner>` | Indeterminate activity indicator for work with no measurable progress |

**Form**

| Tag | |
| --- | --- |
| `<hex-autocomplete>` | Text field that suggests values as you type |
| `<hex-button>` | Action element |
| `<hex-checkbox>` | Boolean toggle with an inline label |
| `<hex-input>` | Text input with optional label, hint, error, and leading icon |
| `<hex-radio-group>` | A set of radios where exactly one can be chosen |
| `<hex-select>` | Picker for one value out of a known set |
| `<hex-switch>` | Toggle for a setting that takes effect the moment it is flipped |
| `<hex-textarea>` | Multi-line text field |

**Overlay**

| Tag | |
| --- | --- |
| `<hex-menu>` | Menu anchored to the element before it, with full keyboard navigation |
| `<hex-popover>` | Positioning primitive for overlays |
| `<hex-tooltip>` | Short description for the element before it |

**Content**

| Tag | |
| --- | --- |
| `<hex-alert>` | Banner for something the reader needs to notice, tinted by how serious it is |
| `<hex-code>` | Monospace code element |
| `<hex-markup>` | Scopes typography for rendered DText |
| `<hex-quote>` | Inline rounded quote block with a left-side accent stripe |
| `<hex-spoiler>` | Inline censor for content that should not be read by accident |

**Tokens**

| Tag | |
| --- | --- |
| `<hex-chip>` | Generic inline chip for filter tokens, removable selections, and small status pills |
| `<hex-kbd>` | Small monospace key cap |
| `<hex-status-pill>` | Compact health indicator |
| `<hex-tag>` | Category-tinted tag |

**User**

| Tag | |
| --- | --- |
| `<hex-avatar>` | Stroke-only rounded square avatar |
| `<hex-username>` | Role-tinted username text |

**Brand**

| Tag | |
| --- | --- |
| `<hex-chexagon>` | Verification badge: hex shape with a checkmark, in the brand artist amber-orange |
| `<hex-icon>` | Inline stroke icon |
| `<hex-logo>` | Wordmark and mark |

Documented inside their parent: `<hex-listbox>`, `<hex-menu-item>`, `<hex-option>`, `<hex-radio>`.

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
- `dist/hexagonal-preflight.css`: the layout-shift reservations described above
- `dist/hexagonal-fonts.css`: optional bundled brand fonts
- `dist/types/`: the `.d.ts` declarations

`yarn build` prints the current bundle sizes.

## Breaking changes

### 0.2.0

- **`<hex-prose>` is now `<hex-markup>`** (`HexProse` → `HexMarkup`). It styles
  generic typography as well as DText, so it was named after the wrong half.
- **`--hex-texture` changed meaning**, from a pre-faded strip to a repeating
  period. Anything doing `background-repeat: repeat-x` with it breaks silently;
  use `repeat` and the `--hex-texture-mask` token for the fade.
- **Component-internal custom properties are namespaced.** Previously bare names
  like `--btn-color` and `--tag-color` are now `--_hex-*`. They were never
  documented, but they were reachable, and a consumer setting one would have
  collided with the component.
- **Selection controls activate from an external `<label for>`.** Previously the
  label associated but did nothing on click.
