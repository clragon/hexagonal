import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexSkeletonShape = "text" | "block" | "circle" | "pill";

@customElement("hex-skeleton")
export class HexSkeleton extends HexElement {
  static preflight = {
    base: { display: "block", visibility: "hidden", minHeight: "16px" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: block;
        width: 100%;
        --_hex-skeleton-base: var(--hex-bg-hover);
        --_hex-skeleton-sheen: var(--hex-bg-active);
      }
      .text {
        display: inline;
        color: transparent;
        border-radius: var(--hex-radius-sm);
        background: var(--_hex-skeleton-base);
        background-image: linear-gradient(
          90deg,
          transparent 0%,
          var(--_hex-skeleton-sheen) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        background-repeat: no-repeat;
        animation: sheen 1400ms linear infinite;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        user-select: none;
        -webkit-user-select: none;
      }
      :host([has-content]) {
        width: auto;
      }
      .bar {
        width: 100%;
        background: var(--_hex-skeleton-base);
        border-radius: var(--hex-radius-sm);
        background-image: linear-gradient(
          90deg,
          transparent 0%,
          var(--_hex-skeleton-sheen) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        background-repeat: no-repeat;
        animation: sheen 1400ms linear infinite;
      }
      :host([shape="circle"]) .bar {
        border-radius: 50%;
      }
      :host([shape="pill"]) .bar {
        border-radius: var(--hex-radius-pill);
      }
      :host([shape="block"]) .bar {
        border-radius: var(--hex-radius-md);
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: var(--hex-space-2);
      }
      .stack .bar:last-child:not(:only-child) {
        width: 60%;
      }
      @keyframes sheen {
        from {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .bar {
          animation: none;
          background-image: none;
        }
      }
    `,
  ];

  @property({ type: String, reflect: true }) shape: HexSkeletonShape = "text";
  @property({ type: String }) width?: string;
  @property({ type: String }) height?: string;
  @property({ type: String }) aspect?: string;
  @property({ type: Number }) lines = 1;

  @state() private hasContent = false;

  private barStyle(): string {
    const parts: string[] = [];
    if (this.aspect) parts.push(`aspect-ratio:${this.aspect}`);
    if (this.height) parts.push(`height:${this.height}`);
    else if (!this.aspect) parts.push(this.shape === "text" ? "height:1em" : "height:100%");
    return parts.join(";");
  }

  override updated(): void {
    this.style.width = this.hasContent ? "" : (this.width ?? "");
    this.toggleAttribute("has-content", this.hasContent);
  }

  private readonly onSlotChange = (e: Event): void => {
    const assigned = (e.target as HTMLSlotElement).assignedNodes({ flatten: true });
    this.hasContent = assigned.some(
      (n) => n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim().length ?? 0) > 0,
    );
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("aria-hidden")) this.setAttribute("aria-hidden", "true");
  }

  override render() {
    const style = this.barStyle();
    const probe = html`<slot @slotchange=${this.onSlotChange}></slot>`;
    if (this.hasContent) {
      return html`<span class="text" part="text">${probe}</span>`;
    }
    if (this.shape === "text" && this.lines > 1) {
      return html`
        <div class="stack" part="stack">
          ${Array.from(
            { length: this.lines },
            () => html`<div class="bar" part="bar" style=${style}></div>`,
          )}
          <span hidden>${probe}</span>
        </div>
      `;
    }
    return html`<div class="bar" part="bar" style=${style}></div>
      <span hidden>${probe}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-skeleton": HexSkeleton;
  }
}
