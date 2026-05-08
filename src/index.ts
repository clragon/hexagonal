// Hexagonal design system as web components.
// Importing this module registers every <hex-*> element and injects design
// tokens onto the host page.

import { registerTokens } from "./shared/tokens.js";

import "./components/hex-icon.js";
import "./components/hex-logo.js";
import "./components/hex-chexagon.js";
import "./components/hex-page.js";
import "./components/hex-card.js";
import "./components/hex-button.js";
import "./components/hex-input.js";
import "./components/hex-checkbox.js";
import "./components/hex-chip.js";
import "./components/hex-tag.js";
import "./components/hex-status-pill.js";
import "./components/hex-kbd.js";
import "./components/hex-avatar.js";
import "./components/hex-username.js";
import "./components/hex-quote.js";
import "./components/hex-section.js";
import "./components/hex-code.js";
import "./components/hex-spoiler.js";
import "./components/hex-alert.js";
import "./components/hex-select.js";
import "./components/hex-radio.js";
import "./components/hex-radio-group.js";
import "./components/hex-switch.js";

registerTokens();

export { tokensCss, registerTokens } from "./shared/tokens.js";
export { iconPaths, type IconName } from "./shared/icons.js";
export { assets } from "./shared/assets.js";
