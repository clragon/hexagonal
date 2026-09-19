import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import type { HexRadio } from "./hex-radio.js";

export type HexRadioGroupDirection = "vertical" | "horizontal";

// Container for `<hex-radio>` children. Manages which radio is checked based
// on `value`, propagates `name` to all radios, and emits `hex-change` when
// the selection changes.

@customElement("hex-radio-group")
export class HexRadioGroup extends HexElement {
  static preflight = {
    base: { display: "flex", flexDirection: "column", gap: "8px", visibility: "hidden" },
    variants: [
      { when: '[direction="horizontal"]', style: { flexDirection: "row", gap: "16px" } },
      { when: "[label]", style: { paddingTop: "24.5px" } },
    ],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .label {
        display: block;
        font-size: var(--hex-fs-xs);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--hex-fg-2);
        font-weight: var(--hex-font-weight-bold);
      }
      .options {
        display: flex;
        gap: 8px;
        flex-direction: column;
      }
      :host([direction="horizontal"]) .options {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 16px;
      }
    `,
  ];

  @property({ type: String }) label = "";
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  @property({ type: String, reflect: true }) direction: HexRadioGroupDirection = "vertical";
  @property({ type: Boolean, reflect: true }) required = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("hex-radio-select", this.onChildSelect as EventListener);
    this.syncChildren();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("value") || changed.has("name") || changed.has("required")) {
      this.syncChildren();
    }
  }

  private getRadios(): HexRadio[] {
    return Array.from(this.querySelectorAll("hex-radio")) as HexRadio[];
  }

  private syncChildren() {
    const radios = this.getRadios();
    let selected = false;
    for (const radio of radios) {
      radio.name = this.name;
      radio.checked = radio.value === this.value;
      if (radio.checked) selected = true;
    }
    for (const radio of radios) {
      // Native radio grouping is per shadow root, so required on an unselected
      // radio reports valueMissing even when the group has a selection.
      radio.required = this.required && !selected;
    }
  }

  private onChildSelect = (e: CustomEvent<{ value: string }>) => {
    const newValue = e.detail.value;
    if (newValue === this.value) return;
    this.value = newValue;
    this.dispatchEvent(
      new CustomEvent("hex-change", {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return html`
      ${this.label
        ? html`<div id="group-label" class="label" part="label">${this.label}</div>`
        : ""}
      <div
        class="options"
        part="options"
        role="radiogroup"
        aria-labelledby=${this.label ? "group-label" : ""}
      >
        <slot @slotchange=${() => this.syncChildren()}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-radio-group": HexRadioGroup;
  }
}
