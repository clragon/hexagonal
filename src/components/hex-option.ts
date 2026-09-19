import { html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

@customElement("hex-option")
export class HexOption extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "31.5px" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        cursor: pointer;
      }
      .row {
        display: flex;
        align-items: center;
        gap: var(--hex-space-2);
        padding: 6px 12px;
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
        white-space: nowrap;
        color: var(--hex-option-color, var(--hex-fg-1));
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
      .trailing {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: var(--hex-space-2);
        font-size: var(--hex-fs-xs);
        color: var(--hex-fg-2);
      }
      .trailing[hidden] {
        display: none;
      }
      mark {
        background: transparent;
        color: inherit;
        font-weight: var(--hex-font-weight-bold);
      }
    `,
  ];

  @property({ type: String, reflect: true }) value = "";
  @property({ type: String }) label = "";
  @property({ type: String }) match = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) active = false;

  @state() private hasTrailing = false;

  private readonly onTrailingSlot = (e: Event): void => {
    this.hasTrailing = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

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
        <span class="label" part="label"
          >${this.label ? this.highlighted(this.label) : html`<slot></slot>`}</span
        >
        <span class="trailing" part="trailing" ?hidden=${!this.hasTrailing}>
          <slot name="trailing" @slotchange=${this.onTrailingSlot}></slot>
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-option": HexOption;
  }
}
