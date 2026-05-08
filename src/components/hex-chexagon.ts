import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexChexagonTone =
  | "primary"
  | "artist"
  | "copyright"
  | "character"
  | "species"
  | "general"
  | "meta"
  | "lore"
  | "invalid"
  | "admin"
  | "moderator"
  | "janitor"
  | "former-staff"
  | "member"
  | "blocked";

// The chexagon: hex shape with a checkmark, used as a verification badge.
// Default tone is brand amber. Set `tone="artist"` (or any tag category) to
// recolor the hex outline. The check stays white in every tone.

@customElement("hex-chexagon")
export class HexChexagon extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        line-height: 0;
        --chex-color: var(--hex-tag-artist);
      }
      :host([tone="primary"]) {
        --chex-color: var(--hex-color-primary);
      }
      :host([tone="artist"]) {
        --chex-color: var(--hex-tag-artist);
      }
      :host([tone="copyright"]) {
        --chex-color: var(--hex-tag-copyright);
      }
      :host([tone="character"]) {
        --chex-color: var(--hex-tag-character);
      }
      :host([tone="species"]) {
        --chex-color: var(--hex-tag-species);
      }
      :host([tone="general"]) {
        --chex-color: var(--hex-tag-general);
      }
      :host([tone="meta"]) {
        --chex-color: var(--hex-tag-meta);
      }
      :host([tone="lore"]) {
        --chex-color: var(--hex-tag-lore);
      }
      :host([tone="invalid"]) {
        --chex-color: var(--hex-tag-invalid);
      }
      :host([tone="admin"]) {
        --chex-color: var(--hex-role-admin);
      }
      :host([tone="moderator"]) {
        --chex-color: var(--hex-role-moderator);
      }
      :host([tone="janitor"]) {
        --chex-color: var(--hex-role-janitor);
      }
      :host([tone="former-staff"]) {
        --chex-color: var(--hex-role-former-staff);
      }
      :host([tone="member"]) {
        --chex-color: var(--hex-role-member);
      }
      :host([tone="blocked"]) {
        --chex-color: var(--hex-role-blocked);
      }
      svg {
        display: block;
      }
    `,
  ];

  @property({ type: Number }) size = 18;
  @property({ type: String, reflect: true }) tone: HexChexagonTone = "artist";
  @property({ type: String, attribute: "check-color" }) checkColor = "#ffffff";

  override render() {
    return html`
      <svg
        width=${this.size}
        height=${this.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M7.6 21.4h8.8a2.2 2.1 0 0 0 1.9-1l4.3-7.4a2.2 2.1 0 0 0 0-2l-4.3-7.4a2.2 2.1 0 0 0-2-1H7.7a2.2 2.1 0 0 0-1.9 1L1.4 11a2.2 2.1 0 0 0 0 2l4.3 7.4a2.2 2.1 0 0 0 2 1z"
          stroke="var(--chex-color)"
          stroke-width="1.8"
        />
        <path d="m17.3 9.2-6.6 6.6-3-3.1" stroke=${this.checkColor} stroke-width="2" />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-chexagon": HexChexagon;
  }
}
