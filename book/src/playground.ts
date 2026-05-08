import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { DEFAULT_PREVIEW_HEIGHT, type ComponentEntry, type PropSpec } from "./registry.js";

// Live demo + controls + code snippet for a single component.
// Preview pane uses brand styling so components render on their natural
// surface; controls and code stay neutral so the chrome doesn't compete.

type Value = string | number | boolean;

@customElement("book-playground")
export class BookPlayground extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
    }
    /* Preview is an iframe that hosts a fresh document for each component.
       This isolates DOM, top-layer (modals), focus trap, and styles so demos
       like hex-dialog work without taking over the book. The iframe's
       internal stylesheet handles the surface backgrounds. Fixed height per
       entry (registry decides) so the layout doesn't jump as state toggles. */
    iframe.preview {
      width: 100%;
      border: 1px solid #262626;
      border-radius: 4px;
      display: block;
      background: transparent;
    }
    .panels {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }
    .controls {
      background: #161616;
      border: 1px solid #262626;
      border-radius: 4px;
      padding: 16px 18px;
    }
    .controls h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #888;
      font-weight: 700;
      margin: 0 0 12px;
    }
    .markup-toggle {
      background: #161616;
      border: 1px solid #262626;
      border-radius: 4px;
    }
    .markup-toggle[open] {
      padding-bottom: 12px;
    }
    .markup-toggle summary {
      list-style: none;
      cursor: pointer;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #888;
      font-weight: 700;
      user-select: none;
    }
    .markup-toggle summary::-webkit-details-marker {
      display: none;
    }
    .markup-toggle summary::before {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border: 4px solid transparent;
      border-left-color: #888;
      transition: transform 120ms;
    }
    .markup-toggle[open] summary::before {
      transform: rotate(90deg);
    }
    .markup-toggle .summary-spacer {
      flex: 1;
    }
    .markup-toggle .markup-body {
      padding: 0 12px;
    }
    .control {
      display: grid;
      grid-template-columns: 110px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .control:last-child {
      margin-bottom: 0;
    }
    .control label {
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      color: #b0b0b0;
    }
    .control select,
    .control input[type="text"],
    .control input[type="number"] {
      width: 100%;
      box-sizing: border-box;
      background: #0e0e0e;
      color: #e6e6e6;
      border: 1px solid #2e2e2e;
      padding: 6px 8px;
      border-radius: 3px;
      font-family: inherit;
      font-size: 13px;
      outline: none;
    }
    .control select option {
      background: #161616;
      color: #e6e6e6;
    }
    .control select:focus,
    .control input:focus {
      border-color: #4a4a4a;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
    }
    .control input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: #ffffff;
    }
    .control textarea {
      width: 100%;
      box-sizing: border-box;
      background: #0e0e0e;
      color: #e6e6e6;
      border: 1px solid #2e2e2e;
      padding: 6px 8px;
      border-radius: 3px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      outline: none;
      resize: vertical;
      min-height: 32px;
      line-height: 1.4;
    }
    .control textarea:focus {
      border-color: #4a4a4a;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
    }
    .group-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #888;
      font-weight: 700;
      margin: 14px 0 8px;
    }
    .group-label:first-child {
      margin-top: 0;
    }
    .control.slot-control {
      grid-template-columns: 110px minmax(0, 1fr);
      align-items: start;
    }
    pre.snippet {
      margin: 0;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      color: #d8d8d8;
      background: #0e0e0e;
      border: 1px solid #2e2e2e;
      border-radius: 3px;
      padding: 12px 14px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.5;
    }
    .copy {
      background: #1f1f1f;
      border: 1px solid #2e2e2e;
      color: #b0b0b0;
      font-family: inherit;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 3px;
      cursor: pointer;
      text-transform: none;
      letter-spacing: 0;
      font-weight: 400;
    }
    .copy:hover {
      background: #2a2a2a;
      color: #ffffff;
    }
    @media (max-width: 720px) {
      .control {
        grid-template-columns: 90px minmax(0, 1fr);
      }
    }
  `;

  @property({ attribute: false }) entry?: ComponentEntry;

  @state() private values: Record<string, Value> = {};
  // Slot contents. Empty key ("") is the default slot; other keys are named slots.
  @state() private slots: Record<string, string> = {};

  @query("iframe.preview") private _iframe?: HTMLIFrameElement;
  private iframeReady = false;

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("message", this.onIframeMessage);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("message", this.onIframeMessage);
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("entry") && this.entry) {
      const next: Record<string, Value> = {};
      for (const p of this.entry.props) {
        next[p.name] = p.default ?? defaultFor(p.kind);
      }
      this.values = next;
      const slots: Record<string, string> = {};
      if (this.entry.defaultSlot !== undefined) slots[""] = this.entry.defaultSlot;
      for (const [name, content] of Object.entries(this.entry.namedSlots ?? {})) {
        slots[name] = content;
      }
      this.slots = slots;
    }
  }

  override updated() {
    this.sendToIframe();
  }

  private onIframeMessage = (e: MessageEvent) => {
    if (!this._iframe || e.source !== this._iframe.contentWindow) return;
    if (e.data?.type === "hex-preview-ready") {
      this.iframeReady = true;
      this.sendToIframe();
    }
  };

  private sendToIframe() {
    if (!this.iframeReady || !this._iframe?.contentWindow || !this.entry) return;
    const componentMarkup = buildMarkup(this.entry, this.values, this.slots);
    const extras = this.entry.previewExtras?.trim();
    const previewMarkup = extras ? `${extras}\n${componentMarkup}` : componentMarkup;
    this._iframe.contentWindow.postMessage(
      {
        type: "hex-preview-content",
        markup: previewMarkup,
        surface: this.entry.previewSurface ?? "card",
      },
      "*",
    );
  }

  private updateValue(name: string, value: Value) {
    this.values = { ...this.values, [name]: value };
  }

  private updateSlot(name: string, content: string) {
    this.slots = { ...this.slots, [name]: content };
  }

  override render() {
    if (!this.entry) return nothing;
    // The Markup disclosure shows just the component; previewExtras stay out
    // of the snippet on purpose so consumers see the canonical usage.
    const markup = buildMarkup(this.entry, this.values, this.slots);
    const slotKeys = Object.keys(this.slots);
    const height = this.entry.previewHeight ?? DEFAULT_PREVIEW_HEIGHT;
    return html`
      <iframe
        class="preview"
        src="preview-host.html"
        data-tag=${this.entry.tag}
        style="height: ${height}px"
      ></iframe>
      <div class="panels">
        <div class="controls">
          ${this.entry.props.length > 0
            ? html`
                <div class="group-label">Props</div>
                ${this.entry.props.map((p) => this.renderControl(p))}
              `
            : nothing}
          ${slotKeys.length > 0
            ? html`
                <div class="group-label">Slots</div>
                ${slotKeys.map((name) => this.renderSlotControl(name))}
              `
            : nothing}
          ${this.entry.props.length === 0 && slotKeys.length === 0
            ? html`<p style="margin: 0; font-size: 12px; color: #888">Nothing to tweak.</p>`
            : nothing}
        </div>
        <details class="markup-toggle">
          <summary>
            Markup
            <span class="summary-spacer"></span>
            <button
              class="copy"
              @click=${(e: Event) => {
                e.preventDefault();
                this.copy(markup);
              }}
            >
              Copy
            </button>
          </summary>
          <div class="markup-body"><pre class="snippet">${prettyPrint(markup)}</pre></div>
        </details>
      </div>
    `;
  }

  private renderSlotControl(name: string) {
    const label = name === "" ? "(default)" : name;
    const value = this.slots[name] ?? "";
    return html`
      <div class="control slot-control">
        <label>${label}</label>
        <textarea
          rows="2"
          .value=${value}
          @input=${(e: Event) => this.updateSlot(name, (e.target as HTMLTextAreaElement).value)}
        ></textarea>
      </div>
    `;
  }

  private renderControl(p: PropSpec) {
    const v = this.values[p.name];
    switch (p.kind) {
      case "select":
        return html`
          <div class="control">
            <label>${p.name}</label>
            <select
              @change=${(e: Event) => this.updateValue(p.name, (e.target as HTMLSelectElement).value)}
            >
              ${(p.options ?? []).map(
                (opt) => html`<option value=${opt} ?selected=${opt === v}>${opt || "(none)"}</option>`,
              )}
            </select>
          </div>
        `;
      case "boolean":
        return html`
          <div class="control">
            <label>${p.name}</label>
            <input
              type="checkbox"
              ?checked=${Boolean(v)}
              @change=${(e: Event) => this.updateValue(p.name, (e.target as HTMLInputElement).checked)}
            />
          </div>
        `;
      case "number":
        return html`
          <div class="control">
            <label>${p.name}</label>
            <input
              type="number"
              .value=${String(v ?? "")}
              @input=${(e: Event) => this.updateValue(p.name, Number((e.target as HTMLInputElement).value))}
            />
          </div>
        `;
      case "text":
      default:
        return html`
          <div class="control">
            <label>${p.name}</label>
            <input
              type="text"
              .value=${String(v ?? "")}
              @input=${(e: Event) => this.updateValue(p.name, (e.target as HTMLInputElement).value)}
            />
          </div>
        `;
    }
  }

  private async copy(markup: string) {
    try {
      await navigator.clipboard.writeText(prettyPrint(markup));
    } catch {
      // ignore
    }
  }
}

function defaultFor(kind: PropSpec["kind"]): Value {
  if (kind === "boolean") return false;
  if (kind === "number") return 0;
  return "";
}

function buildMarkup(
  entry: ComponentEntry,
  values: Record<string, Value>,
  slots: Record<string, string>,
): string {
  const attrs: string[] = [];
  for (const p of entry.props) {
    const v = values[p.name];
    if (p.kind === "boolean") {
      if (v === true) attrs.push(p.name);
      continue;
    }
    if (v === undefined || v === "") continue;
    attrs.push(`${p.name}="${escapeAttr(String(v))}"`);
  }
  const attrStr = attrs.length ? ` ${attrs.join(" ")}` : "";
  const defaultSlot = slots[""] ?? "";
  const namedSlotMarkup = Object.entries(slots)
    .filter(([name, content]) => name !== "" && content)
    .map(([name, content]) => wrapInNamedSlot(name, content))
    .join("");
  return `<${entry.tag}${attrStr}>${namedSlotMarkup}${defaultSlot}</${entry.tag}>`;
}

// If the slot content already carries `slot="name"` on its top-level tags
// (e.g. `<hex-button slot="actions">...</hex-button>`), pass it through;
// otherwise wrap it in a span with the slot attribute.
function wrapInNamedSlot(name: string, content: string): string {
  if (new RegExp(`slot=["']${name}["']`).test(content)) return content;
  return `<span slot="${name}">${content}</span>`;
}

function escapeAttr(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function prettyPrint(markup: string): string {
  // Soft-wrap long attribute lists onto separate lines for readability.
  const m = markup.match(/^<(\S+)([^>]*)>([\s\S]*)<\/\S+>$/);
  if (!m) return markup;
  const [, tag, attrPart, body] = m;
  if (!attrPart || attrPart.trim().length < 60) return markup;
  const attrs = attrPart
    .trim()
    .split(/(?<=")\s+/)
    .filter(Boolean);
  const inner = body.trim();
  return `<${tag}\n  ${attrs.join("\n  ")}\n>${inner ? `\n  ${inner}\n` : ""}</${tag.split(" ")[0]}>`;
}

declare global {
  interface HTMLElementTagNameMap {
    "book-playground": BookPlayground;
  }
}
