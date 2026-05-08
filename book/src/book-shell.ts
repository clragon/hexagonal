import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { components, GROUP_ORDER, type ComponentGroup, type ComponentEntry } from "./registry.js";
import "./component-page.js";

// Neutral docs chrome: white background, black text, gray borders. The brand
// styling is reserved for the preview pane so component demos stand out
// against an unstyled surface (no risk of confusing chrome with subject).

@customElement("book-shell")
export class BookShell extends LitElement {
  static override styles = css`
    :host {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      height: 100vh;
      background: #0e0e0e;
      color: #e6e6e6;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }
    aside {
      border-right: 1px solid #262626;
      padding: 20px 12px;
      overflow-y: auto;
      background: #161616;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 8px 16px;
      margin-bottom: 8px;
      border-bottom: 1px solid #262626;
    }
    .brand-mark {
      flex-shrink: 0;
    }
    .brand-text {
      min-width: 0;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 11px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 4px;
    }
    nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    nav li {
      margin-bottom: 1px;
    }
    nav .group-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #666;
      font-weight: 700;
      padding: 16px 10px 6px;
    }
    nav .group:first-child .group-label {
      padding-top: 4px;
    }
    nav a {
      display: block;
      padding: 6px 10px;
      border-radius: 4px;
      color: #b0b0b0;
      text-decoration: none;
      font-size: 13px;
      transition: background 120ms;
    }
    nav a:hover {
      background: #232323;
      color: #ffffff;
    }
    nav a.active {
      background: #ffffff;
      color: #0e0e0e;
      font-weight: 600;
    }
    nav .tag {
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 11px;
      color: inherit;
      opacity: 0.55;
      margin-left: 8px;
    }
    main {
      overflow-y: auto;
      padding: 40px 56px 80px;
    }
    @media (max-width: 720px) {
      :host {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }
      aside {
        border-right: 0;
        border-bottom: 1px solid #262626;
      }
      main {
        padding: 24px 20px 60px;
      }
    }
  `;

  @state() private currentTag: string = components[0]?.tag ?? "";

  override connectedCallback() {
    super.connectedCallback();
    this.syncFromHash();
    window.addEventListener("hashchange", this.syncFromHash);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("hashchange", this.syncFromHash);
  }

  private syncFromHash = () => {
    const slug = window.location.hash.replace(/^#/, "").trim();
    const target = components.find((c) => c.tag === `hex-${slug}` || c.tag === slug);
    this.currentTag = target?.tag ?? components[0]?.tag ?? "";
  };

  private renderGroups() {
    const byGroup = new Map<ComponentGroup, ComponentEntry[]>();
    for (const c of components) {
      const list = byGroup.get(c.group) ?? [];
      list.push(c);
      byGroup.set(c.group, list);
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map(
      (group) => html`
        <div class="group">
          <div class="group-label">${group}</div>
          <ul>
            ${(byGroup.get(group) ?? []).map((c) => {
              const slug = c.tag.replace(/^hex-/, "");
              return html`
                <li>
                  <a href="#${slug}" class=${c.tag === this.currentTag ? "active" : ""}>
                    ${c.title}<span class="tag">&lt;${c.tag}&gt;</span>
                  </a>
                </li>
              `;
            })}
          </ul>
        </div>
      `,
    );
  }

  override render() {
    return html`
      <aside>
        <div class="brand">
          <hex-logo class="brand-mark" mark-only width="32"></hex-logo>
          <div class="brand-text">
            <div class="brand-title">Hexagonal</div>
            <div class="brand-sub">Components</div>
          </div>
        </div>
        <nav>
          ${this.renderGroups()}
        </nav>
      </aside>
      <main>
        <component-page tag=${this.currentTag}></component-page>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "book-shell": BookShell;
  }
}
