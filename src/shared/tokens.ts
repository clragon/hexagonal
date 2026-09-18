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
  --hex-color-danger:        #e07b6b;
  --hex-color-danger-light:  #e89486;
  --hex-color-danger-dark:   #c96a5b;
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
  --hex-tag-general:   #b4c7d9;
  --hex-tag-meta:      #ffffff;
  --hex-tag-lore:      #228b22;
  --hex-tag-invalid:   #ff3d3d;
  --hex-tag-contributor: #c0c0c0;

  --hex-tag-artist-alt:      #fbd67f;
  --hex-tag-copyright-alt:   #ff5eff;
  --hex-tag-character-alt:   #2bff2b;
  --hex-tag-species-alt:     #f6b295;
  --hex-tag-general-alt:     #2e76b4;
  --hex-tag-meta-alt:        #666666;
  --hex-tag-lore-alt:        #5fdb5f;
  --hex-tag-invalid-alt:     #ffbcbc;
  --hex-tag-contributor-alt: #71706e;

  --hex-bg-page:    var(--hex-color-background);
  --hex-bg-card:    var(--hex-color-foreground);
  --hex-bg-section: var(--hex-color-section);
  --hex-bg-overlay: rgba(2, 15, 35, 0.72);
  --hex-bg-sunken:  rgba(2, 15, 35, 0.20);
  --hex-bg-muted:   rgba(180, 199, 217, 0.12);
  --hex-bg-hover:   rgba(180, 199, 217, 0.10);
  --hex-bg-success: rgba(107, 191, 122, 0.15);
  --hex-bg-warning: rgba(232, 196, 70, 0.15);
  --hex-bg-danger:  rgba(224, 123, 107, 0.15);
  --hex-bg-active:  rgba(180, 199, 217, 0.16);

  --hex-fg-on-danger: #2a0e09;

  --hex-fg-1: var(--hex-color-text);
  --hex-fg-2: var(--hex-color-text-muted);
  --hex-fg-link: var(--hex-color-secondary);
  --hex-fg-link-hover: var(--hex-color-secondary-light);
  --hex-fg-on-primary: var(--hex-color-background);

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
  --hex-shadow-focus:   0 0 0 2px rgba(232, 196, 70, 0.45);
  --hex-shadow-focus-danger: 0 0 0 2px rgba(224, 123, 107, 0.35);

  --hex-texture-fade: 180px;
  --hex-texture-mask: linear-gradient(
    to bottom,
    #000 0,
    rgba(0, 0, 0, 0.75) calc(var(--hex-texture-fade) * 0.29),
    rgba(0, 0, 0, 0.5) calc(var(--hex-texture-fade) * 0.53),
    rgba(0, 0, 0, 0.25) calc(var(--hex-texture-fade) * 0.73),
    transparent var(--hex-texture-fade)
  );

  --hex-raise-depth: 4px;
  --hex-raise-press: 2px;

  --hex-z-behind:   -1;
  --hex-z-base:      0;
  --hex-z-sticky:  100;
  --hex-z-dropdown: 200;
  --hex-z-overlay: 300;
  --hex-z-modal:   400;
  --hex-z-popover: 500;
  --hex-z-toast:   600;

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

  --hex-control-optical-offset: 1px;

  --hex-control-line-sm: 15px;
  --hex-control-line-md: 16px;
  --hex-control-line-lg: 19px;

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
  const existing = getComputedStyle(document.documentElement)
    .getPropertyValue("--hex-color-background")
    .trim();
  if (existing) return;
  const style = document.createElement("style");
  style.id = TOKEN_STYLE_ID;
  style.textContent = tokensCss;
  document.head.prepend(style);
}
