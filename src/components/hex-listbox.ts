import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-option.js";
import type { HexOption } from "./hex-option.js";

let listboxSeq = 0;

export interface HexListboxSelectDetail {
  value: string;
  option: HexOption;
  index: number;
}

@customElement("hex-listbox")
export class HexListbox extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "8px", padding: "4px 0" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        overflow-y: auto;
        overscroll-behavior: contain;
        max-height: var(--hex-listbox-max-height, 18rem);
        padding: var(--hex-space-1) 0;
        outline: none;
      }
      .empty {
        padding: 8px 12px;
        font-size: var(--hex-fs-sm);
        color: var(--hex-fg-2);
      }
      .empty[hidden] {
        display: none;
      }
    `,
  ];

  @property({ type: Number }) activeIndex = -1;
  @property({ type: String }) value = "";
  @property({ type: String }) empty = "";

  @state() private count = 0;

  private readonly uid = `hex-lb-${++listboxSeq}`;
  private typeaheadBuffer = "";
  private typeaheadTimer?: ReturnType<typeof setTimeout>;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "listbox");
    if (!this.id) this.id = this.uid;
  }

  override disconnectedCallback(): void {
    clearTimeout(this.typeaheadTimer);
    super.disconnectedCallback();
  }

  get options(): HexOption[] {
    return Array.from(this.querySelectorAll<HexOption>("hex-option"));
  }

  get activeOption(): HexOption | null {
    return this.options[this.activeIndex] ?? null;
  }

  get activeDescendant(): string | undefined {
    return this.activeOption?.id || undefined;
  }

  private step(from: number, delta: number, allowEmpty: boolean): number {
    const options = this.options;
    if (!options.length) return -1;
    const span = allowEmpty ? options.length + 1 : options.length;
    let cursor = from;
    for (let tries = 0; tries < span; tries++) {
      cursor += delta;
      if (allowEmpty) {
        if (cursor >= options.length) cursor = -1;
        else if (cursor < -1) cursor = options.length - 1;
        if (cursor === -1) return -1;
      } else {
        if (cursor >= options.length) cursor = 0;
        else if (cursor < 0) cursor = options.length - 1;
      }
      if (!options[cursor]?.disabled) return cursor;
    }
    return -1;
  }

  move(delta: number, allowEmpty = false): void {
    const from = this.activeIndex < 0 && delta < 0 ? this.options.length : this.activeIndex;
    this.activate(this.step(from, delta, allowEmpty));
  }

  first(): void {
    this.activate(this.step(-1, 1, false));
  }

  last(): void {
    this.activate(this.step(this.options.length, -1, false));
  }

  activate(index: number): void {
    if (index === this.activeIndex) return;
    this.activeIndex = index;
    this.syncActive();
    this.dispatchEvent(
      new CustomEvent("hex-activate", {
        detail: { index, option: this.activeOption },
        bubbles: true,
        composed: true,
      }),
    );
  }

  activateByValue(value: string): void {
    const index = this.options.findIndex((o) => o.value === value);
    if (index >= 0) this.activate(index);
  }

  clearActive(): void {
    this.activate(-1);
  }

  selectActive(): boolean {
    const option = this.activeOption;
    if (!option || option.disabled) return false;
    this.choose(option);
    return true;
  }

  typeahead(char: string): boolean {
    if (char.length !== 1 || !/\S/.test(char)) return false;
    clearTimeout(this.typeaheadTimer);
    this.typeaheadBuffer += char.toLowerCase();
    this.typeaheadTimer = setTimeout(() => (this.typeaheadBuffer = ""), 500);
    const needle = this.typeaheadBuffer;
    const options = this.options;
    const repeated = [...needle].every((c) => c === needle[0]);
    const search = repeated ? (needle[0] ?? "") : needle;
    const start = this.activeIndex < 0 ? 0 : this.activeIndex + (repeated ? 1 : 0);
    for (let i = 0; i < options.length; i++) {
      const at = (start + i) % options.length;
      const option = options[at];
      if (!option || option.disabled) continue;
      if (option.text.toLowerCase().startsWith(search)) {
        this.activate(at);
        return true;
      }
    }
    return false;
  }

  private choose(option: HexOption): void {
    this.value = option.value;
    this.syncSelected();
    this.dispatchEvent(
      new CustomEvent<HexListboxSelectDetail>("hex-select", {
        detail: { value: option.value, option, index: this.options.indexOf(option) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private syncActive(): void {
    const options = this.options;
    options.forEach((option, index) => {
      option.active = index === this.activeIndex;
    });
    this.activeOption?.scrollIntoView({ block: "nearest" });
  }

  private syncSelected(): void {
    for (const option of this.options) option.selected = option.value === this.value;
  }

  private readonly onSlotChange = (): void => {
    const options = this.options;
    this.count = options.length;
    options.forEach((option, index) => {
      if (!option.id) option.id = `${this.id}-o${index}`;
    });
    if (this.activeIndex >= options.length) this.activeIndex = options.length - 1;
    this.syncActive();
    this.syncSelected();
  };

  private readonly onClick = (e: MouseEvent): void => {
    const option = e
      .composedPath()
      .find((n): n is HexOption => n instanceof HTMLElement && n.localName === "hex-option");
    if (!option || option.disabled) return;
    this.activate(this.options.indexOf(option));
    this.choose(option);
  };

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("value")) this.syncSelected();
    if (changed.has("activeIndex")) this.syncActive();
  }

  override render() {
    return html`
      <slot @slotchange=${this.onSlotChange} @click=${this.onClick}></slot>
      <div class="empty" part="empty" ?hidden=${this.count > 0 || !this.empty}>${this.empty}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-listbox": HexListbox;
  }
}
