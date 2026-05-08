import { LitElement, css, type CSSResultGroup } from "lit";

// Shared component base. Every Hexagonal component extends this so we can:
// - layer brand-default font/color resets onto the host
// - swap in shared utility CSS later without touching individual components
//
// Tokens are global (:root via registerTokens), so we reference --hex-* directly.

export const hostReset = css`
  :host {
    box-sizing: border-box;
    font-family: var(--hex-font-family);
    color: var(--hex-fg-1);
    line-height: var(--hex-line-normal);
  }
  :host([hidden]) {
    display: none;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;

export class HexElement extends LitElement {
  static override styles: CSSResultGroup = [hostReset];
}
