import { html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HexFormElement } from "../shared/form-element.js";

// Single radio control. Use inside a `<hex-radio-group>` to manage selection
// across multiple radios; on its own it still works but won't deselect peers.
// `value` is the payload reported when this radio is selected.

@customElement("hex-radio")
export class HexRadio extends HexFormElement {
  static override styles = [
    HexFormElement.styles,
    css`
      :host {
        display: inline-flex;
      }
      label {
        display: inline-flex;
        align-items: center;
        min-height: 24px;
        gap: 8px;
        font-size: var(--hex-fs-md);
        color: var(--hex-fg-1);
        cursor: pointer;
        user-select: none;
      }
      .dot {
        width: 18px;
        height: 18px;
        border-radius: var(--hex-radius-pill);
        border: 2px solid var(--hex-border-strong);
        background: var(--hex-color-background);
        flex-shrink: 0;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease);
      }
      :host([checked]) .dot {
        border-width: 4px;
        border-color: var(--hex-color-primary);
        background: var(--hex-fg-on-primary);
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
  @property({ type: String }) value = "";

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

  private onSelect = () => {
    if (this.disabled || this.checked) return;
    this.checked = true;
    this.commit();
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
        <span class="dot" part="dot"></span>
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
