import { afterEach, expect, test, vi } from "vitest";
import "../src/components/hex-autocomplete.js";
import type {
  HexAutocomplete,
  HexAutocompleteItem,
  HexAutocompleteProvider,
} from "../src/components/hex-autocomplete.js";

const mounted: HexAutocomplete[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function field(provider: HexAutocompleteProvider, props: Partial<HexAutocomplete> = {}) {
  const el = document.createElement("hex-autocomplete") as HexAutocomplete;
  el.delay = 0;
  Object.assign(el, props);
  el.provider = provider;
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  return el;
}

function type(el: HexAutocomplete, value: string) {
  const input = el.renderRoot.querySelector("input") as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function shown(el: HexAutocomplete) {
  return [...el.renderRoot.querySelectorAll("hex-option")].map((o) => o.getAttribute("value"));
}

test("a slow response superseded by a newer one is discarded", async () => {
  let releaseSlow!: () => void;
  const provider: HexAutocompleteProvider = {
    search: (q) =>
      new Promise<HexAutocompleteItem[]>((res) => {
        if (q === "slow") releaseSlow = () => res([{ value: "STALE" }]);
        else res([{ value: "FRESH" }]);
      }),
  };
  const el = await field(provider);

  type(el, "slow");
  await tick();
  type(el, "fast");
  await tick(20);
  releaseSlow();
  await tick(20);

  expect(shown(el)).toEqual(["FRESH"]);
});

test("superseding a request aborts the signal handed to the provider", async () => {
  const aborted: string[] = [];
  const provider: HexAutocompleteProvider = {
    search: (q, ctx) =>
      new Promise<HexAutocompleteItem[]>((res) => {
        ctx.signal.addEventListener("abort", () => aborted.push(q));
        if (q !== "slow") res([{ value: q }]);
      }),
  };
  const el = await field(provider);

  type(el, "slow");
  await tick();
  type(el, "next");
  await tick(20);

  expect(aborted).toEqual(["slow"]);
});

test("a query below the minimum length never reaches the provider", async () => {
  const search = vi.fn(() => [] as HexAutocompleteItem[]);
  const el = await field({ search }, { minLength: 3 });

  type(el, "ab");
  await tick(20);
  expect(search).not.toHaveBeenCalled();

  type(el, "abc");
  await tick(20);
  expect(search).toHaveBeenCalledTimes(1);
});

test("wildcards do not count toward the minimum length", async () => {
  const search = vi.fn(() => [] as HexAutocompleteItem[]);
  const el = await field({ search }, { minLength: 3 });

  type(el, "ab*");
  await tick(20);
  expect(search).not.toHaveBeenCalled();

  type(el, "ab*c");
  await tick(20);
  expect(search).toHaveBeenCalledTimes(1);
});

test("retyping the same query while open does not re-query the provider", async () => {
  const search = vi.fn((q: string) => [{ value: q }]);
  const el = await field({ search });

  type(el, "abc");
  await tick(20);
  expect(search).toHaveBeenCalledTimes(1);

  type(el, "abc");
  await tick(20);
  expect(search).toHaveBeenCalledTimes(1);

  type(el, "abcd");
  await tick(20);
  expect(search).toHaveBeenCalledTimes(2);
});

test("keystrokes inside the debounce window collapse into one query", async () => {
  const search = vi.fn((q: string) => [{ value: q }]);
  const el = await field({ search }, { delay: 30 });

  type(el, "a");
  type(el, "ab");
  type(el, "abc");
  await tick(80);

  expect(search).toHaveBeenCalledTimes(1);
  expect(search.mock.calls[0]?.[0]).toBe("abc");
});

test("the highlighted option survives a re-query that still contains it", async () => {
  let items: HexAutocompleteItem[] = [{ value: "x" }, { value: "y" }, { value: "z" }];
  const el = await field({ search: () => items });

  type(el, "aa");
  await tick(20);
  el.renderRoot.querySelector("hex-listbox")!.activateByValue("y");
  await tick();

  items = [{ value: "w" }, { value: "y" }];
  type(el, "ab");
  await tick(20);

  expect(el.renderRoot.querySelector("hex-listbox")!.activeOption?.value).toBe("y");
});

test("a re-query that drops the highlighted option highlights nothing", async () => {
  let items: HexAutocompleteItem[] = [{ value: "x" }, { value: "y" }];
  const el = await field({ search: () => items });

  type(el, "aa");
  await tick(20);
  el.renderRoot.querySelector("hex-listbox")!.activateByValue("y");
  await tick();

  items = [{ value: "p" }, { value: "q" }];
  type(el, "ab");
  await tick(20);

  expect(el.renderRoot.querySelector("hex-listbox")!.activeIndex).toBe(-1);
});

test("results are clamped to the configured maximum", async () => {
  const many = Array.from({ length: 40 }, (_, i) => ({ value: `v${i}` }));
  const el = await field({ search: () => many }, { maxResults: 5 });

  type(el, "aa");
  await tick(20);

  expect(shown(el)).toHaveLength(5);
});

test("the provider decides what the inserted value is", async () => {
  const provider: HexAutocompleteProvider = {
    search: () => [{ value: "wolf" }],
    insert: (input, item) => {
      input.value = `prefix:${item.value}`;
    },
  };
  const el = await field(provider);

  type(el, "wo");
  await tick(20);
  el.renderRoot.querySelector("hex-listbox")!.activate(0);
  el.renderRoot.querySelector("hex-listbox")!.selectActive();
  await tick(20);

  expect(el.value).toBe("prefix:wolf");
});

test("a provider-inserted value does not trigger another query", async () => {
  const search = vi.fn(() => [{ value: "wolf" }]);
  const el = await field({
    search,
    insert: (input, item) => {
      input.value = item.value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
  });

  type(el, "wo");
  await tick(20);
  expect(search).toHaveBeenCalledTimes(1);

  el.renderRoot.querySelector("hex-listbox")!.activate(0);
  el.renderRoot.querySelector("hex-listbox")!.selectActive();
  await tick(30);

  expect(search).toHaveBeenCalledTimes(1);
});

test("a provider can render its own option content", async () => {
  const el = await field({
    search: () => [{ value: "wolf" }],
    renderOption: (item) => {
      const span = document.createElement("span");
      span.className = "custom";
      span.textContent = item.value.toUpperCase();
      return span as unknown as ReturnType<NonNullable<HexAutocompleteProvider["renderOption"]>>;
    },
  });

  type(el, "wo");
  await tick(20);

  expect(el.renderRoot.querySelector("hex-option")?.querySelector(".custom")?.textContent).toBe(
    "WOLF",
  );
});

test("a provider failure closes the list and reports rather than throwing", async () => {
  const boom = new Error("network down");
  const el = await field({
    search: () => Promise.reject(boom),
  });
  const errors: unknown[] = [];
  el.addEventListener("hex-error", (e) => errors.push((e as CustomEvent).detail.error));

  type(el, "aa");
  await tick(30);

  expect(errors).toEqual([boom]);
  expect(shown(el)).toEqual([]);
});

test("the caret position is handed to the provider so it can complete one word", async () => {
  const carets: number[] = [];
  const el = await field({
    search: (_q, ctx) => {
      carets.push(ctx.caret);
      return [];
    },
  });

  const input = el.renderRoot.querySelector("input") as HTMLInputElement;
  input.value = "alpha beta";
  input.setSelectionRange(5, 5);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await tick(20);

  expect(carets).toEqual([5]);
});

test("the provider chooses what the matched run is highlighted against", async () => {
  const el = await field({
    search: (_q, ctx) => {
      ctx.term = "be";
      return [{ value: "beta", label: "beta" }];
    },
  });

  type(el, "alpha be");
  await tick(20);

  const option = el.renderRoot.querySelector("hex-option");
  await option?.updateComplete;
  expect(option?.renderRoot.querySelector("mark")?.textContent).toBe("be");
});

test("a count reaches the option as compact trailing content", async () => {
  const el = await field({
    search: () => [
      { value: "wolf", count: 88400 },
      { value: "patreon", count: 0 },
      { value: "fox" },
    ],
  });
  type(el, "wo");
  await tick(20);

  const options = [...el.renderRoot.querySelectorAll("hex-option")];
  const trailing = options.map(
    (o) => o.querySelector('[slot="trailing"]')?.textContent?.trim() ?? null,
  );

  expect(trailing[0], "88400 should read as compact notation").toBe("88.4K");
  expect(trailing[1], "a zero count is a count, not an absent one").toBe("0");
  expect(trailing[2], "an item with no count gets no trailing node").toBeNull();
});
