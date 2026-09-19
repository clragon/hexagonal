import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexButton } from "../src/components/hex-button.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function mount(markup: string): Promise<HexButton> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  const el = host.firstElementChild as HexButton;
  document.body.append(host);
  mounted.push(host);
  await el.updateComplete;
  await tick();
  await el.updateComplete;
  return el;
}

const base = (el: HexButton) => el.renderRoot.querySelector(".base") as HTMLElement;

test("without href it stays a button", async () => {
  const el = await mount(`<hex-button>Save</hex-button>`);
  expect(base(el).tagName).toBe("BUTTON");
});

test("with href it becomes a real anchor", async () => {
  const el = await mount(`<hex-button href="/posts/42">Open</hex-button>`);
  const anchor = base(el) as HTMLAnchorElement;
  expect(anchor.tagName).toBe("A");
  expect(anchor.getAttribute("href")).toBe("/posts/42");
  expect(anchor.hasAttribute("type")).toBe(false);
});

test("the anchor keeps the button styling hooks", async () => {
  const el = await mount(`<hex-button href="/x" variant="outline">Open</hex-button>`);
  const anchor = base(el);
  expect(anchor.getAttribute("part")).toBe("base");
  expect(getComputedStyle(anchor).borderStyle).toBe("solid");
});

test("a new tab target gets a safe rel, and an explicit rel wins", async () => {
  const blank = await mount(`<hex-button href="/x" target="_blank">Open</hex-button>`);
  expect(blank.renderRoot.querySelector("a")?.getAttribute("rel")).toBe("noopener noreferrer");

  const explicit = await mount(
    `<hex-button href="/x" target="_blank" rel="nofollow">Open</hex-button>`,
  );
  expect(explicit.renderRoot.querySelector("a")?.getAttribute("rel")).toBe("nofollow");

  const same = await mount(`<hex-button href="/x">Open</hex-button>`);
  expect(same.renderRoot.querySelector("a")?.hasAttribute("rel")).toBe(false);
});

test("a disabled link drops its href and leaves the tab order", async () => {
  const el = await mount(`<hex-button href="/x" disabled>Open</hex-button>`);
  const anchor = base(el);
  expect(anchor.hasAttribute("href")).toBe(false);
  expect(anchor.getAttribute("aria-disabled")).toBe("true");
  expect(anchor.getAttribute("tabindex")).toBe("-1");
});

test("a loading link is inert the same way", async () => {
  const el = await mount(`<hex-button href="/x" loading>Open</hex-button>`);
  expect(base(el).hasAttribute("href")).toBe(false);
  expect(base(el).getAttribute("aria-busy")).toBe("true");
});

test("a link does not submit the form around it", async () => {
  const form = document.createElement("form");
  form.innerHTML = `<hex-button href="/x" type="submit">Go</hex-button>`;
  document.body.append(form);
  mounted.push(form);
  let submitted = false;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitted = true;
  });
  const el = form.firstElementChild as HexButton;
  await el.updateComplete;
  await tick();

  const anchor = base(el);
  anchor.addEventListener("click", (e) => e.preventDefault());
  anchor.click();
  await tick();
  expect(submitted).toBe(false);
});

test("forwarded aria reaches the anchor", async () => {
  const el = await mount(`<hex-button href="/x" icon-only aria-label="Open post"></hex-button>`);
  expect(base(el).getAttribute("aria-label")).toBe("Open post");
});
