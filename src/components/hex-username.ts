import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-chexagon.js";
import type { HexUserRole } from "./hex-avatar.js";

// Role-tinted username text. `blocked` adds a strike. When `verified` is set,
// the chexagon (verified badge) is appended after the name.

@customElement("hex-username")
export class HexUsername extends HexElement {
  static preflight = {
    base: {
      display: "inline-flex",
      verticalAlign: "middle",
      visibility: "hidden",
      minHeight: "19.5px",
    },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        align-items: baseline;
        gap: 4px;
        font-weight: var(--hex-font-weight-bold);
        font-size: var(--hex-fs-md);
        --_hex-uname-color: var(--hex-role-member);
        --_hex-uname-color-alt: var(--hex-role-member-alt);
        color: var(--_hex-uname-color);
      }
      :host([role-color="privileged"]) {
        --_hex-uname-color: var(--hex-role-privileged);
        --_hex-uname-color-alt: var(--hex-role-privileged-alt);
      }
      :host([role-color="blocked"]) {
        --_hex-uname-color: var(--hex-role-blocked);
        --_hex-uname-color-alt: var(--hex-role-blocked-alt);
      }
      :host([role-color="former-staff"]) {
        --_hex-uname-color: var(--hex-role-former-staff);
        --_hex-uname-color-alt: var(--hex-role-former-staff-alt);
      }
      :host([role-color="staff"]) {
        --_hex-uname-color: var(--hex-role-staff);
        --_hex-uname-color-alt: var(--hex-role-staff-alt);
      }
      :host([role-color="janitor"]) {
        --_hex-uname-color: var(--hex-role-janitor);
        --_hex-uname-color-alt: var(--hex-role-janitor-alt);
      }
      :host([role-color="moderator"]) {
        --_hex-uname-color: var(--hex-role-moderator);
        --_hex-uname-color-alt: var(--hex-role-moderator-alt);
      }
      :host([role-color="admin"]) {
        --_hex-uname-color: var(--hex-role-admin);
        --_hex-uname-color-alt: var(--hex-role-admin-alt);
      }

      .name {
        color: inherit;
        text-decoration: none;
      }
      :host([role-color="blocked"]) .name {
        text-decoration: line-through;
        text-decoration-thickness: 1.5px;
        text-decoration-color: currentColor;
      }
      a.name:hover {
        color: var(--_hex-uname-color-alt);
      }
      hex-chexagon {
        transform: translateY(2px);
      }
    `,
  ];

  @property({ type: String, reflect: true, attribute: "role-color" }) roleColor: HexUserRole =
    "member";
  @property({ type: String }) href = "";
  @property({ type: Boolean, reflect: true }) verified = false;

  override render() {
    const inner = html`<slot></slot>`;
    return html`
      ${this.href
        ? html`<a class="name" part="name" href=${this.href}>${inner}</a>`
        : html`<span class="name" part="name">${inner}</span>`}
      ${this.verified
        ? html`<hex-chexagon size="14" aria-label="Verified" role="img"></hex-chexagon>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-username": HexUsername;
  }
}
