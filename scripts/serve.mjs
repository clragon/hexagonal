import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { liveReload } from "./livereload.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 47312; // arbitrary, avoid 3000/8080 etc.

const reload = liveReload(root);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

createServer(async (req, res) => {
  try {
    if (reload.handle(req, res)) return;
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    // Redirect rather than alias, so relative URLs inside the book resolve
    // against /book/ instead of the server root.
    if (urlPath === "/") {
      res.writeHead(302, { Location: "/book/index.html" });
      res.end();
      return;
    }
    const filePath = normalize(resolve(root, "." + urlPath));
    if (!filePath.startsWith(root + sep) && filePath !== root) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    const s = await stat(filePath).catch(() => null);
    if (!s || !s.isFile()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    const ext = extname(filePath);
    const data = await readFile(filePath);
    const body = ext === ".html" ? reload.inject(data) : data;
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}/`));
