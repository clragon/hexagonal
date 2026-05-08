// Binary brand assets, inlined as data URIs at build time so the bundle is
// fully self-contained. The `?inline` query is wired up in scripts/build.mjs.

import hexTileUri from "../../assets/hex-tile.png?inline";
import hexTextureUri from "../../assets/hex-texture.png?inline";
import logoSvgUri from "../../assets/logo.svg?inline";
import logoMarkSvgUri from "../../assets/logo-mark.svg?inline";
import chexagonSvgUri from "../../assets/chexagon.svg?inline";

export const assets = {
  hexTile: hexTileUri,
  hexTexture: hexTextureUri,
  logo: logoSvgUri,
  logoMark: logoMarkSvgUri,
  chexagon: chexagonSvgUri,
} as const;
