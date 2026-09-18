import { iconPaths, type IconName } from "../../src/shared/icons.js";

const ICON_OPTIONS: string[] = ["", ...Object.keys(iconPaths)];

export type ControlKind = "select" | "boolean" | "text" | "number";

export type PreviewSurface = "page" | "card" | "empty";

export type ComponentGroup =
  | "Surfaces"
  | "Layout"
  | "Form"
  | "Overlay"
  | "Content"
  | "Tokens"
  | "User"
  | "Brand";

export const GROUP_ORDER: ComponentGroup[] = [
  "Surfaces",
  "Layout",
  "Form",
  "Overlay",
  "Content",
  "Tokens",
  "User",
  "Brand",
];

export interface PropSpec {
  name: string;
  kind: ControlKind;
  options?: string[];
  default?: string | number | boolean;
  description?: string;
}

export interface UsageExample {
  /** Guideline copy. Inline markdown supported (`code`, **bold**, *italic*, [link](url)). */
  text: string;
  /** Optional live demo markup rendered below the text. */
  demo?: string;
}

export interface ComponentEntry {
  tag: string;
  title: string;
  description: string;
  group: ComponentGroup;
  defaultSlot?: string;
  /** Optional named slot content for slots like alert's "actions" or section's "heading" */
  namedSlots?: Record<string, string>;
  /** Surface the playground should render on. Defaults to "card". */
  previewSurface?: PreviewSurface;
  /** Fixed height (in px) of the playground iframe. Defaults to 280. */
  previewHeight?: number;
  /**
   * Extra markup injected into the playground iframe but NOT shown in the
   * Markup snippet. Use for openers (a button that triggers a modal), wiring
   * scaffolding, or anything that's part of the demo but not the canonical
   * usage of the component itself.
   */
  previewExtras?: string;
  props: PropSpec[];
  /** When-to-use guidance. Each entry is a guideline + optional live demo. */
  usage?: UsageExample[];
}

export const DEFAULT_PREVIEW_HEIGHT = 180;

const userRoles = ["member", "privileged", "blocked", "former-staff", "janitor", "moderator", "admin"];
const tagCategories = ["artist", "contributor", "copyright", "character", "species", "general", "meta", "lore", "invalid"];

