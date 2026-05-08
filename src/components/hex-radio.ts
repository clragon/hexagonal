import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Single radio control. Use inside a `<hex-radio-group>` to manage selection
// across multiple radios; on its own it still works but won't deselect peers.
// `value` is the payload reported when this radio is selected.

@customElement("hex-radio")
export class HexRadio extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
      }
      label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: var(--hex-fs-md);
        color: var(--hex-fg-1);
        cursor: pointer;
        user-select: none;
      }
      .dot {
        position: relative;
        width: 14px;
        height: 14px;
        border-radius: var(--hex-radius-pill);
        border: 1px solid var(--hex-border-strong);
        background: var(--hex-color-background);
        flex-shrink: 0;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease);
      }
      :host([checked]) .dot {
        border-color: var(--hex-color-primary);
      }
      :host([checked]) .dot::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        border-radius: var(--hex-radius-pill);
        background: var(--hex-color-primary);
        transform: translate(-50%, -50%);
      }
      :host([disabled]) {
        opacity: 0.4;
        pointer-events: none;
      }
      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      input:focus-visible + .dot {
        box-shadow: var(--hex-shadow-focus);
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) value = "";
  @property({ type: String }) name = "";

  private onSelect = () => {
    if (this.disabled || this.checked) return;
    this.checked = true;
    this.dispatchEvent(
      new CustomEvent("hex-radio-select", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return html`
      <label>
        <input
          type="radio"
          name=${this.name}
          .value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onSelect}
        />
        <span class="dot"></span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-radio": HexRadio;
  }
}
