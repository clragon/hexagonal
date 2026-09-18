import { html, css, svg, type SVGTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import { iconPaths, ICONS_CHANGED, type IconName } from "../shared/icons.js";

const mounted = new Set<HexIcon>();
if (typeof window !== "undefined") {
  window.addEventListener(ICONS_CHANGED, () => {
    for (const icon of mounted) icon.requestUpdate();
  });
}

@customElement("hex-icon")
export class HexIcon extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      width: "16px",
      height: "16px",
    },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        flex-shrink: 0;
        line-height: 0;
        color: currentColor;
      }
      svg {
        display: block;
      }
      .slotted {
        display: block;
      }
      ::slotted(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ];

  @property({ type: String }) name: IconName | "" = "";

  override connectedCallback(): void {
    super.connectedCallback();
    mounted.add(this);
  }

  override disconnectedCallback(): void {
    mounted.delete(this);
    super.disconnectedCallback();
  }
  @property({ type: Number }) size = 16;
  @property({ type: Number, attribute: "stroke-width" }) strokeWidth = 1.6;

  override render() {
    const path: SVGTemplateResult | null = this.name
      ? (iconPaths[this.name as IconName] ?? null)
      : null;
    if (!path) {
      return html`
        <div class="slotted" part="slotted" style="width:${this.size}px;height:${this.size}px">
          <slot></slot>
        </div>
      `;
    }
    return html`
      <svg
        width=${this.size}
        height=${this.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width=${this.strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        ${svg`${path}`}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-icon": HexIcon;
  }
}
