import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

declare const __HEX_VERSION__: string;
declare const __HEX_REPO__: string;

@customElement("book-intro")
export class BookIntro extends LitElement {
  static override styles = css`
    :host {
      display: block;
      max-width: 860px;
    }
    .hero {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid #262626;
    }
    h1 {
      margin: 28px 0 0;
      font-size: 26px;
      letter-spacing: -0.01em;
      color: #ffffff;
    }
    .tagline {
      margin: 6px 0 0;
      font-size: 15px;
      color: #b0b0b0;
    }
    p {
      margin: 18px 0 0;
      font-size: 14px;
      line-height: 1.65;
      color: #c8c8c8;
    }
    h2 {
      margin: 34px 0 10px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #888;
      font-weight: 700;
    }
    pre {
      margin: 0;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 12px;
      color: #d8d8d8;
      background: #0e0e0e;
      border: 1px solid #2e2e2e;
      border-radius: 4px;
      padding: 12px 14px;
      overflow-x: auto;
      line-height: 1.6;
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
    .links a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border: 1px solid #2e2e2e;
      border-radius: 4px;
      background: #1a1a1a;
      color: #e6e6e6;
      text-decoration: none;
      font-size: 13px;
    }
    .links a:hover {
      background: #232323;
      border-color: #3a3a3a;
    }
    .count {
      color: #888;
    }
    @media (max-width: 720px) {
      h1 {
        font-size: 22px;
      }
    }
  `;

  override render() {
    return html`
      <img
        class="hero"
        src="../assets/hero.png"
        alt="Components of the system scattered across a hexagon-tiled page, around the Hexagonal wordmark"
      />

      <h1>Hexagonal</h1>
      <p class="tagline">A design for a blue honeycomb world.</p>

      <p>
        A set of web components for e621 surfaces, designed with a more modern flair than its inspiration.
      </p>

      <h2>Use</h2>
      <pre>
&lt;script type="module" src="https://libs.cdn.clynamic.net/hexagonal/${__HEX_VERSION__}/hexagonal.min.js"&gt;&lt;/script&gt;</pre
      >

      <div class="links">
        <a href=${__HEX_REPO__}>Source on GitHub</a>
        <a href="${__HEX_REPO__}/releases">Releases <span class="count">v${__HEX_VERSION__}</span></a>
        <a href="${__HEX_REPO__}#readme">Readme</a>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "book-intro": BookIntro;
  }
}
