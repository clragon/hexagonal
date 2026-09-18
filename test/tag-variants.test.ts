import { afterEach, expect, test } from "vitest";
import "../src/index.js";
import type { HexTag } from "../src/components/hex-tag.js";

const mounted: HexTag[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

async function tag(inner: string, props: Partial<HexTag> = {}) {
  const el = document.createElement("hex-tag") as HexTag;
  el.innerHTML = inner;
  Object.assign(el, props);
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  return el;
}

const part = (el: HexTag, name: string) => el.renderRoot.querySelector(`[part="${name}"]`);

test("a chip stays inline so a run of tags can wrap", async () => {
  const el = await tag("canine", { category: "species" });
  expect(getComputedStyle(el).display).toBe("inline-flex");
});

test("a row is block-level and only as wide as its content", async () => {
  const el = await tag("canine", { category: "species", variant: "row" });
  expect(getComputedStyle(el).display).toBe("flex");
  expect(getComputedStyle(el).width).not.toBe("auto");
});

test("a row carries the category colour on its leading edge", async () => {
  const el = await tag("canine", { category: "species", variant: "row" });
  const cs = getComputedStyle(el);

  expect(parseFloat(cs.borderLeftWidth)).toBeGreaterThan(parseFloat(cs.borderTopWidth));
  expect(cs.borderLeftColor).toBe(cs.color);
});

test("both variants take the category colour from the same token", async () => {
  const chip = await tag("x", { category: "artist" });
  const row = await tag("x", { category: "artist", variant: "row" });
  expect(getComputedStyle(row).color).toBe(getComputedStyle(chip).color);
});

test("a count renders in compact notation and is omitted when unset", async () => {
  const withCount = await tag("canine", { variant: "row", count: 512000 });
  expect(part(withCount, "count")?.textContent?.trim()).toBe("512K");

  const without = await tag("canine", { variant: "row" });
  expect(part(without, "count")).toBeNull();
});

test("a zero count still renders rather than being treated as absent", async () => {
  const el = await tag("canine", { variant: "row", count: 0 });
  expect(part(el, "count")?.textContent?.trim()).toBe("0");
});

test("lead and action content is placed either side of the name", async () => {
  const el = await tag(
    `<span slot="lead">?</span>canine<span slot="actions">x</span>`,
    { variant: "row" },
  );
  const lead = part(el, "lead")?.querySelector("slot") as HTMLSlotElement;
  const actions = part(el, "actions")?.querySelector("slot") as HTMLSlotElement;

  expect(lead.assignedNodes().length).toBe(1);
  expect(actions.assignedNodes().length).toBe(1);
});

test("an empty lead draws no divider", async () => {
  const bare = await tag("canine", { variant: "row" });
  const withLead = await tag(`<span slot="lead">?</span>canine`, { variant: "row" });

  const bareBorder = getComputedStyle(part(bare, "lead") as Element).borderRightWidth;
  const leadBorder = getComputedStyle(part(withLead, "lead") as Element).borderRightWidth;

  expect(parseFloat(bareBorder) || 0).toBe(0);
  expect(parseFloat(leadBorder)).toBeGreaterThan(0);
});

test("switching variant does not change the tag's height", async () => {
  const chip = await tag("canine", { category: "species" });
  const chipHeight = chip.getBoundingClientRect().height;

  chip.variant = "row";
  await chip.updateComplete;

  expect(chip.getBoundingClientRect().height).toBe(chipHeight);
});
