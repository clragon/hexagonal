import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexListbox } from "../src/components/hex-listbox.js";
import type { HexOption } from "../src/components/hex-option.js";
import type { HexAutocomplete } from "../src/components/hex-autocomplete.js";
import type { HexSelect } from "../src/components/hex-select.js";
import type { HexInput } from "../src/components/hex-input.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function mount<T extends HTMLElement>(tag: string, inner = "", props: Record<string, unknown> = {}) {
  const el = document.createElement(tag) as T;
  el.innerHTML = inner;
  Object.assign(el, props);
  document.body.append(el);
  mounted.push(el);
  return el;
}

const OPTIONS = `<hex-option value="a" label="a"></hex-option><hex-option value="b" label="b"></hex-option><hex-option value="c" label="c" disabled></hex-option>`;

test("clicking an option selects it", async () => {
  const el = mount<HexListbox>("hex-listbox", OPTIONS);
  await el.updateComplete;
  const chosen: string[] = [];
  el.addEventListener("hex-select", (e) => chosen.push((e as CustomEvent).detail.value));

  (el.querySelectorAll("hex-option")[1] as HexOption).click();
  await el.updateComplete;

  expect(chosen).toEqual(["b"]);
  expect(el.value).toBe("b");
});

test("clicking an option also moves the highlight to it", async () => {
  const el = mount<HexListbox>("hex-listbox", OPTIONS);
  await el.updateComplete;

  (el.querySelectorAll("hex-option")[1] as HexOption).click();
  await el.updateComplete;

  expect(el.activeIndex).toBe(1);
});

test("clicking a disabled option does nothing", async () => {
  const el = mount<HexListbox>("hex-listbox", OPTIONS);
  await el.updateComplete;
  const chosen: string[] = [];
  el.addEventListener("hex-select", (e) => chosen.push((e as CustomEvent).detail.value));

  (el.querySelectorAll("hex-option")[2] as HexOption).click();
  await el.updateComplete;

  expect(chosen).toEqual([]);
  expect(el.value).toBe("");
});

test("clicking the gap between options selects nothing", async () => {
  const el = mount<HexListbox>("hex-listbox", OPTIONS);
  await el.updateComplete;
  const chosen: string[] = [];
  el.addEventListener("hex-select", (e) => chosen.push((e as CustomEvent).detail.value));

  el.click();
  await el.updateComplete;

  expect(chosen).toEqual([]);
});

test("pressing on the autocomplete panel does not pull focus out of the input", async () => {
  const el = mount<HexAutocomplete>("hex-autocomplete", "", { delay: 0, source: ["alpha"] });
  await el.updateComplete;
  const input = el.renderRoot.querySelector("input") as HTMLInputElement;
  input.value = "al";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await tick(20);

  const panel = el.renderRoot.querySelector("hex-popover") as HTMLElement;
  const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
  panel.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
});

test("pressing on the select panel does not pull focus off the trigger", async () => {
  const el = mount<HexSelect>("hex-select", `<option value="a">A</option>`);
  await el.updateComplete;
  await tick();

  const panel = el.renderRoot.querySelector("hex-popover") as HTMLElement;
  const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
  panel.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
});

test("arrow up walks backwards through an open autocomplete", async () => {
  const el = mount<HexAutocomplete>("hex-autocomplete", "", {
    delay: 0,
    source: ["alpha", "alpine", "also"],
  });
  await el.updateComplete;
  const input = el.renderRoot.querySelector("input") as HTMLInputElement;
  input.value = "al";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await tick(20);

  const key = (k: string) =>
    input.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));

  key("ArrowDown");
  key("ArrowDown");
  await tick();
  const second = el.renderRoot.querySelector("hex-listbox")!.activeIndex;
  key("ArrowUp");
  await tick();

  expect(second).toBe(1);
  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(0);
});

test("arrow up walks backwards through an open select", async () => {
  const el = mount<HexSelect>(
    "hex-select",
    `<option value="a">A</option><option value="b">B</option><option value="c">C</option>`,
  );
  await el.updateComplete;
  await tick();
  const trigger = el.renderRoot.querySelector("button") as HTMLButtonElement;
  const key = (k: string) =>
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));

  key("ArrowDown");
  await tick(20);
  key("ArrowDown");
  key("ArrowUp");
  await tick();

  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(0);
});

test("tab closes an open select without reverting the value", async () => {
  const el = mount<HexSelect>(
    "hex-select",
    `<option value="a">A</option><option value="b">B</option>`,
    { value: "b" },
  );
  await el.updateComplete;
  await tick();
  const trigger = el.renderRoot.querySelector("button") as HTMLButtonElement;

  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  await tick(20);
  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
  await tick(20);

  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(el.value).toBe("b");
});

test("focusing the host reaches the control inside a field", async () => {
  for (const [tag, inner, sel] of [
    ["hex-input", "", "input"],
    ["hex-autocomplete", "", "input"],
    ["hex-select", `<option value="a">A</option>`, "button"],
  ] as const) {
    const el = mount<HexInput>(tag, inner);
    await el.updateComplete;
    await tick();

    el.focus();
    const inner_ = el.renderRoot.querySelector(sel);
    expect((el.renderRoot as ShadowRoot).activeElement, `${tag} did not focus its ${sel}`).toBe(inner_);
  }
});

