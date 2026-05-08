import { html, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import type { IconName } from "../shared/icons.js";

// Native `<select>` styled to match hex-input. Options are provided as light
// DOM `<option>` children, mirrored into the shadow select on connect /
// child-list mutation. We rely on the platform select for keyboard nav,
// screen-reader behavior, and the mobile picker.

interface OptionData {
  value: string;
  label: string;
  disabled: boolean;
}

@customElement("hex-select")
export class HexSelect extends HexElement {
  static override styles = [
    HexElement.styles,
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
      .chev {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--hex-color-secondary-dark);
        pointer-events: none;
      }
      select {
        width: 100%;
        box-sizing: border-box;
        background: var(--hex-color-background);
        color: var(--hex-fg-1);
        border: 1px solid var(--hex-border-strong);
        font-family: inherit;
        font-size: var(--hex-fs-md);
        padding: 8px 30px 8px 10px;
        border-radius: var(--hex-radius-md);
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        transition:
          border-color var(--hex-dur-fast) var(--hex-ease),
          box-shadow var(--hex-dur-fast) var(--hex-ease);
      }
      :host([with-icon]) select {
        padding-left: 30px;
      }
      select:focus {
        border-color: var(--hex-color-primary);
        box-shadow: var(--hex-shadow-focus);
      }
      :host([invalid]) select {
        border-color: var(--hex-color-danger);
      }
      :host([invalid]) select:focus {
        box-shadow: 0 0 0 2px rgba(224, 123, 107, 0.35);
      }
      option {
        background: var(--hex-bg-card);
        color: var(--hex-fg-1);
      }
      /* Mute the displayed value while the hidden placeholder option is the
         active one (no real selection made yet). */
      select:has(option[hidden]:checked),
      select:invalid {
        color: var(--hex-fg-2);
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
  @property({ type: String }) hint = "";
  @property({ type: String }) error = "";
  @property({ type: String }) icon?: IconName;
  @property({ type: String }) name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private opts: OptionData[] = [];

  @query("select") private _select!: HTMLSelectElement;

  private observer?: MutationObserver;

  override connectedCallback() {
    super.connectedCallback();
    this.syncOptions();
    this.observer = new MutationObserver(() => this.syncOptions());
    this.observer.observe(this, { childList: true, subtree: true, characterData: true });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("icon")) this.toggleAttribute("with-icon", Boolean(this.icon));
    if (changed.has("error")) this.toggleAttribute("invalid", Boolean(this.error));
  }

  override focus() {
    this._select?.focus();
  }

  private syncOptions() {
    const lightOptions = Array.from(this.querySelectorAll<HTMLOptionElement>("option"));
    this.opts = lightOptions.map((opt) => ({
      value: opt.value || (opt.textContent ?? ""),
      label: opt.textContent ?? "",
      disabled: opt.disabled,
    }));
  }

  private onChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("hex-change", { detail: { value }, bubbles: true, composed: true }),
    );
  };

  override render() {
    const describedBy = this.error ? "error" : this.hint ? "hint" : undefined;
    return html`
      ${this.label ? html`<label for="select">${this.label}</label>` : nothing}
      <div class="field">
        ${this.icon
          ? html`<span class="icon"><hex-icon name=${this.icon} size="14"></hex-icon></span>`
          : nothing}
        <select
          id="select"
          name=${this.name}
          ?disabled=${this.disabled}
          aria-describedby=${ifDefined(describedBy)}
          aria-invalid=${this.error ? "true" : "false"}
          @change=${this.onChange}
        >
          ${this.placeholder
            ? html`
                <option value="" disabled hidden ?selected=${!this.value}>
                  ${this.placeholder}
                </option>
              `
            : nothing}
          ${this.opts.map(
            (o) => html`
              <option value=${o.value} ?disabled=${o.disabled} ?selected=${o.value === this.value}>
                ${o.label}
              </option>
            `,
          )}
        </select>
        <span class="chev"><hex-icon name="chev-down" size="14"></hex-icon></span>
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
    "hex-select": HexSelect;
  }
}
