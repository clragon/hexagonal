import { html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexFormElement } from "../shared/form-element.js";

@customElement("hex-textarea")
export class HexTextarea extends HexFormElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "164px" },
    variants: [
      { when: "[label]", style: { minHeight: "185.5px" } },
      { when: "[label][counter]", style: { minHeight: "202px" } },
    ],
  };

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
      textarea {
        width: 100%;
        box-sizing: border-box;
        min-height: 10rem;
        resize: vertical;
        background: var(--hex-color-background);
        color: var(--hex-fg-1);
        border: 1px solid var(--hex-border-strong);
        font-family: inherit;
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
        padding: 8px 10px;
        border-radius: var(--hex-radius-md);
        outline: none;
        display: block;
        transition:
          border-color var(--hex-dur-fast) var(--hex-ease),
          box-shadow var(--hex-dur-fast) var(--hex-ease);
      }
      textarea:focus {
        border-color: var(--hex-color-primary);
        box-shadow: var(--hex-shadow-focus);
      }
      :host([invalid]) textarea {
        border-color: var(--hex-color-danger);
      }
      :host([invalid]) textarea:focus {
        box-shadow: var(--hex-shadow-focus-danger);
      }
      .footer {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--hex-space-3);
        margin-top: 4px;
      }
      .hint,
      .error,
      .counter {
        font-size: var(--hex-fs-xs);
      }
      .hint {
        color: var(--hex-fg-2);
      }
      .error {
        color: var(--hex-color-danger);
      }
      .counter {
        color: var(--hex-fg-2);
        font-variant-numeric: tabular-nums;
        margin-left: auto;
        flex-shrink: 0;
      }
      .counter[data-over] {
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
  @property({ type: String }) hint = "";
  @property({ type: String }) error = "";
  @property({ type: Number }) rows = 6;
  @property({ type: Number, attribute: "maxlength" }) maxLength?: number;
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
    if (changed.has("error")) this.toggleAttribute("invalid", Boolean(this.error));
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
    const describedBy = this.error ? "error" : this.hint ? "hint" : undefined;
    const over = this.maxLength !== undefined && this.value.length > this.maxLength;
    return html`
      ${this.label ? html`<label for="ta">${this.label}</label>` : nothing}
      <textarea
        part="control"
        id="ta"
        .value=${this.value}
        rows=${this.rows}
        name=${this.name}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        ?required=${this.required}
        maxlength=${ifDefined(this.maxLength)}
        aria-describedby=${ifDefined(describedBy)}
        aria-invalid=${this.error ? "true" : "false"}
        @input=${this.onInput}
        @change=${this.onChange}
      ></textarea>
      <div class="footer" part="footer">
        ${this.error
          ? html`<div id="error" class="error" part="error" role="alert">${this.error}</div>`
          : this.hint
            ? html`<div id="hint" class="hint" part="hint">${this.hint}</div>`
            : nothing}
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
