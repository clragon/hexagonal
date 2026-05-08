// Development orchestrator: runs the esbuild watcher and the static file
// server side by side so a single `yarn watch` covers both. Forwards stdio
// straight through and tears both children down on Ctrl-C.

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function child(args) {
  return spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
}

const builder = child(["scripts/build.mjs", "--watch"]);
const server = child(["scripts/serve.mjs"]);

const procs = [builder, server];

function shutdown() {
  for (const p of procs) {
    if (!p.killed) p.kill();
  }
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

for (const p of procs) {
  p.on("exit", (code) => {
    shutdown();
    process.exit(code ?? 1);
  });
}
