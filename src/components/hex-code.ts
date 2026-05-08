import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Inline `<code>` by default; `block` switches to a multi-line preformatted box.

@customElement("hex-code")
export class HexCode extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        font-family: var(--hex-font-mono);
        font-size: var(--hex-fs-sm);
      }
      :host(:not([block])) {
        display: inline;
      }
      :host(:not([block])) code {
        background: rgba(2, 15, 35, 0.5);
        padding: 1px 6px;
        border-radius: var(--hex-radius-sm);
        border: 1px solid var(--hex-border-subtle);
        color: var(--hex-color-secondary-light);
      }
      :host([block]) {
        display: block;
      }
      :host([block]) pre {
        margin: 0;
        background: var(--hex-color-background);
        border: 1px solid var(--hex-border);
        border-radius: var(--hex-radius-md);
        padding: 12px 14px;
        color: var(--hex-fg-1);
        font-size: var(--hex-fs-sm);
        line-height: var(--hex-line-normal);
        overflow-x: auto;
        white-space: pre;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) block = false;

  override render() {
    return this.block
      ? html`<pre><code><slot></slot></code></pre>`
      : html`<code><slot></slot></code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-code": HexCode;
  }
}
