import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, normalize, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "assets/hero.png");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const filePath = normalize(resolve(root, "." + urlPath));
    if (!filePath.startsWith(root + sep)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[extname(filePath)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

await new Promise((done) => server.listen(0, "127.0.0.1", done));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 800 },
  deviceScaleFactor: 1.5,
});
page.on("pageerror", (e) => console.error("[hero] page error:", e.message));

await page.goto(`http://127.0.0.1:${port}/assets/hero.html`, { waitUntil: "load" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await customElements.whenDefined("hex-logo");
  const pending = [...document.querySelectorAll("*")]
    .filter((el) => el.tagName.startsWith("HEX-"))
    .map((el) => el.updateComplete)
    .filter(Boolean);
  await Promise.all(pending);
});
await page.waitForTimeout(400);

const stage = await page.$("#stage");
await stage.screenshot({ path: out });

await browser.close();
server.close();

const { size } = await import("node:fs").then((fs) => fs.promises.stat(out));
console.log(`wrote assets/hero.png (${Math.round(size / 1024)} KB)`);
