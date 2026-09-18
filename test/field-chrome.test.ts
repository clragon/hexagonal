import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexInput } from "../src/components/hex-input.js";

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function input(props: Partial<HexInput> = {}, inner = "") {
  const el = document.createElement("hex-input") as HexInput;
  el.innerHTML = inner;
  Object.assign(el, props);
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  await tick();
  await el.updateComplete;
  return el;
}

const control = (el: HexInput) => el.renderRoot.querySelector("input") as HTMLInputElement;

test("an error is announced assertively and takes over from the hint", async () => {
  const el = await input({ hint: "Lowercase only", error: "Already taken" });

  const message = el.renderRoot.querySelector(".error");
  expect(message?.getAttribute("role")).toBe("alert");
  expect(message?.textContent?.trim()).toBe("Already taken");
  expect(el.renderRoot.querySelector(".hint")).toBeNull();
});

test("the control points at whichever message is showing", async () => {
  const el = await input({ hint: "Lowercase only" });
  expect(control(el).getAttribute("aria-describedby")).toBe("hint");

  el.error = "Already taken";
  await el.updateComplete;
  expect(control(el).getAttribute("aria-describedby")).toBe("error");

  el.error = "";
  el.hint = "";
  await el.updateComplete;
  expect(control(el).hasAttribute("aria-describedby")).toBe(false);
});

test("an error marks the control invalid to assistive tech and in the host state", async () => {
  const el = await input({});
  expect(control(el).getAttribute("aria-invalid")).toBe("false");
  expect(el.hasAttribute("invalid")).toBe(false);

  el.error = "Nope";
  await el.updateComplete;

  expect(control(el).getAttribute("aria-invalid")).toBe("true");
  expect(el.hasAttribute("invalid")).toBe(true);
});

test("setting an icon marks the host so the control makes room for it", async () => {
  const el = await input({});
  expect(el.hasAttribute("with-icon")).toBe(false);

  el.icon = "search";
  await el.updateComplete;
  expect(el.hasAttribute("with-icon")).toBe(true);
  expect(el.renderRoot.querySelector("hex-icon")).not.toBeNull();

  el.icon = undefined;
  await el.updateComplete;
  expect(el.hasAttribute("with-icon")).toBe(false);
});

test("slotting a prefix marks the host and leaving it empty does not", async () => {
  const empty = await input({});
  expect(empty.hasAttribute("has-prefix")).toBe(false);

  const withPrefix = await input({}, `<span slot="prefix">$</span>`);
  expect(withPrefix.hasAttribute("has-prefix")).toBe(true);
  expect(withPrefix.hasAttribute("has-suffix")).toBe(false);
});

test("slotting a suffix marks the host independently of the prefix", async () => {
  const el = await input({}, `<span slot="suffix">USD</span>`);
  expect(el.hasAttribute("has-suffix")).toBe(true);
  expect(el.hasAttribute("has-prefix")).toBe(false);
});

test("removing slotted affix content clears the host marker", async () => {
  const el = await input({}, `<span slot="prefix">$</span>`);
  expect(el.hasAttribute("has-prefix")).toBe(true);

  el.querySelector('[slot="prefix"]')?.remove();
  await tick(20);
  await el.updateComplete;

  expect(el.hasAttribute("has-prefix")).toBe(false);
});

test("typing announces the value and keeps the component in step", async () => {
  const el = await input({});
  const seen: string[] = [];
  el.addEventListener("hex-input", (e) => seen.push((e as CustomEvent).detail.value));

  control(el).value = "typed";
  control(el).dispatchEvent(new Event("input", { bubbles: true }));
  await el.updateComplete;

  expect(seen).toEqual(["typed"]);
  expect(el.value).toBe("typed");
});

test("the label is wired to the control so clicking it focuses the field", async () => {
  const el = await input({ label: "Cluster" });
  const label = el.renderRoot.querySelector("label") as HTMLLabelElement;

  expect(label.getAttribute("for")).toBe(control(el).id);
  expect(control(el).id).toBeTruthy();
});

test("size is reflected so the stylesheet can pick it up", async () => {
  const el = await input({ size: "sm" });
  expect(el.getAttribute("size")).toBe("sm");

  el.size = "lg";
  await el.updateComplete;
  expect(el.getAttribute("size")).toBe("lg");
});

test("every field control resolves to the same height for a given size", async () => {
  const heights = new Map<string, number[]>();
  for (const size of ["sm", "md", "lg"] as const) {
    const row: number[] = [];
    for (const tag of ["hex-input", "hex-select", "hex-autocomplete"]) {
      const el = document.createElement(tag) as HexInput;
      el.style.display = "block";
      el.style.width = "240px";
      el.size = size;
      if (tag === "hex-select") el.innerHTML = `<option value="a">A</option>`;
      document.body.append(el);
      mounted.push(el);
      await el.updateComplete;
      await tick();
      const inner = el.renderRoot.querySelector("input, button") as HTMLElement;
      row.push(inner.getBoundingClientRect().height);
    }
    heights.set(size, row);
  }

  for (const [size, row] of heights) {
    expect(new Set(row).size, `${size} controls disagree: ${row.join(", ")}`).toBe(1);
  }

  const [sm] = heights.get("sm") as number[];
  const [md] = heights.get("md") as number[];
  const [lg] = heights.get("lg") as number[];
  expect(sm).toBeLessThan(md as number);
  expect(md).toBeLessThan(lg as number);
});

async function radioGroup(direction: string) {
  const el = document.createElement("hex-radio-group");
  el.setAttribute("label", "Sort");
  el.setAttribute("name", "sort");
  el.setAttribute("value", "new");
  el.setAttribute("direction", direction);
  el.innerHTML = `<hex-radio value="new">Newest</hex-radio><hex-radio value="old">Oldest</hex-radio>`;
  document.body.append(el);
  mounted.push(el);
  await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  await tick(20);
  const radios = [...el.querySelectorAll("hex-radio")];
  return {
    label: el.shadowRoot!.querySelector(".label")!.getBoundingClientRect(),
    first: radios[0]!.getBoundingClientRect(),
    second: radios[1]!.getBoundingClientRect(),
  };
}

test("a horizontal radio group keeps its label above the row", async () => {
  const { label, first, second } = await radioGroup("horizontal");

  expect(second.top, "the two radios sit on one row").toBe(first.top);
  expect(
    label.bottom,
    "the label belongs above the radios, not beside them in the row",
  ).toBeLessThanOrEqual(first.top);
  expect(label.left, "the label starts at the same edge as the first radio").toBe(first.left);
});

test("a vertical radio group stacks its radios under the label", async () => {
  const { label, first, second } = await radioGroup("vertical");

  expect(second.top).toBeGreaterThan(first.top);
  expect(label.bottom).toBeLessThanOrEqual(first.top);
});
