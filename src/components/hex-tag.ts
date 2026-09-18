import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexTagVariant = "chip" | "row";

export type HexTagCategory =
  | "artist"
  | "copyright"
  | "character"
  | "species"
  | "general"
  | "meta"
  | "lore"
  | "invalid"
  | "contributor";

// Category-tinted tag. Renders as a dark-bg chip with a 1px currentColor
// border. Label color follows the category color
// except for the "meta" category (white), which uses white text.

const compactCount = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

@customElement("hex-tag")
export class HexTag extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        gap: 6px;
        font-size: var(--hex-fs-sm);
        padding: 4px 8px;
        border-radius: var(--hex-radius-sm);
        background: rgba(2, 15, 35, 0.45);
        border: 1px solid currentColor;
        line-height: 1;
        --_hex-tag-color: var(--hex-tag-general);
        color: var(--_hex-tag-color);
      }
      .count,
      .lead,
      .actions {
        display: contents;
      }
      .count {
        color: var(--hex-fg-2);
        font-size: var(--hex-fs-xs);
        font-variant-numeric: tabular-nums;
      }
      :host([variant="row"]) {
        display: flex;
        width: fit-content;
        align-items: stretch;
        gap: 0;
        padding: 0;
        overflow: hidden;
        border: 1px solid var(--hex-border-subtle);
        border-left: 3px solid currentColor;
      }
      :host([variant="row"]) .lead {
        display: flex;
        align-items: center;
        color: var(--hex-color-secondary-dark);
        font-size: var(--hex-fs-xs);
      }
      :host([variant="row"][has-lead]) .lead {
        border-right: 1px solid var(--hex-border-subtle);
      }
      :host([variant="row"]) .name {
        display: flex;
        align-items: center;
        padding: 4px 8px;
      }
      :host([variant="row"]) .count {
        display: flex;
        align-items: center;
        padding: 0 7px;
        border-left: 1px solid var(--hex-border-subtle);
      }
      :host([variant="row"]) .actions {
        display: flex;
        align-items: center;
      }
      :host([variant="row"][has-actions]) .actions {
        border-left: 1px solid var(--hex-border-subtle);
      }
      :host([variant="row"]:hover) {
        border-left-color: var(--_hex-tag-color-alt, currentColor);
      }
      :host([category="artist"]) {
        --_hex-tag-color: var(--hex-tag-artist);
        --_hex-tag-color-alt: var(--hex-tag-artist-alt);
      }
      :host([category="copyright"]) {
        --_hex-tag-color: var(--hex-tag-copyright);
        --_hex-tag-color-alt: var(--hex-tag-copyright-alt);
      }
      :host([category="character"]) {
        --_hex-tag-color: var(--hex-tag-character);
        --_hex-tag-color-alt: var(--hex-tag-character-alt);
      }
      :host([category="species"]) {
        --_hex-tag-color: var(--hex-tag-species);
        --_hex-tag-color-alt: var(--hex-tag-species-alt);
      }
      :host([category="general"]) {
        --_hex-tag-color: var(--hex-tag-general);
        --_hex-tag-color-alt: var(--hex-tag-general-alt);
      }
      :host([category="lore"]) {
        --_hex-tag-color: var(--hex-tag-lore);
        --_hex-tag-color-alt: var(--hex-tag-lore-alt);
      }
      :host([category="invalid"]) {
        --_hex-tag-color: var(--hex-tag-invalid);
        --_hex-tag-color-alt: var(--hex-tag-invalid-alt);
      }
      :host([category="contributor"]) {
        --_hex-tag-color: var(--hex-tag-contributor);
        --_hex-tag-color-alt: var(--hex-tag-contributor-alt);
      }
      :host([category="meta"]) {
        --_hex-tag-color: var(--hex-tag-meta);
        --_hex-tag-color-alt: var(--hex-tag-meta-alt);
        color: #fff;
      }
    `,
  ];

  @property({ type: String, reflect: true }) category: HexTagCategory = "general";
  @property({ type: String, reflect: true }) variant: HexTagVariant = "chip";
  @property({ type: Number }) count?: number;

  private readonly onSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const filled = slot
      .assignedNodes({ flatten: true })
      .some((n) => n.nodeType !== Node.TEXT_NODE || (n.textContent ?? "").trim() !== "");
    this.toggleAttribute(slot.name === "lead" ? "has-lead" : "has-actions", filled);
  };

  override render() {
    return html`
      <span class="lead" part="lead"
        ><slot name="lead" @slotchange=${this.onSlotChange}></slot
      ></span>
      <span class="name" part="name"><slot></slot></span>
      ${this.count === undefined
        ? nothing
        : html`<span class="count" part="count">${compactCount.format(this.count)}</span>`}
      <span class="actions" part="actions"
        ><slot name="actions" @slotchange=${this.onSlotChange}></slot
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-tag": HexTag;
  }
}
