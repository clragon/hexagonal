import { afterEach, expect, test } from "vitest";
import "../src/components/hex-select.js";
import type { HexSelect } from "../src/components/hex-select.js";

const mounted: HexSelect[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function select(inner: string, props: Partial<HexSelect> = {}) {
  const el = document.createElement("hex-select") as HexSelect;
  el.innerHTML = inner;
  Object.assign(el, props);
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  await tick();
  await el.updateComplete;
  return el;
}

const REGIONS = `<option value="eu">Europe</option><option value="us">North America</option><option value="ap">Asia Pacific</option>`;

const trigger = (el: HexSelect) => el.renderRoot.querySelector("button") as HTMLButtonElement;
const shownValue = (el: HexSelect) =>
  el.renderRoot.querySelector(".value")?.textContent?.trim() ?? "";
const key = (el: HexSelect, k: string) =>
  trigger(el).dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

test("the trigger reports collapsed until it is opened", async () => {
  const el = await select(REGIONS);
  expect(trigger(el).getAttribute("aria-expanded")).toBe("false");

  trigger(el).click();
  await el.updateComplete;

  expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
});

test("clicking the trigger again closes it", async () => {
  const el = await select(REGIONS);
  trigger(el).click();
  await el.updateComplete;
  trigger(el).click();
  await el.updateComplete;

  expect(trigger(el).getAttribute("aria-expanded")).toBe("false");
});

test("arrow down opens the list and highlights the first option", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowDown");
  await tick(20);

  expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(0);
});

test("arrow up opens the list and highlights the last option", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowUp");
  await tick(20);

  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(2);
});

test("opening an already-chosen select highlights the current choice", async () => {
  const el = await select(REGIONS, { value: "ap" });
  key(el, "ArrowDown");
  await tick(20);

  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(2);
});

test("enter commits the highlighted option and closes", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowDown");
  await tick(20);
  key(el, "ArrowDown");
  key(el, "Enter");
  await tick(20);

  expect(el.value).toBe("us");
  expect(trigger(el).getAttribute("aria-expanded")).toBe("false");
});

test("committing a choice announces it once with the new value", async () => {
  const el = await select(REGIONS);
  const seen: string[] = [];
  el.addEventListener("hex-change", (e) => seen.push((e as CustomEvent).detail.value));

  key(el, "ArrowDown");
  await tick(20);
  key(el, "Enter");
  await tick(20);

  expect(seen).toEqual(["eu"]);
});

test("re-choosing the value already set announces nothing", async () => {
  const el = await select(REGIONS, { value: "eu" });
  const seen: string[] = [];
  el.addEventListener("hex-change", (e) => seen.push((e as CustomEvent).detail.value));

  key(el, "ArrowDown");
  await tick(20);
  key(el, "Enter");
  await tick(20);

  expect(seen).toEqual([]);
});

test("escape closes without changing the value", async () => {
  const el = await select(REGIONS, { value: "eu" });
  key(el, "ArrowDown");
  await tick(20);
  key(el, "ArrowDown");
  key(el, "Escape");
  await tick(20);

  expect(el.value).toBe("eu");
  expect(trigger(el).getAttribute("aria-expanded")).toBe("false");
});

test("home and end jump to the ends of the list", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowDown");
  await tick(20);
  key(el, "End");
  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(2);
  key(el, "Home");
  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(0);
});

test("typing a letter while closed opens the list on the matching option", async () => {
  const el = await select(REGIONS);
  key(el, "n");
  await tick(30);

  expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(1);
});

test("typing while open moves the highlight to the matching option", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowDown");
  await tick(20);
  key(el, "a");
  await tick(10);

  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(2);
});

test("the placeholder shows until a choice is made", async () => {
  const el = await select(REGIONS, { placeholder: "Choose a region" });
  expect(shownValue(el)).toBe("Choose a region");

  el.value = "us";
  await el.updateComplete;

  expect(shownValue(el)).toBe("North America");
});

test("a disabled option cannot be committed", async () => {
  const el = await select(
    `<option value="eu">Europe</option><option value="us" disabled>North America</option>`,
  );
  const listbox = el.renderRoot.querySelector("hex-listbox")!;
  listbox.activate(1);
  expect(listbox.selectActive()).toBe(false);
  expect(el.value).toBe("");
});

test("options added after mount are picked up", async () => {
  const el = await select(`<option value="eu">Europe</option>`);
  expect(el.renderRoot.querySelectorAll("hex-option")).toHaveLength(1);

  el.insertAdjacentHTML("beforeend", `<option value="us">North America</option>`);
  await tick(20);
  await el.updateComplete;

  expect(el.renderRoot.querySelectorAll("hex-option")).toHaveLength(2);
});

test("plain options carry category and count through data attributes", async () => {
  const el = await select(
    `<option value="wolf" data-category="species" data-count="88400">wolf</option>`,
  );
  const option = el.renderRoot.querySelector("hex-option")!;

  expect(option.getAttribute("category")).toBe("species");
  expect(option.getAttribute("count")).toBe("88400");
});

test("rich option children are used in place of plain options", async () => {
  const el = await select(
    `<hex-option value="wolf" label="wolf" category="species" count="88400" antecedent="canis"></hex-option>`,
  );
  const option = el.renderRoot.querySelector("hex-option")!;

  expect(option.getAttribute("label")).toBe("wolf");
  expect(option.getAttribute("category")).toBe("species");
  expect(option.getAttribute("antecedent")).toBe("canis");
});

test("the trigger points at the option it has highlighted", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowDown");
  await tick(20);

  const id = trigger(el).getAttribute("aria-activedescendant");
  expect(id).toBeTruthy();
  expect((el.renderRoot as ShadowRoot).getElementById(id as string)).not.toBeNull();
});

test("the highlight pointer is dropped when the list closes", async () => {
  const el = await select(REGIONS);
  key(el, "ArrowDown");
  await tick(20);
  key(el, "Escape");
  await tick(20);

  expect(trigger(el).hasAttribute("aria-activedescendant")).toBe(false);
});
