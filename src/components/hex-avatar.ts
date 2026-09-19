import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { HexElement } from "../shared/base.js";

export type HexUserRole =
  | "member"
  | "privileged"
  | "blocked"
  | "former-staff"
  | "staff"
  | "janitor"
  | "moderator"
  | "admin";
export type HexAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<HexAvatarSize, number> = { xs: 20, sm: 28, md: 36, lg: 48, xl: 64 };

// Stroke-only rounded-square avatar. Color is driven by `role` and the entire
// element inherits that role color (so wrapping a username next to it keeps tone).

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
      :host([role-color="staff"]) {
        --_hex-av-color: var(--hex-role-staff);
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
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1.5px solid currentColor;
        font-weight: var(--hex-font-weight-bold);
        overflow: hidden;
        font-family: var(--hex-font-family);
        text-decoration: none;
        color: inherit;
        box-sizing: border-box;
      }
      .fallback {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        user-select: none;
      }
      img {
        position: absolute;
        inset: 0;
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
  @property({ type: String }) name = "";
  @property({ type: String }) src = "";
  @property({ type: String }) alt = "";
  @property({ type: String }) href?: string;
  @property({ type: String }) target?: string;
  @property({ type: String }) rel?: string;

  @state() private failed = false;

  private radiusFor(size: HexAvatarSize) {
    if (size === "xs" || size === "sm") return 4;
    if (size === "md" || size === "lg") return 6;
    return 8;
  }

  private fontFor(size: HexAvatarSize) {
    return ({ xs: 11, sm: 14, md: 18, lg: 24, xl: 32 } as const)[size];
  }

  private get letter(): string {
    return (this.name.trim()[0] ?? "?").toUpperCase();
  }

  private get linkRel(): string | undefined {
    if (this.rel !== undefined) return this.rel;
    return this.target === "_blank" ? "noopener noreferrer" : undefined;
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("src")) this.failed = false;
  }

  override render() {
    const px = SIZE_PX[this.size];
    const radius = this.radiusFor(this.size);
    const fontSize = this.fontFor(this.size);
    const box = `width:${px}px;height:${px}px;border-radius:${radius}px;font-size:${fontSize}px;`;
    const inside = html`
      <span class="fallback" part="fallback" aria-hidden="true"><slot>${this.letter}</slot></span>
      ${this.src && !this.failed
        ? html`<img
            part="image"
            src=${this.src}
            alt=${this.alt}
            @error=${() => {
              this.failed = true;
            }}
          />`
        : nothing}
    `;
    return this.href !== undefined
      ? html`<a
          class="sq"
          part="sq"
          style=${box}
          href=${this.href}
          target=${ifDefined(this.target)}
          rel=${ifDefined(this.linkRel)}
          aria-label=${ifDefined(this.alt || this.name || undefined)}
          >${inside}</a
        >`
      : html`<div class="sq" part="sq" style=${box}>${inside}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-avatar": HexAvatar;
  }
}
