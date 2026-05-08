import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import type { IconName } from "../shared/icons.js";

export type HexButtonVariant = "primary" | "secondary" | "ghost" | "text-primary" | "danger";
export type HexButtonSize = "sm" | "md" | "lg";

// Button surface. `type="submit"` forwards to the inner <button> so it works
// inside forms; click events bubble out as the standard `click`.

@customElement("hex-button")
export class HexButton extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      :host([full]) {
        display: flex;
      }
      :host([disabled]) {
        opacity: 0.4;
        cursor: not-allowed;
      }
      :host([disabled]) button {
        pointer-events: none;
      }
      button {
        all: unset;
        font-family: inherit;
        font-size: var(--hex-fs-md);
        font-weight: var(--hex-font-weight-bold);
        padding: 8px 16px;
        border-radius: var(--hex-radius-md);
        cursor: pointer;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        user-select: none;
        -webkit-user-select: none;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          color var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease),
          transform var(--hex-dur-fast) var(--hex-ease),
          box-shadow var(--hex-dur-fast) var(--hex-ease);
        border: 1px solid transparent;
      }
      :host([full]) button {
        width: 100%;
        justify-content: center;
      }
      button:focus-visible {
        outline: none;
        box-shadow: var(--hex-shadow-focus);
      }
      button:active {
        transform: translateY(1px);
        box-shadow: var(--hex-shadow-sunken);
      }
      button:active:focus-visible {
        box-shadow: var(--hex-shadow-sunken), var(--hex-shadow-focus);
      }

      /* primary */
      :host([variant="primary"]) button,
      :host(:not([variant])) button {
        background: var(--hex-color-primary);
        color: var(--hex-fg-on-primary);
      }
      :host([variant="primary"]) button:hover,
      :host(:not([variant])) button:hover {
        background: var(--hex-color-primary-light);
      }
      :host([variant="primary"]) button:active,
      :host(:not([variant])) button:active {
        background: var(--hex-color-primary-dark);
      }

      /* secondary (outline) */
      :host([variant="secondary"]) button {
        background: transparent;
        color: var(--hex-fg-1);
        border-color: var(--hex-border-strong);
      }
      :host([variant="secondary"]) button:hover {
        background: rgba(180, 199, 217, 0.14);
        color: var(--hex-color-secondary-light);
        border-color: var(--hex-color-secondary);
      }
      :host([variant="secondary"]) button:active {
        background: rgba(180, 199, 217, 0.22);
        border-color: var(--hex-color-secondary-light);
      }

      /* ghost (no border) */
      :host([variant="ghost"]) button {
        background: transparent;
        color: var(--hex-color-secondary);
      }
      :host([variant="ghost"]) button:hover {
        background: rgba(180, 199, 217, 0.1);
        color: var(--hex-color-secondary-light);
      }
      :host([variant="ghost"]) button:active {
        background: rgba(180, 199, 217, 0.18);
      }

      /* text-primary (amber link-ish) */
      :host([variant="text-primary"]) button {
        background: transparent;
        color: var(--hex-color-primary);
        padding: 8px 10px;
      }
      :host([variant="text-primary"]) button:hover {
        background: rgba(232, 196, 70, 0.12);
        color: var(--hex-color-primary-light);
      }
      :host([variant="text-primary"]) button:active {
        background: rgba(232, 196, 70, 0.2);
      }

      /* danger */
      :host([variant="danger"]) button {
        background: var(--hex-color-danger);
        color: #2a0e09;
      }
      :host([variant="danger"]) button:hover {
        background: #e89486;
      }
      :host([variant="danger"]) button:active {
        background: #c96a5b;
      }

      /* sizes */
      :host([size="sm"]) button {
        font-size: var(--hex-fs-xs);
        padding: 6px 10px;
      }
      :host([size="lg"]) button {
        font-size: 14px;
        padding: 10px 20px;
      }
      :host([size="sm"][variant="text-primary"]) button {
        padding: 6px 8px;
      }
      :host([size="lg"][variant="text-primary"]) button {
        padding: 10px 14px;
      }
    `,
  ];

  @property({ type: String, reflect: true }) variant: HexButtonVariant = "primary";
  @property({ type: String, reflect: true }) size: HexButtonSize = "md";
  @property({ type: String }) icon?: IconName;
  @property({ type: String }) type: "button" | "submit" | "reset" = "button";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) full = false;

  private onClick = (e: Event) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (this.type === "submit") {
      const form = this.closest("form");
      form?.requestSubmit();
    } else if (this.type === "reset") {
      this.closest("form")?.reset();
    }
  };

  override render() {
    const iconSize = this.size === "lg" ? 16 : 14;
    return html`
      <button type=${this.type} ?disabled=${this.disabled} @click=${this.onClick}>
        ${this.icon ? html`<hex-icon name=${this.icon} size=${iconSize}></hex-icon>` : nothing}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-button": HexButton;
  }
}
