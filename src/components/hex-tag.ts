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
  | "invalid"
  | "contributor";

// Category-tinted tag. Renders as a dark-bg chip with a 1px currentColor
// border. Label color follows the category color
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
        --_hex-tag-color: var(--hex-tag-general);
        color: var(--_hex-tag-color);
      }
      :host([category="artist"]) {
        --_hex-tag-color: var(--hex-tag-artist);
        --_hex-tag-color-alt: var(--hex-tag-artist-alt);
      }
      :host([category="copyright"]) {
        --_hex-tag-color: var(--hex-tag-copyright);
        --_hex-tag-color-alt: var(--hex-tag-copyright-alt);
      }
      :host([category="character"]) {
        --_hex-tag-color: var(--hex-tag-character);
        --_hex-tag-color-alt: var(--hex-tag-character-alt);
      }
      :host([category="species"]) {
        --_hex-tag-color: var(--hex-tag-species);
        --_hex-tag-color-alt: var(--hex-tag-species-alt);
      }
      :host([category="general"]) {
        --_hex-tag-color: var(--hex-tag-general);
        --_hex-tag-color-alt: var(--hex-tag-general-alt);
      }
      :host([category="lore"]) {
        --_hex-tag-color: var(--hex-tag-lore);
        --_hex-tag-color-alt: var(--hex-tag-lore-alt);
      }
      :host([category="invalid"]) {
        --_hex-tag-color: var(--hex-tag-invalid);
        --_hex-tag-color-alt: var(--hex-tag-invalid-alt);
      }
      :host([category="contributor"]) {
        --_hex-tag-color: var(--hex-tag-contributor);
        --_hex-tag-color-alt: var(--hex-tag-contributor-alt);
      }
      :host([category="meta"]) {
        --_hex-tag-color: var(--hex-tag-meta);
        --_hex-tag-color-alt: var(--hex-tag-meta-alt);
        color: #fff;
      }
    `,
  ];

  @property({ type: String, reflect: true }) category: HexTagCategory = "general";

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-tag": HexTag;
  }
}
