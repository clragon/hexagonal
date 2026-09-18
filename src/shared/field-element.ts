import { html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { HexFormElement } from "./form-element.js";
import { fieldStyles, type HexFieldSize } from "./field-styles.js";
import type { IconName } from "./icons.js";

export abstract class HexFieldElement extends HexFormElement {
  static override styles = [HexFormElement.styles, fieldStyles];

  @property({ type: String }) label = "";
  @property({ type: String }) hint = "";
  @property({ type: String }) error = "";
  @property({ type: String }) icon?: IconName;
  @property({ type: String, reflect: true }) size: HexFieldSize = "md";

  @state() protected hasPrefix = false;
  @state() protected hasSuffix = false;

  protected get describedBy(): string | undefined {
    return this.error ? "error" : this.hint ? "hint" : undefined;
  }

  protected readonly onAffixSlot = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const filled = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === "prefix") {
      this.hasPrefix = filled;
      this.toggleAttribute("has-prefix", filled);
    } else {
      this.hasSuffix = filled;
      this.toggleAttribute("has-suffix", filled);
    }
  };

  protected renderPrefix(): TemplateResult {
    return html`<span class="prefix" part="prefix" ?hidden=${!this.hasPrefix}>
      <slot name="prefix" @slotchange=${this.onAffixSlot}></slot>
    </span>`;
  }

  protected renderSuffix(): TemplateResult {
    return html`<span class="suffix" part="suffix" ?hidden=${!this.hasSuffix}>
      <slot name="suffix" @slotchange=${this.onAffixSlot}></slot>
    </span>`;
  }

  protected renderMessage(): TemplateResult | typeof nothing {
    if (this.error)
      return html`<div id="error" class="error" part="error" role="alert">${this.error}</div>`;
    if (this.hint) return html`<div id="hint" class="hint" part="hint">${this.hint}</div>`;
    return nothing;
  }

  protected syncFieldAttributes(changed: Map<string, unknown>): void {
    if (changed.has("icon")) this.toggleAttribute("with-icon", Boolean(this.icon));
    if (changed.has("error")) this.toggleAttribute("invalid", Boolean(this.error));
  }
}
