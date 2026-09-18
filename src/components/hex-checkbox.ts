import { html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HexFormElement } from "../shared/form-element.js";
import "./hex-icon.js";

@customElement("hex-checkbox")
export class HexCheckbox extends HexFormElement {
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
      .box {
        position: relative;
        top: var(--hex-control-optical-offset);
        width: 18px;
        height: 18px;
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
          .checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @change=${this.onToggle}
        />
        <span class="box" part="box">
          ${this.checked ? html`<hex-icon name="check" size="13" stroke-width="3"></hex-icon>` : ""}
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
