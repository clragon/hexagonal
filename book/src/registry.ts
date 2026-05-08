import { iconPaths, type IconName } from "../../src/shared/icons.js";

const ICON_OPTIONS: string[] = ["", ...Object.keys(iconPaths)];

export type ControlKind = "select" | "boolean" | "text" | "number";

export type PreviewSurface = "page" | "card";

export interface PropSpec {
  name: string;
  kind: ControlKind;
  options?: string[];
  default?: string | number | boolean;
  description?: string;
}

export interface ComponentEntry {
  tag: string;
  title: string;
  description: string;
  defaultSlot?: string;
  /** Optional named slot content for slots like alert's "actions" */
  namedSlots?: Record<string, string>;
  /** Surface the playground should render on. Defaults to "card". */
  previewSurface?: PreviewSurface;
  props: PropSpec[];
}

const userRoles = ["member", "privileged", "blocked", "former-staff", "janitor", "moderator", "admin"];
const tagCategories = ["artist", "copyright", "character", "species", "general", "meta", "lore", "invalid"];

export const components: ComponentEntry[] = [
  {
    tag: "hex-page",
    title: "Page",
    description:
      "Full-bleed page surface. Wraps a route or app shell with the brand navy background and tiled hex pattern.",
    defaultSlot:
      '<div style="padding: 24px; opacity: 0.85; font-style: italic;">⬡ content here ⬡</div>',
    previewSurface: "page",
    props: [],
  },
  {
    tag: "hex-card",
    title: "Card",
    description:
      "Standard card surface with the brand hex-texture watermark fading down from the top. Use for grouped content.",
    defaultSlot: "Card content goes here. Cards have 24px internal padding by default.",
    previewSurface: "page",
    props: [
      { name: "dense", kind: "boolean", default: false, description: "Drops padding to 16px for dense data." },
      { name: "flat", kind: "boolean", default: false, description: "Removes texture and shadow for nested cards." },
    ],
  },
  {
    tag: "hex-button",
    title: "Button",
    description:
      "Primary action element. Five visual variants, three sizes, optional leading icon, and an icon-only mode.",
    defaultSlot: "Save changes",
    props: [
      {
        name: "variant",
        kind: "select",
        options: ["primary", "secondary", "ghost", "text-primary", "danger"],
        default: "primary",
      },
      { name: "size", kind: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "icon", kind: "select", options: ICON_OPTIONS, default: "" },
      { name: "icon-only", kind: "boolean", default: false },
      { name: "disabled", kind: "boolean", default: false },
      { name: "full", kind: "boolean", default: false, description: "Stretches to full container width." },
    ],
  },
  {
    tag: "hex-input",
    title: "Input",
    description: "Text input with optional label, hint, error, and leading icon.",
    props: [
      { name: "label", kind: "text", default: "Cluster name" },
      { name: "placeholder", kind: "text", default: "prod-east-1" },
      { name: "value", kind: "text", default: "" },
      { name: "hint", kind: "text", default: "Lowercase, dashes ok." },
      { name: "error", kind: "text", default: "" },
      { name: "icon", kind: "select", options: ICON_OPTIONS, default: "" },
      {
        name: "type",
        kind: "select",
        options: ["text", "email", "password", "number", "search", "url"],
        default: "text",
      },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-checkbox",
    title: "Checkbox",
    description: "Boolean toggle with an inline label.",
    defaultSlot: "Enable autoscaling",
    props: [
      { name: "checked", kind: "boolean", default: false },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-icon",
    title: "Icon",
    description: "Inline stroke icon. The full set of available names is exported as `iconPaths`.",
    props: [
      { name: "name", kind: "select", options: Object.keys(iconPaths) as IconName[], default: "settings" },
      { name: "size", kind: "number", default: 16 },
      { name: "stroke-width", kind: "number", default: 1.6 },
    ],
  },
  {
    tag: "hex-logo",
    title: "Logo",
    description:
      "Brand wordmark. `mark-only` swaps to the standalone hex mark for tight spaces (favicons, avatar slots).",
    previewSurface: "page",
    props: [
      { name: "width", kind: "number", default: 200 },
      { name: "mark-only", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-chexagon",
    title: "Chexagon",
    description: "Verification badge: hex shape with a checkmark. Default tone is the artist amber-orange.",
    props: [
      {
        name: "tone",
        kind: "select",
        options: ["primary", ...tagCategories, ...userRoles].filter((v, i, a) => a.indexOf(v) === i),
        default: "artist",
      },
      { name: "size", kind: "number", default: 18 },
    ],
  },
  {
    tag: "hex-chip",
    title: "Chip",
    description: "Generic inline chip for filter tokens, removable selections, and small status pills.",
    defaultSlot: "filter: errors",
    props: [
      { name: "active", kind: "boolean", default: false },
      { name: "pill", kind: "boolean", default: false, description: "Switch to fully rounded shape." },
      { name: "removable", kind: "boolean", default: false },
      { name: "interactive", kind: "boolean", default: false, description: "Adds hover affordance." },
    ],
  },
  {
    tag: "hex-tag",
    title: "Tag",
    description: "Category-tinted tag with a colored dot, used in tag clouds and listings.",
    defaultSlot: "rowan",
    props: [
      {
        name: "category",
        kind: "select",
        options: tagCategories,
        default: "artist",
      },
    ],
  },
  {
    tag: "hex-status-pill",
    title: "Status pill",
    description: "Compact health indicator. Shows a label and colored dot per status.",
    props: [
      { name: "status", kind: "select", options: ["healthy", "degraded", "failing", "idle"], default: "healthy" },
    ],
  },
  {
    tag: "hex-kbd",
    title: "Keyboard hint",
    description: "Small monospace key cap. Use for keyboard shortcut hints in tooltips and help surfaces.",
    defaultSlot: "⌘K",
    props: [],
  },
  {
    tag: "hex-avatar",
    title: "Avatar",
    description: "Stroke-only rounded square avatar. Tinted by user role. Falls back to two-letter initials.",
    props: [
      { name: "role-color", kind: "select", options: userRoles, default: "member" },
      { name: "size", kind: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "md" },
      { name: "initials", kind: "text", default: "RK" },
      { name: "src", kind: "text", default: "" },
    ],
  },
  {
    tag: "hex-username",
    title: "Username",
    description:
      "Role-tinted username text. Adds a strikethrough for blocked users and an optional verified chexagon badge.",
    defaultSlot: "rowan",
    props: [
      { name: "role-color", kind: "select", options: userRoles, default: "member" },
      { name: "verified", kind: "boolean", default: false },
      {
        name: "verified-as",
        kind: "select",
        options: ["primary", ...tagCategories, ...userRoles].filter((v, i, a) => a.indexOf(v) === i),
        default: "artist",
      },
      { name: "href", kind: "text", default: "" },
    ],
  },
  {
    tag: "hex-quote",
    title: "Quote",
    description: "Inline rounded quote block with a left-side accent stripe.",
    defaultSlot: "The hex tile is the brand. Every full-page surface uses a tiled hex pattern.",
    props: [
      { name: "variant", kind: "select", options: ["default", "alt", "warn"], default: "default" },
      { name: "cite", kind: "text", default: "README.md, Visual Foundations" },
    ],
  },
  {
    tag: "hex-section",
    title: "Section",
    description: "Collapsible section with a heading, rotating chevron, and optional badge.",
    defaultSlot: "Region: us-east-1. Nodes: 12. Version: 2.14.0.",
    previewSurface: "page",
    props: [
      { name: "heading", kind: "text", default: "Cluster configuration" },
      { name: "badge", kind: "text", default: "12" },
      { name: "open", kind: "boolean", default: true },
    ],
  },
  {
    tag: "hex-code",
    title: "Code",
    description: "Monospace code element. Inline by default; set `block` for a preformatted block.",
    defaultSlot: '--hex-color-primary',
    props: [
      { name: "block", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-spoiler",
    title: "Spoiler",
    description: "Inline censor that reveals on hover (desktop) or tap (mobile). Wraps cleanly across lines.",
    defaultSlot: "the Guardian of the Hexagon",
    props: [],
  },
  {
    tag: "hex-alert",
    title: "Alert",
    description:
      "Banner with variant tint, leading icon, optional heading, message body, action slot, and a close button.",
    defaultSlot: "All 12 nodes updated to version 2.15.0",
    previewSurface: "page",
    props: [
      {
        name: "variant",
        kind: "select",
        options: ["success", "error", "warning", "info"],
        default: "success",
      },
      { name: "heading", kind: "text", default: "Deployment successful" },
      { name: "no-close", kind: "boolean", default: false },
    ],
  },
];

export function findComponent(tag: string): ComponentEntry | undefined {
  return components.find((c) => c.tag === tag);
}
