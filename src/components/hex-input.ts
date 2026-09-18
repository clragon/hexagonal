import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexFieldElement } from "../shared/field-element.js";
import "./hex-icon.js";

@customElement("hex-input")
export class HexInput extends HexFieldElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "34px" },
    variants: [
      { when: "[label]", style: { minHeight: "55.5px" } },
      { when: "[hint]", style: { minHeight: "54.5px" } },
      { when: "[label][hint]", style: { minHeight: "76px" } },
      { when: "[label][error]", style: { minHeight: "76px" } },
      { when: '[size="sm"]', style: { minHeight: "29px" } },
      { when: '[size="sm"][label]', style: { minHeight: "50.5px" } },
      { when: '[size="sm"][hint]', style: { minHeight: "49.5px" } },
      { when: '[size="sm"][label][error]', style: { minHeight: "71px" } },
      { when: '[size="sm"][label][hint]', style: { minHeight: "71px" } },
      { when: '[size="lg"]', style: { minHeight: "41px" } },
      { when: '[size="lg"][label]', style: { minHeight: "62.5px" } },
      { when: '[size="lg"][hint]', style: { minHeight: "61.5px" } },
      { when: '[size="lg"][label][error]', style: { minHeight: "83px" } },
      { when: '[size="lg"][label][hint]', style: { minHeight: "83px" } },
    ],
  };

  static override styles = HexFieldElement.styles;

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) type: HTMLInputElement["type"] = "text";
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
    this.syncFieldAttributes(changed);
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
    return html`
      ${this.label ? html`<label for="input">${this.label}</label>` : nothing}
      <div class="field" part="field">
        ${this.icon
          ? html`<span class="icon" part="icon"
              ><hex-icon name=${this.icon} size="14"></hex-icon
            ></span>`
          : nothing}
        ${this.renderPrefix()}
        <input
          id="input"
          class="control"
          part="control"
          .value=${this.value}
          type=${this.type}
          name=${this.name}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          pattern=${ifDefined(this.pattern)}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
          aria-describedby=${ifDefined(this.describedBy)}
          aria-invalid=${this.error ? "true" : "false"}
          @input=${this.onInput}
          @change=${this.onChange}
        />
        ${this.renderSuffix()}
      </div>
      ${this.renderMessage()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-input": HexInput;
  }
}
