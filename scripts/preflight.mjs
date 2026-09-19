import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = join(root, "src/components");
const target = join(root, "assets/preflight.css");

const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

function literal(node, where) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((e) => literal(e, where));
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const p of node.properties) {
      if (!ts.isPropertyAssignment(p))
        throw new Error(`${where}: only plain properties are supported`);
      const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : null;
      if (key === null) throw new Error(`${where}: computed keys are not supported`);
      out[key] = literal(p.initializer, where);
    }
    return out;
  }
  throw new Error(`${where}: preflight must be a plain literal, found ${ts.SyntaxKind[node.kind]}`);
}

function read(file) {
  const path = join(componentsDir, file);
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const found = [];
  for (const stmt of source.statements) {
    if (!ts.isClassDeclaration(stmt)) continue;
    const decorators = ts.getDecorators(stmt) ?? [];
    let tag = null;
    for (const d of decorators) {
      const call = d.expression;
      if (!ts.isCallExpression(call)) continue;
      if (!ts.isIdentifier(call.expression) || call.expression.text !== "customElement") continue;
      const arg = call.arguments[0];
      if (arg && ts.isStringLiteral(arg)) tag = arg.text;
    }
    if (tag === null) continue;
    const prop = stmt.members.find(
      (m) =>
        ts.isPropertyDeclaration(m) &&
        ts.isIdentifier(m.name) &&
        m.name.text === "preflight" &&
        (ts.getModifiers(m) ?? []).some((x) => x.kind === ts.SyntaxKind.StaticKeyword),
    );
    if (!prop)
      throw new Error(
        `${file}: <${tag}> has no 'static preflight'. Declare its pre-upgrade box, or 'null' to reserve nothing.`,
      );
    if (!prop.initializer)
      throw new Error(`${file}: <${tag}> declares 'static preflight' without a value`);
    found.push({ tag, rules: literal(prop.initializer, `${file} <${tag}>`) });
  }
  return found;
}

function block(selector, style) {
  const decls = Object.entries(style).map(([k, v]) => `  ${kebab(k)}: ${v};`);
  return `${selector}:not(:defined) {\n${decls.join("\n")}\n}`;
}

function generate() {
  const entries = [];
  for (const file of readdirSync(componentsDir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    entries.push(...read(file));
  }
  entries.sort((a, b) => a.tag.localeCompare(b.tag));

  const blocks = [];
  for (const { tag, rules } of entries) {
    if (rules === null) continue;
    if (rules.base && Object.keys(rules.base).length > 0) blocks.push(block(tag, rules.base));
    for (const v of rules.variants ?? []) {
      if (!v.when || !v.style || Object.keys(v.style).length === 0) continue;
      blocks.push(block(tag + v.when, v.style));
    }
  }
  return blocks.join("\n\n") + "\n";
}

const css = generate();

if (process.argv.includes("--check")) {
  const current = readFileSync(target, "utf8");
  if (current !== css) {
    console.error("assets/preflight.css is stale. Run `npm run preflight` and commit the result.");
    process.exit(1);
  }
  console.log("assets/preflight.css is current");
} else {
  writeFileSync(target, css);
  console.log(`wrote assets/preflight.css`);
}