export const components: ComponentEntry[] = [
  {
    tag: "hex-page",
    title: "Page",
    group: "Surfaces",
    description:
      "Full-bleed page surface. Wraps a route or app shell with the brand navy background and tiled hex pattern.",
    defaultSlot: `
      <div style="text-align: center; padding: 36px 24px; max-width: 560px; margin: 0 auto;">
        <hex-logo width="200"></hex-logo>
        <p style="margin: 14px 0 0; opacity: 0.85; line-height: 1.5; font-size: 13px;">
          A dark, navy-on-amber design system anchored in a repeating hexagonal tile pattern.
          Utilitarian, slightly technical, and content-first.
        </p>
      </div>`,
    previewSurface: "empty",
    previewHeight: 360,
    props: [],
  },
  {
    tag: "hex-card",
    title: "Card",
    group: "Surfaces",
    previewHeight: 260,
    description:
      "Standard card surface with the brand hex-texture watermark fading down from the top. Use for grouped content.",
    defaultSlot: `
      <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 700;">Cluster configuration</h3>
      <p style="margin: 0 0 12px; line-height: 1.55;">
        Cards group related content on a textured surface. The hex-texture watermark fades
        from dense at the top to clear at the bottom, giving each card a subtle visual anchor
        without competing with the content.
      </p>
      <p style="margin: 0; line-height: 1.55; color: var(--hex-fg-2); font-size: 12px;">
        Region us-east-1 &middot; 12 nodes &middot; Version 2.14.0
      </p>`,
    previewSurface: "page",
    props: [
      { name: "dense", kind: "boolean", default: false, description: "Drops padding to 16px for dense data." },
      { name: "flat", kind: "boolean", default: false, description: "Removes texture and shadow for nested cards." },
    ],
  },
  {
    tag: "hex-button",
    title: "Button",
    group: "Form",
    description:
      "Action element. Three visual variants, three colors, three sizes, optional leading icon, and an icon-only mode.",
    defaultSlot: "Save changes",
    usage: [
      {
        text: "Use the **solid primary** button for the main action of a view: save, submit, continue, run. Reserve it for the action you want the user to take.",
        demo: '<hex-button>Save changes</hex-button>',
      },
      {
        text: "Use **raised** for actions that should feel physical, where the click is the point rather than a step in a form. The lip is the button's own dark shade, and the press consumes it so the footprint never changes.",
        demo:
          '<hex-button variant="raised">Save changes</hex-button> <hex-button variant="raised" color="secondary">Reload</hex-button> <hex-button variant="raised" color="danger" icon="trash">Delete</hex-button>',
      },
      {
        text: "Use **outline** for the cancel or alternative paired with a primary action. **Primary action goes on the right** so the visual flow ends on action, not on retreat.",
        demo:
          '<hex-button variant="outline" color="secondary">Cancel</hex-button> <hex-button>Save changes</hex-button>',
      },
      {
        text: "Use **ghost** for tertiary or in-line actions where a full button would be too loud: in toolbars, alert footers, table rows.",
        demo:
          '<hex-button variant="ghost" color="secondary" icon="settings">Configure</hex-button> <hex-button variant="ghost" color="secondary" icon="refresh">Reload</hex-button>',
      },
      {
        text: "Use `color=\"danger\"` to indicate **destructive actions** the user can't easily undo: delete, remove, revoke, force-restart. Pair with a confirmation step, and keep the destructive action on the right.",
        demo:
          '<hex-button variant="ghost" color="secondary">Cancel</hex-button> <hex-button color="danger" icon="trash">Delete cluster</hex-button>',
      },
      {
        text: "Pass a custom glyph with `slot=\"icon\"` when the built-in set doesn't carry it. Wrap it in a `hex-icon` so it picks up the button's icon sizing.",
        demo: '<hex-button variant="outline" color="secondary" icon-only aria-label="More"><hex-icon slot="icon" size="14"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"5\" r=\"1.6\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\"/><circle cx=\"12\" cy=\"19\" r=\"1.6\"/></svg></hex-icon></hex-button> <hex-button variant="outline" color="secondary"><hex-icon slot="icon" size="14"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"5\" r=\"1.6\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\"/><circle cx=\"12\" cy=\"19\" r=\"1.6\"/></svg></hex-icon>More</hex-button>',
      },
      {
        text: "Use **icon-only** for compact toolbars and action rails. Always pass `aria-label` so screen readers announce the action.",
        demo:
          '<hex-button icon-only icon="plus" aria-label="Add"></hex-button> <hex-button variant="outline" color="secondary" icon-only icon="refresh" aria-label="Reload"></hex-button> <hex-button variant="ghost" color="danger" icon-only icon="trash" aria-label="Delete"></hex-button>',
      },
    ],
    props: [
      {
        name: "variant",
        kind: "select",
        options: ["solid", "raised", "outline", "ghost"],
        default: "solid",
      },
      {
        name: "color",
        kind: "select",
        options: ["primary", "secondary", "danger"],
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
    group: "Form",
    previewHeight: 220,
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
    group: "Form",
    description: "Boolean toggle with an inline label.",
    defaultSlot: "Enable autoscaling",
    props: [
      { name: "checked", kind: "boolean", default: false },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-select",
    title: "Select",
    group: "Form",
    previewHeight: 220,
    description:
      "Native `<select>` styled to match the input. Options live as light-DOM `<option>` children for free keyboard nav, screen-reader behavior, and the mobile picker.",
    defaultSlot: `
      <option value="us-east-1">US East (Virginia)</option>
      <option value="us-west-2">US West (Oregon)</option>
      <option value="eu-west-1">EU West (Ireland)</option>
      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>`,
    props: [
      { name: "label", kind: "text", default: "Region" },
      { name: "value", kind: "text", default: "" },
      { name: "placeholder", kind: "text", default: "Choose a region" },
      { name: "hint", kind: "text", default: "Pick the closest data center." },
      { name: "error", kind: "text", default: "" },
      { name: "icon", kind: "select", options: ICON_OPTIONS, default: "" },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-switch",
    title: "Switch",
    group: "Form",
    description:
      "Toggle switch. Use for boolean settings where the on/off state is the point. The native checkbox underneath gets `role=\"switch\"` so assistive tech announces it correctly.",
    defaultSlot: "Enable telemetry",
    props: [
      { name: "checked", kind: "boolean", default: true },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-radio-group",
    title: "Radio group",
    group: "Form",
    previewHeight: 240,
    description:
      "Container for `<hex-radio>` children. Manages selection via `value`, propagates `name` to children, and fires `hex-change` on selection change.",
    defaultSlot: `
      <hex-radio value="public">Public client</hex-radio>
      <hex-radio value="confidential">Confidential client</hex-radio>
      <hex-radio value="internal" disabled>Internal (disabled)</hex-radio>`,
    props: [
      { name: "label", kind: "text", default: "Client type" },
      { name: "name", kind: "text", default: "client-type" },
      { name: "value", kind: "text", default: "public" },
      {
        name: "direction",
        kind: "select",
        options: ["vertical", "horizontal"],
        default: "vertical",
      },
    ],
  },
  {
    tag: "hex-icon",
    title: "Icon",
    group: "Brand",
    previewHeight: 120,
    description: "Inline stroke icon. The full set of available names is exported as `iconPaths`.",
    usage: [
      {
        text: "Set `name` to one of the built-in icons. The full set is exported as `iconPaths`.",
        demo: '<hex-icon name="settings" size="24"></hex-icon> <hex-icon name="bell" size="24"></hex-icon> <hex-icon name="trash" size="24"></hex-icon>',
      },
      {
        text: "Leave `name` unset and **slot your own SVG** for any glyph the set doesn't carry. The slotted icon is sized to `size`, so it lines up with the built-ins.",
        demo: '<hex-icon size="24"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"5\" r=\"1.6\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\"/><circle cx=\"12\" cy=\"19\" r=\"1.6\"/></svg></hex-icon> <hex-icon name="settings" size="24"></hex-icon>',
      },
    ],
    props: [
      { name: "name", kind: "select", options: Object.keys(iconPaths) as IconName[], default: "settings" },
      { name: "size", kind: "number", default: 16 },
      { name: "stroke-width", kind: "number", default: 1.6 },
    ],
  },
  {
    tag: "hex-chexagon",
    title: "Chexagon",
    group: "Brand",
    previewHeight: 120,
    description: "Verification badge: hex shape with a checkmark, in the brand artist amber-orange.",
    props: [
      { name: "size", kind: "number", default: 18 },
    ],
  },
  {
    tag: "hex-chip",
    title: "Chip",
    group: "Tokens",
    previewHeight: 120,
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
    group: "Tokens",
    previewHeight: 120,
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
    tag: "hex-divider",
    title: "Divider",
    group: "Layout",
    previewHeight: 160,
    description: "Rule separating content. Horizontal or vertical, optionally labelled.",
    usage: [
      {
        text: "Use a plain divider to separate sections of related content. Prefer spacing alone when the grouping is already obvious.",
        demo: '<div style="width:320px"><hex-divider></hex-divider></div>',
      },
      {
        text: "Use **subtle** inside an already-bordered surface such as a card, where a full-strength rule would compete with the container edge.",
        demo: '<div style="width:320px"><hex-divider subtle></hex-divider></div>',
      },
      {
        text: "Slot text to **label** the break. Useful for separating a primary path from a fallback, such as a login form and its alternatives.",
        demo: '<div style="width:320px"><hex-divider>or</hex-divider></div>',
      },
      {
        text: "Use `orientation=\"vertical\"` between inline items in a toolbar or action row.",
        demo: '<div style="display:flex;align-items:center;gap:12px;height:32px"><hex-button variant="ghost" color="secondary" icon="eye">View</hex-button><hex-divider orientation="vertical"></hex-divider><hex-button variant="ghost" color="secondary" icon="trash">Delete</hex-button></div>',
      },
    ],
    props: [
      { name: "orientation", kind: "select", options: ["horizontal", "vertical"], default: "horizontal" },
      { name: "subtle", kind: "boolean", default: false },
      { name: "inset", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-skeleton",
    title: "Skeleton",
    group: "Layout",
    previewHeight: 200,
    description: "Placeholder that reserves the exact box its content will occupy.",
    defaultSlot: "Kesha Rosalind Aldritch has been a contributor since 2019.",
    usage: [
      {
        text: "**Slot the text you are waiting for.** The skeleton renders it transparent over a shaded background, so it occupies the exact box, wraps at the same points, and the last line is short because the sentence is. Nothing moves when the real content arrives.",
        demo: '<div style="width:320px"><hex-skeleton>Kesha Rosalind Aldritch has been a contributor since 2019.</hex-skeleton></div>',
      },
      {
        text: "Slot nothing and you get abstract bars instead. Use these only when the content is genuinely unknown, such as a list whose length has not arrived yet, and remember `lines` is a guess where slotted text is a measurement.",
        demo: '<div style="width:320px"><hex-skeleton lines="3"></hex-skeleton></div>',
      },
      {
        text: "Use `aspect` for media, so the box is reserved before the image knows its own size.",
        demo: '<div style="width:220px"><hex-skeleton shape="block" aspect="16/9"></hex-skeleton></div>',
      },
      {
        text: "Match the shape of what is loading: **circle** for avatars, **pill** for chips and tags.",
        demo: '<div style="display:flex;gap:10px;align-items:center"><hex-skeleton shape="circle" width="36px" height="36px"></hex-skeleton><hex-skeleton shape="pill" width="90px" height="20px"></hex-skeleton></div>',
      },
    ],
    props: [
      { name: "shape", kind: "select", options: ["text", "block", "circle", "pill"], default: "text" },
      { name: "lines", kind: "number", default: 1 },
      { name: "width", kind: "text", default: "" },
      { name: "height", kind: "text", default: "" },
      { name: "aspect", kind: "text", default: "" },
    ],
  },
  {
    tag: "hex-spinner",
    title: "Spinner",
    group: "Layout",
    previewHeight: 140,
    description: "Indeterminate activity indicator for work with no measurable progress.",
    usage: [
      {
        text: "Use a spinner only where the wait has **no known extent** and no layout to reserve. Where content is arriving into a known box, a skeleton is better, because it reserves the space instead of occupying it.",
        demo: '<hex-spinner size="16"></hex-spinner> <hex-spinner size="24"></hex-spinner> <hex-spinner size="32"></hex-spinner>',
      },
      {
        text: "Inside a button, keep the label so the button does not resize while the action is in flight.",
        demo: '<hex-button><hex-spinner slot="icon" size="14"></hex-spinner>Saving</hex-button>',
      },
    ],
    props: [
      { name: "size", kind: "number", default: 16 },
      { name: "stroke-width", kind: "number", default: 2 },
      { name: "label", kind: "text", default: "Loading" },
    ],
  },
  {
    tag: "hex-tooltip",
    title: "Tooltip",
    group: "Overlay",
    description: "Short description for the element before it. Shows on hover and on focus.",
    defaultSlot: "Runs a full resync. This can take several minutes.",
    previewHeight: 200,
    previewExtras: `
      <hex-button>Hover or focus me</hex-button>
    `,
    usage: [
      {
        text: "Place the tooltip **immediately after** the element it describes. It wires `aria-describedby` to itself, so the description reaches screen readers as well as pointers.",
        demo: '<hex-button icon="refresh">Resync</hex-button> <hex-tooltip>Runs a full resync. This can take several minutes.</hex-tooltip>',
      },
      {
        text: "A tooltip must never carry the only copy of something important. It is unavailable to touch users and disappears on Escape, so treat it as a hint rather than as content.",
        demo: '<hex-button variant="outline" color="secondary" icon-only icon="refresh" aria-label="Reload"></hex-button> <hex-tooltip placement="bottom">Reload the current view</hex-tooltip>',
      },
    ],
    props: [
      { name: "placement", kind: "select", options: ["top", "bottom", "left", "right"], default: "top" },
      { name: "delay", kind: "number", default: 150 },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-menu",
    title: "Menu",
    group: "Overlay",
    description: "Menu anchored to the element before it, with full keyboard navigation.",
    defaultSlot: `
      <hex-menu-item value="rename" icon="settings">Rename</hex-menu-item>
      <hex-menu-item value="duplicate" icon="layers">Duplicate</hex-menu-item>
      <hex-menu-item value="delete" icon="trash" danger>Delete</hex-menu-item>
    `,
    previewHeight: 280,
    previewExtras: `
      <hex-button variant="outline" color="secondary">Actions</hex-button>
    `,
    usage: [
      {
        text: "Put the menu **after its trigger**. It sets `aria-haspopup` and `aria-expanded` on the trigger, opens on click or arrow key, moves with arrows and Home/End, and returns focus to the trigger when it closes.",
        demo: '<hex-button variant="outline" color="secondary" icon-only aria-label="More"><hex-icon slot=\"icon\" size=\"14\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"5\" r=\"1.6\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\"/><circle cx=\"12\" cy=\"19\" r=\"1.6\"/></svg></hex-icon></hex-button> <hex-menu><hex-menu-item value="rename" icon="settings">Rename</hex-menu-item><hex-menu-item value="duplicate" icon="layers">Duplicate</hex-menu-item><hex-menu-item value="delete" icon="trash" danger>Delete</hex-menu-item></hex-menu>',
      },
      {
        text: "Mark destructive entries with **danger**, and keep them last so the pointer does not pass over them on the way to anything else.",
        demo: '<hex-button>Actions</hex-button> <hex-menu align="start"><hex-menu-item icon="download">Export CSV</hex-menu-item><hex-menu-item icon="refresh">Resync</hex-menu-item><hex-menu-item icon="trash" danger>Delete cluster</hex-menu-item></hex-menu>',
      },
    ],
    props: [
      { name: "placement", kind: "select", options: ["bottom", "top", "left", "right"], default: "bottom" },
      { name: "align", kind: "select", options: ["start", "center", "end"], default: "start" },
    ],
  },
  {
    tag: "hex-popover",
    title: "Popover",
    group: "Overlay",
    description: "Positioning primitive for overlays. Flips and shifts to stay in the viewport.",
    defaultSlot: `<div style="padding:10px 14px">Anchored, flipped and shifted as needed</div>`,
    previewHeight: 240,
    previewExtras: `
      <hex-button>Open popover</hex-button>
    `,
    usage: [
      {
        text: "Use `hex-popover` directly only when building a new overlay. For descriptions reach for **tooltip**, for action lists reach for **menu**; both are built on this.",
        demo: '<hex-button id="pop-demo-trigger">Open popover</hex-button> <hex-popover placement="bottom"><div style="padding:10px 14px">Anchored, flipped and shifted as needed</div></hex-popover>',
      },
    ],
    props: [
      { name: "placement", kind: "select", options: ["bottom", "top", "left", "right"], default: "bottom" },
      { name: "align", kind: "select", options: ["center", "start", "end"], default: "center" },
      { name: "distance", kind: "number", default: 6 },
      { name: "open", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-status-pill",
    title: "Status pill",
    group: "Tokens",
    previewHeight: 120,
    description: "Compact health indicator. Shows a label and colored dot per status.",
    props: [
      { name: "status", kind: "select", options: ["healthy", "degraded", "failing", "idle"], default: "healthy" },
    ],
  },
  {
    tag: "hex-kbd",
    title: "Keyboard hint",
    group: "Tokens",
    previewHeight: 120,
    description: "Small monospace key cap. Use for keyboard shortcut hints in tooltips and help surfaces.",
    defaultSlot: "⌘K",
    props: [],
  },
  {
    tag: "hex-avatar",
    title: "Avatar",
    group: "User",
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
    group: "User",
    description:
      "Role-tinted username text. Adds a strikethrough for blocked users and an optional verified chexagon badge.",
    defaultSlot: "rowan",
    props: [
      { name: "role-color", kind: "select", options: userRoles, default: "member" },
      { name: "verified", kind: "boolean", default: false },
      { name: "href", kind: "text", default: "" },
    ],
  },
  {
    tag: "hex-quote",
    title: "Quote",
    group: "Content",
    description:
      "Inline rounded quote block with a left-side accent stripe. Set `stripe-color` (or the `--hex-quote-stripe` CSS variable) to use any CSS color.",
    defaultSlot: "The hex tile is the brand. Every full-page surface uses a tiled hex pattern.",
    props: [
      { name: "variant", kind: "select", options: ["default", "alt"], default: "default" },
      { name: "stripe-color", kind: "text", default: "", description: "Any CSS color overriding the variant." },
    ],
  },
  {
    tag: "hex-section",
    title: "Section",
    group: "Surfaces",
    previewHeight: 240,
    description:
      "Collapsible section. Slot any HTML into `name=\"heading\"` (badges, links, icons) and `name=\"trailing\"` for header-flush actions.",
    defaultSlot: "Region: us-east-1. Nodes: 12. Version: 2.14.0.",
    namedSlots: {
      heading:
        'Cluster configuration <hex-chip pill style="font-size: 10px; padding: 2px 8px;">12</hex-chip>',
    },
    previewSurface: "page",
    props: [{ name: "open", kind: "boolean", default: true }],
  },
  {
    tag: "hex-code",
    title: "Code",
    group: "Content",
    previewHeight: 140,
    description: "Monospace code element. Inline by default; set `block` for a preformatted block.",
    defaultSlot: "--hex-color-primary",
    props: [{ name: "block", kind: "boolean", default: false }],
  },
  {
    tag: "hex-spoiler",
    title: "Spoiler",
    group: "Content",
    previewHeight: 140,
    description: "Inline censor that reveals on hover (desktop) or tap (mobile). Wraps cleanly across lines.",
    defaultSlot: "the Guardian of the Hexagon",
    props: [],
  },
  {
    tag: "hex-dialog",
    title: "Dialog",
    group: "Surfaces",
    description:
      "Modal dialog backed by the native `<dialog>` element. Free focus trap, ESC-to-close, top-layer rendering, and proper aria role. Slots: `heading`, default body, `actions` (primary on the right).",
    defaultSlot:
      "This will permanently remove the cluster and all of its data. This action cannot be undone.",
    namedSlots: {
      heading: "Delete cluster?",
      actions:
        '<hex-button slot="actions" variant="outline" color="secondary">Cancel</hex-button><hex-button slot="actions" color="danger">Delete</hex-button>',
    },
    previewSurface: "page",
    previewHeight: 400,
    previewExtras: `
      <hex-button onclick="document.querySelector('hex-dialog')?.show()">Open dialog</hex-button>
    `,
    props: [
      {
        name: "open",
        kind: "boolean",
        default: true,
        description:
          "Toggle to open as a modal. Covers the entire viewport while open.",
      },
      { name: "size", kind: "select", options: ["sm", "md", "lg"], default: "md" },
      {
        name: "no-close",
        kind: "boolean",
        default: false,
        description:
          "Hides the X, disables backdrop dismissal, and switches the role to `alertdialog`. Use for confirmations the user must explicitly acknowledge.",
      },
      {
        name: "no-backdrop-close",
        kind: "boolean",
        default: false,
        description: "Disable click-outside-to-close while keeping the X button.",
      },
    ],
    usage: [
      {
        text: "Trigger the dialog from a button by calling `.show()` on the element. ESC, the close button, or a backdrop click all dismiss it.",
        demo: `
          <hex-button onclick="document.getElementById('demo-info').show()">Open dialog</hex-button>
          <hex-dialog id="demo-info">
            <span slot="heading">Cluster details</span>
            Region us-east-1, 12 nodes, version 2.14.0. Auto-scaling enabled at 68% capacity.
            <hex-button slot="actions" variant="outline" color="secondary"
              onclick="document.getElementById('demo-info').close()">Close</hex-button>
          </hex-dialog>
        `,
      },
      {
        text: "Set `no-close` for confirmations the user must explicitly acknowledge. The X disappears, backdrop clicks are ignored, the role becomes `alertdialog`, and dismissal must go through one of the action buttons.",
        demo: `
          <hex-button color="danger" onclick="document.getElementById('demo-confirm').show()">Delete cluster</hex-button>
          <hex-dialog id="demo-confirm" no-close>
            <span slot="heading">Delete cluster?</span>
            This will permanently remove the cluster and all of its data. This action cannot be undone.
            <hex-button slot="actions" variant="outline" color="secondary"
              onclick="document.getElementById('demo-confirm').close()">Cancel</hex-button>
            <hex-button slot="actions" color="danger"
              onclick="document.getElementById('demo-confirm').close('confirmed')">Delete</hex-button>
          </hex-dialog>
        `,
      },
      {
        text: "Listen for the `hex-close` event to react to dismissal. The event detail includes the `returnValue` passed to `.close(value)` so you can tell confirm from cancel.",
      },
    ],
  },
  {
    tag: "hex-alert",
    title: "Alert",
    group: "Content",
    description:
      "Banner with variant tint, leading icon, heading slot, message body, action slot, and a close button. Click the close button to fire the `hex-dismiss` event; the element removes itself unless the event is `preventDefault()`'d.",
    defaultSlot: "All 12 nodes updated to version 2.15.0",
    namedSlots: {
      heading: "Deployment successful",
      actions:
        '<hex-button slot="actions" variant="ghost" color="secondary" size="sm">View logs</hex-button><hex-button slot="actions" variant="ghost" color="secondary" size="sm">Details</hex-button>',
    },
    previewSurface: "page",
    previewHeight: 320,
    props: [
      {
        name: "variant",
        kind: "select",
        options: ["success", "error", "warning", "info"],
        default: "success",
      },
      { name: "no-close", kind: "boolean", default: false },
    ],
  },
];

export function findComponent(tag: string): ComponentEntry | undefined {
  return components.find((c) => c.tag === tag);
}
