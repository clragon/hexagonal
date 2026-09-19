import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

const STYLE_ID = "hex-markup-styles";

const proseCss = /* css */ `
hex-markup {
  display: block;
  color: var(--hex-fg-1);
  font-size: var(--hex-fs-md);
  line-height: var(--hex-line-normal);
  overflow-wrap: break-word;
}
hex-markup > :first-child { margin-top: 0; }
hex-markup > :last-child { margin-bottom: 0; }
hex-markup p { margin: 0 0 var(--hex-space-3); }
hex-markup h1, hex-markup h2, hex-markup h3,
hex-markup h4, hex-markup h5, hex-markup h6 {
  margin: var(--hex-space-5) 0 var(--hex-space-2);
  line-height: var(--hex-line-tight);
  font-weight: var(--hex-font-weight-bold);
  color: var(--hex-fg-1);
}
hex-markup h1 { font-size: var(--hex-fs-h4); }
hex-markup h2 { font-size: var(--hex-fs-h5); }
hex-markup h3 { font-size: var(--hex-fs-h6); }
hex-markup h4 { font-size: var(--hex-fs-lg); }
hex-markup h5 { font-size: var(--hex-fs-md); }
hex-markup h6 { font-size: var(--hex-fs-sm); color: var(--hex-fg-2); }
hex-markup ul, hex-markup ol { margin: 0 0 var(--hex-space-3); padding-left: var(--hex-space-5); }
hex-markup li { margin-bottom: var(--hex-space-1); }
hex-markup li > ul, hex-markup li > ol { margin-top: var(--hex-space-1); margin-bottom: 0; }
hex-markup a,
hex-markup .dtext-link {
  color: var(--hex-fg-link);
  text-decoration: none;
}
hex-markup a:hover,
hex-markup .dtext-link:hover {
  color: var(--hex-fg-link-hover);
}
hex-markup a:focus-visible { outline: none; box-shadow: var(--hex-shadow-focus); border-radius: var(--hex-radius-sm); }
hex-markup .dtext-external-link::after {
  content: "\\2197";
  display: inline-block;
  margin-left: 0.15em;
  font-size: 0.85em;
  opacity: 0.7;
  text-decoration: none;
}
hex-markup .dtext-artist-id-link { color: var(--hex-tag-artist); }
hex-markup .dtext-artist-id-link:hover { color: var(--hex-tag-artist-alt); }
hex-markup .dtext-post-search-link { color: var(--hex-tag-general); }
hex-markup .dtext-post-search-link:hover { color: var(--hex-tag-general-alt); }
hex-markup hr { border: 0; border-top: 1px solid var(--hex-border); margin: var(--hex-space-5) 0; }
hex-markup table {
  border-collapse: collapse;
  margin: 0 0 var(--hex-space-3);
  font-size: var(--hex-fs-sm);
  display: block;
  overflow-x: auto;
  max-width: 100%;
}
hex-markup th, hex-markup td {
  border: 1px solid var(--hex-border);
  padding: var(--hex-space-1) var(--hex-space-2);
  text-align: left;
  vertical-align: top;
}
hex-markup th { background: var(--hex-bg-section); font-weight: var(--hex-font-weight-bold); }
hex-markup table.striped tbody tr:nth-child(even) { background: var(--hex-bg-muted); }
hex-markup blockquote {
  margin: 0 0 var(--hex-space-3);
  padding: var(--hex-space-2) var(--hex-space-3);
  border-left: 3px solid var(--hex-border-strong);
  background: var(--hex-bg-section);
  border-radius: var(--hex-radius-sm);
}
hex-markup pre {
  margin: 0 0 var(--hex-space-3);
  padding: var(--hex-space-3);
  background: var(--hex-bg-sunken);
  border-radius: var(--hex-radius-md);
  overflow-x: auto;
  font-family: var(--hex-font-mono);
  font-size: var(--hex-fs-sm);
}
hex-markup code, hex-markup .inline-code {
  font-family: var(--hex-font-mono);
  font-size: 0.92em;
  background: var(--hex-bg-sunken);
  padding: 1px 4px;
  border-radius: var(--hex-radius-sm);
}
hex-markup pre code, hex-markup pre .inline-code { background: none; padding: 0; }
hex-markup sub, hex-markup sup { line-height: 0; font-size: 0.75em; }
hex-markup [class*="dtext-color-"] { color: var(--_hex-dtext-color, inherit); }
hex-markup .dtext-color-artist { --_hex-dtext-color: var(--hex-tag-artist); }
hex-markup .dtext-color-copyright { --_hex-dtext-color: var(--hex-tag-copyright); }
hex-markup .dtext-color-character { --_hex-dtext-color: var(--hex-tag-character); }
hex-markup .dtext-color-species { --_hex-dtext-color: var(--hex-tag-species); }
hex-markup .dtext-color-general { --_hex-dtext-color: var(--hex-tag-general); }
hex-markup .dtext-color-meta { --_hex-dtext-color: var(--hex-tag-meta); }
hex-markup .dtext-color-lore { --_hex-dtext-color: var(--hex-tag-lore); }
hex-markup .dtext-color-invalid { --_hex-dtext-color: var(--hex-tag-invalid); }
hex-markup .dtext-color-contributor { --_hex-dtext-color: var(--hex-tag-contributor); }
hex-markup[dense] p,
hex-markup[dense] ul,
hex-markup[dense] ol,
hex-markup[dense] blockquote,
hex-markup[dense] pre { margin-bottom: var(--hex-space-2); }
hex-markup[dense] h1, hex-markup[dense] h2, hex-markup[dense] h3,
hex-markup[dense] h4, hex-markup[dense] h5, hex-markup[dense] h6 {
  margin-top: var(--hex-space-3);
}
`;

let sheet: CSSStyleSheet | undefined;

function proseSheet(): CSSStyleSheet | undefined {
  if (typeof CSSStyleSheet === "undefined" || !("replaceSync" in CSSStyleSheet.prototype))
    return undefined;
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(proseCss);
  }
  return sheet;
}

export function registerMarkupStyles(root: Document | ShadowRoot): void {
  const constructed = proseSheet();
  if (constructed && "adoptedStyleSheets" in root) {
    if (!root.adoptedStyleSheets.includes(constructed)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, constructed];
    }
    return;
  }
  const doc = root instanceof Document ? root : root.ownerDocument;
  const host = root instanceof Document ? root.head : root;
  if (!doc || (root instanceof Document && doc.getElementById(STYLE_ID))) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = proseCss;
  host.appendChild(style);
}

@customElement("hex-markup")
export class HexMarkup extends HexElement {
  static preflight = {
    base: { display: "flex", flexDirection: "column", gap: "8px", visibility: "hidden" },
    variants: [],
  };

  @property({ type: Boolean, reflect: true }) dense = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.getRootNode();
    if (root instanceof Document || root instanceof ShadowRoot) registerMarkupStyles(root);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-markup": HexMarkup;
  }
}
