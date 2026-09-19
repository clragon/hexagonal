import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import { formatRelativeTime } from "../src/shared/relative-time.js";
import type { HexTime } from "../src/components/hex-time.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const NOW = new Date("2026-09-19T12:00:00Z");
const ago = (seconds: number) => new Date(NOW.getTime() - seconds * 1000);

async function mount(markup: string): Promise<HexTime> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  const el = host.firstElementChild as HexTime;
  document.body.append(host);
  mounted.push(host);
  await el.updateComplete;
  return el;
}

const inner = (el: HexTime) => el.renderRoot.querySelector("time") as HTMLTimeElement;

test("each bucket picks its own unit", () => {
  expect(formatRelativeTime(ago(30), NOW)).toBe("30 seconds ago");
  expect(formatRelativeTime(ago(60 * 5), NOW)).toBe("5 minutes ago");
  expect(formatRelativeTime(ago(60 * 60 * 3), NOW)).toBe("3 hours ago");
  expect(formatRelativeTime(ago(60 * 60 * 24 * 3), NOW)).toBe("3 days ago");
  expect(formatRelativeTime(ago(60 * 60 * 24 * 14), NOW)).toBe("2 weeks ago");
  expect(formatRelativeTime(ago(60 * 60 * 24 * 90), NOW)).toBe("3 months ago");
  expect(formatRelativeTime(ago(60 * 60 * 24 * 365 * 2), NOW)).toBe("2 years ago");
});

test("a future timestamp reads forwards", () => {
  const future = new Date(NOW.getTime() + 60 * 60 * 1000 * 2);
  expect(formatRelativeTime(future, NOW)).toBe("in 2 hours");
});

test("the element renders a time tag carrying the absolute value", async () => {
  const el = await mount(`<hex-time datetime="2020-01-02T03:04:05Z"></hex-time>`);
  const time = inner(el);
  expect(time.getAttribute("datetime")).toBe("2020-01-02T03:04:05.000Z");
  expect(time.getAttribute("title")).toBe(new Date("2020-01-02T03:04:05Z").toLocaleString());
  expect(time.textContent).toContain("ago");
});

test("absolute formats bypass the relative wording", async () => {
  const stamp = "2020-01-02T03:04:05Z";
  const date = await mount(`<hex-time format="date" datetime="${stamp}"></hex-time>`);
  const datetime = await mount(`<hex-time format="datetime" datetime="${stamp}"></hex-time>`);
  expect(inner(date).textContent).toBe(new Date(stamp).toLocaleDateString());
  expect(inner(datetime).textContent).toBe(new Date(stamp).toLocaleString());
});

test("an unparseable or missing datetime renders nothing", async () => {
  expect(inner(await mount(`<hex-time></hex-time>`))).toBe(null);
  expect(inner(await mount(`<hex-time datetime="not a date"></hex-time>`))).toBe(null);
});

test("the text inherits colour and font from its surroundings", async () => {
  const host = document.createElement("div");
  host.style.color = "rgb(255, 0, 0)";
  host.style.fontFamily = "monospace";
  host.innerHTML = `<hex-time datetime="2020-01-02T03:04:05Z"></hex-time>`;
  document.body.append(host);
  mounted.push(host);
  const el = host.firstElementChild as HexTime;
  await el.updateComplete;

  const style = getComputedStyle(inner(el));
  expect(style.color).toBe("rgb(255, 0, 0)");
  expect(style.fontFamily).toBe("monospace");
});
