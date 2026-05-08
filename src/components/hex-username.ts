import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-chexagon.js";
import type { HexUserRole } from "./hex-avatar.js";

// Role-tinted username text. `blocked` adds a strike. When `verified` is set,
// the chexagon (verified badge) is appended after the name.

@customElement("hex-username")
export class HexUsername extends HexElement {
  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        font-weight: var(--hex-font-weight-bold);
        font-size: var(--hex-fs-md);
        --uname-color: var(--hex-role-member);
        color: var(--uname-color);
      }
      :host([role-color="privileged"]) {
        --uname-color: var(--hex-role-privileged);
      }
      :host([role-color="blocked"]) {
        --uname-color: var(--hex-role-blocked);
      }
      :host([role-color="former-staff"]) {
        --uname-color: var(--hex-role-former-staff);
      }
      :host([role-color="janitor"]) {
        --uname-color: var(--hex-role-janitor);
      }
      :host([role-color="moderator"]) {
        --uname-color: var(--hex-role-moderator);
      }
      :host([role-color="admin"]) {
        --uname-color: var(--hex-role-admin);
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
        text-decoration: underline;
      }
      :host([role-color="blocked"]) a.name:hover {
        text-decoration: line-through underline;
        text-decoration-thickness: 1.5px;
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
        ? html`<a class="name" href=${this.href}>${inner}</a>`
        : html`<span class="name">${inner}</span>`}
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
