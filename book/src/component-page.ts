import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { marked } from "marked";
import { findComponent, type ComponentEntry } from "./registry.js";
import "./playground.js";

const md = (text: string): string => marked.parseInline(text) as string;

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
    @media (max-width: 720px) {
      .api,
      .api tbody,
      .api tr,
      .api td {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
      .api thead {
        display: none;
      }
      .api tr {
        border: 1px solid #262626;
        border-radius: 4px;
        padding: 10px 12px;
        margin-bottom: 10px;
      }
      .api td {
        border-bottom: 0;
        padding: 3px 0;
      }
      .api td:not([data-label]) {
        display: none;
      }
      .api td[data-label="Type"]::before,
      .api td[data-label="Default"]::before {
        content: attr(data-label) ": ";
        color: #888;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;
      }
      .api td[data-label="Description"] {
        color: #b0b0b0;
        margin-top: 4px;
      }
      .api code {
        overflow-wrap: anywhere;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
      }
    }
    .usage-block {
      margin-bottom: 20px;
    }
    .usage-text {
      margin: 0 0 12px;
      line-height: 1.55;
      color: #d8d8d8;
    }
    .usage-text code {
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      background: #1f1f1f;
      padding: 1px 6px;
      border-radius: 3px;
      color: #e6e6e6;
    }
    .usage-demo::before {
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
    .usage-demo {
      padding: 24px 20px;
      border-radius: 4px;
      background-color: var(--hex-bg-card);
      position: relative;
      isolation: isolate;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      color: var(--hex-fg-1);
      font-family: var(--hex-font-family);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
  `;

  @property({ type: String }) tag = "";

  override render() {
    const entry: ComponentEntry | undefined = findComponent(this.tag);
    if (!entry) return html`<p>Unknown component: ${this.tag}</p>`;

    return html`
      <h1>${entry.title}<span class="tag-name">&lt;${entry.tag}&gt;</span></h1>
      <p class="lead">${unsafeHTML(md(entry.description))}</p>

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
                ${entry.props.map((p) => {
                  const hasDefault = p.default !== undefined && p.default !== "";
                  return html`
                    <tr>
                      <td data-label="Attribute"><code>${p.name}</code></td>
                      <td data-label="Type">${this.formatType(p)}</td>
                      <td data-label=${ifDefined(hasDefault ? "Default" : undefined)}>
                        ${hasDefault ? html`<code>${String(p.default)}</code>` : ""}
                      </td>
                      <td data-label=${ifDefined(p.description ? "Description" : undefined)}>
                        ${p.description ? unsafeHTML(md(p.description)) : ""}
                      </td>
                    </tr>
                  `;
                })}
              </tbody>
            </table>
          `}
      ${entry.usage && entry.usage.length > 0
        ? html`
            <h2>Usage</h2>
            ${entry.usage.map(
              (u) => html`
                <div class="usage-block">
                  <p class="usage-text">${unsafeHTML(md(u.text))}</p>
                  ${u.demo ? html`<div class="usage-demo">${unsafeHTML(u.demo)}</div>` : nothing}
                </div>
              `,
            )}
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
