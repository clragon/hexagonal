import { html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexFormElement } from "../shared/form-element.js";
import "./hex-icon.js";
import type { IconName } from "../shared/icons.js";

@customElement("hex-input")
export class HexInput extends HexFormElement {
  static override styles = [
    HexFormElement.styles,
    css`
      :host {
        display: block;
      }
      label {
        display: block;
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
        box-shadow: var(--hex-shadow-focus-danger);
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
  @property({ type: String }) pattern?: string;
  @property({ type: Number, attribute: "minlength" }) minLength?: number;
  @property({ type: Number, attribute: "maxlength" }) maxLength?: number;

  @query("input") private _input!: HTMLInputElement;

  protected override control(): HTMLInputElement | null {
    return this._input ?? null;
  }

  protected override formValue(): string {
    return this.value;
  }

  protected override resetValue(): void {
    this.value = "";
  }

  override focus() {
    this._input?.focus();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("icon")) this.toggleAttribute("with-icon", Boolean(this.icon));
    if (changed.has("error")) this.toggleAttribute("invalid", Boolean(this.error));
    if (changed.has("value") || changed.has("required") || changed.has("error")) {
      this.commit(this.error || undefined);
    }
  }

  private onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.commit(this.error || undefined);
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
    const describedBy = this.error ? "error" : this.hint ? "hint" : undefined;
    return html`
      ${this.label ? html`<label for="input">${this.label}</label>` : nothing}
      <div class="field">
        ${this.icon
          ? html`<span class="icon"><hex-icon name=${this.icon} size="14"></hex-icon></span>`
          : nothing}
        <input
          id="input"
          .value=${this.value}
          type=${this.type}
          name=${this.name}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          pattern=${ifDefined(this.pattern)}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
          aria-describedby=${ifDefined(describedBy)}
          aria-invalid=${this.error ? "true" : "false"}
          @input=${this.onInput}
          @change=${this.onChange}
        />
      </div>
      ${this.error
        ? html`<div id="error" class="error" role="alert">${this.error}</div>`
        : this.hint
          ? html`<div id="hint" class="hint">${this.hint}</div>`
          : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-input": HexInput;
  }
}
