import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Collapsible section (single-card, not a `<details>` clone): rotating chevron,
// optional badge in the header, max-height transition for smooth open.

@customElement("hex-section")
export class HexSection extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        background: var(--hex-bg-section);
        border-radius: var(--hex-radius-md);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        cursor: pointer;
        user-select: none;
        border-bottom: 1px solid transparent;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-base) var(--hex-ease);
      }
      .header:hover {
        background: rgba(180, 199, 217, 0.06);
      }
      .title {
        font-weight: var(--hex-font-weight-bold);
        font-size: var(--hex-fs-md);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .chev {
        transition: transform var(--hex-dur-base) var(--hex-ease);
      }
      :host([open]) .chev {
        transform: rotate(90deg);
      }
      :host([open]) .header {
        border-bottom-color: var(--hex-border);
      }
      .body {
        max-height: 0;
        overflow: hidden;
        transition: max-height var(--hex-dur-base) var(--hex-ease);
      }
      :host([open]) .body {
        max-height: var(--hex-section-max-height, 800px);
      }
      .content {
        padding: 12px 14px;
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
      }
      .badge {
        background: rgba(232, 196, 70, 0.15);
        color: var(--hex-color-primary);
        font-size: 10px;
        font-weight: var(--hex-font-weight-bold);
        padding: 2px 6px;
        border-radius: var(--hex-radius-pill);
        margin-left: 6px;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) heading = "";
  @property({ type: String }) badge = "";

  private toggle = () => {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent("hex-toggle", { detail: { open: this.open }, bubbles: true, composed: true }),
    );
  };

  override render() {
    return html`
      <div class="header" @click=${this.toggle} role="button" aria-expanded=${this.open}>
        <div class="title">
          <svg
            class="chev"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
          ${this.heading} ${this.badge ? html`<span class="badge">${this.badge}</span>` : nothing}
        </div>
        <slot name="trailing"></slot>
      </div>
      <div class="body">
        <div class="content"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-section": HexSection;
  }
}
