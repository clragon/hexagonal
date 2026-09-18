import { css } from "lit";

export const fieldStyles = css`
  :host {
    display: block;
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
`;
