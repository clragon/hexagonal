import { html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-popover.js";
import type { HexPopover, HexPopoverPlacement } from "./hex-popover.js";

let tooltipSeq = 0;

@customElement("hex-tooltip")
export class HexTooltip extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: contents;
      }
      .body {
        padding: 4px 8px;
        max-width: 22rem;
        font-size: var(--hex-fs-sm);
        line-height: var(--hex-line-normal);
        color: var(--hex-fg-1);
      }
      hex-popover::part(surface),
      hex-popover::part(arrow) {
        background: var(--hex-color-section);
        border-color: var(--hex-border-strong);
      }
    `,
  ];

  @property({ type: String, reflect: true }) placement: HexPopoverPlacement = "top";
  @property({ type: Number }) delay = 150;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query("hex-popover") private popoverEl!: HexPopover;

  @state() private trigger: HTMLElement | null = null;
  private timer?: number;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.id) this.id = `hex-tooltip-${++tooltipSeq}`;
    queueMicrotask(() => this.bind());
  }

  override disconnectedCallback(): void {
    this.unbind();
    super.disconnectedCallback();
  }

  private bind(): void {
    const trigger = this.previousElementSibling as HTMLElement | null;
    if (!trigger) return;
    this.trigger = trigger;
    const described = trigger.getAttribute("aria-describedby");
    if (!described) trigger.setAttribute("aria-describedby", this.id);
    trigger.addEventListener("pointerenter", this.onEnter);
    trigger.addEventListener("pointerleave", this.onLeave);
    trigger.addEventListener("focusin", this.onFocus);
    trigger.addEventListener("focusout", this.onLeave);
    document.addEventListener("keydown", this.onKeydown);
  }

  private unbind(): void {
    window.clearTimeout(this.timer);
    document.removeEventListener("keydown", this.onKeydown);
    const trigger = this.trigger;
    if (!trigger) return;
    trigger.removeEventListener("pointerenter", this.onEnter);
    trigger.removeEventListener("pointerleave", this.onLeave);
    trigger.removeEventListener("focusin", this.onFocus);
    trigger.removeEventListener("focusout", this.onLeave);
    this.trigger = null;
  }

  private readonly onEnter = (): void => {
    if (this.disabled) return;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.popoverEl?.show(), this.delay);
  };

  private readonly onFocus = (): void => {
    if (this.disabled) return;
    window.clearTimeout(this.timer);
    this.popoverEl?.show();
  };

  private readonly onLeave = (): void => {
    window.clearTimeout(this.timer);
    this.popoverEl?.hide();
  };

  private readonly onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") this.onLeave();
  };

  override render() {
    return html`
      <hex-popover
        .anchorElement=${this.trigger}
        placement=${this.placement}
        dismiss="manual"
        trigger="none"
        arrow
        distance="6"
      >
        <div class="body" part="body" role="tooltip"><slot></slot></div>
      </hex-popover>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-tooltip": HexTooltip;
  }
}
