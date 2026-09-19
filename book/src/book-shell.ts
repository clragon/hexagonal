import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { components, GROUP_ORDER, type ComponentGroup, type ComponentEntry } from "./registry.js";
import "./component-page.js";
import "./intro.js";

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
      margin-top: 4px;
    }
    .nav-drawer > summary {
      display: none;
    }
    nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    nav li {
      margin-bottom: 1px;
    }
    nav ul.home {
      margin-bottom: 4px;
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
        grid-template-rows: auto minmax(0, 1fr);
      }
      aside {
        border-right: 0;
        border-bottom: 1px solid #262626;
      }
      :host([nav-open]) aside {
        position: fixed;
        inset: 0;
        z-index: 20;
        border-bottom: 0;
      }
      main {
        padding: 24px 20px 60px;
      }
      .nav-drawer > summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 12px;
        border: 1px solid #2e2e2e;
        border-radius: 6px;
        background: #1d1d1d;
        color: #e6e6e6;
        font-size: 13px;
        cursor: pointer;
        list-style: none;
        box-sizing: border-box;
      }
      .nav-drawer > summary::-webkit-details-marker {
        display: none;
      }
      .nav-drawer > summary::after {
        content: "▾";
        color: #888;
      }
      .nav-drawer[open] > summary::after {
        content: "▴";
      }
    }
  `;

  @state() private currentTag = "";
  @state() private navOpen = true;
  private wide = window.matchMedia("(min-width: 721px)");

  override connectedCallback() {
    super.connectedCallback();
    this.navOpen = this.wide.matches;
    this.syncFromHash();
    window.addEventListener("hashchange", this.syncFromHash);
    this.wide.addEventListener("change", this.onWidthChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("hashchange", this.syncFromHash);
    this.wide.removeEventListener("change", this.onWidthChange);
  }

  private syncFromHash = () => {
    const slug = window.location.hash.replace(/^#/, "").trim();
    const target = components.find((c) => c.tag === `hex-${slug}` || c.tag === slug);
    this.currentTag = target?.tag ?? "";
    if (!this.wide.matches) this.navOpen = false;
  };

  private onWidthChange = (e: MediaQueryListEvent) => {
    this.navOpen = e.matches;
  };

  override updated(changed: Map<string, unknown>) {
    this.toggleAttribute("nav-open", this.navOpen && !this.wide.matches);
    if (changed.has("currentTag")) {
      this.renderRoot.querySelector("main")?.scrollTo({ top: 0 });
      window.scrollTo({ top: 0 });
    }
  }

  private currentTitle() {
    return components.find((c) => c.tag === this.currentTag)?.title ?? "Overview";
  }

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
          <img class="brand-mark" src="../assets/logo-mark.svg" width="32" height="32" alt="" />
          <div class="brand-text">
            <div class="brand-title">Hexagonal</div>
            <div class="brand-sub">Components</div>
          </div>
        </div>
        <details
          class="nav-drawer"
          ?open=${this.navOpen}
          @toggle=${(e: Event) => {
            this.navOpen = (e.target as HTMLDetailsElement).open;
          }}
        >
          <summary>${this.currentTitle()}</summary>
          <nav>
            <ul class="home">
              <li>
                <a href="#" class=${this.currentTag ? "" : "active"}>Overview</a>
              </li>
            </ul>
            ${this.renderGroups()}
          </nav>
        </details>
      </aside>
      <main>
        ${this.currentTag
          ? html`<component-page tag=${this.currentTag}></component-page>`
          : html`<book-intro></book-intro>`}
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "book-shell": BookShell;
  }
}
