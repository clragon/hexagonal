import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Standard card surface: navy fill, a masked hex-texture layer fading down, soft shadow.
// `dense` drops internal padding from 24 to 16 for data-heavy surfaces.
// `flat` removes the texture for nested card-on-card-on-card cases.

@customElement("hex-card")
export class HexCard extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "48px", padding: "24px" },
    variants: [{ when: "[dense]", style: { padding: "16px" } }],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        position: relative;
        isolation: isolate;
        background-color: var(--hex-bg-card);
        border-radius: var(--hex-radius-md);
        box-shadow: var(--hex-shadow-card);
        color: var(--hex-fg-1);
        padding: var(--hex-space-5);
      }
      :host::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background-image: var(--hex-texture);
        background-repeat: repeat;
        -webkit-mask-image: var(--hex-texture-mask);
        mask-image: var(--hex-texture-mask);
      }
      :host([dense]) {
        padding: var(--hex-space-4);
      }
      :host([flat])::before {
        display: none;
      }
      :host([flat]) {
        background-color: var(--hex-bg-section);
        box-shadow: none;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) dense = false;
  @property({ type: Boolean, reflect: true }) flat = false;

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-card": HexCard;
  }
}
