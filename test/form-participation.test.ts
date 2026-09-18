import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexInput } from "../src/components/hex-input.js";
import type { HexSelect } from "../src/components/hex-select.js";
import type { HexAutocomplete } from "../src/components/hex-autocomplete.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

async function form(html: string) {
  const f = document.createElement("form");
  f.innerHTML = html;
  document.body.append(f);
  mounted.push(f);
  await Promise.all(
    [...f.querySelectorAll("*")]
      .filter((e): e is HTMLElement & { updateComplete: Promise<unknown> } => "updateComplete" in e)
      .map((e) => e.updateComplete),
  );
  return f;
}

const entries = (f: HTMLFormElement) => Object.fromEntries(new FormData(f).entries());

test("a named input contributes its value to the submitted form", async () => {
  const f = await form(`<hex-input name="cluster"></hex-input>`);
  const input = f.querySelector("hex-input") as HexInput;

  input.value = "prod-east";
  await input.updateComplete;

  expect(entries(f)).toEqual({ cluster: "prod-east" });
});

test("a select contributes the chosen option rather than its label", async () => {
  const f = await form(
    `<hex-select name="region"><option value="eu">Europe</option><option value="us">North America</option></hex-select>`,
  );
  const select = f.querySelector("hex-select") as HexSelect;

  select.value = "us";
  await select.updateComplete;

  expect(entries(f)).toEqual({ region: "us" });
});

test("an autocomplete contributes its value", async () => {
  const f = await form(`<hex-autocomplete name="tag"></hex-autocomplete>`);
  const ac = f.querySelector("hex-autocomplete") as HexAutocomplete;

  ac.value = "wolf";
  await ac.updateComplete;

  expect(entries(f)).toEqual({ tag: "wolf" });
});

test("an unnamed control contributes nothing", async () => {
  const f = await form(`<hex-input></hex-input>`);
  const input = f.querySelector("hex-input") as HexInput;
  input.value = "ignored";
  await input.updateComplete;

  expect(entries(f)).toEqual({});
});

test("a required control blocks the form until it has a value", async () => {
  const f = await form(`<hex-input name="a" required></hex-input>`);
  const input = f.querySelector("hex-input") as HexInput;

  expect(f.checkValidity()).toBe(false);

  input.value = "filled";
  await input.updateComplete;

  expect(f.checkValidity()).toBe(true);
});

test("a required select blocks the form until a choice is made", async () => {
  const f = await form(
    `<hex-select name="r" required><option value="eu">Europe</option></hex-select>`,
  );
  const select = f.querySelector("hex-select") as HexSelect;

  expect(f.checkValidity()).toBe(false);

  select.value = "eu";
  await select.updateComplete;

  expect(f.checkValidity()).toBe(true);
});

test("an error message makes the control invalid and is reported back", async () => {
  const f = await form(`<hex-input name="a"></hex-input>`);
  const input = f.querySelector("hex-input") as HexInput;

  input.value = "anything";
  input.error = "Not allowed";
  await input.updateComplete;

  expect(input.checkValidity()).toBe(false);
  expect(input.validationMessage).toBe("Not allowed");
  expect(f.checkValidity()).toBe(false);
});

test("resetting the form clears every control", async () => {
  const f = await form(
    `<hex-input name="a"></hex-input><hex-select name="b"><option value="eu">Europe</option></hex-select>`,
  );
  const input = f.querySelector("hex-input") as HexInput;
  const select = f.querySelector("hex-select") as HexSelect;

  input.value = "x";
  select.value = "eu";
  await Promise.all([input.updateComplete, select.updateComplete]);
  expect(entries(f)).toEqual({ a: "x", b: "eu" });

  f.reset();
  await Promise.all([input.updateComplete, select.updateComplete]);

  expect(entries(f)).toEqual({ a: "", b: "" });
});

test("a disabled fieldset disables the controls inside it", async () => {
  const f = await form(`<fieldset><hex-input name="a"></hex-input></fieldset>`);
  const input = f.querySelector("hex-input") as HexInput;
  const fieldset = f.querySelector("fieldset") as HTMLFieldSetElement;

  expect(input.disabled).toBe(false);
  fieldset.disabled = true;
  await input.updateComplete;

  expect(input.disabled).toBe(true);
});

test("every control reports the form it belongs to", async () => {
  const f = await form(
    `<hex-input name="a"></hex-input><hex-select name="b"><option value="x">X</option></hex-select><hex-autocomplete name="c"></hex-autocomplete>`,
  );
  for (const tag of ["hex-input", "hex-select", "hex-autocomplete"]) {
    const el = f.querySelector(tag) as HexInput;
    expect(el.form).toBe(f);
  }
});
