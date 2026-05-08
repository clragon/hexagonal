import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexTagCategory =
  | "artist"
  | "copyright"
  | "character"
  | "species"
  | "general"
  | "meta"
  | "lore"
  | "invalid";

// Category-tinted tag. Renders as a dark-bg chip with a 1px currentColor
// border + a category-color dot. Label color follows the category color
// except for the "meta" category (white), which uses white text.

@customElement("hex-tag")
export class HexTag extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: var(--hex-fs-sm);
        padding: 4px 8px;
        border-radius: var(--hex-radius-sm);
        background: rgba(2, 15, 35, 0.45);
        border: 1px solid currentColor;
        line-height: 1;
        --tag-color: var(--hex-tag-general);
        color: var(--tag-color);
      }
      :host([category="artist"]) {
        --tag-color: var(--hex-tag-artist);
      }
      :host([category="copyright"]) {
        --tag-color: var(--hex-tag-copyright);
      }
      :host([category="character"]) {
        --tag-color: var(--hex-tag-character);
      }
      :host([category="species"]) {
        --tag-color: var(--hex-tag-species);
      }
      :host([category="general"]) {
        --tag-color: var(--hex-tag-general);
      }
      :host([category="lore"]) {
        --tag-color: var(--hex-tag-lore);
      }
      :host([category="invalid"]) {
        --tag-color: var(--hex-tag-invalid);
      }
      :host([category="meta"]) {
        --tag-color: var(--hex-tag-meta);
        color: #fff;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: var(--hex-radius-pill);
        background: var(--tag-color);
        flex-shrink: 0;
      }
    `,
  ];

  @property({ type: String, reflect: true }) category: HexTagCategory = "general";

  override render() {
    return html`<span class="dot"></span><slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-tag": HexTag;
  }
}
