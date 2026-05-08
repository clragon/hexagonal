import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Standard card surface: navy fill + hex-texture watermark fading down + soft shadow.
// `dense` drops internal padding from 24 to 16 for data-heavy surfaces.
// `flat` removes the texture for nested card-on-card-on-card cases.

@customElement("hex-card")
export class HexCard extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        background-color: var(--hex-bg-card);
        background-image: var(--hex-texture);
        background-repeat: repeat-x;
        background-position: left top;
        border-radius: var(--hex-radius-md);
        box-shadow: var(--hex-shadow-card);
        color: var(--hex-fg-1);
        padding: var(--hex-space-5);
      }
      :host([dense]) {
        padding: var(--hex-space-4);
      }
      :host([flat]) {
        background-image: none;
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
