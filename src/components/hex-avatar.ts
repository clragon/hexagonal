import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";

export type HexUserRole =
  | "member"
  | "privileged"
  | "blocked"
  | "former-staff"
  | "janitor"
  | "moderator"
  | "admin";
export type HexAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<HexAvatarSize, number> = { xs: 20, sm: 28, md: 36, lg: 48, xl: 64 };

// Stroke-only rounded-square avatar. Color is driven by `role` and the entire
// element inherits that role color (so wrapping a username next to it keeps tone).
// `src` shows an image instead of initials when set.

@customElement("hex-avatar")
export class HexAvatar extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      width: "36px",
      height: "36px",
    },
    variants: [
      { when: '[size="xs"]', style: { width: "20px", height: "20px" } },
      { when: '[size="sm"]', style: { width: "28px", height: "28px" } },
      { when: '[size="lg"]', style: { width: "48px", height: "48px" } },
      { when: '[size="xl"]', style: { width: "64px", height: "64px" } },
    ],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        --_hex-av-color: var(--hex-role-member);
        color: var(--_hex-av-color);
      }
      :host([role-color="privileged"]) {
        --_hex-av-color: var(--hex-role-privileged);
      }
      :host([role-color="blocked"]) {
        --_hex-av-color: var(--hex-role-blocked);
      }
      :host([role-color="former-staff"]) {
        --_hex-av-color: var(--hex-role-former-staff);
      }
      :host([role-color="janitor"]) {
        --_hex-av-color: var(--hex-role-janitor);
      }
      :host([role-color="moderator"]) {
        --_hex-av-color: var(--hex-role-moderator);
      }
      :host([role-color="admin"]) {
        --_hex-av-color: var(--hex-role-admin);
      }

      .sq {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1.5px solid currentColor;
        font-weight: var(--hex-font-weight-bold);
        overflow: hidden;
        font-family: var(--hex-font-family);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    `,
  ];

  @property({ type: String, reflect: true, attribute: "role-color" }) roleColor: HexUserRole =
    "member";
  @property({ type: String, reflect: true }) size: HexAvatarSize = "md";
  @property({ type: String }) initials = "";
  @property({ type: String }) src = "";
  @property({ type: String }) alt = "";

  private radiusFor(size: HexAvatarSize) {
    if (size === "xs" || size === "sm") return 4;
    if (size === "md" || size === "lg") return 6;
    return 8;
  }

  private fontFor(size: HexAvatarSize) {
    return ({ xs: 9, sm: 11, md: 13, lg: 16, xl: 22 } as const)[size];
  }

  override render() {
    const px = SIZE_PX[this.size];
    const radius = this.radiusFor(this.size);
    const fontSize = this.fontFor(this.size);
    return html`
      <div
        class="sq"
        part="sq"
        style=${`width:${px}px;height:${px}px;border-radius:${radius}px;font-size:${fontSize}px;`}
      >
        ${this.src
          ? html`<img part="image" src=${this.src} alt=${this.alt} />`
          : html`${this.initials.slice(0, 2).toUpperCase()}`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-avatar": HexAvatar;
  }
}
