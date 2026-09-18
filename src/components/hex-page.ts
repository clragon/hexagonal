import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Full-bleed page surface. Use as the outer wrapper to get the navy background
// + tiled hex texture without manually wiring up the recipe.

@customElement("hex-page")
export class HexPage extends HexElement {
  static preflight = {
    base: { display: "block", minHeight: "100vh", visibility: "hidden" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        scrollbar-gutter: stable;
        background-color: var(--hex-bg-page);
        background-image: var(--hex-tile);
        background-repeat: repeat;
        color: var(--hex-fg-1);
        font-size: var(--hex-fs-md);
      }
    `,
  ];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-page": HexPage;
  }
}
