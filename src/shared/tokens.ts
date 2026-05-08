import { assets } from "./assets.js";

// Design tokens injected as :root CSS custom properties. Loaded once per page
// when the bundle is imported; safe to call multiple times.

export const tokensCss = /* css */ `
:root {
  --hex-color-background: #020f23;
  --hex-color-foreground: #152f56;
  --hex-color-section:    #1f3c67;
  --hex-color-text:       #ffffff;
  --hex-color-text-muted: #999999;

  --hex-color-primary:        #e8c446;
  --hex-color-primary-light:  #f5e5ae;
  --hex-color-primary-dark:   #e1ac00;

  --hex-color-secondary:        #b4c7d9;
  --hex-color-secondary-light:  #cedeec;
  --hex-color-secondary-dark:   #839db5;

  --hex-color-success: #6bbf7a;
  --hex-color-warning: #e8c446;
  --hex-color-danger:  #e07b6b;
  --hex-color-info:    #b4c7d9;

  --hex-role-member:       #b4c7d9;
  --hex-role-privileged:   #b4c7d9;
  --hex-role-blocked:      #6b7f93;
  --hex-role-former-staff: #78dca5;
  --hex-role-janitor:      #d82828;
  --hex-role-moderator:    #d82828;
  --hex-role-admin:        #e69500;

  --hex-tag-artist:    #f2ac08;
  --hex-tag-copyright: #dd00dd;
  --hex-tag-character: #00aa00;
  --hex-tag-species:   #ed5d1f;
  --hex-tag-general:   #0075e0;
  --hex-tag-meta:      #ffffff;
  --hex-tag-lore:      #228b22;
  --hex-tag-invalid:   #ff3d3d;

  --hex-bg-page:    var(--hex-color-background);
  --hex-bg-card:    var(--hex-color-foreground);
  --hex-bg-section: var(--hex-color-section);
  --hex-bg-overlay: rgba(2, 15, 35, 0.72);

  --hex-fg-1: var(--hex-color-text);
  --hex-fg-2: var(--hex-color-text-muted);
  --hex-fg-link: var(--hex-color-secondary);
  --hex-fg-link-hover: var(--hex-color-secondary-light);
  --hex-fg-on-primary: #1a1303;

  --hex-border:        var(--hex-color-section);
  --hex-border-strong: #2a4d80;
  --hex-border-subtle: rgba(180, 199, 217, 0.12);

  --hex-tile:    url("${assets.hexTile}");
  --hex-texture: url("${assets.hexTexture}");

  --hex-radius-sm:   2px;
  --hex-radius-md:   4px;
  --hex-radius-lg:   8px;
  --hex-radius-pill: 999px;

  --hex-space-0: 0;
  --hex-space-1: 4px;
  --hex-space-2: 8px;
  --hex-space-3: 12px;
  --hex-space-4: 16px;
  --hex-space-5: 24px;
  --hex-space-6: 32px;
  --hex-space-7: 48px;
  --hex-space-8: 64px;

  --hex-shadow-card:    0 4px 20px rgba(0, 0, 0, 0.20);
  --hex-shadow-popover: 0 8px 28px rgba(0, 0, 0, 0.40);
  --hex-shadow-sunken:  inset 0 1px 0 rgba(0, 0, 0, 0.30);
  --hex-shadow-focus:   0 0 0 2px rgba(232, 196, 70, 0.45);

  --hex-font-family: Verdana, "Noto Sans", "Helvetica Neue", Arial, sans-serif;
  --hex-font-logo:   "Paulistana Ipe", Verdana, "Noto Sans", sans-serif;
  --hex-font-mono:   "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

  --hex-font-weight-regular: 400;
  --hex-font-weight-medium:  500;
  --hex-font-weight-bold:    700;

  --hex-fs-xs: 11px;
  --hex-fs-sm: 12px;
  --hex-fs-md: 13px;
  --hex-fs-lg: 15px;
  --hex-fs-xl: 18px;
  --hex-fs-h6: 16px;
  --hex-fs-h5: 20px;
  --hex-fs-h4: 24px;
  --hex-fs-h3: 30px;
  --hex-fs-h2: 38px;
  --hex-fs-h1: 48px;

  --hex-line-tight:  1.2;
  --hex-line-normal: 1.5;
  --hex-line-loose:  1.7;

  --hex-ease:     cubic-bezier(0.4, 0, 0.2, 1);
  --hex-dur-fast: 120ms;
  --hex-dur-base: 180ms;
  --hex-dur-slow: 280ms;
}
`;

const TOKEN_STYLE_ID = "hex-tokens";

export function registerTokens(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(TOKEN_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = TOKEN_STYLE_ID;
  style.textContent = tokensCss;
  document.head.prepend(style);
}
