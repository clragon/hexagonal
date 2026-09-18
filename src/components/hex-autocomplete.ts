import { html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexFieldElement } from "../shared/field-element.js";
import "./hex-icon.js";
import "./hex-listbox.js";
import "./hex-option.js";
import "./hex-popover.js";
import "./hex-spinner.js";
import type { HexListbox, HexListboxSelectDetail } from "./hex-listbox.js";
import type { HexOptionCategory } from "./hex-option.js";
import type { HexPopover } from "./hex-popover.js";

export interface HexAutocompleteItem {
  value: string;
  label?: string;
  count?: number;
  category?: HexOptionCategory;
  antecedent?: string;
  disabled?: boolean;
  data?: unknown;
}

export interface HexAutocompleteContext {
  input: HTMLInputElement;
  caret: number;
  signal: AbortSignal;
  term: string;
}

export interface HexAutocompleteProvider {
  search(
    query: string,
    context: HexAutocompleteContext,
  ): Promise<HexAutocompleteItem[]> | HexAutocompleteItem[];
  insert?(input: HTMLInputElement, item: HexAutocompleteItem): void;
  renderOption?(item: HexAutocompleteItem, index: number): TemplateResult;
}

const DEFAULT_DELAY = 225;
const BLUR_GRACE = 150;

function normalize(entry: string | HexAutocompleteItem): HexAutocompleteItem {
  return typeof entry === "string" ? { value: entry } : entry;
}

