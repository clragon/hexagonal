interface RenderContext {
  render(node: unknown, out: string[]): void;
  renderAll(nodes: readonly unknown[], out: string[]): void;
}

type Handler = (node: never, out: string[], ctx: RenderContext) => void;

interface WithChildren {
  children: readonly unknown[];
}

interface SectionNodeLike extends WithChildren {
  title?: string;
  expanded?: boolean;
}

interface CodeNodeLike {
  content: string;
}

interface QuoteNodeLike extends WithChildren {
  color?: string;
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const quote = (node: QuoteNodeLike, out: string[], ctx: RenderContext): void => {
  out.push(node.color ? `<hex-quote stripe-color="${escape(node.color)}">` : "<hex-quote>");
  ctx.renderAll(node.children, out);
  out.push("</hex-quote>");
};

const spoilerBlock = (node: WithChildren, out: string[], ctx: RenderContext): void => {
  out.push("<hex-spoiler>");
  ctx.renderAll(node.children, out);
  out.push("</hex-spoiler>");
};

const inlineSpoiler = (node: WithChildren, out: string[], ctx: RenderContext): void => {
  out.push("<hex-spoiler>");
  ctx.renderAll(node.children, out);
  out.push("</hex-spoiler>");
};

const section = (node: SectionNodeLike, out: string[], ctx: RenderContext): void => {
  out.push(node.expanded ? "<hex-section open>" : "<hex-section>");
  out.push('<span slot="heading">', node.title ? escape(node.title) : "", "</span>");
  ctx.renderAll(node.children, out);
  out.push("</hex-section>");
};

const codeBlock = (node: CodeNodeLike, out: string[]): void => {
  out.push("<hex-code block>", escape(node.content), "</hex-code>");
};

const inlineCode = (node: CodeNodeLike, out: string[]): void => {
  out.push("<hex-code>", escape(node.content), "</hex-code>");
};

export const dmarkHandlers: Record<string, Handler> = {
  quote: quote as Handler,
  spoiler_block: spoilerBlock as Handler,
  inline_spoiler: inlineSpoiler as Handler,
  section: section as Handler,
  code_block: codeBlock as Handler,
  inline_code: inlineCode as Handler,
};
