import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

const STYLE_ID = "hex-prose-styles";

const proseCss = /* css */ `
hex-prose {
  display: block;
  color: var(--hex-fg-1);
  font-size: var(--hex-fs-md);
  line-height: var(--hex-line-normal);
  overflow-wrap: break-word;
}
hex-prose > :first-child { margin-top: 0; }
hex-prose > :last-child { margin-bottom: 0; }
hex-prose p { margin: 0 0 var(--hex-space-3); }
hex-prose h1, hex-prose h2, hex-prose h3,
hex-prose h4, hex-prose h5, hex-prose h6 {
  margin: var(--hex-space-5) 0 var(--hex-space-2);
  line-height: var(--hex-line-tight);
  font-weight: var(--hex-font-weight-bold);
  color: var(--hex-fg-1);
}
hex-prose h1 { font-size: var(--hex-fs-h4); }
hex-prose h2 { font-size: var(--hex-fs-h5); }
hex-prose h3 { font-size: var(--hex-fs-h6); }
hex-prose h4 { font-size: var(--hex-fs-lg); }
hex-prose h5 { font-size: var(--hex-fs-md); }
hex-prose h6 { font-size: var(--hex-fs-sm); color: var(--hex-fg-2); }
hex-prose ul, hex-prose ol { margin: 0 0 var(--hex-space-3); padding-left: var(--hex-space-5); }
hex-prose li { margin-bottom: var(--hex-space-1); }
hex-prose li > ul, hex-prose li > ol { margin-top: var(--hex-space-1); margin-bottom: 0; }
hex-prose a,
hex-prose .dtext-link {
  color: var(--hex-fg-link);
  text-decoration: none;
}
hex-prose a:hover,
hex-prose .dtext-link:hover {
  color: var(--hex-fg-link-hover);
  text-decoration: underline;
}
hex-prose a:focus-visible { outline: none; box-shadow: var(--hex-shadow-focus); border-radius: var(--hex-radius-sm); }
hex-prose .dtext-external-link::after {
  content: "\\2197";
  display: inline-block;
  margin-left: 0.15em;
  font-size: 0.85em;
  opacity: 0.7;
  text-decoration: none;
}
hex-prose .dtext-artist-id-link { color: var(--hex-tag-artist); }
hex-prose .dtext-artist-id-link:hover { color: var(--hex-tag-artist-alt); }
hex-prose .dtext-post-search-link { color: var(--hex-tag-general); }
hex-prose .dtext-post-search-link:hover { color: var(--hex-tag-general-alt); }
hex-prose hr { border: 0; border-top: 1px solid var(--hex-border); margin: var(--hex-space-5) 0; }
hex-prose table {
  border-collapse: collapse;
  margin: 0 0 var(--hex-space-3);
  font-size: var(--hex-fs-sm);
  display: block;
  overflow-x: auto;
  max-width: 100%;
}
hex-prose th, hex-prose td {
  border: 1px solid var(--hex-border);
  padding: var(--hex-space-1) var(--hex-space-2);
  text-align: left;
  vertical-align: top;
}
hex-prose th { background: var(--hex-bg-section); font-weight: var(--hex-font-weight-bold); }
hex-prose table.striped tbody tr:nth-child(even) { background: var(--hex-bg-muted); }
hex-prose blockquote {
  margin: 0 0 var(--hex-space-3);
  padding: var(--hex-space-2) var(--hex-space-3);
  border-left: 3px solid var(--hex-border-strong);
  background: var(--hex-bg-section);
  border-radius: var(--hex-radius-sm);
}
hex-prose pre {
  margin: 0 0 var(--hex-space-3);
  padding: var(--hex-space-3);
  background: var(--hex-bg-sunken);
  border-radius: var(--hex-radius-md);
  overflow-x: auto;
  font-family: var(--hex-font-mono);
  font-size: var(--hex-fs-sm);
}
hex-prose code, hex-prose .inline-code {
  font-family: var(--hex-font-mono);
  font-size: 0.92em;
  background: var(--hex-bg-sunken);
  padding: 1px 4px;
  border-radius: var(--hex-radius-sm);
}
hex-prose pre code, hex-prose pre .inline-code { background: none; padding: 0; }
hex-prose sub, hex-prose sup { line-height: 0; font-size: 0.75em; }
hex-prose [class*="dtext-color-"] { color: var(--_hex-dtext-color, inherit); }
hex-prose .dtext-color-artist { --_hex-dtext-color: var(--hex-tag-artist); }
hex-prose .dtext-color-copyright { --_hex-dtext-color: var(--hex-tag-copyright); }
hex-prose .dtext-color-character { --_hex-dtext-color: var(--hex-tag-character); }
hex-prose .dtext-color-species { --_hex-dtext-color: var(--hex-tag-species); }
hex-prose .dtext-color-general { --_hex-dtext-color: var(--hex-tag-general); }
hex-prose .dtext-color-meta { --_hex-dtext-color: var(--hex-tag-meta); }
hex-prose .dtext-color-lore { --_hex-dtext-color: var(--hex-tag-lore); }
hex-prose .dtext-color-invalid { --_hex-dtext-color: var(--hex-tag-invalid); }
hex-prose .dtext-color-contributor { --_hex-dtext-color: var(--hex-tag-contributor); }
hex-prose[dense] p,
hex-prose[dense] ul,
hex-prose[dense] ol,
hex-prose[dense] blockquote,
hex-prose[dense] pre { margin-bottom: var(--hex-space-2); }
hex-prose[dense] h1, hex-prose[dense] h2, hex-prose[dense] h3,
hex-prose[dense] h4, hex-prose[dense] h5, hex-prose[dense] h6 {
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

export function registerProseStyles(root: Document | ShadowRoot): void {
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

@customElement("hex-prose")
export class HexProse extends HexElement {
  @property({ type: Boolean, reflect: true }) dense = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.getRootNode();
    if (root instanceof Document || root instanceof ShadowRoot) registerProseStyles(root);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-prose": HexProse;
  }
}
