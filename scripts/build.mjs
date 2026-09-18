import { build, context } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const assetPlugin = {
  name: "hex-assets",
  setup(b) {
    b.onResolve({ filter: /\?inline$/ }, (args) => ({
      path: resolve(args.resolveDir, args.path.replace(/\?inline$/, "")),
      namespace: "hex-inline",
    }));
    b.onLoad({ filter: /.*/, namespace: "hex-inline" }, (args) => {
      const ext = args.path.split(".").pop().toLowerCase();
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "svg"
            ? "image/svg+xml"
            : ext === "ttf"
              ? "font/ttf"
              : "application/octet-stream";
      const data = readFileSync(args.path);
      const b64 = data.toString("base64");
      const uri = `data:${mime};base64,${b64}`;
      return { contents: `export default ${JSON.stringify(uri)};`, loader: "js" };
    });
  },
};

const baseOptions = {
  entryPoints: [resolve(root, "src/index.ts")],
  bundle: true,
  format: "esm",
  target: "es2022",
  plugins: [assetPlugin],
  logLevel: "info",
};

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const pkgRepo = pkg.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

const bookOptions = {
  entryPoints: [resolve(root, "book/src/main.ts")],
  bundle: true,
  format: "esm",
  target: "es2022",
  plugins: [assetPlugin],
  define: {
    __HEX_VERSION__: JSON.stringify(pkg.version),
    __HEX_REPO__: JSON.stringify(pkgRepo),
  },
  logLevel: "info",
};

mkdirSync(resolve(root, "dist"), { recursive: true });

const watch = process.argv.includes("--watch");

if (watch) {
  const libCtx = await context({
    ...baseOptions,
    outfile: resolve(root, "dist/hexagonal.js"),
    sourcemap: true,
    minify: false,
  });
  const bookCtx = await context({
    ...bookOptions,
    outfile: resolve(root, "dist/book.js"),
    sourcemap: true,
    minify: false,
  });
  await libCtx.watch();
  await bookCtx.watch();
  console.log("[esbuild] watching src/ + book/ ...");
} else {
  await build({
    ...baseOptions,
    outfile: resolve(root, "dist/hexagonal.js"),
    sourcemap: true,
    minify: false,
  });
  await build({
    ...baseOptions,
    outfile: resolve(root, "dist/hexagonal.min.js"),
    minify: true,
  });

  // Tiny standalone fonts.css consumers can <link> if they want bundled fonts.
  const verdana = readFileSync(resolve(root, "assets/fonts/Verdana.ttf")).toString("base64");
  const paulistana = readFileSync(resolve(root, "assets/fonts/PaulistanaIpe-Regular.ttf")).toString(
    "base64",
  );
  const fontsCss = `@font-face{font-family:"Verdana";src:url(data:font/ttf;base64,${verdana}) format("truetype");font-weight:400;font-style:normal;font-display:swap}
`;
  writeFileSync(resolve(root, "dist/hexagonal-fonts.css"), fontsCss);

  const bookFontsCss = `@font-face{font-family:"Paulistana Ipe";src:url(data:font/ttf;base64,${paulistana}) format("truetype");font-weight:400;font-style:normal;font-display:swap}
`;
  writeFileSync(resolve(root, "dist/book-fonts.css"), bookFontsCss);

  // Standalone preflight.css consumers <link> in <head> so unupgraded <hex-*>
  // elements already occupy their final box, before the module evaluates.
  writeFileSync(
    resolve(root, "dist/hexagonal-preflight.css"),
    readFileSync(resolve(root, "assets/preflight.css"), "utf8"),
  );

  const tokensBundle = resolve(root, "dist/.tokens.mjs");
  await build({
    entryPoints: [resolve(root, "src/shared/tokens.ts")],
    bundle: true,
    format: "esm",
    target: "es2022",
    plugins: [assetPlugin],
    outfile: tokensBundle,
    logLevel: "silent",
  });
  const { tokensCss } = await import(pathToFileURL(tokensBundle).href);
  writeFileSync(resolve(root, "dist/hexagonal-tokens.css"), tokensCss.trimStart());
  rmSync(tokensBundle);

  await build({
    ...bookOptions,
    outfile: resolve(root, "dist/book.js"),
    minify: false,
  });

  console.log(
    "[esbuild] built dist/hexagonal.js + .min.js + hexagonal-tokens.css + hexagonal-fonts.css + book-fonts.css + hexagonal-preflight.css + book.js",
  );

  console.log("[tsc] emitting .d.ts ...");
  const tscBin = process.platform === "win32" ? "tsc.cmd" : "tsc";
  const r = spawnSync(tscBin, ["-p", "tsconfig.build.json"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log("[tsc] dist/types/ ready");
}
