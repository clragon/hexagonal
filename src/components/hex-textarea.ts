import { html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexFieldElement } from "../shared/field-element.js";
import "./hex-icon.js";

@customElement("hex-textarea")
export class HexTextarea extends HexFieldElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "114px" },
    variants: [
      { when: "[label]", style: { minHeight: "135.5px" } },
      { when: "[hint]", style: { minHeight: "134.5px" } },
      { when: "[label][hint]", style: { minHeight: "156px" } },
      { when: "[label][error]", style: { minHeight: "156px" } },
      { when: "[counter]", style: { minHeight: "134.5px" } },
      { when: "[label][counter]", style: { minHeight: "156px" } },
      { when: '[size="sm"]', style: { minHeight: "104px" } },
      { when: '[size="sm"][label]', style: { minHeight: "125.5px" } },
      { when: '[size="sm"][hint]', style: { minHeight: "124.5px" } },
      { when: '[size="sm"][label][hint]', style: { minHeight: "146px" } },
      { when: '[size="sm"][label][error]', style: { minHeight: "146px" } },
      { when: '[size="sm"][counter]', style: { minHeight: "124.5px" } },
      { when: '[size="sm"][label][counter]', style: { minHeight: "146px" } },
      { when: '[size="lg"]', style: { minHeight: "136px" } },
      { when: '[size="lg"][label]', style: { minHeight: "157.5px" } },
      { when: '[size="lg"][hint]', style: { minHeight: "156.5px" } },
      { when: '[size="lg"][label][hint]', style: { minHeight: "178px" } },
      { when: '[size="lg"][label][error]', style: { minHeight: "178px" } },
      { when: '[size="lg"][counter]', style: { minHeight: "156.5px" } },
      { when: '[size="lg"][label][counter]', style: { minHeight: "178px" } },
    ],
  };

  static override styles = [
    HexFieldElement.styles,
    css`
      .field {
        align-items: stretch;
      }
      .control {
        display: block;
        resize: vertical;
      }
      .icon,
      .prefix,
      .suffix {
        top: calc(8px + var(--_hex-control-line) / 2);
      }
      :host([size="sm"]) .icon,
      :host([size="sm"]) .prefix,
      :host([size="sm"]) .suffix {
        top: calc(6px + var(--_hex-control-line) / 2);
      }
      :host([size="lg"]) .icon,
      :host([size="lg"]) .prefix,
      :host([size="lg"]) .suffix {
        top: calc(10px + var(--_hex-control-line) / 2);
      }
      .footer {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--hex-space-3);
      }
      .counter {
        font-size: var(--hex-fs-xs);
        color: var(--hex-fg-2);
        font-variant-numeric: tabular-nums;
        margin-top: 4px;
        margin-left: auto;
        flex-shrink: 0;
      }
      .counter[data-over] {
        color: var(--hex-color-danger);
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: Number }) rows = 6;
  @property({ type: Number, attribute: "minlength" }) minLength?: number;
  @property({ type: Number, attribute: "maxlength" }) maxLength?: number;
  @property({ type: String }) autocomplete?: string;
  @property({ type: Boolean, reflect: true, attribute: "readonly" }) readOnly = false;
  @property({ type: Boolean, reflect: true }) counter = false;

  @query("textarea") private _textarea!: HTMLTextAreaElement;

  protected override control(): HTMLTextAreaElement | null {
    return this._textarea ?? null;
  }

  protected override formValue(): string {
    return this.value;
  }

  protected override resetValue(): void {
    this.value = "";
  }

  override focus() {
    this._textarea?.focus();
  }

  override updated(changed: Map<string, unknown>) {
    this.syncFieldAttributes(changed);
    if (changed.has("value") || changed.has("required") || changed.has("error")) {
      this.commit(this.error || undefined);
    }
  }

  private onInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;
    this.value = value;
    this.commit(this.error || undefined);
    this.dispatchEvent(
      new CustomEvent("hex-input", { detail: { value }, bubbles: true, composed: true }),
    );
  };

  private onChange = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(
      new CustomEvent("hex-change", { detail: { value }, bubbles: true, composed: true }),
    );
  };

  override render() {
    const over = this.maxLength !== undefined && this.value.length > this.maxLength;
    return html`
      ${this.label ? html`<label for="ta">${this.label}</label>` : nothing}
      <div class="field" part="field">
        ${this.icon
          ? html`<span class="icon" part="icon"
              ><hex-icon name=${this.icon} size="14"></hex-icon
            ></span>`
          : nothing}
        ${this.renderPrefix()}
        <textarea
          class="control"
          part="control"
          id="ta"
          .value=${this.value}
          rows=${this.rows}
          name=${this.name}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readOnly}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
          autocomplete=${ifDefined(this.autocomplete)}
          aria-describedby=${ifDefined(this.describedBy)}
          aria-invalid=${this.error ? "true" : "false"}
          @input=${this.onInput}
          @change=${this.onChange}
        ></textarea>
        ${this.renderSuffix()}
      </div>
      <div class="footer" part="footer">
        ${this.renderMessage()}
        ${this.counter && this.maxLength !== undefined
          ? html`<div class="counter" part="counter" ?data-over=${over} aria-live="polite">
              ${this.value.length} / ${this.maxLength}
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-textarea": HexTextarea;
  }
}
