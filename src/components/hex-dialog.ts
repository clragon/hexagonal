import { html, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import "./hex-button.js";

export type HexDialogSize = "sm" | "md" | "lg";

// Modal dialog backed by the native <dialog> element so we get focus trap,
// ESC-to-close, top-layer rendering, and the accessibility role for free.
//
// Slots:
//   heading   bold title in the header
//   default   body content
//   actions   footer buttons (primary on the right per house convention)
//
// Open programmatically via .show() / .close() or declaratively via the
// `open` attribute. Set `no-close` for confirmations the user must
// explicitly acknowledge: hides the close X, disables backdrop-click
// dismissal, and switches the role to "alertdialog" so screen readers
// announce it as such.

@customElement("hex-dialog")
export class HexDialog extends HexElement {
  static preflight = {
    base: { display: "none" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: contents;
      }
      dialog {
        isolation: isolate;
        background: var(--hex-bg-card);
        color: var(--hex-fg-1);
        border: 1px solid var(--hex-border);
        border-radius: var(--hex-radius-lg);
        box-shadow: var(--hex-shadow-popover);
        padding: 0;
        font-family: var(--hex-font-family);
        font-size: var(--hex-fs-md);
        line-height: var(--hex-line-normal);
        max-width: min(92vw, 640px);
        max-height: 92vh;
        width: 480px;
        outline: none;
      }
      dialog::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background-image: var(--hex-texture);
        background-repeat: repeat;
        -webkit-mask-image: var(--hex-texture-mask);
        mask-image: var(--hex-texture-mask);
      }
      dialog:focus,
      dialog:focus-visible {
        outline: none;
      }
      :host([size="sm"]) dialog {
        width: 360px;
      }
      :host([size="lg"]) dialog {
        width: 640px;
      }
      dialog::backdrop {
        background: var(--hex-bg-overlay);
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px 8px;
      }
      .heading {
        flex: 1;
        min-width: 0;
        font-weight: var(--hex-font-weight-bold);
        font-size: var(--hex-fs-h6);
        color: var(--hex-fg-1);
      }
      .body {
        padding: 8px 20px 20px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 20px 16px;
        border-top: 1px solid var(--hex-border);
        background: var(--hex-bg-sunken);
      }
      .actions[hidden] {
        display: none;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String, reflect: true }) size: HexDialogSize = "md";
  @property({ type: Boolean, reflect: true, attribute: "no-close" }) noClose = false;
  @property({ type: Boolean, reflect: true, attribute: "no-backdrop-close" }) noBackdropClose =
    false;

  @query("dialog") private _dialog!: HTMLDialogElement;

  @state() private hasActions = false;

  show() {
    this.open = true;
  }

  close(returnValue?: string) {
    if (returnValue !== undefined && this._dialog) this._dialog.returnValue = returnValue;
    this.open = false;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open && !this._dialog.open) this._dialog.showModal();
      else if (!this.open && this._dialog.open) this._dialog.close();
    }
  }

  private onClose = () => {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("hex-close", {
        detail: { returnValue: this._dialog?.returnValue ?? "" },
        bubbles: true,
        composed: true,
      }),
    );
  };

  // Native <dialog> doesn't close on backdrop click. Detect clicks on the
  // dialog element itself (not its children) and close. `no-close` (an
  // acknowledge-required dialog) and `no-backdrop-close` both suppress this.
  private onClick = (e: MouseEvent) => {
    if (this.noBackdropClose || this.noClose) return;
    if (e.target === this._dialog) this.close();
  };

  override render() {
    return html`
      <dialog
        part="base"
        role=${this.noClose ? "alertdialog" : "dialog"}
        aria-labelledby="heading"
        @close=${this.onClose}
        @click=${this.onClick}
      >
        <div class="header" part="header">
          <div id="heading" class="heading" part="heading"><slot name="heading"></slot></div>
          ${this.noClose
            ? nothing
            : html`
                <hex-button
                  variant="ghost"
                  color="secondary"
                  size="sm"
                  icon-only
                  icon="close"
                  aria-label="Close"
                  @click=${() => this.close()}
                ></hex-button>
              `}
        </div>
        <div class="body" part="body"><slot></slot></div>
        <div class="actions" part="actions" ?hidden=${!this.hasActions}>
          <slot
            name="actions"
            @slotchange=${(e: Event) => {
              const slot = e.target as HTMLSlotElement;
              this.hasActions = slot.assignedNodes({ flatten: true }).length > 0;
            }}
          ></slot>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-dialog": HexDialog;
  }
}
