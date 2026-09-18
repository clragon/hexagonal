import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexDividerOrientation = "horizontal" | "vertical";

@customElement("hex-divider")
export class HexDivider extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        border: 0;
        background: var(--hex-border);
        height: 1px;
        width: 100%;
        flex-shrink: 0;
      }
      :host([orientation="vertical"]) {
        height: auto;
        width: 1px;
        align-self: stretch;
        min-height: var(--hex-space-4);
      }
      :host([subtle]) {
        background: var(--hex-border-subtle);
      }
      :host([inset]) {
        margin-inline: var(--hex-space-4);
        width: auto;
      }
      :host([orientation="vertical"][inset]) {
        margin-inline: 0;
        margin-block: var(--hex-space-2);
      }
      .label {
        display: none;
      }
      :host([has-label]) {
        display: flex;
        align-items: center;
        gap: var(--hex-space-3);
        background: none;
        height: auto;
      }
      :host([has-label])::before,
      :host([has-label])::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--hex-border);
      }
      :host([has-label][subtle])::before,
      :host([has-label][subtle])::after {
        background: var(--hex-border-subtle);
      }
      :host([has-label]) .label {
        display: block;
        color: var(--hex-fg-2);
        font-size: var(--hex-fs-xs);
        line-height: var(--hex-line-tight);
        white-space: nowrap;
      }
    `,
  ];

  @property({ type: String, reflect: true }) orientation: HexDividerOrientation = "horizontal";
  @property({ type: Boolean, reflect: true }) subtle = false;
  @property({ type: Boolean, reflect: true }) inset = false;
  @property({ type: Boolean, reflect: true, attribute: "has-label" }) hasLabel = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "separator");
    if (this.orientation === "vertical") this.setAttribute("aria-orientation", "vertical");
    this.syncLabel();
  }

  private syncLabel = (): void => {
    this.hasLabel = this.textContent?.trim() !== "";
  };

  override render() {
    return html`<span class="label" part="label"
      ><slot @slotchange=${this.syncLabel}></slot
    ></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-divider": HexDivider;
  }
}
