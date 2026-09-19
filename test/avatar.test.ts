import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexAvatar } from "../src/components/hex-avatar.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function mount(markup: string): Promise<HexAvatar> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  const el = host.firstElementChild as HexAvatar;
  document.body.append(host);
  mounted.push(host);
  await el.updateComplete;
  await tick();
  await el.updateComplete;
  return el;
}

const box = (el: HexAvatar) => el.renderRoot.querySelector(".sq") as HTMLElement;
const fallback = (el: HexAvatar) => el.renderRoot.querySelector(".fallback") as HTMLElement;

const PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

test("the leading character of the name becomes the fallback", async () => {
  expect(fallback(await mount(`<hex-avatar name="velvet_otter"></hex-avatar>`)).textContent).toBe(
    "V",
  );
  expect(fallback(await mount(`<hex-avatar name="rowan"></hex-avatar>`)).textContent).toBe("R");
});

test("a blank name falls back to a question mark", async () => {
  expect(fallback(await mount(`<hex-avatar></hex-avatar>`)).textContent).toBe("?");
  expect(fallback(await mount(`<hex-avatar name="   "></hex-avatar>`)).textContent).toBe("?");
});

test("the fallback sits under the image rather than replacing it", async () => {
  const el = await mount(`<hex-avatar name="rowan" src="${PIXEL}"></hex-avatar>`);
  expect(fallback(el).textContent).toBe("R");
  expect(el.renderRoot.querySelector("img")).not.toBe(null);
  expect(getComputedStyle(fallback(el)).position).toBe("absolute");
});

test("an image that fails to load gives way to the letter", async () => {
  const el = await mount(`<hex-avatar name="rowan" src="/does-not-exist.png"></hex-avatar>`);
  await tick(120);
  await el.updateComplete;
  expect(el.renderRoot.querySelector("img")).toBe(null);
  expect(fallback(el).textContent).toBe("R");
});

test("a new src gets another chance after a failure", async () => {
  const el = await mount(`<hex-avatar name="rowan" src="/does-not-exist.png"></hex-avatar>`);
  await tick(120);
  await el.updateComplete;
  expect(el.renderRoot.querySelector("img")).toBe(null);

  el.src = PIXEL;
  await el.updateComplete;
  await tick(60);
  expect(el.renderRoot.querySelector("img")).not.toBe(null);
});

test("href turns the avatar into a real anchor", async () => {
  const el = await mount(`<hex-avatar name="rowan" href="/users/rowan"></hex-avatar>`);
  const anchor = box(el) as HTMLAnchorElement;
  expect(anchor.tagName).toBe("A");
  expect(anchor.getAttribute("href")).toBe("/users/rowan");
  expect(anchor.getAttribute("aria-label")).toBe("rowan");
});

test("without href it stays a plain box", async () => {
  expect(box(await mount(`<hex-avatar name="rowan"></hex-avatar>`)).tagName).toBe("DIV");
});

test("a new tab target gets a safe rel", async () => {
  const el = await mount(`<hex-avatar name="r" href="/x" target="_blank"></hex-avatar>`);
  expect(box(el).getAttribute("rel")).toBe("noopener noreferrer");
});

test("slotted content replaces the derived letter", async () => {
  const el = await mount(`<hex-avatar name="rowan"><span>OK</span></hex-avatar>`);
  const slot = fallback(el).querySelector("slot") as HTMLSlotElement;
  expect(slot.assignedNodes({ flatten: true })[0]?.textContent).toBe("OK");
});

test("the fallback is hidden from assistive technology", async () => {
  const el = await mount(`<hex-avatar name="rowan"></hex-avatar>`);
  expect(fallback(el).getAttribute("aria-hidden")).toBe("true");
});
