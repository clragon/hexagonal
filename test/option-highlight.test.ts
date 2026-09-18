import { afterEach, expect, test } from "vitest";
import "../src/components/hex-option.js";
import type { HexOption } from "../src/components/hex-option.js";

const mounted: HexOption[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

async function option(props: Partial<HexOption>) {
  const el = document.createElement("hex-option") as HexOption;
  Object.assign(el, props);
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  return el;
}

function parts(el: HexOption) {
  const label = el.renderRoot.querySelector(".label");
  const mark = label?.querySelector("mark");
  return { text: label?.textContent?.trim(), marked: mark?.textContent ?? null };
}

test("the matched run is marked and the rest is left alone", async () => {
  const el = await option({ label: "canine", match: "can" });
  expect(parts(el)).toEqual({ text: "canine", marked: "can" });
});

test("a match in the middle marks only that run", async () => {
  const el = await option({ label: "canine", match: "nin" });
  expect(parts(el).marked).toBe("nin");
});

test("a match at the end marks only that run", async () => {
  const el = await option({ label: "canine", match: "ine" });
  expect(parts(el).marked).toBe("ine");
});

test("matching ignores case but the original casing is preserved", async () => {
  const el = await option({ label: "Canine", match: "CAN" });
  expect(parts(el)).toEqual({ text: "Canine", marked: "Can" });
});

test("a needle absent from the label marks nothing", async () => {
  const el = await option({ label: "canine", match: "zzz" });
  expect(parts(el)).toEqual({ text: "canine", marked: null });
});

test("an empty match marks nothing", async () => {
  const el = await option({ label: "canine", match: "" });
  expect(parts(el)).toEqual({ text: "canine", marked: null });
});

test("a whitespace-only match marks nothing", async () => {
  const el = await option({ label: "canine", match: "   " });
  expect(parts(el).marked).toBeNull();
});

test("surrounding whitespace is trimmed off the needle before matching", async () => {
  const el = await option({ label: "canine", match: "  can  " });
  expect(parts(el).marked).toBe("can");
});

test("only the first occurrence is marked", async () => {
  const el = await option({ label: "banana", match: "na" });
  const marks = el.renderRoot.querySelectorAll("mark");
  expect(marks).toHaveLength(1);
  expect(marks[0]?.textContent).toBe("na");
});

test("a count renders in compact notation and is omitted when unset", async () => {
  const withCount = await option({ label: "wolf", count: 88400 });
  expect(withCount.renderRoot.querySelector(".count")?.textContent?.trim()).toBe("88.4K");

  const without = await option({ label: "wolf" });
  expect(without.renderRoot.querySelector(".count")).toBeNull();
});

test("a zero count still renders rather than being treated as absent", async () => {
  const el = await option({ label: "wolf", count: 0 });
  expect(el.renderRoot.querySelector(".count")?.textContent?.trim()).toBe("0");
});

test("an antecedent renders alongside the label and is omitted when unset", async () => {
  const withAnte = await option({ label: "canine", antecedent: "dog" });
  expect(withAnte.renderRoot.querySelector(".antecedent")?.textContent?.trim()).toBe("dog");

  const without = await option({ label: "canine" });
  expect(without.renderRoot.querySelector(".antecedent")).toBeNull();
});

test("text falls back through label, slotted content, then value", async () => {
  expect((await option({ label: "L", value: "V" })).text).toBe("L");
  expect((await option({ value: "V" })).text).toBe("V");

  const slotted = document.createElement("hex-option") as HexOption;
  slotted.textContent = "S";
  document.body.append(slotted);
  mounted.push(slotted);
  await slotted.updateComplete;
  expect(slotted.text).toBe("S");
});

test("selected and disabled are mirrored to aria for assistive tech", async () => {
  const el = await option({ label: "a", selected: true, disabled: true });
  expect(el.getAttribute("aria-selected")).toBe("true");
  expect(el.getAttribute("aria-disabled")).toBe("true");
  expect(el.getAttribute("role")).toBe("option");

  el.selected = false;
  el.disabled = false;
  await el.updateComplete;
  expect(el.getAttribute("aria-selected")).toBe("false");
  expect(el.hasAttribute("aria-disabled")).toBe(false);
});
