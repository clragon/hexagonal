import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexQuoteVariant = "default" | "alt";

// Inline rounded quote block with a left-side accent stripe.
// Variants pick from the brand palette; pass any CSS color via `stripe-color`
// to override (or set the `--hex-quote-stripe` custom property directly).

@customElement("hex-quote")
export class HexQuote extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "24px", padding: "12px 14px" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        margin: 0;
        --hex-quote-stripe: var(--hex-color-secondary);
        background: var(--hex-color-section);
        border-left: 3px solid var(--hex-quote-stripe);
        border-radius: var(--hex-radius-md);
        padding: 12px 14px;
        color: var(--hex-fg-1);
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
      }
      :host([variant="alt"]) {
        --hex-quote-stripe: var(--hex-color-primary);
      }
    `,
  ];

  @property({ type: String, reflect: true }) variant: HexQuoteVariant = "default";
  @property({ type: String, attribute: "stripe-color" }) stripeColor = "";

  override updated(changed: Map<string, unknown>) {
    if (changed.has("stripeColor")) {
      if (this.stripeColor) {
        this.style.setProperty("--hex-quote-stripe", this.stripeColor);
      } else {
        this.style.removeProperty("--hex-quote-stripe");
      }
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "blockquote");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-quote": HexQuote;
  }
}
