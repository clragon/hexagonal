import { html, css, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

const WEDGES = [
  "M 94.8 97 L 5.2 97 L 50 19.4 Z",
  "M 100 94 L 55.2 16.4 L 144.8 16.4 Z",
  "M 105.2 97 L 150 19.4 L 194.8 97 Z",
  "M 105.2 103 L 194.8 103 L 150 180.6 Z",
  "M 100 106 L 144.8 183.6 L 55.2 183.6 Z",
  "M 94.8 103 L 50 180.6 L 5.2 103 Z",
];

@customElement("hex-spinner")
export class HexSpinner extends HexElement {
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
        flex-shrink: 0;
        color: currentColor;
        vertical-align: middle;
      }
      svg {
        display: block;
      }
      path {
        fill: currentColor;
        opacity: 0.08;
        animation: swap var(--hex-spinner-duration, 1800ms) ease-in-out infinite;
      }
      path:nth-child(1) {
        animation-delay: 0ms;
      }
      path:nth-child(2) {
        animation-delay: calc(var(--hex-spinner-duration, 1800ms) / -6);
      }
      path:nth-child(3) {
        animation-delay: calc(var(--hex-spinner-duration, 1800ms) / -3);
      }
      path:nth-child(4) {
        animation-delay: calc(var(--hex-spinner-duration, 1800ms) / -2);
      }
      path:nth-child(5) {
        animation-delay: calc(var(--hex-spinner-duration, 1800ms) / -1.5);
      }
      path:nth-child(6) {
        animation-delay: calc(var(--hex-spinner-duration, 1800ms) / -1.2);
      }
      @keyframes swap {
        0%,
        100% {
          opacity: 0.08;
        }
        50% {
          opacity: 1;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        path {
          animation: none;
          opacity: 0.55;
        }
      }
    `,
  ];

  @property({ type: Number }) size = 16;
  @property({ type: Number, attribute: "duration" }) durationMs = 1800;
  @property({ type: String }) label = "Loading";

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "progressbar");
  }

  override render() {
    return html`
      <svg
        width=${this.size}
        height=${this.size}
        viewBox="-6 -6 212 212"
        aria-label=${this.label}
        style="--hex-spinner-duration:${this.durationMs}ms"
      >
        ${WEDGES.map((d) => svg`<path d=${d}></path>`)}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-spinner": HexSpinner;
  }
}
