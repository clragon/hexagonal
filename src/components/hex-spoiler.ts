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
        background: #000000;
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
    if (!this.hasAttribute("role")) this.setAttribute("role", "button");
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");
    if (!this.hasAttribute("aria-label")) this.setAttribute("aria-label", "Spoiler, hidden text");
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKey);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("revealed")) {
      this.setAttribute("aria-expanded", String(this.revealed));
    }
  }

  private onClick = () => {
    // Hover-capable devices already reveal via CSS; only toggle on touch.
    if (matchMedia("(hover: none)").matches) this.toggle();
  };

  private onKey = (e: KeyboardEvent) => {
    // Keyboard users have no hover so always toggle on activation.
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggle();
    }
  };

  private toggle() {
    this.revealed = !this.revealed;
    this.dispatchEvent(
      new CustomEvent("hex-toggle", {
        detail: { revealed: this.revealed },
        bubbles: true,
        composed: true,
      }),
    );
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
