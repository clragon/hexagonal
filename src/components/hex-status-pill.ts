import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexStatus = "healthy" | "degraded" | "failing" | "idle";

const STATUS_LABELS: Record<HexStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  failing: "Failing",
  idle: "Idle",
};

@customElement("hex-status-pill")
export class HexStatusPill extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      minHeight: "17px",
    },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        gap: 6px;
        font-size: var(--hex-fs-xs);
        font-weight: var(--hex-font-weight-bold);
        padding: 3px 9px;
        border-radius: var(--hex-radius-pill);
        line-height: 1;
        --_hex-pill-bg: var(--hex-bg-muted);
        --_hex-pill-fg: var(--hex-color-secondary);
        background: var(--_hex-pill-bg);
        color: var(--_hex-pill-fg);
      }
      :host([status="healthy"]) {
        --_hex-pill-bg: var(--hex-bg-success);
        --_hex-pill-fg: var(--hex-color-success);
      }
      :host([status="degraded"]) {
        --_hex-pill-bg: var(--hex-bg-warning);
        --_hex-pill-fg: var(--hex-color-primary);
      }
      :host([status="failing"]) {
        --_hex-pill-bg: var(--hex-bg-danger);
        --_hex-pill-fg: var(--hex-color-danger);
      }
      :host([status="idle"]) {
        --_hex-pill-bg: var(--hex-bg-muted);
        --_hex-pill-fg: var(--hex-color-secondary);
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: var(--hex-radius-pill);
        background: var(--_hex-pill-fg);
      }
    `,
  ];

  @property({ type: String, reflect: true }) status: HexStatus = "idle";

  override render() {
    return html`<span class="dot" part="dot"></span>${STATUS_LABELS[this.status] ??
      STATUS_LABELS.idle}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-status-pill": HexStatusPill;
  }
}
