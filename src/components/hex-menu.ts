import { html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-popover.js";
import type { HexPopover, HexPopoverAlign, HexPopoverPlacement } from "./hex-popover.js";
import type { HexMenuItem } from "./hex-menu-item.js";

@customElement("hex-menu")
export class HexMenu extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: contents;
      }
      .list {
        min-width: 10rem;
        padding: var(--hex-space-1) 0;
      }
    `,
  ];

  @property({ type: String, reflect: true }) placement: HexPopoverPlacement = "bottom";
  @property({ type: String, reflect: true }) align: HexPopoverAlign = "start";
  @property({ type: Boolean, reflect: true }) open = false;

  @query("hex-popover") private popoverEl!: HexPopover;
  @state() private trigger: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    queueMicrotask(() => this.bind());
  }

  override disconnectedCallback(): void {
    this.unbind();
    super.disconnectedCallback();
  }

  private get items(): HexMenuItem[] {
    return Array.from(this.querySelectorAll<HexMenuItem>("hex-menu-item")).filter(
      (i) => !i.disabled,
    );
  }

  private bind(): void {
    const trigger = this.previousElementSibling as HTMLElement | null;
    if (!trigger) return;
    this.trigger = trigger;
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", this.onTriggerClick);
    trigger.addEventListener("keydown", this.onTriggerKeydown);
    this.addEventListener("hex-select", this.onSelect);
  }

  private unbind(): void {
    this.removeEventListener("hex-select", this.onSelect);
    const trigger = this.trigger;
    if (!trigger) return;
    trigger.removeEventListener("click", this.onTriggerClick);
    trigger.removeEventListener("keydown", this.onTriggerKeydown);
    this.trigger = null;
  }

  private readonly onTriggerClick = (): void => {
    if (this.open) this.hide();
    else this.show();
  };

  private readonly onTriggerKeydown = (e: KeyboardEvent): void => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      this.show(e.key === "ArrowUp" ? "last" : "first");
    }
  };

  private readonly onSelect = (): void => {
    this.hide();
  };

  private readonly onPanelKeydown = (e: KeyboardEvent): void => {
    const items = this.items;
    if (!items.length) return;
    const active = items.findIndex(
      (i) => i.renderRoot.querySelector(".item") === this.deepActive(),
    );
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = (active + dir + items.length) % items.length;
      items[next]?.focusItem();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focusItem();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focusItem();
    } else if (e.key === "Escape" || e.key === "Tab") {
      this.hide();
    }
  };

  private deepActive(): Element | null {
    let el: Element | null = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el;
  }

  show(focus: "first" | "last" | "none" = "none"): void {
    this.open = true;
    this.trigger?.setAttribute("aria-expanded", "true");
    this.popoverEl?.show();
    requestAnimationFrame(() => {
      const items = this.items;
      if (focus === "first") items[0]?.focusItem();
      else if (focus === "last") items[items.length - 1]?.focusItem();
    });
  }

  hide(): void {
    if (!this.open) return;
    this.open = false;
    this.trigger?.setAttribute("aria-expanded", "false");
    this.popoverEl?.hide();
    this.trigger?.focus();
  }

  private readonly onPopoverClose = (): void => {
    if (!this.open) return;
    this.open = false;
    this.trigger?.setAttribute("aria-expanded", "false");
  };

  override render() {
    return html`
      <hex-popover
        .anchorElement=${this.trigger}
        placement=${this.placement}
        align=${this.align}
        dismiss="auto"
        @hex-close=${this.onPopoverClose}
      >
        <div class="list" part="list" role="menu" @keydown=${this.onPanelKeydown}>
          <slot></slot>
        </div>
      </hex-popover>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-menu": HexMenu;
  }
}
