import { css } from "lit";

export const fieldStyles = css`
  :host {
    display: block;
    --_hex-control-line: var(--hex-control-line-md);
  }
  :host([size="sm"]) {
    --_hex-control-line: var(--hex-control-line-sm);
  }
  :host([size="lg"]) {
    --_hex-control-line: var(--hex-control-line-lg);
  }
  label {
    display: block;
    font-size: var(--hex-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--hex-fg-2);
    font-weight: var(--hex-font-weight-bold);
    margin-bottom: 5px;
  }
  .field {
    position: relative;
    display: flex;
    align-items: center;
  }
  .icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--hex-color-secondary-dark);
    pointer-events: none;
  }
  .control {
    width: 100%;
    box-sizing: border-box;
    background: var(--hex-color-background);
    color: var(--hex-fg-1);
    border: 1px solid var(--hex-border-strong);
    font-family: inherit;
    font-size: var(--hex-fs-md);
    padding: 8px 10px;
    border-radius: var(--hex-radius-md);
    line-height: var(--_hex-control-line);
    outline: none;
    transition:
      border-color var(--hex-dur-fast) var(--hex-ease),
      box-shadow var(--hex-dur-fast) var(--hex-ease);
  }
  :host([with-icon]) .control {
    padding-left: 30px;
  }
  .control:focus {
    border-color: var(--hex-color-primary);
    box-shadow: var(--hex-shadow-focus);
  }
  :host([invalid]) .control {
    border-color: var(--hex-color-danger);
  }
  :host([invalid]) .control:focus {
    box-shadow: var(--hex-shadow-focus-danger);
  }
  .hint,
  .error {
    font-size: var(--hex-fs-xs);
    margin-top: 4px;
  }
  .hint {
    color: var(--hex-fg-2);
  }
  .error {
    color: var(--hex-color-danger);
  }
  :host([disabled]) {
    opacity: 0.55;
    pointer-events: none;
  }

  .control[type="number"] {
    appearance: textfield;
  }
  .control[type="number"]::-webkit-outer-spin-button,
  .control[type="number"]::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  :host([size="sm"]) .control {
    font-size: var(--hex-fs-xs);
    padding: 6px 10px;
  }
  :host([size="lg"]) .control {
    font-size: 14px;
    padding: 10px 12px;
  }

  .prefix,
  .suffix {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    color: var(--hex-fg-2);
    font-size: var(--hex-fs-sm);
  }
  .prefix {
    left: 10px;
  }
  .suffix {
    right: 10px;
  }
  .prefix[hidden],
  .suffix[hidden] {
    display: none;
  }
  :host([has-prefix]) .control {
    padding-left: var(--_hex-field-prefix, 30px);
  }
  :host([has-suffix]) .control {
    padding-right: var(--_hex-field-suffix, 30px);
  }
`;
export type HexFieldSize = "sm" | "md" | "lg";