@customElement("hex-autocomplete")
export class HexAutocomplete extends HexFieldElement {
  static override styles = [
    ...HexFieldElement.styles,
    css`
      .control {
        padding-right: 30px;
      }
      .trailing {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        pointer-events: none;
      }
      .trailing[hidden] {
        display: none;
      }
      hex-popover::part(surface) {
        min-width: var(--_hex-ac-width, 12rem);
        max-width: min(92vw, 34rem);
      }
      .status {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) empty = "";
  @property({ type: Number, attribute: "min-length" }) minLength = 1;
  @property({ type: Number, attribute: "max-results" }) maxResults = 15;
  @property({ type: Number }) delay = DEFAULT_DELAY;
  @property({ attribute: false }) provider?: HexAutocompleteProvider;
  @property({
    converter: {
      fromAttribute: (value: string | null): (string | HexAutocompleteItem)[] => {
        if (!value) return [];
        const trimmed = value.trim();
        if (trimmed.startsWith("[")) {
          try {
            return JSON.parse(trimmed) as (string | HexAutocompleteItem)[];
          } catch {
            return [];
          }
        }
        return trimmed
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean);
      },
      toAttribute: (): null => null,
    },
  })
  source: (string | HexAutocompleteItem)[] = [];

  @state() private items: HexAutocompleteItem[] = [];
  @state() private term = "";
  @state() private expanded = false;
  @state() private loading = false;
  @state() private activeId?: string;

  @query("input") private _input!: HTMLInputElement;
  @query(".field") private _field!: HTMLElement;
  @query("hex-popover") private _popover!: HexPopover;
  @query("hex-listbox") private _listbox!: HexListbox;

  private controller?: AbortController;
  private debounceTimer?: ReturnType<typeof setTimeout>;
  private blurTimer?: ReturnType<typeof setTimeout>;
  private justSelected = false;
  private keepOpenHeld = false;
  private lastQuery = "";

  protected override control(): HTMLInputElement | null {
    return this._input ?? null;
  }

  protected override formValue(): string {
    return this.value;
  }

  protected override resetValue(): void {
    this.value = "";
    this.items = [];
    this.close();
  }

  override disconnectedCallback(): void {
    clearTimeout(this.debounceTimer);
    clearTimeout(this.blurTimer);
    this.controller?.abort();
    super.disconnectedCallback();
  }

  override focus(): void {
    this._input?.focus();
  }

  override updated(changed: Map<string, unknown>): void {
    this.syncFieldAttributes(changed);
    if (changed.has("value") || changed.has("required") || changed.has("error")) {
      this.commit(this.error || undefined);
    }
  }

  private get activeProvider(): HexAutocompleteProvider {
    return this.provider ?? this.sourceProvider;
  }

  private readonly sourceProvider: HexAutocompleteProvider = {
    search: (typed) => {
      const needle = typed.trim().toLowerCase();
      return this.source
        .map(normalize)
        .filter((item) => (item.label ?? item.value).toLowerCase().includes(needle));
    },
  };

  private schedule(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => void this.search(), this.delay);
  }

  private async search(): Promise<void> {
    const input = this._input;
    if (!input || this.disabled) return;

    const typed = input.value;
    const caret = input.selectionStart ?? typed.length;

    if (this.expanded && typed.trim() === this.lastQuery.trim()) return;
    this.lastQuery = typed;

    if (typed.trim().replace(/\*/g, "").length < this.minLength) {
      this.controller?.abort();
      this.items = [];
      this.close();
      return;
    }

    this.controller?.abort();
    const controller = new AbortController();
    this.controller = controller;
    this.loading = true;

    const context: HexAutocompleteContext = {
      input,
      caret,
      signal: controller.signal,
      term: typed,
    };

    try {
      const found = await this.activeProvider.search(typed, context);
      if (controller.signal.aborted || this.controller !== controller) return;
      this.apply(found.slice(0, this.maxResults), context.term);
    } catch (err) {
      if (controller.signal.aborted || this.controller !== controller) return;
      this.items = [];
      this.close();
      this.dispatchEvent(
        new CustomEvent("hex-error", { detail: { error: err }, bubbles: true, composed: true }),
      );
    } finally {
      if (this.controller === controller) this.loading = false;
    }
  }

  private apply(items: HexAutocompleteItem[], term: string): void {
    const previous = this._listbox?.activeOption?.value;
    this.items = items;
    this.term = term;
    if (!items.length) {
      if (this.empty) this.openPanel();
      else this.close();
      return;
    }
    this.openPanel();
    void (async () => {
      await this.updateComplete;
      const listbox = this._listbox;
      if (!listbox) return;
      const restored = previous ? items.findIndex((i) => i.value === previous) : -1;
      listbox.activeIndex = restored;
      this.activeId = listbox.activeDescendant;
    })();
  }

  private openPanel(): void {
    if (this._field) {
      this._popover?.style.setProperty("--_hex-ac-width", `${this._field.offsetWidth}px`);
    }
    this.expanded = true;
    this._popover?.show();
  }

  private close(): void {
    if (!this.expanded) return;
    this.expanded = false;
    this.activeId = undefined;
    this._listbox?.clearActive();
    this._popover?.hide();
  }

  private readonly onInput = (e: Event): void => {
    if (this.justSelected) {
      this.justSelected = false;
      return;
    }
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.commit(this.error || undefined);
    this.dispatchEvent(
      new CustomEvent("hex-input", { detail: { value }, bubbles: true, composed: true }),
    );
    this.schedule();
  };

  private readonly onFocus = (): void => {
    clearTimeout(this.blurTimer);
  };

  private readonly onBlur = (): void => {
    clearTimeout(this.blurTimer);
    this.blurTimer = setTimeout(() => this.close(), BLUR_GRACE);
  };

  private readonly onKeydown = (e: KeyboardEvent): void => {
    const listbox = this._listbox;
    if (!this.expanded || !listbox) {
      if (e.key === "ArrowDown" && this.items.length) {
        e.preventDefault();
        this.openPanel();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        listbox.move(1, true);
        this.activeId = listbox.activeDescendant;
        break;
      case "ArrowUp":
        e.preventDefault();
        listbox.move(-1, true);
        this.activeId = listbox.activeDescendant;
        break;
      case "Enter":
        if (listbox.activeIndex < 0) return;
        e.preventDefault();
        e.stopPropagation();
        this.choose(listbox.activeIndex, e.ctrlKey);
        break;
      case "Escape":
        e.preventDefault();
        this.close();
        break;
      case "Tab":
        if (!this.items.length) return;
        e.preventDefault();
        this.choose(listbox.activeIndex < 0 ? 0 : listbox.activeIndex, e.ctrlKey);
        break;
      default:
        break;
    }
  };

  private readonly onPanelMousedown = (e: MouseEvent): void => {
    this.keepOpenHeld = e.ctrlKey;
    e.preventDefault();
  };

  private readonly onListboxActivate = (e: Event): void => {
    e.stopPropagation();
    this.activeId = this._listbox?.activeDescendant;
  };

  private readonly onListboxSelect = (e: Event): void => {
    e.stopPropagation();
    const detail = (e as CustomEvent<HexListboxSelectDetail>).detail;
    this.choose(detail.index, this.keepOpenHeld);
    this.keepOpenHeld = false;
  };

  private choose(index: number, keepOpen: boolean): void {
    const item = this.items[index];
    const input = this._input;
    if (!item || !input || item.disabled) return;

    this.justSelected = true;
    if (this.activeProvider.insert) this.activeProvider.insert(input, item);
    else input.value = item.value;
    this.justSelected = false;

    this.value = input.value;
    this.commit(this.error || undefined);
    this.dispatchEvent(
      new CustomEvent("hex-select", {
        detail: { value: item.value, item, input: this.value },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("hex-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );

    input.focus();
    if (keepOpen) {
      this.lastQuery = "";
      this.schedule();
    } else {
      this.lastQuery = input.value;
      this.close();
    }
  }

  private readonly onPopoverClose = (): void => {
    if (this.expanded) this.expanded = false;
  };

  override render() {
    return html`
      ${this.label ? html`<label for="input">${this.label}</label>` : nothing}
      <div class="field" part="field">
        ${this.icon
          ? html`<span class="icon" part="icon"><hex-icon name=${this.icon} size="14"></hex-icon></span>`
          : nothing}
        ${this.renderPrefix()}
        <input
          id="input"
          class="control"
          part="control"
          .value=${this.value}
          type="text"
          name=${this.name}
          placeholder=${this.placeholder}
          autocomplete="off"
          spellcheck="false"
          role="combobox"
          aria-expanded=${this.expanded ? "true" : "false"}
          aria-controls="listbox"
          aria-autocomplete="list"
          aria-activedescendant=${ifDefined(this.activeId)}
          aria-describedby=${ifDefined(this.describedBy)}
          aria-invalid=${this.error ? "true" : "false"}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @input=${this.onInput}
          @keydown=${this.onKeydown}
          @focus=${this.onFocus}
          @blur=${this.onBlur}
        />
        <span class="trailing" ?hidden=${!this.loading}>
          <hex-spinner size="14"></hex-spinner>
        </span>
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
          empty=${this.empty}
          @hex-activate=${this.onListboxActivate}
          @hex-select=${this.onListboxSelect}
        >
          ${this.items.map((item, index) => {
            const custom = this.activeProvider.renderOption?.(item, index);
            return html`
              <hex-option
                value=${item.value}
                label=${custom ? "" : (item.label ?? item.value)}
                category=${ifDefined(item.category)}
                antecedent=${ifDefined(item.antecedent)}
                count=${ifDefined(item.count)}
                match=${this.term}
                ?disabled=${item.disabled ?? false}
                >${custom ?? nothing}</hex-option
              >
            `;
          })}
        </hex-listbox>
      </hex-popover>
      ${this.renderMessage()}
      <span class="status" role="status" aria-live="polite">
        ${this.expanded ? `${this.items.length} results` : ""}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-autocomplete": HexAutocomplete;
  }
}
