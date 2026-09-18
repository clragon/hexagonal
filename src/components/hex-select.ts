import { html, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexFieldElement } from "../shared/field-element.js";
import "./hex-icon.js";
import "./hex-listbox.js";
import "./hex-option.js";
import "./hex-popover.js";
import type { HexListbox, HexListboxSelectDetail } from "./hex-listbox.js";
import type { HexOption, HexOptionCategory } from "./hex-option.js";
import type { HexPopover } from "./hex-popover.js";

interface OptionData {
  value: string;
  label: string;
  disabled: boolean;
  category?: HexOptionCategory;
  count?: number;
  antecedent?: string;
}

@customElement("hex-select")
export class HexSelect extends HexFieldElement {
  static override styles = [
    ...HexFieldElement.styles,
    css`
      .control {
        display: flex;
        align-items: center;
        text-align: left;
        padding-right: 30px;
        cursor: pointer;
      }
      .value {
        flex: 1 1 auto;
        min-width: 0;
        height: var(--_hex-control-line);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .value[data-placeholder] {
        color: var(--hex-fg-2);
      }
      .chev {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--hex-color-secondary-dark);
        pointer-events: none;
      }
      .native {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        border: 0;
        padding: 0;
        margin: 0;
        bottom: 0;
        left: 10px;
      }
      hex-popover::part(surface) {
        min-width: var(--_hex-select-width, 12rem);
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";

  @state() private opts: OptionData[] = [];
  @state() private expanded = false;
  @state() private activeId?: string;

  @query(".control") private _button!: HTMLButtonElement;
  @query(".field") private _field!: HTMLElement;
  @query("select") private _select!: HTMLSelectElement;
  @query("hex-popover") private _popover!: HexPopover;
  @query("hex-listbox") private _listbox!: HexListbox;

  private observer?: MutationObserver;

  protected override control(): HTMLSelectElement | null {
    return this._select ?? null;
  }

  protected override formValue(): string {
    return this.value;
  }

  protected override resetValue(): void {
    this.value = "";
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncOptions();
    this.observer = new MutationObserver(() => this.syncOptions());
    this.observer.observe(this, { childList: true, subtree: true, characterData: true });
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    this.syncFieldAttributes(changed);
    if (changed.has("value") || changed.has("required") || changed.has("error")) {
      if (this._select) this._select.value = this.value;
      this.commit(this.error || undefined);
    }
  }

  override focus(): void {
    this._button?.focus();
  }

  private syncOptions(): void {
    const rich = Array.from(this.querySelectorAll<HexOption>("hex-option"));
    if (rich.length) {
      this.opts = rich.map((opt) => ({
        value: opt.getAttribute("value") ?? "",
        label: opt.getAttribute("label") ?? (opt.textContent ?? "").trim(),
        disabled: opt.hasAttribute("disabled"),
        category: (opt.getAttribute("category") as HexOptionCategory | null) ?? undefined,
        count: opt.hasAttribute("count") ? Number(opt.getAttribute("count")) : undefined,
        antecedent: opt.getAttribute("antecedent") ?? undefined,
      }));
      return;
    }
    const lightOptions = Array.from(this.querySelectorAll<HTMLOptionElement>("option"));
    this.opts = lightOptions.map((opt) => {
      const count = opt.dataset.count;
      return {
        value: opt.value || (opt.textContent ?? "").trim(),
        label: (opt.textContent ?? "").trim(),
        disabled: opt.disabled,
        category: opt.dataset.category as HexOptionCategory | undefined,
        count: count === undefined ? undefined : Number(count),
        antecedent: opt.dataset.antecedent,
      };
    });
  }

  private get selected(): OptionData | undefined {
    return this.opts.find((o) => o.value === this.value);
  }

  private open(focus: "selected" | "first" | "last" = "selected"): void {
    if (this.expanded || this.disabled) return;
    if (this._field) {
      this._popover?.style.setProperty("--_hex-select-width", `${this._field.offsetWidth}px`);
    }
    this.expanded = true;
    this._popover?.show();
    void (async () => {
      await this.updateComplete;
      const listbox = this._listbox;
      if (!listbox) return;
      if (focus === "last") listbox.last();
      else if (focus === "first" || !this.value) listbox.first();
      else listbox.activateByValue(this.value);
      this.activeId = listbox.activeDescendant;
    })();
  }

  private close(refocus = true): void {
    if (!this.expanded) return;
    this.expanded = false;
    this.activeId = undefined;
    this._popover?.hide();
    this._listbox?.clearActive();
    if (refocus) this._button?.focus();
  }

  private commitValue(value: string): void {
    if (value === this.value) return;
    this.value = value;
    if (this._select) this._select.value = value;
    this.commit(this.error || undefined);
    this.dispatchEvent(
      new CustomEvent("hex-change", { detail: { value }, bubbles: true, composed: true }),
    );
  }

  private readonly onButtonClick = (): void => {
    if (this.expanded) this.close();
    else this.open();
  };

  private readonly onKeydown = (e: KeyboardEvent): void => {
    const listbox = this._listbox;

    if (!this.expanded) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.open(e.key === "ArrowUp" ? "last" : "selected");
      } else if (e.key.length === 1 && /\S/.test(e.key)) {
        this.open();
        void (async () => {
          await this.updateComplete;
          this._listbox?.typeahead(e.key);
          this.activeId = this._listbox?.activeDescendant;
        })();
      }
      return;
    }

    if (!listbox) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        listbox.move(1);
        this.activeId = listbox.activeDescendant;
        break;
      case "ArrowUp":
        e.preventDefault();
        listbox.move(-1);
        this.activeId = listbox.activeDescendant;
        break;
      case "Home":
        e.preventDefault();
        listbox.first();
        this.activeId = listbox.activeDescendant;
        break;
      case "End":
        e.preventDefault();
        listbox.last();
        this.activeId = listbox.activeDescendant;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (listbox.selectActive()) return;
        this.close();
        break;
      case "Escape":
        e.preventDefault();
        this.close();
        break;
      case "Tab":
        this.close(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          listbox.typeahead(e.key);
          this.activeId = listbox.activeDescendant;
        }
        break;
    }
  };

  private readonly onListboxActivate = (e: Event): void => {
    e.stopPropagation();
    this.activeId = this._listbox?.activeDescendant;
  };

  private readonly onListboxSelect = (e: Event): void => {
    e.stopPropagation();
    const detail = (e as CustomEvent<HexListboxSelectDetail>).detail;
    this.commitValue(detail.value);
    this.close();
  };

  private readonly onPanelMousedown = (e: MouseEvent): void => {
    e.preventDefault();
  };

  private readonly onPopoverClose = (): void => {
    if (this.expanded) {
      this.expanded = false;
      this.activeId = undefined;
    }
  };

  override render() {
    const selected = this.selected;
    return html`
      ${this.label ? html`<label id="label" for="trigger">${this.label}</label>` : nothing}
      <div class="field" part="field">
        ${this.icon
          ? html`<span class="icon" part="icon"
              ><hex-icon name=${this.icon} size="14"></hex-icon
            ></span>`
          : nothing}
        ${this.renderPrefix()}
        <button
          id="trigger"
          class="control"
          part="control"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this.expanded ? "true" : "false"}
          aria-controls="listbox"
          aria-activedescendant=${ifDefined(this.activeId)}
          aria-describedby=${ifDefined(this.describedBy)}
          aria-invalid=${this.error ? "true" : "false"}
          aria-labelledby=${ifDefined(this.label ? "label trigger" : undefined)}
          ?disabled=${this.disabled}
          @click=${this.onButtonClick}
          @keydown=${this.onKeydown}
        >
          <span class="value" ?data-placeholder=${!selected}
            >${selected ? selected.label : this.placeholder}</span
          >
        </button>
        <span class="chev"><hex-icon name="chev-down" size="14"></hex-icon></span>
        <select
          class="native"
          tabindex="-1"
          aria-hidden="true"
          name=${this.name}
          ?disabled=${this.disabled}
          ?required=${this.required}
        >
          <option value="" ?selected=${!this.value}></option>
          ${this.opts.map(
            (o) => html`<option value=${o.value} ?selected=${o.value === this.value}>
              ${o.label}
            </option>`,
          )}
        </select>
      </div>
      <hex-popover
        .anchorElement=${this._field ?? null}
        trigger="none"
        dismiss="auto"
        placement="bottom"
        align="start"
        distance="4"
        @hex-close=${this.onPopoverClose}
        @mousedown=${this.onPanelMousedown}
      >
        <hex-listbox
          id="listbox"
          .value=${this.value}
          aria-labelledby=${ifDefined(this.label ? "label" : undefined)}
          @hex-activate=${this.onListboxActivate}
          @hex-select=${this.onListboxSelect}
        >
          ${this.opts.map(
            (o) => html`
              <hex-option
                value=${o.value}
                label=${o.label}
                category=${ifDefined(o.category)}
                count=${ifDefined(o.count)}
                antecedent=${ifDefined(o.antecedent)}
                ?disabled=${o.disabled}
              ></hex-option>
            `,
          )}
        </hex-listbox>
      </hex-popover>
      ${this.renderMessage()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-select": HexSelect;
  }
}
