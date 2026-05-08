import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Collapsible section. The heading is whatever you slot into `name="heading"`
// (so consumers can drop in their own badges, icons, links, etc.). A
// `name="trailing"` slot sits flush right inside the header for actions or
// metadata.

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
        min-width: 0;
      }
      .chev {
        flex-shrink: 0;
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
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;

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
          <slot name="heading"></slot>
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
