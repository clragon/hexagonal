import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexElement } from "../shared/base.js";
import "./hex-icon.js";
import "./hex-spinner.js";
import type { IconName } from "../shared/icons.js";

export type HexButtonVariant = "solid" | "raised" | "outline" | "ghost";
export type HexButtonColor = "primary" | "secondary" | "danger";
export type HexButtonSize = "sm" | "md" | "lg";

// Two-axis button: visual `variant` (solid / outline / ghost) and tonal
// `color` (primary / secondary / danger). Color tokens are exposed as CSS
// custom properties so each variant rule references --_hex-btn-color, etc., and
// every variant + color combo composes naturally.

@customElement("hex-button")
export class HexButton extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      minHeight: "34px",
    },
    variants: [
      { when: '[size="sm"]', style: { minHeight: "29px" } },
      { when: '[size="lg"]', style: { minHeight: "41px" } },
      { when: "[full]", style: { display: "flex", width: "100%" } },
    ],
  };

  static override shadowRootOptions = {
    ...HexElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        --_hex-control-line: var(--hex-control-line-md);
        display: inline-flex;
        vertical-align: middle;
        position: relative;
        top: 0;

        /* Color tokens default to primary; overridden per :host([color="..."]) */
        --_hex-btn-color: var(--hex-color-primary);
        --_hex-btn-color-light: var(--hex-color-primary-light);
        --_hex-btn-color-dark: var(--hex-color-primary-dark);
        --_hex-btn-fg-on: var(--hex-fg-on-primary);
      }
      :host([color="secondary"]) {
        --_hex-btn-color: var(--hex-color-secondary);
        --_hex-btn-color-light: var(--hex-color-secondary-light);
        --_hex-btn-color-dark: var(--hex-color-secondary-dark);
        --_hex-btn-fg-on: var(--hex-color-background);
      }
      :host([color="danger"]) {
        --_hex-btn-color: var(--hex-color-danger);
        --_hex-btn-color-light: var(--hex-color-danger-light);
        --_hex-btn-color-dark: var(--hex-color-danger-dark);
        --_hex-btn-fg-on: var(--hex-fg-on-danger);
      }

      :host([variant="solid"]),
      :host([variant="raised"]),
      :host(:not([variant])) {
        color: var(--_hex-btn-fg-on);
      }
      :host([variant="outline"]),
      :host([variant="ghost"]) {
        color: var(--_hex-btn-color);
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
      :host([disabled]) .base {
        pointer-events: none;
      }
      :host([loading]) .base {
        cursor: progress;
        pointer-events: none;
      }
      :host([loading][variant="raised"]) {
        top: var(--hex-raise-press);
      }
      :host([loading][variant="raised"]) .base {
        box-shadow: 0 var(--hex-raise-press) 0 var(--_hex-btn-color-dark);
      }

      .base {
        all: unset;
        flex: 1 1 auto;
        box-sizing: border-box;
        font-family: inherit;
        font-size: var(--hex-fs-md);
        font-weight: var(--hex-font-weight-bold);
        padding: 8px 16px;
        border-radius: var(--hex-radius-md);
        cursor: pointer;
        line-height: var(--_hex-control-line);
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
      :host([full]) .base {
        width: 100%;
        justify-content: center;
      }
      .base:focus-visible {
        outline: none;
        box-shadow: var(--hex-shadow-focus);
      }

      /* solid: filled bg, dark text on bright bg */
      :host([variant="solid"]) .base,
      :host(:not([variant])) .base {
        background: var(--_hex-btn-color);
        color: var(--_hex-btn-fg-on);
        border-color: var(--_hex-btn-color);
      }
      :host([variant="solid"]) .base:hover,
      :host(:not([variant])) .base:hover {
        background: var(--_hex-btn-color-light);
        border-color: var(--_hex-btn-color-light);
      }
      :host([variant="solid"]) .base:active,
      :host(:not([variant])) .base:active {
        background: var(--_hex-btn-color-dark);
        border-color: var(--_hex-btn-color-dark);
      }

      /* outline: transparent bg, colored border + text, tinted hover */
      :host([variant="outline"]) .base {
        background: transparent;
        color: var(--_hex-btn-color);
        border-color: var(--_hex-btn-color);
      }
      :host([variant="outline"]) .base:hover,
      :host([variant="outline"]) .base:active {
        background: color-mix(in oklch, var(--_hex-btn-color) 14%, transparent);
        color: var(--_hex-btn-color-light);
        border-color: var(--_hex-btn-color-light);
      }

      /* ghost: no border, transparent bg, tinted hover */
      :host([variant="ghost"]) .base {
        background: transparent;
        color: var(--_hex-btn-color);
        padding: 8px 10px;
      }
      :host([variant="ghost"]) .base:hover,
      :host([variant="ghost"]) .base:active {
        background: color-mix(in oklch, var(--_hex-btn-color) 12%, transparent);
        color: var(--_hex-btn-color-light);
      }

      /* sizes */
      :host([variant="raised"]) .base {
        transition:
          background var(--hex-dur-fast) var(--hex-ease),
          color var(--hex-dur-fast) var(--hex-ease),
          border-color var(--hex-dur-fast) var(--hex-ease);
        position: relative;
        background: var(--_hex-btn-color);
        color: var(--_hex-btn-fg-on);
        border-color: var(--_hex-btn-color);
        box-shadow: 0 var(--hex-raise-depth) 0 var(--_hex-btn-color-dark);
      }
      :host([variant="raised"]) .base:hover {
        background: var(--_hex-btn-color-light);
        border-color: var(--_hex-btn-color-light);
      }
      :host([variant="raised"]) .base:focus-visible {
        box-shadow:
          0 var(--hex-raise-depth) 0 var(--_hex-btn-color-dark),
          var(--hex-shadow-focus);
      }
      :host([variant="raised"]:active:not([disabled])) {
        top: var(--hex-raise-press);
      }
      :host([variant="raised"]) .base:active {
        background: var(--_hex-btn-color);
        border-color: var(--_hex-btn-color);
        box-shadow: 0 var(--hex-raise-press) 0 var(--_hex-btn-color-dark);
      }
      :host([variant="raised"]) .base:active:focus-visible {
        box-shadow:
          0 var(--hex-raise-press) 0 var(--_hex-btn-color-dark),
          var(--hex-shadow-focus);
      }
      /* e621ng .st-button.kinetic covers this gap: the press offset moves
         the hit box down, so clicks on the old top edge miss. */
      :host([variant="raised"]) .base:active::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: calc(-1 * var(--hex-raise-press));
        height: var(--hex-raise-depth);
        background: transparent;
      }
      :host([variant="raised"][disabled]) .base {
        box-shadow: none;
      }

      :host([size="sm"]) {
        --_hex-control-line: var(--hex-control-line-sm);
      }
      :host([size="lg"]) {
        --_hex-control-line: var(--hex-control-line-lg);
      }
      :host([size="sm"]) .base {
        font-size: var(--hex-fs-xs);
        padding: 6px 10px;
      }
      :host([size="lg"]) .base {
        font-size: 14px;
        padding: 10px 20px;
      }
      :host([size="sm"][variant="ghost"]) .base {
        padding: 6px 8px;
      }
      :host([size="lg"][variant="ghost"]) .base {
        padding: 10px 14px;
      }

      /* icon-only: square padding, 1:1 aspect, no slot/gap */
      :host([icon-only]) .base {
        padding: 8px;
        aspect-ratio: 1 / 1;
        justify-content: center;
        gap: 0;
      }
      :host([icon-only]) .base > *,
      :host([icon-only]) ::slotted([slot="icon"]) {
        width: var(--_hex-control-line);
        height: var(--_hex-control-line);
        align-items: center;
        justify-content: center;
      }
      :host([icon-only][size="sm"]) .base {
        padding: 6px;
      }
      :host([icon-only][size="lg"]) .base {
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
  @property({ type: String }) href?: string;
  @property({ type: String }) target?: string;
  @property({ type: String }) rel?: string;

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
    const inner = this.shadowRoot?.querySelector(".base");
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
    if (this.href) return;
    if (this.type === "submit") {
      const form = this.closest("form");
      form?.requestSubmit();
    } else if (this.type === "reset") {
      this.closest("form")?.reset();
    }
  };

  private renderContent(iconSize: number) {
    return html`
      ${this.loading
        ? html`<hex-spinner size=${iconSize} duration="1200"></hex-spinner>`
        : this.icon
          ? html`<hex-icon name=${this.icon} size=${iconSize}></hex-icon>`
          : html`<slot name="icon"></slot>`}
      ${this.iconOnly ? nothing : html`<slot></slot>`}
    `;
  }

  private get linkRel(): string | undefined {
    if (this.rel !== undefined) return this.rel;
    return this.target === "_blank" ? "noopener noreferrer" : undefined;
  }

  override render() {
    const iconSize = this.size === "lg" ? 16 : 14;
    const inert = this.disabled || this.loading;
    if (this.href !== undefined) {
      return html`
        <a
          class="base"
          part="base"
          href=${ifDefined(inert ? undefined : this.href)}
          target=${ifDefined(this.target)}
          rel=${ifDefined(this.linkRel)}
          role="button"
          aria-disabled=${inert ? "true" : "false"}
          aria-busy=${this.loading ? "true" : "false"}
          tabindex=${inert ? "-1" : "0"}
          @click=${this.onClick}
          >${this.renderContent(iconSize)}</a
        >
      `;
    }
    return html`
      <button
        class="base"
        part="base"
        type=${this.type}
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? "true" : "false"}
        @click=${this.onClick}
      >
        ${this.renderContent(iconSize)}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-button": HexButton;
  }
}
