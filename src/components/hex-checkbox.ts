import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";

@customElement("hex-checkbox")
export class HexCheckbox extends HexElement {
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
      .box {
        width: 14px;
        height: 14px;
        border-radius: var(--hex-radius-sm);
        border: 1px solid var(--hex-border-strong);
        background: var(--hex-color-background);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease);
      }
      :host([checked]) .box {
        background: var(--hex-color-primary);
        border-color: var(--hex-color-primary);
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
      input:focus-visible + .box {
        box-shadow: var(--hex-shadow-focus);
      }
      hex-icon {
        color: var(--hex-fg-on-primary);
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = "";

  private onToggle = () => {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("hex-change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return html`
      <label>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onToggle}
        />
        <span class="box">
          ${this.checked ? html`<hex-icon name="check" size="10" stroke-width="3"></hex-icon>` : ""}
        </span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-checkbox": HexCheckbox;
  }
}
