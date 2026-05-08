import { html, css, svg, nothing, type SVGTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import { iconPaths, type IconName } from "../shared/icons.js";

@customElement("hex-icon")
export class HexIcon extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        flex-shrink: 0;
        line-height: 0;
        color: currentColor;
      }
      svg {
        display: block;
      }
    `,
  ];

  @property({ type: String }) name: IconName | "" = "";
  @property({ type: Number }) size = 16;
  @property({ type: Number, attribute: "stroke-width" }) strokeWidth = 1.6;

  override render() {
    const path: SVGTemplateResult | null = this.name
      ? (iconPaths[this.name as IconName] ?? null)
      : null;
    if (!path) return nothing;
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
