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
          A dark design system for e621 surfaces. Amber on navy, anchored in a repeating
          hexagonal tile, and built for pages of tags, text and forms.
        </p>
      </div>`,
    previewSurface: "empty",
    previewHeight: 360,
    usage: [
      {
        text: "Wrap a whole view. It paints the page background and the hexagon tile, so nothing below it needs to. Use one per view, not one per section. The preview above is the page itself, at full bleed; there is no sensible way to show a page surface inside a card.",
      },
    ],
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
    usage: [
      {
        text: "Group content that belongs together on one surface. A card is the default home for content; reach for it before inventing a container.",
        demo: '<hex-card style="padding:14px;max-width:320px">Content on the standard surface.</hex-card>',
      },
      {
        text: "Use **dense** in lists and rows where full padding wastes vertical space, and **flat** when a card sits inside another card and a second shadow would muddy the stack.",
        demo: '<div style="display:flex;gap:10px"><hex-card dense style="padding:10px">Dense</hex-card><hex-card flat style="padding:10px">Flat</hex-card></div>',
      },
    ],
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
    usage: [
      {
        text: "To join a field to a button, square off the edges where they meet with `::part`. The focus ring still wraps the field correctly, so this needs no wrapper element:\n\n`hex-input::part(control) { border-top-right-radius: 0; border-bottom-right-radius: 0 }`\n\n`hex-button::part(base) { border-top-left-radius: 0; border-bottom-left-radius: 0 }`",
        demo: '<div style="display:flex;align-items:stretch;width:300px"><style>.ig hex-input::part(control){border-top-right-radius:0;border-bottom-right-radius:0}.ig hex-button::part(base){border-top-left-radius:0;border-bottom-left-radius:0}</style><span class="ig" style="display:flex;width:100%"><hex-input value="wolf" style="flex:1"></hex-input><hex-button>Search</hex-button></span></div>',
      },
      {
        text: "Always give it a **label**. A placeholder is not a label: it disappears the moment someone types, which is exactly when they need to check what the field wanted.",
        demo: '<div style="width:280px"><hex-input label="Cluster name" placeholder="production-1"></hex-input></div>',
      },
      {
        text: "Use **hint** for guidance that is always true, and **error** for what went wrong this time. Setting `error` marks the field invalid and announces the message.",
        demo: '<div style="width:280px;display:flex;flex-direction:column;gap:10px"><hex-input label="Name" hint="Lowercase, no spaces"></hex-input><hex-input label="Name" value="Bad Name" error="Lowercase letters only"></hex-input></div>',
      },
    ],
    props: [
      { name: "label", kind: "text", default: "Cluster name" },
      { name: "size", kind: "select", options: ["sm", "md", "lg"], default: "md" },
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
    tag: "hex-textarea",
    title: "Textarea",
    group: "Form",
    previewHeight: 320,
    description: "Multi-line text field. Reserves its height and resizes by hand, never on its own.",
    usage: [
      {
        text: "Textareas **reserve their height and never grow on their own**. An autogrowing field pushes everything below it down on each new line, which is a layout shift the reader is causing by typing. Give it the room it needs and let people drag it.",
        demo: '<div style="width:340px"><hex-textarea label="Reason" hint="Visible to the user" rows="4"></hex-textarea></div>',
      },
      {
        text: "Add **counter** with a `maxlength` where the limit is real. The count turns danger-coloured past the limit, and it is announced politely rather than on every keystroke.",
        demo: '<div style="width:340px"><hex-textarea label="Bio" counter maxlength="80" rows="3" value="Contributor since 2019."></hex-textarea></div>',
      },
      {
        text: "It participates in forms like a native control: it submits under its `name`, honours `required`, and pairs with an external `label` through `for`.",
        demo: '<div style="width:340px"><hex-textarea label="Notes" required error="This field is required" rows="3"></hex-textarea></div>',
      },
    ],
    props: [
      { name: "label", kind: "text", default: "" },
      { name: "value", kind: "text", default: "" },
      { name: "placeholder", kind: "text", default: "" },
      { name: "hint", kind: "text", default: "" },
      { name: "error", kind: "text", default: "" },
      { name: "rows", kind: "number", default: 6 },
      { name: "maxlength", kind: "number", default: "" },
      { name: "counter", kind: "boolean", default: false },
      { name: "required", kind: "boolean", default: false },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-checkbox",
    title: "Checkbox",
    group: "Form",
    description: "Boolean toggle with an inline label.",
    defaultSlot: "Enable autoscaling",
    usage: [
      {
        text: "Use a checkbox for an option that stands alone, where the alternative is simply not choosing it. For a setting that applies the moment it is flipped, reach for **switch**.",
        demo: '<hex-checkbox checked>Include archived</hex-checkbox>',
      },
      {
        text: "Write the label as the **positive** outcome. A negative label makes the unchecked state a double negative, which nobody parses correctly under time pressure.",
        demo: '<div style="display:flex;flex-direction:column;gap:8px"><hex-checkbox>Send notifications</hex-checkbox><hex-checkbox disabled>Unavailable option</hex-checkbox></div>',
      },
    ],
    props: [
      { name: "checked", kind: "boolean", default: false },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-select",
    title: "Select",
    group: "Form",
    previewHeight: 360,
    description:
      "Picker for one value out of a known set. Options are ordinary `<option>` children, or `<hex-option>` when a row needs a category tint, a count or an antecedent.",
    defaultSlot: `
      <option value="us-east-1">US East (Virginia)</option>
      <option value="us-west-2">US West (Oregon)</option>
      <option value="eu-west-1">EU West (Ireland)</option>
      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>`,
    usage: [
      {
        text: "Use a select once the options outgrow a radio group, roughly past five. Below that, showing every option at once costs less effort than opening a list.",
        demo: '<div style="width:260px"><hex-select label="Region"><option value="eu">Europe</option><option value="us">North America</option><option value="ap">Asia Pacific</option></hex-select></div>',
      },
      {
        text: "Give it a **placeholder** only when choosing nothing is valid. If a value is always required, preselect a sensible default rather than making people open the list to find one.",
        demo: '<div style="width:260px"><hex-select label="Owner" placeholder="Unassigned"><option>Ada</option><option>Grace</option></hex-select></div>',
      },
      {
        text: "Swap `<option>` for `<hex-option>` when a row needs more than a label. It takes **category** to tint the label with the matching tag colour, **count** to show a right-aligned figure in compact notation, and **antecedent** for a name the option resolves away from.",
        demo: '<div style="width:280px"><hex-select label="Tag" placeholder="Pick a tag"><hex-option value="wolf" label="wolf" category="species" count="88400"></hex-option><hex-option value="patreon" label="patreon" category="meta" count="4120"></hex-option><hex-option value="canine" label="canine" category="species" count="512000" antecedent="dog"></hex-option></hex-select></div>',
      },
      {
        text: "Plain `<option>` reaches the same rendering through `data-category` and `data-count`, which is easier when the markup comes from a template that only emits standard options.",
        demo: '<div style="width:280px"><hex-select label="Tag" placeholder="Pick a tag"><option value="wolf" data-category="species" data-count="88400">wolf</option><option value="patreon" data-category="meta" data-count="4120">patreon</option></hex-select></div>',
      },
      {
        text: "Both this and `hex-autocomplete` are built on `hex-listbox`, which owns highlight state, wrap-around movement, typeahead and click-to-select. It is exported for building a new combobox-like control, but reach for it only then: focus stays on the field and `aria-activedescendant` points at the option, so a listbox on its own does nothing useful.",
      },
    ],
    props: [
      { name: "label", kind: "text", default: "Region" },
      { name: "size", kind: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "value", kind: "text", default: "" },
      { name: "placeholder", kind: "text", default: "Choose a region" },
      { name: "hint", kind: "text", default: "Pick the closest data center." },
      { name: "error", kind: "text", default: "" },
      { name: "icon", kind: "select", options: ICON_OPTIONS, default: "" },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-autocomplete",
    title: "Autocomplete",
    group: "Form",
    previewHeight: 320,
    description:
      "Text field that suggests values as you type. Use it when the valid answers are too many to list, such as tags or users.",
    usage: [
      {
        text: "Suggestions come from one of two places: **source** for a fixed list, or a **provider** for anything that must be looked up, such as a server or a search index. A provider defines what counts as a match and may be async. Debouncing, responses that arrive out of order, keyboard navigation and screen-reader wiring are already covered.",
      },
      {
        text: "A provider may also define what gets written into the field when a suggestion is picked, and how a row is rendered. This matters for a field holding several values at once, such as a tag search, where picking a suggestion should replace only the word under the cursor rather than the whole box.",
      },
      {
        text: "With a fixed **source**, matching is a case-insensitive substring and the matched run is underlined so people can see why a row is there.",
        demo: '<div style="width:280px"><hex-autocomplete label="Species" placeholder="Start typing" source="canine, feline, equine, avian, reptile, cervine"></hex-autocomplete></div>',
      },
      {
        text: "Set **min-length** when results cost a network round trip, so a single character does not fan out. Wildcards (`*`) do not count toward the threshold.",
        demo: '<div style="width:280px"><hex-autocomplete label="Tag" min-length="3" hint="Three characters minimum" source="character, copyright, conditional_dnp, contributor"></hex-autocomplete></div>',
      },
      {
        text: "Give **empty** a string to keep the panel open with a no-matches message. Leave it unset and the panel simply closes, which suits fields where an unmatched value is still valid.",
        demo: '<div style="width:280px"><hex-autocomplete label="Artist" empty="No artists found" source="ada, grace, alan"></hex-autocomplete></div>',
      },
      {
        text: "Hold <kbd>Ctrl</kbd> while picking with click, <kbd>Enter</kbd>, or <kbd>Tab</kbd> to insert and keep the list open. Pair it with a provider whose `insert` splices one word so people can complete several terms in one field without reopening.",
      },
    ],
    props: [
      { name: "label", kind: "text", default: "Tag" },
      { name: "size", kind: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "value", kind: "text", default: "" },
      { name: "placeholder", kind: "text", default: "Start typing" },
      {
        name: "source",
        kind: "text",
        default: "canine, feline, equine, avian, reptile, cervine, bovine",
      },
      { name: "empty", kind: "text", default: "No matches" },
      { name: "hint", kind: "text", default: "" },
      { name: "error", kind: "text", default: "" },
      { name: "icon", kind: "select", options: ICON_OPTIONS, default: "" },
      { name: "min-length", kind: "number", default: 1 },
      { name: "max-results", kind: "number", default: 15 },
      { name: "delay", kind: "number", default: 225 },
      { name: "disabled", kind: "boolean", default: false },
    ],
  },
  {
    tag: "hex-switch",
    title: "Switch",
    group: "Form",
    description:
      "Toggle for a setting that takes effect the moment it is flipped. Use it where the on and off states are the point, rather than something applied on save.",
    defaultSlot: "Enable telemetry",
    usage: [
      {
        text: "Use a switch for a setting that **takes effect immediately**. If the change only applies once a form is submitted, use a checkbox, because a switch promises the change already happened.",
        demo: '<hex-switch checked>Safe mode</hex-switch>',
      },
      {
        text: "Label the thing being switched, not the action. Safe mode reads correctly in both states, where Enable safe mode reads as a button and goes wrong once it is already on.",
        demo: '<div style="display:flex;flex-direction:column;gap:8px"><hex-switch>Compact rows</hex-switch><hex-switch checked disabled>Locked by policy</hex-switch></div>',
      },
    ],
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
      "A set of radios where exactly one can be chosen. Use it below roughly five options, where showing every choice at once costs less than opening a list.",
    defaultSlot: `
      <hex-radio value="public">Public client</hex-radio>
      <hex-radio value="confidential">Confidential client</hex-radio>
      <hex-radio value="internal" disabled>Internal (disabled)</hex-radio>`,
    usage: [
      {
        text: "Use a radio group when the options are few and worth comparing side by side. Every option stays visible, which is the whole advantage over a select.",
        demo: '<hex-radio-group label="Visibility" name="vis" value="team"><hex-radio value="private">Private</hex-radio><hex-radio value="team">Team</hex-radio><hex-radio value="public">Public</hex-radio></hex-radio-group>',
      },
      {
        text: "Use horizontal direction only for two or three short labels. Beyond that the eye loses the association between a label and its control.",
        demo: '<hex-radio-group label="Sort" name="sort" value="new" direction="horizontal"><hex-radio value="new">Newest</hex-radio><hex-radio value="old">Oldest</hex-radio></hex-radio-group>',
      },
    ],
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
    tag: "hex-logo",
    title: "Logo",
    group: "Brand",
    previewHeight: 180,
    previewSurface: "page",
    description: "Wordmark and mark. Sizes by width; height follows the aspect ratio.",
    usage: [
      {
        text: "Set **width** and leave height alone. The element holds its own aspect ratio, so nothing reflows once it paints.",
        demo: '<hex-logo width="200"></hex-logo>',
      },
      {
        text: "Use **mark-only** where the wordmark will not fit or would repeat something already on screen, such as a collapsed sidebar or a favicon-sized slot.",
        demo: '<div style="display:flex;gap:20px;align-items:center"><hex-logo width="150"></hex-logo><hex-logo mark-only width="40"></hex-logo></div>',
      },
      {
        text: "Both colours are overridable for placement on an unusual surface, but leave them alone by default: the amber mark on white wordmark is the brand.",
        demo: '<hex-logo width="170" color="#b4c7d9" mark-color="#b4c7d9"></hex-logo>',
      },
    ],
    props: [
      { name: "width", kind: "number", default: 160 },
      { name: "mark-only", kind: "boolean", default: false },
      { name: "color", kind: "text", default: "#fff" },
      { name: "mark-color", kind: "text", default: "" },
    ],
  },
  {
    tag: "hex-chexagon",
    title: "Chexagon",
    group: "Brand",
    previewHeight: 120,
    description: "Verification badge: hex shape with a checkmark, in the brand artist amber-orange.",
    usage: [
      {
        text: "Use it beside a name or a tag that has been verified, never as decoration. The badge means a claim was checked, so it stops meaning anything if it appears without one.",
        demo: '<span style="display:inline-flex;align-items:center;gap:6px">rowan <hex-chexagon></hex-chexagon></span>',
      },
    ],
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
    usage: [
      {
        text: "Use a chip for a filter or a selection the reader can act on. Use **tag** instead for category-coloured metadata, which is read rather than toggled.",
        demo: '<div style="display:flex;gap:6px"><hex-chip interactive>All</hex-chip><hex-chip interactive active>Pending</hex-chip><hex-chip interactive>Approved</hex-chip></div>',
      },
      {
        text: "Add **removable** when the chip represents something the reader added and can take back, such as an applied filter.",
        demo: '<div style="display:flex;gap:6px"><hex-chip removable pill>status:open</hex-chip><hex-chip removable pill>owner:ada</hex-chip></div>',
      },
    ],
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
    description:
      "Category-tinted tag. The chip variant flows like words in a wrap; the row variant stacks into a sidebar list with a count and controls.",
    defaultSlot: "rowan",
    usage: [
      {
        text: "Tags are **read, not pressed**. The colour is the meaning, so it comes from the category rather than from anything about importance or state.",
        demo: '<div style="display:flex;gap:6px;flex-wrap:wrap"><hex-tag category="artist">rowan</hex-tag><hex-tag category="character">vale</hex-tag><hex-tag category="species">canine</hex-tag><hex-tag category="copyright">series</hex-tag></div>',
      },
      {
        text: "Keep the category truthful. A reader who knows the palette reads gold as artist and magenta as copyright, so mislabelling costs more than leaving a tag uncoloured would.",
        demo: '<div style="display:flex;gap:6px;flex-wrap:wrap"><hex-tag category="general">outdoors</hex-tag><hex-tag category="meta">hi_res</hex-tag><hex-tag category="lore">canon</hex-tag><hex-tag category="invalid">bad_tag</hex-tag><hex-tag category="contributor">helper</hex-tag></div>',
      },
      {
        text: "Switch to **row** for a vertical list. The chip border becomes a coloured leading edge, which reads down a column where a full outline would fight the stack. Width follows the content, so the ragged right edge stays readable.",
        demo: '<div style="display:flex;flex-direction:column;gap:4px;width:220px"><hex-tag variant="row" category="artist" count="128">rowan</hex-tag><hex-tag variant="row" category="character" count="1200">vale</hex-tag><hex-tag variant="row" category="species" count="512000">canine</hex-tag></div>',
      },
      {
        text: "A **count** is formatted compactly, so a column of tags stays aligned whether a tag has been used twice or two million times.",
        demo: '<div style="display:flex;flex-direction:column;gap:4px;width:220px"><hex-tag variant="row" category="general" count="2">rare_tag</hex-tag><hex-tag variant="row" category="general" count="2100000">solo</hex-tag></div>',
      },
      {
        text: "Put per-tag controls in the **lead** and **actions** slots. Searching, excluding and blacklisting are decisions for the surrounding application, so the tag supplies the segments and the colour rather than the behaviour. Dividers appear only where a slot is filled.",
        demo: '<div style="display:flex;flex-direction:column;gap:4px;width:250px"><hex-tag variant="row" category="species" count="512000"><span slot="lead" style="display:flex"><a href="#" style="padding:0 5px;color:inherit;opacity:.7;text-decoration:none">?</a><a href="#" style="padding:0 5px;color:inherit;opacity:.7;text-decoration:none">+</a><a href="#" style="padding:0 5px;color:inherit;opacity:.7;text-decoration:none">&ndash;</a></span>canine</hex-tag><hex-tag variant="row" category="artist" count="128">no controls</hex-tag></div>',
      },
    ],
    props: [
      {
        name: "category",
        kind: "select",
        options: tagCategories,
        default: "artist",
      },
      { name: "variant", kind: "select", options: ["chip", "row"], default: "chip" },
      { name: "count", kind: "number", default: "" },
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
    previewHeight: 340,
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
    previewHeight: 320,
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
    usage: [
      {
        text: "Use it for the state of a system, not the outcome of an action. The label is fixed per status so the same state always reads the same way across views.",
        demo: '<div style="display:flex;gap:8px;flex-wrap:wrap"><hex-status-pill status="healthy"></hex-status-pill><hex-status-pill status="degraded"></hex-status-pill><hex-status-pill status="failing"></hex-status-pill><hex-status-pill status="idle"></hex-status-pill></div>',
      },
    ],
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
    usage: [
      {
        text: "Use it for keys the reader is meant to press. Write them as they appear on the keyboard, and give each key its own element so the separator is yours to choose.",
        demo: '<span>Press <hex-kbd>Ctrl</hex-kbd> + <hex-kbd>K</hex-kbd> to search, or <hex-kbd>Esc</hex-kbd> to dismiss.</span>',
      },
    ],
    props: [],
  },
  {
    tag: "hex-avatar",
    title: "Avatar",
    group: "User",
    description: "Stroke-only rounded square avatar. Tinted by user role. Falls back to two-letter initials.",
    usage: [
      {
        text: "Use **initials** as the fallback when there is no image. An avatar that silently renders empty is worse than one that shows two letters.",
        demo: '<div style="display:flex;gap:8px;align-items:center"><hex-avatar initials="AL"></hex-avatar><hex-avatar initials="GH" role-color="moderator"></hex-avatar><hex-avatar initials="RS" role-color="admin"></hex-avatar></div>',
      },
      {
        text: "Size by context rather than by importance: **xs** and **sm** inline beside text, **md** in rows, **lg** and **xl** on a profile.",
        demo: '<div style="display:flex;gap:8px;align-items:center"><hex-avatar size="xs" initials="A"></hex-avatar><hex-avatar size="sm" initials="B"></hex-avatar><hex-avatar size="md" initials="C"></hex-avatar><hex-avatar size="lg" initials="D"></hex-avatar></div>',
      },
    ],
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
    usage: [
      {
        text: "The colour states a role, so use it only where the role matters. In a dense list, colouring every name turns the signal into noise.",
        demo: '<div style="display:flex;gap:12px;flex-wrap:wrap"><hex-username>member</hex-username><hex-username role-color="moderator">moderator</hex-username><hex-username role-color="admin">admin</hex-username><hex-username role-color="former-staff">former staff</hex-username></div>',
      },
      {
        text: "**blocked** strikes the name through, which is the one state readers must not miss. Add **verified** where the account has been confirmed.",
        demo: '<div style="display:flex;gap:12px;flex-wrap:wrap"><hex-username role-color="blocked">blocked_user</hex-username><hex-username role-color="member" verified>verified_user</hex-username></div>',
      },
    ],
    props: [
      { name: "role-color", kind: "select", options: userRoles, default: "member" },
      { name: "verified", kind: "boolean", default: false },
      { name: "href", kind: "text", default: "" },
    ],
  },
  {
    tag: "hex-markup",
    title: "Markup",
    group: "Content",
    previewHeight: 420,
    previewSurface: "card",
    defaultSlot: `
      <h2>Tag group: canines</h2>
      <p>See <a class="dtext-link dtext-post-search-link" href="#">canine</a>, the
      <a class="dtext-link dtext-artist-id-link" href="#">artist page</a>, or the
      <a class="dtext-link dtext-external-link" href="#">upstream wiki</a>.</p>
      <ul><li>First item</li><li>Second, with <span class="inline-code">inline code</span></li></ul>
      <blockquote>Quoted guidance from a staff member.</blockquote>
    `,
    description: "Scopes typography for rendered DText. Styles the markup rather than replacing it.",
    usage: [
      {
        text: "Wrap **rendered DText** in `hex-markup`. dmark emits ordinary HTML carrying `dtext-*` classes, so this styles that output in place instead of asking you to swap every node for a custom element.",
        demo: '<hex-markup><h3>Heading</h3><p>A paragraph with a <a class="dtext-link" href="#">link</a> and <span class="inline-code">code</span>.</p><ul><li>One</li><li>Two</li></ul></hex-markup>',
      },
      {
        text: "Reference links carry their own colour, so an artist link reads gold and a tag search reads blue, matching the site they came from. External links get an arrow.",
        demo: '<hex-markup><p><a class="dtext-link dtext-artist-id-link" href="#">artist</a> &middot; <a class="dtext-link dtext-post-search-link" href="#">tag search</a> &middot; <a class="dtext-link dtext-external-link" href="#">external</a></p></hex-markup>',
      },
      {
        text: "Use **dense** inside a comment or a list row, where full paragraph spacing would waste the space.",
        demo: '<hex-markup dense><p>First paragraph.</p><p>Second paragraph, tightened.</p></hex-markup>',
      },
    ],
    props: [{ name: "dense", kind: "boolean", default: false }],
  },
  {
    tag: "hex-quote",
    title: "Quote",
    group: "Content",
    description:
      "Inline rounded quote block with a left-side accent stripe. Set `stripe-color` (or the `--hex-quote-stripe` CSS variable) to use any CSS color.",
    defaultSlot: "The hex tile is the brand. Every full-page surface uses a tiled hex pattern.",
    usage: [
      {
        text: "Use it for words that came from somewhere else, most often rendered DText. It is not a callout: for something the reader must act on, use **alert**.",
        demo: '<hex-quote>Approvals stay open until a second reviewer signs off.</hex-quote>',
      },
      {
        text: "Set **stripe-color** when the quote is attributed and the colour carries that attribution, such as a tag category. Leave it alone otherwise.",
        demo: '<div style="display:flex;flex-direction:column;gap:8px"><hex-quote variant="alt">An alternate surface, for a quote inside a quote.</hex-quote><hex-quote stripe-color="var(--hex-tag-artist)">Attributed to an artist.</hex-quote></div>',
      },
    ],
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
    usage: [
      {
        text: "Collapse detail that most readers will skip, and **leave open what most readers need**. A section that hides the main content saves nothing and costs a click.",
        demo: '<div style="width:340px"><hex-section open><span slot="heading">Request details</span>Everything a reviewer needs in order to decide.</hex-section></div>',
      },
      {
        text: "Use the **trailing** slot for a count or a status, so the heading says how much is hidden before anyone opens it.",
        demo: '<div style="width:340px"><hex-section><span slot="heading">Advanced</span><hex-status-pill slot="trailing" status="idle"></hex-status-pill>Options most readers never change.</hex-section></div>',
      },
    ],
    props: [{ name: "open", kind: "boolean", default: true }],
  },
  {
    tag: "hex-code",
    title: "Code",
    group: "Content",
    previewHeight: 140,
    description: "Monospace code element. Inline by default; set `block` for a preformatted block.",
    defaultSlot: "--hex-color-primary",
    usage: [
      {
        text: "Use the inline form for identifiers inside a sentence: a flag, a tag name, a field. It keeps the reading line intact.",
        demo: '<span>Set <hex-code>--hex-radius-md</hex-code> to change the corner radius, or pass <hex-code>variant=\"raised\"</hex-code> for a physical button.</span>',
      },
      {
        text: "Use **block** for anything the reader is meant to copy or scan line by line. It scrolls horizontally rather than wrapping, so code keeps its shape.",
        demo: '<div style="width:340px"><hex-code block>import { dmarkHandlers } from \"hexagonal\";\nrenderAstToHtml(ast, { ...htmlHandlers, ...dmarkHandlers });</hex-code></div>',
      },
    ],
    props: [{ name: "block", kind: "boolean", default: false }],
  },
  {
    tag: "hex-spoiler",
    title: "Spoiler",
    group: "Content",
    previewHeight: 140,
    description: "Inline censor for content that should not be read by accident. Reveals on click and never on hover, since a pointer passing over something is not consent to read it.",
    defaultSlot: "the Guardian of the Hexagon",
    usage: [
      {
        text: "Click or keyboard activation reveals it, on every device. Hover deliberately does not, since a pointer passing over a spoiler is not consent to read it.",
        demo: '<span>Ending: <hex-spoiler>the butler did it</hex-spoiler>.</span>',
      },
      {
        text: "Links inside stay **inert until revealed**, so the first click can never navigate somewhere the reader has not seen yet. Hidden content is also kept out of the accessibility tree.",
        demo: '<span>See <hex-spoiler>the <a href="#">full writeup</a> for details</hex-spoiler>.</span>',
      },
    ],
    props: [],
  },
  {
    tag: "hex-dialog",
    title: "Dialog",
    group: "Surfaces",
    description:
      "Modal for a decision that has to be made before anything else can continue. Keeps focus inside, closes on Escape, and sits above the rest of the page.",
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
      "Banner for something the reader needs to notice, tinted by how serious it is. Takes a heading, a message, and optional actions, and can be dismissed.",
    defaultSlot: "All 12 nodes updated to version 2.15.0",
    namedSlots: {
      heading: "Deployment successful",
      actions:
        '<hex-button slot="actions" variant="ghost" color="secondary" size="sm">View logs</hex-button><hex-button slot="actions" variant="ghost" color="secondary" size="sm">Details</hex-button>',
    },
    previewSurface: "page",
    previewHeight: 320,
    usage: [
      {
        text: "Use an alert for something that happened and needs a response. **error** announces assertively; the other variants announce politely, so reserve error for what actually blocks the reader.",
        demo: '<div style="display:flex;flex-direction:column;gap:8px;width:360px"><hex-alert variant="success"><span slot="heading">Saved</span>Your changes are live.</hex-alert><hex-alert variant="error"><span slot="heading">Could not save</span>The connection dropped before the write completed.</hex-alert></div>',
      },
      {
        text: "Put the recovery in the **actions** slot. An error that states a problem without offering the next step leaves the reader to guess.",
        demo: '<div style="width:360px"><hex-alert variant="warning"><span slot="heading">Session expiring</span>You will be signed out in two minutes.<hex-button slot="actions" size="sm">Stay signed in</hex-button></hex-alert></div>',
      },
    ],
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
