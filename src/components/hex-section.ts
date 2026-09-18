import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Collapsible section. The heading is whatever you slot into `name="heading"`
// (so consumers can drop in their own badges, icons, links, etc.). A
// `name="trailing"` slot sits flush right inside the header for actions or
// metadata.

@customElement("hex-section")
export class HexSection extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "35px" },
    variants: [],
  };

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

  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggle();
    }
  };

  override render() {
    return html`
      <div
        class="header"
        part="header"
        @click=${this.toggle}
        @keydown=${this.onKey}
        role="button"
        tabindex="0"
        aria-expanded=${this.open}
        aria-controls="body"
      >
        <div class="title" part="title">
          <svg
            class="chev"
            part="chev"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
          <slot name="heading"></slot>
        </div>
        <slot name="trailing"></slot>
      </div>
      <div id="body" class="body" part="body" role="region">
        <div class="content" part="content"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-section": HexSection;
  }
}