test("typeahead ignores keys that are not a single printable character", async () => {
  const el = mount<HexListbox>("hex-listbox", OPTIONS);
  await el.updateComplete;

  expect(el.typeahead("ab")).toBe(false);
  expect(el.typeahead(" ")).toBe(false);
  expect(el.typeahead("")).toBe(false);
  expect(el.activeIndex).toBe(-1);
});

test("typeahead accumulates while typing quickly", async () => {
  const el = mount<HexListbox>(
    "hex-listbox",
    `<hex-option value="ba" label="ba"></hex-option><hex-option value="bb" label="bb"></hex-option>`,
  );
  await el.updateComplete;

  expect(el.typeahead("b")).toBe(true);
  expect(el.activeIndex).toBe(0);
  expect(el.typeahead("b")).toBe(true);
  expect(el.activeIndex).toBe(1);
});

test("the typeahead buffer is dropped after a pause", async () => {
  const el = mount<HexListbox>(
    "hex-listbox",
    `<hex-option value="ba" label="ba"></hex-option><hex-option value="ab" label="ab"></hex-option>`,
  );
  await el.updateComplete;

  expect(el.typeahead("b")).toBe(true);
  expect(el.activeIndex).toBe(0);

  await tick(600);

  expect(el.typeahead("a"), "a stale buffer would have searched for ba").toBe(true);
  expect(el.activeIndex).toBe(1);
});

test("typing without a pause keeps extending the same search", async () => {
  const el = mount<HexListbox>(
    "hex-listbox",
    `<hex-option value="ba" label="ba"></hex-option><hex-option value="ab" label="ab"></hex-option>`,
  );
  await el.updateComplete;

  expect(el.typeahead("b")).toBe(true);
  expect(el.typeahead("a")).toBe(true);
  expect(el.activeIndex).toBe(0);
});

test("typeahead reports when nothing matches", async () => {
  const el = mount<HexListbox>("hex-listbox", OPTIONS);
  await el.updateComplete;

  expect(el.typeahead("z")).toBe(false);
  expect(el.activeIndex).toBe(-1);
});

test("a control exposes the label pointing at it", async () => {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<label for="cluster">Cluster</label><hex-input id="cluster" name="c"></hex-input>`;
  document.body.append(wrap);
  mounted.push(wrap);
  const el = wrap.querySelector("hex-input") as HexInput;
  await el.updateComplete;

  expect([...el.labels]).toHaveLength(1);
  expect((el.labels[0] as HTMLLabelElement).textContent).toBe("Cluster");
});

test("a control exposes the reason it is invalid", async () => {
  const el = mount<HexInput>("hex-input", "", { name: "a", required: true });
  await el.updateComplete;

  expect(el.validity.valid).toBe(false);
  expect(el.validity.valueMissing).toBe(true);
  expect(el.reportValidity()).toBe(false);

  el.value = "filled";
  await el.updateComplete;

  expect(el.validity.valid).toBe(true);
  expect(el.reportValidity()).toBe(true);
});

test("a custom validity message is applied and can be cleared", async () => {
  const el = mount<HexInput>("hex-input", "", { name: "a" });
  await el.updateComplete;

  el.setCustomValidity("Taken");
  expect(el.checkValidity()).toBe(false);
  expect(el.validationMessage).toBe("Taken");

  el.setCustomValidity("");
  expect(el.checkValidity()).toBe(true);
});

test("an external label activates the control it points at", async () => {
  const form = document.createElement("form");
  form.innerHTML = `
    <label for="cb" id="lcb">Enable</label><hex-checkbox id="cb" name="t" value="on"></hex-checkbox>
    <label for="sw" id="lsw">Notify</label><hex-switch id="sw" name="n" value="on"></hex-switch>
    <label for="rd" id="lrd">Standard</label><hex-radio id="rd" name="tier" value="a"></hex-radio>`;
  document.body.append(form);
  mounted.push(form as unknown as HexListbox);
  await tick(30);

  for (const id of ["lcb", "lsw", "lrd"]) {
    (form.querySelector(`#${id}`) as HTMLLabelElement).click();
    await tick(20);
  }

  expect([...new FormData(form).entries()].map(([k, v]) => `${k}=${v}`)).toEqual([
    "t=on",
    "n=on",
    "tier=a",
  ]);
});

test("an external label leaves a disabled control alone", async () => {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<label for="d" id="ld">Disabled</label><hex-checkbox id="d" disabled></hex-checkbox>`;
  document.body.append(wrap);
  mounted.push(wrap as unknown as HexListbox);
  await tick(30);

  (wrap.querySelector("#ld") as HTMLLabelElement).click();
  await tick(20);

  expect((wrap.querySelector("#d") as HexInput & { checked: boolean }).checked).toBe(false);
});

test("clicking the control itself toggles it once, not twice", async () => {
  const el = mount<HexInput & { checked: boolean }>("hex-checkbox", "Enable");
  await el.updateComplete;
  await tick(20);

  expect(el.checked).toBe(false);
  el.click();
  await tick(30);
  expect(el.checked).toBe(true);
  el.click();
  await tick(30);
  expect(el.checked).toBe(false);
});
