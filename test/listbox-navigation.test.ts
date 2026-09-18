import { afterEach, expect, test } from "vitest";
import "../src/components/hex-listbox.js";
import type { HexListbox } from "../src/components/hex-listbox.js";

const mounted: HexListbox[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

async function listbox(...options: (string | { label: string; disabled: boolean })[]) {
  const el = document.createElement("hex-listbox") as HexListbox;
  el.innerHTML = options
    .map((o) => {
      const { label, disabled } = typeof o === "string" ? { label: o, disabled: false } : o;
      return `<hex-option value="${label}" label="${label}"${disabled ? " disabled" : ""}></hex-option>`;
    })
    .join("");
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  await Promise.all(el.options.map((o) => o.updateComplete));
  return el;
}

test("first forward step from nothing selected lands on index 0", async () => {
  const el = await listbox("a", "b", "c");
  el.move(1);
  expect(el.activeIndex).toBe(0);
});

test("forward past the end wraps to the start", async () => {
  const el = await listbox("a", "b", "c");
  el.activate(2);
  el.move(1);
  expect(el.activeIndex).toBe(0);
});

test("backward from nothing selected lands on the last option", async () => {
  const el = await listbox("a", "b", "c");
  el.move(-1);
  expect(el.activeIndex).toBe(2);
});

test("backward past the start wraps to the end", async () => {
  const el = await listbox("a", "b", "c");
  el.activate(0);
  el.move(-1);
  expect(el.activeIndex).toBe(2);
});

test("allowEmpty passes through nothing-selected instead of wrapping", async () => {
  const el = await listbox("a", "b", "c");
  el.activate(2);
  el.move(1, true);
  expect(el.activeIndex).toBe(-1);
});

test("allowEmpty resumes from the end after passing through", async () => {
  const el = await listbox("a", "b", "c");
  el.activate(-1);
  el.move(-1, true);
  expect(el.activeIndex).toBe(2);
});

test("a disabled option in the middle is stepped over", async () => {
  const el = await listbox("a", { label: "b", disabled: true }, "c");
  el.activate(0);
  el.move(1);
  expect(el.activeIndex).toBe(2);
});

test("consecutive disabled options are all stepped over", async () => {
  const el = await listbox("a", { label: "b", disabled: true }, { label: "c", disabled: true }, "d");
  el.activate(0);
  el.move(1);
  expect(el.activeIndex).toBe(3);
});

test("a disabled option is stepped over when wrapping", async () => {
  const el = await listbox({ label: "a", disabled: true }, "b", "c");
  el.activate(2);
  el.move(1);
  expect(el.activeIndex).toBe(1);
});

test("an all-disabled list selects nothing", async () => {
  const el = await listbox({ label: "a", disabled: true }, { label: "b", disabled: true });
  el.move(1);
  expect(el.activeIndex).toBe(-1);
});

test("an empty list selects nothing", async () => {
  const el = await listbox();
  el.move(1);
  expect(el.activeIndex).toBe(-1);
});

test("first and last skip disabled edges", async () => {
  const el = await listbox({ label: "a", disabled: true }, "b", "c", { label: "d", disabled: true });
  el.first();
  expect(el.activeIndex).toBe(1);
  el.last();
  expect(el.activeIndex).toBe(2);
});

test("selecting an active option emits its value and refuses a disabled one", async () => {
  const el = await listbox("a", { label: "b", disabled: true }, "c");
  const seen: string[] = [];
  el.addEventListener("hex-select", (e) => seen.push((e as CustomEvent).detail.value));

  el.activate(0);
  expect(el.selectActive()).toBe(true);

  el.activate(1);
  expect(el.selectActive()).toBe(false);

  expect(seen).toEqual(["a"]);
});

test("activating by value finds the matching option and ignores an unknown one", async () => {
  const el = await listbox("a", "b", "c");
  el.activateByValue("c");
  expect(el.activeIndex).toBe(2);
  el.activateByValue("nope");
  expect(el.activeIndex).toBe(2);
});

test("the active option is marked so only one is active at a time", async () => {
  const el = await listbox("a", "b", "c");
  el.activate(1);
  await el.updateComplete;
  expect(el.options.map((o) => o.active)).toEqual([false, true, false]);
});
