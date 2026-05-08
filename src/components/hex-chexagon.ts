import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Verification badge: hex outline + check. The hex stroke uses the artist
// tag color (the canonical "verified" hue); the check stays white.

@customElement("hex-chexagon")
export class HexChexagon extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        line-height: 0;
      }
      svg {
        display: block;
      }
    `,
  ];

  @property({ type: Number }) size = 18;

  override render() {
    return html`
      <svg
        width=${this.size}
        height=${this.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M7.6 21.4h8.8a2.2 2.1 0 0 0 1.9-1l4.3-7.4a2.2 2.1 0 0 0 0-2l-4.3-7.4a2.2 2.1 0 0 0-2-1H7.7a2.2 2.1 0 0 0-1.9 1L1.4 11a2.2 2.1 0 0 0 0 2l4.3 7.4a2.2 2.1 0 0 0 2 1z"
          stroke="var(--hex-tag-artist)"
          stroke-width="1.8"
        />
        <path d="m17.3 9.2-6.6 6.6-3-3.1" stroke="#ffffff" stroke-width="2" />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-chexagon": HexChexagon;
  }
}
