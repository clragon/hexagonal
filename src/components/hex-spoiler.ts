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
      .content {
        display: contents;
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
  @property({ type: String }) hint = "Spoiler, activate to reveal";

  private sticky = false;

  constructor() {
    super();
    if (!this.hasAttribute("role")) this.setAttribute("role", "button");
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKey);
    this.addEventListener("pointerenter", this.onEnter);
    this.addEventListener("pointerleave", this.onLeave);
  }

  override updated(changed: Map<string, unknown>) {
    if (!changed.has("revealed")) return;
    this.setAttribute("aria-expanded", String(this.revealed));
    if (this.revealed) this.removeAttribute("aria-label");
    else this.setAttribute("aria-label", this.hint);
  }

  private get hoverCapable(): boolean {
    return matchMedia("(hover: hover)").matches;
  }

  private readonly onEnter = (): void => {
    if (this.hoverCapable) this.revealed = true;
  };

  private readonly onLeave = (): void => {
    if (this.hoverCapable && !this.sticky) this.revealed = false;
  };

  private onClick = (e: Event) => {
    if (this.revealed) {
      const path = e.composedPath();
      const onControl = path.some(
        (n) =>
          n instanceof HTMLElement && n !== this && n.matches("a[href], button, [role='link']"),
      );
      if (onControl) return;
    }
    if (this.hoverCapable) {
      this.sticky = !this.sticky;
      if (this.sticky) this.revealed = true;
      return;
    }
    this.toggle();
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
    if (!this.revealed) this.sticky = false;
    this.dispatchEvent(
      new CustomEvent("hex-toggle", {
        detail: { revealed: this.revealed },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`<span class="content" ?inert=${!this.revealed}><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-spoiler": HexSpoiler;
  }
}
