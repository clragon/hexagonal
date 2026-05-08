import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import "./hex-button.js";
import type { IconName } from "../shared/icons.js";

export type HexAlertVariant = "success" | "error" | "warning" | "info";

const VARIANT_ICON: Record<HexAlertVariant, IconName> = {
  success: "check",
  error: "alert-circle",
  warning: "alert-triangle",
  info: "info-circle",
};

// Alert banner: tinted bg + colored left stripe + variant icon + optional
// heading + message + actions slot + close button.
//
// Slots:
// - default: message body
// - actions: ghost buttons rendered before the close button
//
// Set `no-close` to omit the close button. Click on close fires `hex-dismiss`
// and removes the element from the DOM by default. Call `event.preventDefault()`
// in a listener to keep it mounted (e.g. animate it out yourself).

@customElement("hex-alert")
export class HexAlert extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--hex-radius-md);
        border-left: 3px solid;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        font-size: var(--hex-fs-md);
        --alert-color: var(--hex-color-secondary);
        background: rgba(180, 199, 217, 0.12);
        border-left-color: var(--alert-color);
        color: var(--alert-color);
      }
      :host([variant="success"]) {
        --alert-color: var(--hex-color-success);
        background: rgba(107, 191, 122, 0.15);
      }
      :host([variant="error"]) {
        --alert-color: var(--hex-color-danger);
        background: rgba(224, 123, 107, 0.15);
      }
      :host([variant="warning"]) {
        --alert-color: var(--hex-color-primary);
        background: rgba(232, 196, 70, 0.12);
      }
      :host([variant="info"]) {
        --alert-color: var(--hex-color-secondary);
        background: rgba(180, 199, 217, 0.12);
      }

      .icon {
        flex-shrink: 0;
        color: var(--alert-color);
      }
      .content {
        flex: 1;
        min-width: 0;
      }
      .heading {
        font-weight: var(--hex-font-weight-bold);
        font-size: var(--hex-fs-md);
        margin-bottom: 2px;
        color: var(--alert-color);
      }
      .msg {
        font-size: var(--hex-fs-md);
        color: var(--hex-color-secondary-light);
        opacity: 0.92;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
      ::slotted([slot="actions"]) {
        color: var(--alert-color);
      }
      .close {
        color: var(--alert-color);
      }
    `,
  ];

  @property({ type: String, reflect: true }) variant: HexAlertVariant = "info";
  @property({ type: String }) heading = "";
  @property({ type: Boolean, reflect: true, attribute: "no-close" }) noClose = false;

  private onClose = () => {
    const event = new CustomEvent("hex-dismiss", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const allowed = this.dispatchEvent(event);
    if (allowed) this.remove();
  };

  override render() {
    const iconName = VARIANT_ICON[this.variant];
    return html`
      <span class="icon"><hex-icon name=${iconName} size="18" stroke-width="2"></hex-icon></span>
      <div class="content">
        ${this.heading ? html`<div class="heading">${this.heading}</div>` : nothing}
        <div class="msg"><slot></slot></div>
      </div>
      <div class="actions"><slot name="actions"></slot></div>
      ${this.noClose
        ? nothing
        : html`
            <hex-button
              class="close"
              variant="ghost"
              size="sm"
              icon-only
              icon="close"
              aria-label="Dismiss"
              @click=${this.onClose}
            ></hex-button>
          `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-alert": HexAlert;
  }
}
