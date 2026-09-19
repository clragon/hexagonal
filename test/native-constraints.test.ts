import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexInput } from "../src/components/hex-input.js";
import type { HexTextarea } from "../src/components/hex-textarea.js";
import type { HexSwitch } from "../src/components/hex-switch.js";
import type { HexRadioGroup } from "../src/components/hex-radio-group.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function mount<T extends HTMLElement>(markup: string): Promise<T> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  const el = host.firstElementChild as T;
  document.body.append(host);
  mounted.push(host);
  await tick(20);
  await (el as T & { updateComplete: Promise<unknown> }).updateComplete;
  return el;
}

const inner = (el: HTMLElement, tag = "input") =>
  (el as HTMLElement & { renderRoot: ShadowRoot }).renderRoot.querySelector(tag) as
    | HTMLInputElement
    | HTMLTextAreaElement;

test("numeric bounds reach the control and take part in validation", async () => {
  const el = await mount<HexInput>(
    `<hex-input type="number" min="0" max="10" step="0.5" value="99"></hex-input>`,
  );
  const control = inner(el) as HTMLInputElement;

  expect(control.min).toBe("0");
  expect(control.max).toBe("10");
  expect(control.step).toBe("0.5");
  expect(el.checkValidity()).toBe(false);
  expect(el.validity.rangeOverflow).toBe(true);

  el.value = "2.5";
  await el.updateComplete;
  expect(el.checkValidity()).toBe(true);
});

test("step allows the any keyword", async () => {
  const el = await mount<HexInput>(`<hex-input type="number" step="any"></hex-input>`);
  expect((inner(el) as HTMLInputElement).step).toBe("any");
});

test("readonly reaches the control and still submits its value", async () => {
  const el = await mount<HexInput>(`<hex-input readonly name="n" value="locked"></hex-input>`);
  expect((inner(el) as HTMLInputElement).readOnly).toBe(true);

  const form = document.createElement("form");
  document.body.append(form);
  mounted.push(form);
  form.append(el);
  await tick();
  expect([...new FormData(form).entries()]).toEqual([["n", "locked"]]);
});

test("autocomplete reaches the control", async () => {
  const el = await mount<HexInput>(
    `<hex-input type="password" autocomplete="new-password"></hex-input>`,
  );
  expect(inner(el).getAttribute("autocomplete")).toBe("new-password");
});

test("a textarea honours minlength and readonly", async () => {
  const el = await mount<HexTextarea>(
    `<hex-textarea minlength="5" readonly value="ab"></hex-textarea>`,
  );
  const control = inner(el, "textarea") as HTMLTextAreaElement;
  expect(control.minLength).toBe(5);
  expect(control.readOnly).toBe(true);
});

test("a required switch is invalid until it is checked", async () => {
  const el = await mount<HexSwitch>(`<hex-switch required name="tos"></hex-switch>`);
  expect(el.checkValidity()).toBe(false);
  expect(el.validity.valueMissing).toBe(true);

  el.checked = true;
  await el.updateComplete;
  expect(el.checkValidity()).toBe(true);
});

test("a required radio group is invalid only while nothing is selected", async () => {
  const group = await mount<HexRadioGroup>(`
    <hex-radio-group name="rating" required>
      <hex-radio value="s">Safe</hex-radio>
      <hex-radio value="q">Questionable</hex-radio>
      <hex-radio value="e">Explicit</hex-radio>
    </hex-radio-group>`);
  const radios = [...group.querySelectorAll("hex-radio")] as (HTMLElement & {
    checkValidity(): boolean;
    updateComplete: Promise<unknown>;
  })[];
  await Promise.all(radios.map((r) => r.updateComplete));

  expect(radios.every((r) => r.checkValidity())).toBe(false);

  group.value = "q";
  await group.updateComplete;
  await Promise.all(radios.map((r) => r.updateComplete));

  expect(radios.every((r) => r.checkValidity())).toBe(true);
});
