import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexSpoiler } from "../src/components/hex-spoiler.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function spoiler(inner: string, revealed = false) {
  const el = document.createElement("hex-spoiler") as HexSpoiler;
  el.innerHTML = inner;
  if (revealed) el.setAttribute("revealed", "");
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  return el;
}

const isConcealed = (el: HexSpoiler) => {
  const filter = getComputedStyle(el).filter;
  return filter !== "none" && filter !== "";
};

test("content whose colour is not inherited is still concealed", async () => {
  for (const markup of [
    `plain words`,
    `<a href="#" style="color:#b4c7d9">a secret link</a>`,
    `<hex-tag category="artist">artist_name</hex-tag>`,
    `<img src="/assets/logo-mark.svg" width="40" height="18" alt="">`,
    `<span style="color:#ff0000">red text</span>`,
  ]) {
    const el = await spoiler(markup);
    expect(isConcealed(el), `not concealed: ${markup}`).toBe(true);
    el.remove();
  }
});

test("revealing lifts the concealment", async () => {
  const el = await spoiler(`<a href="#">link</a>`);
  expect(isConcealed(el)).toBe(true);

  el.click();
  await el.updateComplete;
  await tick(250);

  expect(el.hasAttribute("revealed")).toBe(true);
  expect(isConcealed(el)).toBe(false);
});

test("hidden content is kept out of the tab order and announced as a spoiler", async () => {
  const el = await spoiler(`<a href="#" id="inner">link</a>`);
  const content = el.renderRoot.querySelector(".content") as HTMLElement;

  expect(content.hasAttribute("inert")).toBe(true);
  expect(el.getAttribute("aria-label")).toBe("Spoiler, activate to reveal");

  el.click();
  await el.updateComplete;

  expect(content.hasAttribute("inert")).toBe(false);
  expect(el.hasAttribute("aria-label")).toBe(false);
});

test("hovering does not reveal", async () => {
  const el = await spoiler("secret");
  el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  await tick(30);

  expect(el.hasAttribute("revealed")).toBe(false);
  expect(isConcealed(el)).toBe(true);
});

test("following a link inside a revealed spoiler does not re-conceal it", async () => {
  const el = await spoiler(`<a href="#somewhere" id="inner">link</a>`);
  el.click();
  await el.updateComplete;
  expect(el.hasAttribute("revealed")).toBe(true);

  (el.querySelector("#inner") as HTMLAnchorElement).click();
  await el.updateComplete;
  await tick(20);

  expect(el.hasAttribute("revealed")).toBe(true);
});

test("concealed text cannot be selected", async () => {
  const el = await spoiler("secret words");
  expect(getComputedStyle(el).userSelect).toBe("none");

  el.click();
  await el.updateComplete;

  expect(getComputedStyle(el).userSelect).not.toBe("none");
});
