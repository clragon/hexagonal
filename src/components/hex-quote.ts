import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexQuoteVariant = "default" | "alt" | "warn";

@customElement("hex-quote")
export class HexQuote extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        background: var(--hex-color-section);
        border-left: 3px solid var(--hex-color-secondary);
        border-radius: var(--hex-radius-md);
        padding: 12px 14px;
        color: var(--hex-fg-1);
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
      }
      :host([variant="alt"]) {
        border-left-color: var(--hex-color-primary);
      }
      :host([variant="warn"]) {
        border-left-color: var(--hex-role-admin);
        background: rgba(230, 149, 0, 0.08);
      }
      .cite {
        display: block;
        font-size: var(--hex-fs-xs);
        color: var(--hex-fg-2);
        margin-top: 6px;
        font-style: italic;
      }
    `,
  ];

  @property({ type: String, reflect: true }) variant: HexQuoteVariant = "default";
  @property({ type: String }) cite = "";

  override render() {
    return html`
      <slot></slot>
      ${this.cite ? html`<span class="cite">${this.cite}</span>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-quote": HexQuote;
  }
}
