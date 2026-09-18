import { html, css, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import type { HexTagCategory } from "./hex-tag.js";

export type HexOptionCategory = HexTagCategory | "user" | "pool" | "wiki" | "metatag";

const compact = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

@customElement("hex-option")
export class HexOption extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        cursor: pointer;
        --option-color: var(--hex-fg-1);
      }
      .row {
        display: flex;
        align-items: center;
        gap: var(--hex-space-2);
        padding: 6px 12px;
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
        white-space: nowrap;
        color: var(--option-color);
      }
      :host([active]) .row,
      :host(:hover) .row {
        background: var(--hex-bg-hover);
      }
      :host([selected]) .row {
        background: var(--hex-bg-active);
      }
      :host([disabled]) {
        cursor: not-allowed;
      }
      :host([disabled]) .row {
        opacity: 0.4;
      }
      .label {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .count {
        flex: 0 0 auto;
        font-size: var(--hex-fs-xs);
        color: var(--hex-fg-2);
        font-variant-numeric: tabular-nums;
      }
      .antecedent {
        flex: 0 0 auto;
        color: var(--hex-fg-2);
        text-decoration: line-through;
      }
      .arrow {
        flex: 0 0 auto;
        color: var(--hex-fg-2);
      }
      mark {
        background: transparent;
        color: inherit;
        font-weight: var(--hex-font-weight-bold);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      :host([category="artist"]) {
        --option-color: var(--hex-tag-artist);
      }
      :host([category="copyright"]) {
        --option-color: var(--hex-tag-copyright);
      }
      :host([category="character"]) {
        --option-color: var(--hex-tag-character);
      }
      :host([category="species"]) {
        --option-color: var(--hex-tag-species);
      }
      :host([category="general"]) {
        --option-color: var(--hex-tag-general);
      }
      :host([category="meta"]) {
        --option-color: var(--hex-tag-meta);
      }
      :host([category="lore"]) {
        --option-color: var(--hex-tag-lore);
      }
      :host([category="invalid"]) {
        --option-color: var(--hex-tag-invalid);
      }
      :host([category="contributor"]) {
        --option-color: var(--hex-tag-contributor);
      }
      :host([category="metatag"]) {
        --option-color: var(--hex-fg-2);
      }
    `,
  ];

  @property({ type: String, reflect: true }) value = "";
  @property({ type: String }) label = "";
  @property({ type: Number }) count?: number;
  @property({ type: String, reflect: true }) category?: HexOptionCategory;
  @property({ type: String }) antecedent?: string;
  @property({ type: String }) match = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) active = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "option");
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("selected")) this.setAttribute("aria-selected", String(this.selected));
    if (changed.has("disabled")) {
      if (this.disabled) this.setAttribute("aria-disabled", "true");
      else this.removeAttribute("aria-disabled");
    }
  }

  get text(): string {
    return this.label || this.textContent?.trim() || this.value;
  }

  private highlighted(text: string): TemplateResult | string {
    const needle = this.match.trim();
    if (!needle) return text;
    const at = text.toLowerCase().indexOf(needle.toLowerCase());
    if (at < 0) return text;
    const end = at + needle.length;
    return html`${text.slice(0, at)}<mark part="match">${text.slice(at, end)}</mark>${text.slice(
      end,
    )}`;
  }

  override render() {
    return html`
      <div class="row" part="base">
        ${this.antecedent
          ? html`<span class="antecedent" part="antecedent">${this.antecedent}</span>
              <span class="arrow" aria-hidden="true">&rarr;</span>`
          : nothing}
        <span class="label" part="label"
          >${this.label ? this.highlighted(this.label) : html`<slot></slot>`}</span
        >
        ${this.count === undefined
          ? nothing
          : html`<span class="count" part="count">${compact.format(this.count)}</span>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-option": HexOption;
  }
}
