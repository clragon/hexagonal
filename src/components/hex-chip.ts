import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";

// Generic chip used for filters, selections, removable tokens. For tag-cloud
// category coloring, use <hex-tag> instead.

@customElement("hex-chip")
export class HexChip extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      minHeight: "24px",
    },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        gap: 6px;
        font-size: var(--hex-fs-sm);
        padding: 5px 10px;
        border-radius: var(--hex-radius-sm);
        background: var(--hex-bg-hover);
        border: 1px solid var(--hex-bg-active);
        color: var(--hex-fg-1);
        line-height: 1;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          color var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease);
      }
      :host([interactive]) {
        cursor: pointer;
      }
      :host([interactive]:hover) {
        background: var(--hex-bg-active);
      }
      :host([active]) {
        background: rgba(232, 196, 70, 0.16);
        border-color: var(--hex-color-primary);
        color: var(--hex-color-primary);
      }
      :host([pill]) {
        border-radius: var(--hex-radius-pill);
      }
      .remove {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        opacity: 0.7;
      }
      .remove:hover {
        opacity: 1;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) pill = false;
  @property({ type: Boolean, reflect: true }) removable = false;
  @property({ type: Boolean, reflect: true }) interactive = false;

  private onRemove = (e: Event) => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("hex-remove", { bubbles: true, composed: true }));
  };

  override render() {
    return html`
      <slot></slot>
      ${this.removable
        ? html`<span class="remove" part="remove" @click=${this.onRemove}
            ><hex-icon name="close" size="11"></hex-icon
          ></span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-chip": HexChip;
  }
}
