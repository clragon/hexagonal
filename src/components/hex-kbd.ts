import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

@customElement("hex-kbd")
export class HexKbd extends HexElement {
  static preflight = {
    base: {
      visibility: "hidden",
      minHeight: "20.19px",
      display: "inline-block",
      verticalAlign: "baseline",
    },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-block;
        font-family: var(--hex-font-mono);
        font-size: var(--hex-fs-xs);
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(180, 199, 217, 0.18);
        border-bottom-width: 2px;
        padding: 2px 6px;
        border-radius: 3px;
        color: var(--hex-fg-1);
        line-height: 1.2;
        vertical-align: baseline;
      }
    `,
  ];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-kbd": HexKbd;
  }
}
