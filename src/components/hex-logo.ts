import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

// Wordmark: 240x64 viewBox (3.75:1).
// Mark-only: viewBox padded by 2 on each side to give the 3px stroke room to
// render without clipping at the corners. Host aspect-ratio is the padded box
// (48:52) so the visible hex inside still has the canonical 44:48 proportion.
//
// Sizing model: set `width` (CSS pixels). The host applies that width and
// gets height automatically from `aspect-ratio`. The inner SVG fills the host.

const FULL_W = 240;
const FULL_H = 64;
const MARK_W = 44;
const MARK_H = 48;
const STROKE_PAD = 2;
const MARK_BOX_W = MARK_W + STROKE_PAD * 2;
const MARK_BOX_H = MARK_H + STROKE_PAD * 2;

@customElement("hex-logo")
export class HexLogo extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      minHeight: "42.66px",
    },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-block;
        line-height: 0;
        aspect-ratio: ${FULL_W} / ${FULL_H};
        flex-shrink: 0;
      }
      :host([mark-only]) {
        aspect-ratio: ${MARK_BOX_W} / ${MARK_BOX_H};
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      text {
        font-family: var(--hex-font-logo);
      }
    `,
  ];

  @property({ type: Number }) width = 160;
  @property({ type: String }) color = "#fff";
  @property({ type: String, attribute: "mark-color" }) markColor = "var(--hex-color-primary)";
  @property({ type: Boolean, reflect: true, attribute: "mark-only" }) markOnly = false;

  override updated(changed: Map<string, unknown>) {
    if (changed.has("width")) {
      this.style.width = `${this.width}px`;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.style.width) this.style.width = `${this.width}px`;
  }

  override render() {
    return this.markOnly ? this.renderMark() : this.renderFull();
  }

  private renderMark() {
    return html`
      <svg
        viewBox="${-STROKE_PAD} ${-STROKE_PAD} ${MARK_BOX_W} ${MARK_BOX_H}"
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points="22,0 44,12 44,36 22,48 0,36 0,12"
          fill="none"
          stroke=${this.markColor}
          stroke-width="3"
          stroke-linejoin="round"
        />
        <polygon points="22,12 36,20 36,28 22,36 8,28 8,20" fill=${this.markColor} />
      </svg>
    `;
  }

  private renderFull() {
    return html`
      <svg viewBox="0 0 ${FULL_W} ${FULL_H}" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(8, 8)">
          <polygon
            points="22,0 44,12 44,36 22,48 0,36 0,12"
            fill="none"
            stroke=${this.markColor}
            stroke-width="3"
            stroke-linejoin="round"
          />
          <polygon points="22,12 36,20 36,28 22,36 8,28 8,20" fill=${this.markColor} />
        </g>
        <text
          x="72"
          y="46"
          font-size="36"
          textLength="118"
          lengthAdjust="spacingAndGlyphs"
          fill=${this.color}
        >
          Hexagonal
        </text>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-logo": HexLogo;
  }
}
