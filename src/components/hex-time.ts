import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HexElement } from "../shared/base.js";
import { formatRelativeTime, relativeTimeInterval } from "../shared/relative-time.js";

export type HexTimeFormat = "relative" | "datetime" | "date";

@customElement("hex-time")
export class HexTime extends HexElement {
  static preflight = {
    base: { display: "inline", visibility: "hidden" },
    variants: [],
  };

  static override styles = [
    HexElement.styles,
    css`
      :host {
        display: inline;
        font: inherit;
        color: inherit;
        line-height: inherit;
      }
      time {
        font: inherit;
        color: inherit;
      }
    `,
  ];

  @property({ type: String }) datetime = "";
  @property({ type: String }) format: HexTimeFormat = "relative";
  @property({ type: Boolean, reflect: true }) live = false;

  @state() private tick = 0;

  private timer?: ReturnType<typeof setTimeout>;

  private get value(): Date | null {
    if (!this.datetime) return null;
    const parsed = new Date(this.datetime);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("live") || changed.has("datetime") || changed.has("format")) this.schedule();
  }

  private stop() {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private schedule() {
    this.stop();
    const value = this.value;
    if (!this.live || !value || this.format !== "relative") return;
    this.timer = setTimeout(() => {
      this.tick++;
      this.schedule();
    }, relativeTimeInterval(value));
  }

  private text(value: Date): string {
    if (this.format === "date") return value.toLocaleDateString();
    if (this.format === "datetime") return value.toLocaleString();
    return formatRelativeTime(value);
  }

  override render() {
    const value = this.value;
    if (!value) return nothing;
    return html`<time datetime=${value.toISOString()} title=${value.toLocaleString()}
      >${this.text(value)}</time
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hex-time": HexTime;
  }
}
