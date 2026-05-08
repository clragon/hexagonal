import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { findComponent, type ComponentEntry } from "./registry.js";
import "./playground.js";

// One component's documentation page. Neutral typography; the playground
// is where the brand styling lives.

@customElement("component-page")
export class ComponentPage extends LitElement {
  static override styles = css`
    :host {
      display: block;
      max-width: 880px;
      color: #e6e6e6;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 4px;
      line-height: 1.2;
      color: #ffffff;
    }
    .tag-name {
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 14px;
      color: #b0b0b0;
      background: #1f1f1f;
      padding: 2px 8px;
      border-radius: 3px;
      vertical-align: middle;
      margin-left: 12px;
      font-weight: 400;
    }
    .lead {
      color: #b0b0b0;
      font-size: 16px;
      margin: 8px 0 32px;
      max-width: 60ch;
      line-height: 1.55;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 40px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #262626;
      color: #ffffff;
    }
    .api {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .api th,
    .api td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #262626;
      vertical-align: top;
    }
    .api th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
      color: #888;
    }
    .api code {
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      background: #1f1f1f;
      padding: 1px 6px;
      border-radius: 3px;
      color: #e6e6e6;
    }
    .empty {
      color: #888;
      font-style: italic;
    }
    pre.slot-sample {
      margin: 0;
      padding: 12px 14px;
      background: #161616;
      border: 1px solid #262626;
      border-radius: 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      color: #c8c8c8;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
  `;

  @property({ type: String }) tag = "";

  override render() {
    const entry: ComponentEntry | undefined = findComponent(this.tag);
    if (!entry) return html`<p>Unknown component: ${this.tag}</p>`;

    return html`
      <h1>${entry.title}<span class="tag-name">&lt;${entry.tag}&gt;</span></h1>
      <p class="lead">${entry.description}</p>

      <h2>Playground</h2>
      <book-playground .entry=${entry}></book-playground>

      <h2>Props</h2>
      ${entry.props.length === 0
        ? html`<p class="empty">This component takes no props beyond its slot content.</p>`
        : html`
            <table class="api">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${entry.props.map(
                  (p) => html`
                    <tr>
                      <td><code>${p.name}</code></td>
                      <td>${this.formatType(p)}</td>
                      <td>${p.default !== undefined ? html`<code>${String(p.default)}</code>` : ""}</td>
                      <td>${p.description ?? ""}</td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          `}
      ${entry.defaultSlot
        ? html`
            <h2>Slot</h2>
            <p>This component renders its default slot inline. Sample content used in the playground:</p>
            <pre class="slot-sample">${entry.defaultSlot}</pre>
          `
        : nothing}
    `;
  }

  private formatType(p: ComponentEntry["props"][number]) {
    if (p.kind === "select" && p.options) {
      return html`<code>${p.options.filter(Boolean).slice(0, 6).join(" | ")}${p.options.length > 6 ? " | ..." : ""}</code>`;
    }
    return html`<code>${p.kind}</code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "component-page": ComponentPage;
  }
}
