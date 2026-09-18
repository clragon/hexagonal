import { html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexPopoverPlacement = "top" | "bottom" | "left" | "right";
export type HexPopoverAlign = "start" | "center" | "end";

const VIEWPORT_MARGIN = 8;

@customElement("hex-popover")
export class HexPopover extends HexElement {
  static preflight = null;

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: contents;
      }
      .panel {
        position: fixed;
        margin: 0;
        padding: 0;
        border: 0;
        inset: auto;
        background: transparent;
        overflow: visible;
        z-index: var(--hex-z-popover);
      }
      .panel:not(:popover-open):not(.fallback-open) {
        display: none;
      }
      .arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--hex-bg-card);
        border: 1px solid var(--hex-border-strong);
        transform: rotate(45deg);
      }
      :host(:not([arrow])) .arrow {
        display: none;
      }
      .surface {
        background: var(--hex-bg-card);
        border: 1px solid var(--hex-border-strong);
        border-radius: var(--hex-radius-md);
        box-shadow: var(--hex-shadow-popover);
        color: var(--hex-fg-1);
        font-size: var(--hex-fs-md);
      }
    `,
  ];

  @property({ type: String, reflect: true }) placement: HexPopoverPlacement = "bottom";
  @property({ type: String, reflect: true }) align: HexPopoverAlign = "center";
  @property({ type: Number }) distance = 6;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) dismiss: "auto" | "manual" = "auto";
  @property({ type: Boolean, reflect: true }) arrow = false;
  @property({ type: String }) trigger: "click" | "none" = "click";
  @property({ attribute: false }) anchorElement: HTMLElement | null = null;

  @query(".panel") private panel!: HTMLElement;

  private readonly reposition = (): void => {
    if (this.open) this.place();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("scroll", this.reposition, true);
    window.addEventListener("resize", this.reposition);
    queueMicrotask(() => this.bindTrigger());
  }

  private boundTrigger: HTMLElement | null = null;

  private bindTrigger(): void {
    if (this.trigger !== "click" || this.anchorElement) return;
    const el = this.previousElementSibling as HTMLElement | null;
    if (!el) return;
    this.boundTrigger = el;
    el.addEventListener("click", this.onTriggerClick);
  }

  private readonly onTriggerClick = (): void => {
    if (this.open) this.hide();
    else this.show();
  };

  override disconnectedCallback(): void {
    window.removeEventListener("scroll", this.reposition, true);
    window.removeEventListener("resize", this.reposition);
    this.boundTrigger?.removeEventListener("click", this.onTriggerClick);
    this.boundTrigger = null;
    super.disconnectedCallback();
  }

  private get supportsPopover(): boolean {
    return typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;
  }

  private anchorRect(): DOMRect | null {
    const el = this.anchorElement ?? (this.previousElementSibling as HTMLElement | null);
    return el ? el.getBoundingClientRect() : null;
  }

  private place(): void {
    const anchor = this.anchorRect();
    if (!anchor || !this.panel) return;
    const panel = this.panel.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const d = this.distance;

    const room = {
      top: anchor.top,
      bottom: vh - anchor.bottom,
      left: anchor.left,
      right: vw - anchor.right,
    };
    const need = {
      top: panel.height + d,
      bottom: panel.height + d,
      left: panel.width + d,
      right: panel.width + d,
    };
    const opposite: Record<HexPopoverPlacement, HexPopoverPlacement> = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    };
    let side = this.placement;
    if (room[side] < need[side] && room[opposite[side]] >= need[opposite[side]]) {
      side = opposite[side];
    }

    const vertical = side === "top" || side === "bottom";
    let x: number;
    let y: number;
    if (vertical) {
      y = side === "top" ? anchor.top - panel.height - d : anchor.bottom + d;
      x =
        this.align === "start"
          ? anchor.left
          : this.align === "end"
            ? anchor.right - panel.width
            : anchor.left + anchor.width / 2 - panel.width / 2;
      x = Math.min(Math.max(x, VIEWPORT_MARGIN), vw - panel.width - VIEWPORT_MARGIN);
    } else {
      x = side === "left" ? anchor.left - panel.width - d : anchor.right + d;
      y =
        this.align === "start"
          ? anchor.top
          : this.align === "end"
            ? anchor.bottom - panel.height
            : anchor.top + anchor.height / 2 - panel.height / 2;
      y = Math.min(Math.max(y, VIEWPORT_MARGIN), vh - panel.height - VIEWPORT_MARGIN);
    }

    this.panel.style.left = `${Math.round(x)}px`;
    this.panel.style.top = `${Math.round(y)}px`;
    this.setAttribute("resolved-placement", side);

    const arrowEl = this.renderRoot.querySelector<HTMLElement>(".arrow");
    if (this.arrow && arrowEl) {
      const half = 4;
      arrowEl.style.cssText = "";
      if (vertical) {
        const cx = anchor.left + anchor.width / 2 - x;
        arrowEl.style.left = `${Math.min(Math.max(cx - half, 8), panel.width - 8 - half * 2)}px`;
        if (side === "top") {
          arrowEl.style.bottom = `-${half + 1}px`;
          arrowEl.style.borderTop = "0";
          arrowEl.style.borderLeft = "0";
        } else {
          arrowEl.style.top = `-${half + 1}px`;
          arrowEl.style.borderBottom = "0";
          arrowEl.style.borderRight = "0";
        }
      } else {
        const cy = anchor.top + anchor.height / 2 - y;
        arrowEl.style.top = `${Math.min(Math.max(cy - half, 8), panel.height - 8 - half * 2)}px`;
        if (side === "left") {
          arrowEl.style.right = `-${half + 1}px`;
          arrowEl.style.borderLeft = "0";
          arrowEl.style.borderBottom = "0";
        } else {
          arrowEl.style.left = `-${half + 1}px`;
          arrowEl.style.borderRight = "0";
          arrowEl.style.borderTop = "0";
        }
      }
    }
  }

  show(): void {
    if (this.open) return;
    this.open = true;
  }

  hide(): void {
    if (!this.open) return;
    this.open = false;
  }

  toggle(): void {
    if (this.open) this.hide();
    else this.show();
  }

  override updated(changed: Map<string, unknown>): void {
    if (!changed.has("open") || !this.panel) return;
    if (this.open) {
      if (this.supportsPopover) {
        this.panel.setAttribute("popover", this.dismiss);
        if (!this.panel.matches(":popover-open"))
          (this.panel as never as HTMLElement & { showPopover(): void }).showPopover();
      } else {
        this.panel.classList.add("fallback-open");
      }
      this.place();
      this.dispatchEvent(new CustomEvent("hex-open", { bubbles: true, composed: true }));
    } else {
      if (this.supportsPopover && this.panel.matches(":popover-open")) {
        (this.panel as never as HTMLElement & { hidePopover(): void }).hidePopover();
      }
      this.panel.classList.remove("fallback-open");
      this.dispatchEvent(new CustomEvent("hex-close", { bubbles: true, composed: true }));
    }
  }

  private readonly onToggleEvent = (e: Event): void => {
    const detail = e as Event & { newState?: string };
    if (detail.newState === "closed" && this.open) this.open = false;
  };

  override render() {
    return html`
      <div class="panel" @toggle=${this.onToggleEvent}>
        <div class="surface" part="surface"><slot></slot></div>
        <div class="arrow" part="arrow"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-popover": HexPopover;
  }
}
