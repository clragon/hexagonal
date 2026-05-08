import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { ComponentEntry, PropSpec } from "./registry.js";

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
    /* Preview pane: brand styling so components show on a real surface. */
    .preview {
      border-radius: 4px;
      padding: 32px 24px;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      color: var(--hex-fg-1);
      font-family: var(--hex-font-family);
    }
    .preview.surface-card {
      background-color: var(--hex-bg-card);
      background-image: var(--hex-texture);
      background-repeat: repeat-x;
      background-position: left top;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .preview.surface-page {
      background-color: var(--hex-bg-page);
      background-image: var(--hex-tile);
      background-repeat: repeat;
      border: 1px solid #262626;
    }
    /* Surface components default to filling viewport. In the preview they
       should size to content so the demo doesn't tower over the page. */
    .preview hex-page,
    .preview hex-card,
    .preview hex-section,
    .preview hex-alert {
      min-height: 0;
      width: 100%;
    }
    .panels {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      gap: 16px;
      margin-top: 16px;
    }
    .controls,
    .snippet-pane {
      background: #161616;
      border: 1px solid #262626;
      border-radius: 4px;
      padding: 16px 18px;
    }
    .controls h3,
    .snippet-pane h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #888;
      font-weight: 700;
      margin: 0 0 12px;
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
    .pane-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .pane-head h3 {
      margin: 0;
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
    }
    .copy:hover {
      background: #2a2a2a;
      color: #ffffff;
    }
    @media (max-width: 720px) {
      .panels {
        grid-template-columns: 1fr;
      }
      .control {
        grid-template-columns: 90px minmax(0, 1fr);
      }
    }
  `;

  @property({ attribute: false }) entry?: ComponentEntry;

  @state() private values: Record<string, Value> = {};

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("entry") && this.entry) {
      const next: Record<string, Value> = {};
      for (const p of this.entry.props) {
        next[p.name] = p.default ?? defaultFor(p.kind);
      }
      this.values = next;
    }
  }

  private updateValue(name: string, value: Value) {
    this.values = { ...this.values, [name]: value };
  }

  override render() {
    if (!this.entry) return nothing;
    const markup = buildMarkup(this.entry, this.values);
    const surface = this.entry.previewSurface ?? "card";
    return html`
      <div class="preview surface-${surface}">${unsafeHTML(markup)}</div>
      <div class="panels">
        <div class="controls">
          <h3>Controls</h3>
          ${this.entry.props.map((p) => this.renderControl(p))}
          ${this.entry.props.length === 0
            ? html`<p style="margin: 0; font-size: 12px; color: #888">No props to tweak.</p>`
            : nothing}
        </div>
        <div class="snippet-pane">
          <div class="pane-head">
            <h3>Markup</h3>
            <button class="copy" @click=${() => this.copy(markup)}>Copy</button>
          </div>
          <pre class="snippet">${prettyPrint(markup)}</pre>
        </div>
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

function buildMarkup(entry: ComponentEntry, values: Record<string, Value>): string {
  // Emit any attribute that has a meaningful value; let the consumer see the
  // full picture in the snippet rather than guessing what defaults exist.
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
  const slot = entry.defaultSlot ?? "";
  return `<${entry.tag}${attrStr}>${slot}</${entry.tag}>`;
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
