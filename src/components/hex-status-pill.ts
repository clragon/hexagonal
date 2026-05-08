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
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: var(--hex-fs-xs);
        font-weight: var(--hex-font-weight-bold);
        padding: 3px 9px;
        border-radius: var(--hex-radius-pill);
        line-height: 1;
        --pill-bg: rgba(180, 199, 217, 0.12);
        --pill-fg: var(--hex-color-secondary);
        background: var(--pill-bg);
        color: var(--pill-fg);
      }
      :host([status="healthy"]) {
        --pill-bg: rgba(107, 191, 122, 0.15);
        --pill-fg: var(--hex-color-success);
      }
      :host([status="degraded"]) {
        --pill-bg: rgba(232, 196, 70, 0.18);
        --pill-fg: var(--hex-color-primary);
      }
      :host([status="failing"]) {
        --pill-bg: rgba(224, 123, 107, 0.15);
        --pill-fg: var(--hex-color-danger);
      }
      :host([status="idle"]) {
        --pill-bg: rgba(180, 199, 217, 0.12);
        --pill-fg: var(--hex-color-secondary);
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: var(--hex-radius-pill);
        background: var(--pill-fg);
      }
    `,
  ];

  @property({ type: String, reflect: true }) status: HexStatus = "idle";

  override render() {
    return html`<span class="dot"></span>${STATUS_LABELS[this.status] ?? STATUS_LABELS.idle}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-status-pill": HexStatusPill;
  }
}
