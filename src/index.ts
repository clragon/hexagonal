// Hexagonal design system as web components.
// Importing this module registers every <hex-*> element and injects design
// tokens onto the host page.

import { registerTokens } from "./shared/tokens.js";

import "./components/hex-alert.js";
import "./components/hex-autocomplete.js";
import "./components/hex-avatar.js";
import "./components/hex-button.js";
import "./components/hex-card.js";
import "./components/hex-checkbox.js";
import "./components/hex-chexagon.js";
import "./components/hex-chip.js";
import "./components/hex-code.js";
import "./components/hex-dialog.js";
import "./components/hex-divider.js";
import "./components/hex-icon.js";
import "./components/hex-input.js";
import "./components/hex-kbd.js";
import "./components/hex-listbox.js";
import "./components/hex-logo.js";
import "./components/hex-menu-item.js";
import "./components/hex-menu.js";
import "./components/hex-option.js";
import "./components/hex-page.js";
import "./components/hex-popover.js";
import "./components/hex-markup.js";
import "./components/hex-quote.js";
import "./components/hex-radio-group.js";
import "./components/hex-radio.js";
import "./components/hex-section.js";
import "./components/hex-select.js";
import "./components/hex-skeleton.js";
import "./components/hex-spinner.js";
import "./components/hex-spoiler.js";
import "./components/hex-status-pill.js";
import "./components/hex-switch.js";
import "./components/hex-tag.js";
import "./components/hex-textarea.js";
import "./components/hex-tooltip.js";
import "./components/hex-username.js";

registerTokens();

export { html, css, svg, nothing, unsafeCSS, LitElement } from "lit";
export type { TemplateResult, CSSResultGroup } from "lit";
export { customElement, property, state, query } from "lit/decorators.js";
export { ifDefined } from "lit/directives/if-defined.js";
export { classMap } from "lit/directives/class-map.js";
export { styleMap } from "lit/directives/style-map.js";

export { HexElement, hostReset } from "./shared/base.js";
export { HexFormElement } from "./shared/form-element.js";
export { fieldStyles, type HexFieldSize } from "./shared/field-styles.js";
export { HexFieldElement } from "./shared/field-element.js";

export { tokensCss, registerTokens } from "./shared/tokens.js";
export {
  iconPaths,
  renderIcon,
  registerIcon,
  registerIcons,
  type IconName,
  ICONS_CHANGED,
  type BuiltinIconName,
} from "./shared/icons.js";
export { dmarkHandlers } from "./shared/dmark-handlers.js";
export { assets } from "./shared/assets.js";

export { HexAlert } from "./components/hex-alert.js";
export type { HexAlertVariant } from "./components/hex-alert.js";
export { HexAutocomplete } from "./components/hex-autocomplete.js";
export type { HexAutocompleteItem, HexAutocompleteContext, HexAutocompleteProvider } from "./components/hex-autocomplete.js";
export { HexAvatar } from "./components/hex-avatar.js";
export type { HexUserRole, HexAvatarSize } from "./components/hex-avatar.js";
export { HexButton } from "./components/hex-button.js";
export type { HexButtonVariant, HexButtonColor, HexButtonSize } from "./components/hex-button.js";
export { HexCard } from "./components/hex-card.js";
export { HexCheckbox } from "./components/hex-checkbox.js";
export { HexChexagon } from "./components/hex-chexagon.js";
export { HexChip } from "./components/hex-chip.js";
export { HexCode } from "./components/hex-code.js";
export { HexDialog } from "./components/hex-dialog.js";
export type { HexDialogSize } from "./components/hex-dialog.js";
export { HexDivider } from "./components/hex-divider.js";
export type { HexDividerOrientation } from "./components/hex-divider.js";
export { HexIcon } from "./components/hex-icon.js";
export { HexInput } from "./components/hex-input.js";
export { HexKbd } from "./components/hex-kbd.js";
export { HexListbox } from "./components/hex-listbox.js";
export type { HexListboxSelectDetail } from "./components/hex-listbox.js";
export { HexLogo } from "./components/hex-logo.js";
export { HexMenuItem } from "./components/hex-menu-item.js";
export { HexMenu } from "./components/hex-menu.js";
export { HexOption } from "./components/hex-option.js";
export type { HexOptionCategory } from "./components/hex-option.js";
export { HexPage } from "./components/hex-page.js";
export { HexPopover } from "./components/hex-popover.js";
export type { HexPopoverPlacement, HexPopoverAlign } from "./components/hex-popover.js";
export { HexMarkup } from "./components/hex-markup.js";
export { HexQuote } from "./components/hex-quote.js";
export type { HexQuoteVariant } from "./components/hex-quote.js";
export { HexRadioGroup } from "./components/hex-radio-group.js";
export type { HexRadioGroupDirection } from "./components/hex-radio-group.js";
export { HexRadio } from "./components/hex-radio.js";
export { HexSection } from "./components/hex-section.js";
export { HexSelect } from "./components/hex-select.js";
export { HexSkeleton } from "./components/hex-skeleton.js";
export type { HexSkeletonShape } from "./components/hex-skeleton.js";
export { HexSpinner } from "./components/hex-spinner.js";
export { HexSpoiler } from "./components/hex-spoiler.js";
export { HexStatusPill } from "./components/hex-status-pill.js";
export type { HexStatus } from "./components/hex-status-pill.js";
export { HexSwitch } from "./components/hex-switch.js";
export { HexTag } from "./components/hex-tag.js";
export type { HexTagCategory } from "./components/hex-tag.js";
export { HexTextarea } from "./components/hex-textarea.js";
export { HexTooltip } from "./components/hex-tooltip.js";
export { HexUsername } from "./components/hex-username.js";
