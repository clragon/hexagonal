import { svg, type SVGTemplateResult } from "lit";

// Lucide-derived stroke icons + a few Hexagonal-specific shapes (hex, chexagon).
// All icons render in a 24x24 viewBox; size/stroke are controlled by <hex-icon>.

const builtinIcons = {
  hex: svg`<polygon points="12 2 22 8 22 16 12 22 2 16 2 8" />`,
  "hex-fill": svg`
    <polygon points="12 2 22 8 22 16 12 22 2 16 2 8" fill="currentColor" stroke="none"/>
    <polygon points="12 6 18 9.5 18 14.5 12 18 6 14.5 6 9.5" fill="#020f23" stroke="none"/>
  `,
  chexagon: svg`
    <path d="M7.6 21.4h8.8a2.2 2.1 0 0 0 1.9-1l4.3-7.4a2.2 2.1 0 0 0 0-2l-4.3-7.4a2.2 2.1 0 0 0-2-1H7.7a2.2 2.1 0 0 0-1.9 1L1.4 11a2.2 2.1 0 0 0 0 2l4.3 7.4a2.2 2.1 0 0 0 2 1z"/>
    <path d="m17.3 9.2-6.6 6.6-3-3.1"/>
  `,
  search: svg`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`,
  plus: svg`<path d="M12 5v14M5 12h14"/>`,
  minus: svg`<path d="M5 12h14"/>`,
  close: svg`<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  check: svg`<polyline points="20 6 9 17 4 12"/>`,
  "chev-down": svg`<polyline points="6 9 12 15 18 9"/>`,
  "chev-right": svg`<polyline points="9 6 15 12 9 18"/>`,
  clock: svg`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  user: svg`<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>`,
  users: svg`
    <circle cx="9" cy="8" r="3.5"/>
    <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/>
    <circle cx="17" cy="9" r="2.5"/>
    <path d="M22 19c0-2.5-2-4.5-5-4.5"/>
  `,
  menu: svg`<path d="M3 12h18M3 6h18M3 18h18"/>`,
  settings: svg`
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  `,
  bell: svg`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>`,
  download: svg`
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  `,
  refresh: svg`
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
    <polyline points="21 3 21 8 16 8"/>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
    <polyline points="3 21 3 16 8 16"/>
  `,
  play: svg`<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>`,
  layers: svg`
    <polygon points="12 2 22 8 12 14 2 8 12 2"/>
    <polyline points="2 16 12 22 22 16"/>
    <polyline points="2 12 12 18 22 12"/>
  `,
  activity: svg`<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  logs: svg`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>`,
  trash: svg`
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  `,
  eye: svg`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>`,
  lock: svg`<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  "alert-circle": svg`<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>`,
  "alert-triangle": svg`
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4m0 4h.01"/>
  `,
  "info-circle": svg`<circle cx="12" cy="12" r="9"/><path d="M12 16v-4m0-4h.01"/>`,
} as const;

export type BuiltinIconName = keyof typeof builtinIcons;

// Any string is accepted so consumers can register their own glyphs; the
// union keeps editor completion for the built-ins.
export type IconName = BuiltinIconName | (string & {});

export const iconPaths: Record<string, SVGTemplateResult> = { ...builtinIcons };

export const ICONS_CHANGED = "hex-icons-changed";

function notifyIconsChanged(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(ICONS_CHANGED));
}

export function registerIcon(name: string, path: SVGTemplateResult): void {
  iconPaths[name] = path;
  notifyIconsChanged();
}

export function registerIcons(icons: Record<string, SVGTemplateResult>): void {
  Object.assign(iconPaths, icons);
  notifyIconsChanged();
}

export function renderIcon(name: IconName): SVGTemplateResult | null {
  return iconPaths[name] ?? null;
}
