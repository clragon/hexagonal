import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";

export type HexErrorVariant = "crash" | "hint";

@customElement("hex-error")
export class HexError extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "120px" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        min-height: 120px;
      }
      .panel {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        min-height: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--hex-space-2);
        padding: var(--hex-space-5) var(--hex-space-4);
        border-radius: var(--hex-radius-md);
        text-align: center;
        color: var(--hex-fg-1);
      }
      :host([variant="crash"]) .panel {
        text-shadow: 0 0 12px var(--hex-color-background);
        background-color: var(--hex-bg-danger);
        background-image: repeating-linear-gradient(
          45deg,
          var(--hex-color-danger) 0,
          var(--hex-color-danger) 16px,
          transparent 16px,
          transparent 48px
        );
      }
      .heading {
        font-size: var(--hex-fs-h6);
        font-weight: var(--hex-font-weight-bold);
        line-height: var(--hex-line-tight);
      }
      .body {
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
      }
      .body[hidden] {
        display: none;
      }
      hex-icon {
        color: var(--hex-color-danger);
      }
      :host([variant="crash"]) hex-icon {
        display: none;
      }
    `,
  ];

  @property({ type: String, reflect: true }) variant: HexErrorVariant = "crash";
  @property({ type: String }) heading = "";

  private hasBody = false;

  private readonly onSlot = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.hasBody = slot.assignedNodes({ flatten: true }).some((n) => n.textContent?.trim());
    this.requestUpdate();
  };

  override render() {
    return html`
      <div class="panel" part="panel" role="alert">
        <hex-icon name="alert-triangle" size="48" part="icon"></hex-icon>
        ${this.heading ? html`<div class="heading" part="heading">${this.heading}</div>` : nothing}
        <div class="body" part="body" ?hidden=${!this.hasBody}>
          <slot @slotchange=${this.onSlot}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-error": HexError;
  }
}
