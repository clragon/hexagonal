import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import "./hex-spinner.js";
import type { IconName } from "../shared/icons.js";

export type HexButtonVariant = "solid" | "raised" | "outline" | "ghost";
export type HexButtonColor = "primary" | "secondary" | "danger";
export type HexButtonSize = "sm" | "md" | "lg";

// Two-axis button: visual `variant` (solid / outline / ghost) and tonal
// `color` (primary / secondary / danger). Color tokens are exposed as CSS
// custom properties so each variant rule references --btn-color, etc., and
// every variant + color combo composes naturally.

@customElement("hex-button")
export class HexButton extends HexElement {
  static override shadowRootOptions = {
    ...HexElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        position: relative;
        top: 0;

        /* Color tokens default to primary; overridden per :host([color="..."]) */
        --btn-color: var(--hex-color-primary);
        --btn-color-light: var(--hex-color-primary-light);
        --btn-color-dark: var(--hex-color-primary-dark);
        --btn-fg-on: var(--hex-fg-on-primary);
      }
      :host([color="secondary"]) {
        --btn-color: var(--hex-color-secondary);
        --btn-color-light: var(--hex-color-secondary-light);
        --btn-color-dark: var(--hex-color-secondary-dark);
        --btn-fg-on: var(--hex-color-background);
      }
      :host([color="danger"]) {
        --btn-color: var(--hex-color-danger);
        --btn-color-light: var(--hex-color-danger-light);
        --btn-color-dark: var(--hex-color-danger-dark);
        --btn-fg-on: var(--hex-fg-on-danger);
      }

      :host([variant="solid"]),
      :host([variant="raised"]),
      :host(:not([variant])) {
        color: var(--btn-fg-on);
      }
      :host([variant="outline"]),
      :host([variant="ghost"]) {
        color: var(--btn-color);
      }

      :host(:active:not([disabled])) {
        top: 1px;
      }
      :host([full]) {
        display: flex;
      }
      :host([disabled]) {
        opacity: 0.4;
        cursor: not-allowed;
      }
      :host([disabled]) button {
        pointer-events: none;
      }
      :host([loading]) button {
        cursor: progress;
        pointer-events: none;
      }
      :host([loading][variant="raised"]) {
        top: var(--hex-raise-press);
      }
      :host([loading][variant="raised"]) button {
        box-shadow: 0 var(--hex-raise-press) 0 var(--btn-color-dark);
      }

