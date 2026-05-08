import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Inline censor. Desktop reveals on hover (pure CSS, no padding so it wraps
// cleanly across lines). On touch devices, tap toggles the revealed state.
// `revealed` never sticks past page state: it's a transient UI signal, not
// content state.

@customElement("hex-spoiler")
export class HexSpoiler extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline;
        background: var(--hex-color-section);
        color: transparent;
        border-radius: var(--hex-radius-sm);
        padding: 0;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          color var(--hex-dur-fast) var(--hex-ease);
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
      }
      @media (hover: hover) {
        :host(:hover) {
          background: transparent;
          color: var(--hex-fg-1);
        }
      }
      :host([revealed]) {
        background: transparent;
        color: var(--hex-fg-1);
        user-select: auto;
        -webkit-user-select: auto;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) revealed = false;

  constructor() {
    super();
    // Touch-only reveal toggle. On hover-capable devices CSS handles it.
    this.addEventListener("click", () => {
      if (!matchMedia("(hover: none)").matches) return;
      this.revealed = !this.revealed;
      this.dispatchEvent(
        new CustomEvent("hex-toggle", {
          detail: { revealed: this.revealed },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-spoiler": HexSpoiler;
  }
}
