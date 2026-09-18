import { expect, test } from "vitest";

const CASES: Record<string, string> = {
  "labelled fields": `
    <hex-input label="L"></hex-input>
    <hex-select label="L"><option value="a">A</option></hex-select>
    <hex-autocomplete label="L"></hex-autocomplete>`,
  "fields with hints": `
    <hex-input label="L" hint="H"></hex-input>
    <hex-select label="L" hint="H"><option value="a">A</option></hex-select>
    <hex-autocomplete label="L" hint="H"></hex-autocomplete>`,
  "small and large fields": `
    <hex-input size="sm" label="S"></hex-input>
    <hex-input size="lg" label="G"></hex-input>
    <hex-select size="sm" label="S"><option value="a">A</option></hex-select>
    <hex-autocomplete size="lg" label="G" hint="H"></hex-autocomplete>`,
  "buttons of every size": `
    <hex-button>Go</hex-button>
    <hex-button size="sm">S</hex-button>
    <hex-button size="lg">L</hex-button>
    <hex-button variant="raised">R</hex-button>
    <hex-button icon-only icon="search" aria-label="s"></hex-button>`,
  "a radio group scales with its children": `
    <hex-radio-group label="T"><hex-radio value="a">A</hex-radio><hex-radio value="b">B</hex-radio></hex-radio-group>
    <hex-radio-group label="T"><hex-radio value="a">A</hex-radio><hex-radio value="b">B</hex-radio><hex-radio value="c">C</hex-radio></hex-radio-group>`,
  "a listbox scales with its options": `
    <hex-listbox><hex-option label="a"></hex-option></hex-listbox>
    <hex-listbox><hex-option label="a"></hex-option><hex-option label="b"></hex-option><hex-option label="c"></hex-option></hex-listbox>`,
  "a card carries its own padding": `
    <hex-card><hex-input label="L"></hex-input></hex-card>
    <hex-card dense><hex-input label="L"></hex-input></hex-card>`,
  "a full form": `
    <hex-card>
      <hex-input label="Cluster" hint="Lowercase"></hex-input>
      <hex-select label="Region" hint="Closest"><option value="eu">EU</option></hex-select>
      <hex-autocomplete label="Tags" hint="Type"></hex-autocomplete>
      <hex-textarea label="Notes" counter maxlength="200"></hex-textarea>
      <hex-radio-group label="Tier"><hex-radio value="a">A</hex-radio><hex-radio value="b">B</hex-radio></hex-radio-group>
      <hex-divider></hex-divider>
      <hex-button variant="raised">Create</hex-button>
    </hex-card>`,
};

async function measureUpgrade(markup: string) {
  const frame = document.createElement("iframe");
  frame.style.cssText = "width:420px;height:900px;border:0";
  document.body.append(frame);

  const doc = frame.contentDocument as Document;
  doc.open();
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8">` +
      `<link rel="stylesheet" href="/dist/hexagonal-preflight.css">` +
      `</head><body style="margin:0"><div id="probe" style="width:420px">${markup}</div></body></html>`,
  );
  doc.close();

  await new Promise<void>((resolve) => {
    const sheet = doc.querySelector("link") as HTMLLinkElement;
    if (sheet.sheet) resolve();
    else sheet.addEventListener("load", () => resolve(), { once: true });
  });

  const probe = doc.getElementById("probe") as HTMLElement;
  const before = probe.getBoundingClientRect().height;

  const script = doc.createElement("script");
  script.type = "module";
  script.src = "/dist/hexagonal.js";
  doc.head.append(script);

  const win = frame.contentWindow as Window & typeof globalThis;
  await new Promise<void>((resolve) => {
    const started = Date.now();
    const poll = () => {
      const ready = win.customElements.get("hex-input") && win.customElements.get("hex-button");
      if (ready || Date.now() - started > 8000) resolve();
      else win.setTimeout(poll, 30);
    };
    poll();
  });
  await new Promise((r) => setTimeout(r, 400));

  const after = probe.getBoundingClientRect().height;
  frame.remove();
  return { before, after };
}

for (const [name, markup] of Object.entries(CASES)) {
  test(`${name} reserve the space they take`, async () => {
    const { before, after } = await measureUpgrade(markup);
    expect(after).toBeGreaterThan(0);
    expect(before, "preflight reserved nothing, so the page would jump").toBeGreaterThan(0);
    expect(
      Math.abs(after - before),
      `reserved ${before}px but rendered ${after}px`,
    ).toBeLessThanOrEqual(1);
  });
}

test("a labelled field is the same height whichever font resolves", async () => {
  const frame = document.createElement("iframe");
  frame.style.cssText = "width:420px;height:600px;border:0";
  document.body.append(frame);
  const doc = frame.contentDocument as Document;
  const fonts = ["Noto Sans", "DejaVu Sans", "Liberation Sans", "monospace", "serif"];
  doc.open();
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">` +
      fonts
        .map(
          (f) =>
            `<div data-font="${f}" style="--hex-font-family:${f};width:300px"><hex-input></hex-input><hex-button>Go</hex-button></div>`,
        )
        .join("") +
      `<script type="module" src="/dist/hexagonal.js"><\/script></body></html>`,
  );
  doc.close();

  const win = frame.contentWindow as Window & typeof globalThis;
  await new Promise<void>((resolve) => {
    const started = Date.now();
    const poll = () => {
      if (win.customElements?.get("hex-button") || Date.now() - started > 8000) resolve();
      else win.setTimeout(poll, 30);
    };
    poll();
  });
  await new Promise((r) => setTimeout(r, 500));

  const heights = [...doc.querySelectorAll("[data-font]")].map((d) => {
    const input = d.querySelector("hex-input")!.shadowRoot!.querySelector("input")!;
    const button = d.querySelector("hex-button")!.shadowRoot!.querySelector("button")!;
    return {
      font: (d as HTMLElement).dataset.font,
      input: input.getBoundingClientRect().height,
      button: button.getBoundingClientRect().height,
    };
  });
  frame.remove();

  const inputs = new Set(heights.map((h) => h.input));
  const buttons = new Set(heights.map((h) => h.button));
  expect(inputs.size, `input heights differ by font: ${JSON.stringify(heights)}`).toBe(1);
  expect(buttons.size, `button heights differ by font: ${JSON.stringify(heights)}`).toBe(1);
  expect([...inputs][0]).toBe([...buttons][0]);
});
