import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import type { IconName } from "../shared/icons.js";

@customElement("hex-menu-item")
export class HexMenuItem extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
      }
      .item {
        display: flex;
        align-items: center;
        gap: var(--hex-space-2);
        width: 100%;
        box-sizing: border-box;
        padding: 6px 12px;
        background: transparent;
        border: 0;
        color: var(--hex-fg-1);
        font-family: inherit;
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
        text-align: left;
        cursor: pointer;
        outline: none;
        white-space: nowrap;
      }
      .item:hover,
      .item:focus-visible {
        background: var(--hex-bg-hover);
      }
      .item:focus-visible {
        box-shadow: inset var(--hex-shadow-focus);
      }
      :host([danger]) .item {
        color: var(--hex-color-danger);
      }
      :host([disabled]) .item {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: String }) icon?: IconName;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) danger = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "none");
  }

  focusItem(): void {
    this.renderRoot.querySelector<HTMLElement>(".item")?.focus();
  }

  private readonly onActivate = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("hex-select", {
        detail: { value: this.value || this.textContent?.trim() || "" },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return html`
      <button
        class="item"
        type="button"
        role="menuitem"
        tabindex="-1"
        ?disabled=${this.disabled}
        @click=${this.onActivate}
      >
        ${this.icon ? html`<hex-icon name=${this.icon} size="14"></hex-icon>` : nothing}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-menu-item": HexMenuItem;
  }
}
