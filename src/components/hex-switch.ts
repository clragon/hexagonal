import { html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HexFormElement } from "../shared/form-element.js";

// Toggle switch. The native checkbox is visually hidden but keeps role,
// keyboard, and screen-reader behavior; the visible track + thumb is purely
// presentational. `role="switch"` is set on the input so assistive tech
// announces it as a switch instead of a checkbox.
//
// Slot content renders as an inline label after the toggle. For row-style
// layouts (label on left + hint below + switch on right) wrap externally.

@customElement("hex-switch")
export class HexSwitch extends HexFormElement {
  static override styles = [
    HexFormElement.styles,
    css`
      :host {
        display: inline-flex;
      }
      label {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: var(--hex-fs-md);
        color: var(--hex-fg-1);
        cursor: pointer;
        user-select: none;
      }
      input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        margin: 0;
      }
      .track {
        position: relative;
        top: var(--hex-control-optical-offset);
        width: 44px;
        height: 24px;
        background: var(--hex-border-strong);
        border-radius: var(--hex-radius-pill);
        transition: background var(--hex-dur-base) var(--hex-ease);
        flex-shrink: 0;
      }
      .thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        background: #ffffff;
        border-radius: var(--hex-radius-pill);
        transition:
          transform var(--hex-dur-base) var(--hex-ease),
          background var(--hex-dur-base) var(--hex-ease);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      :host([checked]) .track {
        background: var(--hex-color-primary);
      }
      :host([checked]) .thumb {
        transform: translateX(20px);
        background: var(--hex-fg-on-primary);
      }
      input:focus-visible + .track {
        box-shadow: var(--hex-shadow-focus);
      }
      :host([disabled]) {
        opacity: 0.4;
        pointer-events: none;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: String }) value = "on";

  @query("input") private _input!: HTMLInputElement;

  protected override control(): HTMLInputElement | null {
    return this._input ?? null;
  }

  protected override formValue(): string | null {
    return this.checked ? this.value : null;
  }

  protected override resetValue(): void {
    this.checked = false;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("checked") || changed.has("required")) this.commit();
  }

  private onToggle = () => {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.commit();
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
          role="switch"
          name=${this.name}
          .value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onToggle}
        />
        <span class="track" part="track"><span class="thumb" part="thumb"></span></span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-switch": HexSwitch;
  }
}
