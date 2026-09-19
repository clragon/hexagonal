import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexError } from "../src/components/hex-error.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function mount(markup: string): Promise<HexError> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  const el = host.firstElementChild as HexError;
  document.body.append(host);
  mounted.push(host);
  await el.updateComplete;
  await tick();
  await el.updateComplete;
  return el;
}

const panel = (el: HexError) => el.renderRoot.querySelector(".panel") as HTMLElement;

test("the panel announces itself assertively", async () => {
  const el = await mount(`<hex-error heading="Something went wrong"></hex-error>`);
  expect(panel(el).getAttribute("role")).toBe("alert");
});

test("crash is the default treatment and carries the stripes", async () => {
  const el = await mount(`<hex-error heading="Broken"></hex-error>`);
  expect(el.variant).toBe("crash");
  expect(getComputedStyle(panel(el)).backgroundImage).toContain("repeating-linear-gradient");
});

test("hint drops the stripes and shows the glyph", async () => {
  const el = await mount(`<hex-error variant="hint" heading="503"></hex-error>`);
  expect(getComputedStyle(panel(el)).backgroundImage).toBe("none");
  const icon = el.renderRoot.querySelector("hex-icon") as HTMLElement;
  expect(getComputedStyle(icon).display).not.toBe("none");
});

test("crash hides the glyph so the stripes carry the signal", async () => {
  const el = await mount(`<hex-error heading="Broken"></hex-error>`);
  const icon = el.renderRoot.querySelector("hex-icon") as HTMLElement;
  expect(getComputedStyle(icon).display).toBe("none");
});

test("the body collapses when nothing is slotted", async () => {
  const empty = await mount(`<hex-error heading="Broken"></hex-error>`);
  const filled = await mount(`<hex-error heading="Broken">Tell us about it.</hex-error>`);
  expect((empty.renderRoot.querySelector(".body") as HTMLElement).hidden).toBe(true);
  expect((filled.renderRoot.querySelector(".body") as HTMLElement).hidden).toBe(false);
});

test("the heading is omitted when unset", async () => {
  const el = await mount(`<hex-error>Body only.</hex-error>`);
  expect(el.renderRoot.querySelector(".heading")).toBe(null);
});