      button {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: var(--hex-fs-md);
        font-weight: var(--hex-font-weight-bold);
        padding: 8px 16px;
        border-radius: var(--hex-radius-md);
        cursor: pointer;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        user-select: none;
        -webkit-user-select: none;
        outline: none;
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          color var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease),
          box-shadow var(--hex-dur-fast) var(--hex-ease);
        border: 1px solid transparent;
      }
      :host([full]) button {
        width: 100%;
        justify-content: center;
      }
      button:focus-visible {
        outline: none;
        box-shadow: var(--hex-shadow-focus);
      }

      /* solid: filled bg, dark text on bright bg */
      :host([variant="solid"]) button,
      :host(:not([variant])) button {
        background: var(--btn-color);
        color: var(--btn-fg-on);
        border-color: var(--btn-color);
      }
      :host([variant="solid"]) button:hover,
      :host(:not([variant])) button:hover {
        background: var(--btn-color-light);
        border-color: var(--btn-color-light);
      }
      :host([variant="solid"]) button:active,
      :host(:not([variant])) button:active {
        background: var(--btn-color-dark);
        border-color: var(--btn-color-dark);
      }

      /* outline: transparent bg, colored border + text, tinted hover */
      :host([variant="outline"]) button {
        background: transparent;
        color: var(--btn-color);
        border-color: var(--btn-color);
      }
      :host([variant="outline"]) button:hover,
      :host([variant="outline"]) button:active {
        background: color-mix(in oklch, var(--btn-color) 14%, transparent);
        color: var(--btn-color-light);
        border-color: var(--btn-color-light);
      }

      /* ghost: no border, transparent bg, tinted hover */
      :host([variant="ghost"]) button {
        background: transparent;
        color: var(--btn-color);
        padding: 8px 10px;
      }
      :host([variant="ghost"]) button:hover,
      :host([variant="ghost"]) button:active {
        background: color-mix(in oklch, var(--btn-color) 12%, transparent);
        color: var(--btn-color-light);
      }

      /* sizes */
      :host([variant="raised"]) button {
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          color var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease);
        position: relative;
        background: var(--btn-color);
        color: var(--btn-fg-on);
        border-color: var(--btn-color);
        box-shadow: 0 var(--hex-raise-depth) 0 var(--btn-color-dark);
      }
      :host([variant="raised"]) button:hover {
        background: var(--btn-color-light);
        border-color: var(--btn-color-light);
      }
      :host([variant="raised"]) button:focus-visible {
        box-shadow:
          0 var(--hex-raise-depth) 0 var(--btn-color-dark),
          var(--hex-shadow-focus);
      }
      :host([variant="raised"]:active:not([disabled])) {
        top: var(--hex-raise-press);
      }
      :host([variant="raised"]) button:active {
        background: var(--btn-color);
        border-color: var(--btn-color);
        box-shadow: 0 var(--hex-raise-press) 0 var(--btn-color-dark);
      }
      :host([variant="raised"]) button:active:focus-visible {
        box-shadow:
          0 var(--hex-raise-press) 0 var(--btn-color-dark),
          var(--hex-shadow-focus);
      }
      /* e621ng .st-button.kinetic covers this gap: the press offset moves
         the hit box down, so clicks on the old top edge miss. */
      :host([variant="raised"]) button:active::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: calc(-1 * var(--hex-raise-press));
        height: var(--hex-raise-depth);
        background: transparent;
      }
      :host([variant="raised"][disabled]) button {
        box-shadow: none;
      }

      :host([size="sm"]) button {
        font-size: var(--hex-fs-xs);
        padding: 6px 10px;
      }
      :host([size="lg"]) button {
        font-size: 14px;
        padding: 10px 20px;
      }
      :host([size="sm"][variant="ghost"]) button {
        padding: 6px 8px;
      }
      :host([size="lg"][variant="ghost"]) button {
        padding: 10px 14px;
      }

      /* icon-only: square padding, 1:1 aspect, no slot/gap */
      :host([icon-only]) button {
        padding: 8px;
        aspect-ratio: 1 / 1;
        justify-content: center;
        gap: 0;
      }
      :host([icon-only][size="sm"]) button {
        padding: 6px;
      }
      :host([icon-only][size="lg"]) button {
        padding: 10px;
      }
    `,
  ];

  @property({ type: String, reflect: true }) variant: HexButtonVariant = "solid";
  @property({ type: String, reflect: true }) color: HexButtonColor = "primary";
  @property({ type: String, reflect: true }) size: HexButtonSize = "md";
  @property({ type: String }) icon?: IconName;
  @property({ type: String }) type: "button" | "submit" | "reset" = "button";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) full = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: "icon-only" }) iconOnly = false;

  // ARIA attributes set on the host don't reach the focusable inner <button>
  // by default. Forward the common interactive ones so screen readers
  // announce icon-only buttons (and any popup wiring) correctly.
  private static FORWARDED_ARIA = [
    "aria-label",
    "aria-describedby",
    "aria-controls",
    "aria-haspopup",
    "aria-expanded",
    "aria-pressed",
  ];

  private hostObserver?: MutationObserver;

  override connectedCallback() {
    super.connectedCallback();
    this.hostObserver = new MutationObserver(() => this.requestUpdate());
    this.hostObserver.observe(this, {
      attributes: true,
      attributeFilter: HexButton.FORWARDED_ARIA,
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.hostObserver?.disconnect();
  }

  override updated() {
    const inner = this.shadowRoot?.querySelector("button");
    if (!inner) return;
    for (const name of HexButton.FORWARDED_ARIA) {
      const v = this.getAttribute(name);
      if (v !== null) inner.setAttribute(name, v);
      else inner.removeAttribute(name);
    }
  }

  private onClick = (e: Event) => {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (this.type === "submit") {
      const form = this.closest("form");
      form?.requestSubmit();
    } else if (this.type === "reset") {
      this.closest("form")?.reset();
    }
  };

  override render() {
    const iconSize = this.size === "lg" ? 16 : 14;
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? "true" : "false"}
        @click=${this.onClick}
      >
        ${this.loading
          ? html`<hex-spinner size=${iconSize} duration="1200"></hex-spinner>`
          : this.icon
            ? html`<hex-icon name=${this.icon} size=${iconSize}></hex-icon>`
            : html`<slot name="icon"></slot>`}
        ${this.iconOnly ? nothing : html`<slot></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-button": HexButton;
  }
}
