import { html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import type { IconName } from "../shared/icons.js";

@customElement("hex-input")
export class HexInput extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
      }
      .label {
        font-size: var(--hex-fs-xs);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--hex-fg-2);
        font-weight: var(--hex-font-weight-bold);
        margin-bottom: 5px;
      }
      .field {
        position: relative;
        display: flex;
        align-items: center;
      }
      .icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--hex-color-secondary-dark);
        pointer-events: none;
      }
      input {
        width: 100%;
        box-sizing: border-box;
        background: var(--hex-color-background);
        color: var(--hex-fg-1);
        border: 1px solid var(--hex-border-strong);
        font-family: inherit;
        font-size: var(--hex-fs-md);
        padding: 8px 10px;
        border-radius: var(--hex-radius-md);
        outline: none;
        transition:
          border-color var(--hex-dur-fast) var(--hex-ease),
          box-shadow var(--hex-dur-fast) var(--hex-ease);
      }
      :host([with-icon]) input {
        padding-left: 30px;
      }
      input:focus {
        border-color: var(--hex-color-primary);
        box-shadow: var(--hex-shadow-focus);
      }
      :host([invalid]) input {
        border-color: var(--hex-color-danger);
      }
      :host([invalid]) input:focus {
        box-shadow: 0 0 0 2px rgba(224, 123, 107, 0.35);
      }
      .hint,
      .error {
        font-size: var(--hex-fs-xs);
        margin-top: 4px;
      }
      .hint {
        color: var(--hex-fg-2);
      }
      .error {
        color: var(--hex-color-danger);
      }
      :host([disabled]) {
        opacity: 0.55;
        pointer-events: none;
      }
    `,
  ];

  @property({ type: String }) label = "";
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) type: HTMLInputElement["type"] = "text";
  @property({ type: String }) hint = "";
  @property({ type: String }) error = "";
  @property({ type: String }) icon?: IconName;
  @property({ type: String }) name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query("input") private _input!: HTMLInputElement;

  override focus() {
    this._input?.focus();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("icon")) this.toggleAttribute("with-icon", Boolean(this.icon));
    if (changed.has("error")) this.toggleAttribute("invalid", Boolean(this.error));
  }

  private onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("hex-input", { detail: { value }, bubbles: true, composed: true }),
    );
  };

  private onChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent("hex-change", { detail: { value }, bubbles: true, composed: true }),
    );
  };

  override render() {
    return html`
      ${this.label ? html`<div class="label">${this.label}</div>` : nothing}
      <div class="field">
        ${this.icon
          ? html`<span class="icon"><hex-icon name=${this.icon} size="14"></hex-icon></span>`
          : nothing}
        <input
          .value=${this.value}
          type=${this.type}
          name=${this.name}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @change=${this.onChange}
        />
      </div>
      ${this.error
        ? html`<div class="error">${this.error}</div>`
        : this.hint
          ? html`<div class="hint">${this.hint}</div>`
          : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-input": HexInput;
  }
}
