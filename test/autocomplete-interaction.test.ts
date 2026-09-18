import { afterEach, expect, test, vi } from "vitest";
import "../src/index.js";
import type { HexAutocomplete } from "../src/components/hex-autocomplete.js";

const mounted: HexAutocomplete[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function field(props: Partial<HexAutocomplete> = {}) {
  const el = document.createElement("hex-autocomplete") as HexAutocomplete;
  el.delay = 0;
  Object.assign(el, props);
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  return el;
}

const input = (el: HexAutocomplete) => el.renderRoot.querySelector("input") as HTMLInputElement;

async function type(el: HexAutocomplete, value: string) {
  input(el).value = value;
  input(el).dispatchEvent(new Event("input", { bubbles: true }));
  await tick(20);
}

function press(el: HexAutocomplete, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  input(el).dispatchEvent(event);
  return event;
}

const shown = (el: HexAutocomplete) =>
  [...el.renderRoot.querySelectorAll("hex-option")].map((o) => o.getAttribute("value"));
const expanded = (el: HexAutocomplete) => input(el).getAttribute("aria-expanded") === "true";
const activeId = (el: HexAutocomplete) => input(el).getAttribute("aria-activedescendant");

const FRUIT = ["apple", "apricot", "banana", "cherry"];

test("a plain source filters by substring without any provider", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");
  expect(shown(el)).toEqual(["apple", "apricot"]);
});

test("source matching ignores case", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "AP");
  expect(shown(el)).toEqual(["apple", "apricot"]);
});

test("source matching is a substring, not a prefix", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "err");
  expect(shown(el)).toEqual(["cherry"]);
});

test("arrow down walks the list and points the input at the highlighted option", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");

  press(el, "ArrowDown");
  await tick();
  const first = activeId(el);
  expect(first).toBeTruthy();
  expect((el.renderRoot as ShadowRoot).getElementById(first as string)).not.toBeNull();

  press(el, "ArrowDown");
  await tick();
  expect(activeId(el)).not.toBe(first);
});

test("arrow down past the end passes through nothing-selected", async () => {
  const el = await field({ source: ["only"] });
  await type(el, "on");

  press(el, "ArrowDown");
  await tick();
  expect(activeId(el)).toBeTruthy();

  press(el, "ArrowDown");
  await tick();
  expect(activeId(el)).toBeNull();
});

test("enter commits the highlighted option into the field", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");
  press(el, "ArrowDown");
  await tick();
  press(el, "Enter");
  await tick(20);

  expect(el.value).toBe("apple");
  expect(expanded(el)).toBe(false);
});

test("enter with nothing highlighted is left to the form", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");

  const event = press(el, "Enter");
  await tick(20);

  expect(event.defaultPrevented).toBe(false);
  expect(el.value).toBe("ap");
});

test("tab with nothing highlighted takes the first result", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");

  press(el, "Tab");
  await tick(20);

  expect(el.value).toBe("apple");
});

test("escape closes the list and leaves the typed text alone", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");
  expect(expanded(el)).toBe(true);

  press(el, "Escape");
  await tick(20);

  expect(expanded(el)).toBe(false);
  expect(el.value).toBe("ap");
});

test("committing announces the chosen item once", async () => {
  const el = await field({ source: FRUIT });
  const chosen: string[] = [];
  el.addEventListener("hex-select", (e) => chosen.push((e as CustomEvent).detail.value));

  await type(el, "ap");
  press(el, "ArrowDown");
  await tick();
  press(el, "Enter");
  await tick(20);

  expect(chosen).toEqual(["apple"]);
});

test("holding ctrl while committing keeps the list open for another pick", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");
  press(el, "ArrowDown");
  await tick();
  press(el, "Enter", { ctrlKey: true });
  await tick(30);

  expect(el.value).toBe("apple");
  expect(expanded(el)).toBe(true);
});

test("no matches closes the list when there is nothing to say", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "zzz");

  expect(expanded(el)).toBe(false);
  expect(shown(el)).toEqual([]);
});

test("no matches keeps the list open to show the empty message", async () => {
  const el = await field({ source: FRUIT, empty: "No fruit found" });
  await type(el, "zzz");

  expect(expanded(el)).toBe(true);
  expect(el.renderRoot.querySelector("hex-listbox")?.empty).toBe("No fruit found");
});

test("the input declares itself a combobox wired to its listbox", async () => {
  const el = await field({ source: FRUIT });
  const controls = input(el).getAttribute("aria-controls");

  expect(input(el).getAttribute("role")).toBe("combobox");
  expect(input(el).getAttribute("aria-autocomplete")).toBe("list");
  expect(input(el).getAttribute("autocomplete")).toBe("off");
  expect(controls).toBeTruthy();
  expect((el.renderRoot as ShadowRoot).getElementById(controls as string)).not.toBeNull();
});

test("the result count is announced politely while the list is open", async () => {
  const el = await field({ source: FRUIT });
  const status = el.renderRoot.querySelector('[role="status"]');
  expect(status?.getAttribute("aria-live")).toBe("polite");
  expect(status?.textContent?.trim()).toBe("");

  await type(el, "ap");
  expect(status?.textContent?.trim()).toBe("2 results");
});

test("arrow down reopens a list that was closed without retyping", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");
  press(el, "Escape");
  await tick(20);
  expect(expanded(el)).toBe(false);

  press(el, "ArrowDown");
  await tick(20);

  expect(expanded(el)).toBe(true);
});

test("leaving the field closes the list", async () => {
  const el = await field({ source: FRUIT });
  await type(el, "ap");
  expect(expanded(el)).toBe(true);

  input(el).dispatchEvent(new FocusEvent("blur", { bubbles: true }));
  await tick(250);

  expect(expanded(el)).toBe(false);
});

test("a disabled field never queries", async () => {
  const search = vi.fn(() => []);
  const el = await field({ provider: { search }, disabled: true });
  await type(el, "abc");

  expect(search).not.toHaveBeenCalled();
});

test("resetting the owning form clears the field and closes the list", async () => {
  const form = document.createElement("form");
  document.body.append(form);
  mounted.push(form as unknown as HexAutocomplete);

  const el = document.createElement("hex-autocomplete") as HexAutocomplete;
  el.delay = 0;
  el.name = "tag";
  el.source = FRUIT;
  form.append(el);
  await el.updateComplete;

  await type(el, "ap");
  expect(expanded(el)).toBe(true);

  form.reset();
  await el.updateComplete;

  expect(el.value).toBe("");
  expect(expanded(el)).toBe(false);
});
