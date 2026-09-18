import { watch } from "node:fs";
import { resolve } from "node:path";

const ENDPOINT = "/__livereload";
const DEBOUNCE_MS = 80;

const CLIENT = `<script>
(() => {
  let retry = 0;
  const connect = () => {
    const es = new EventSource(${JSON.stringify(ENDPOINT)});
    es.addEventListener("open", () => { retry = 0; });
    es.addEventListener("reload", () => location.reload());
    es.addEventListener("error", () => {
      es.close();
      retry = Math.min(retry + 1, 10);
      setTimeout(connect, retry * 250);
    });
  };
  connect();
})();
</script>`;

export function liveReload(root) {
  const clients = new Set();
  let timer;

  const broadcast = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const res of clients) res.write("event: reload\ndata: 1\n\n");
    }, DEBOUNCE_MS);
  };

  const dist = resolve(root, "dist");
  try {
    watch(dist, { recursive: true }, broadcast);
  } catch {
    /* dist appears on first build */
  }

  return {
    handle(req, res) {
      if (req.url.split("?")[0] !== ENDPOINT) return false;
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write("retry: 500\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return true;
    },

    inject(html) {
      const body = html.toString("utf8");
      return body.includes("</body>")
        ? body.replace("</body>", `${CLIENT}\n</body>`)
        : body + CLIENT;
    },
  };
}
