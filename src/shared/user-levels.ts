import type { HexUserRole } from "../components/hex-avatar.js";

export type HexUserLevels = Readonly<Record<number, HexUserRole>>;

export const userLevels: HexUserLevels = {
  10: "blocked",
  20: "member",
  30: "privileged",
  40: "former-staff",
  50: "staff",
  60: "janitor",
  70: "moderator",
  80: "admin",
};

export function roleForLevel(
  level: number,
  levels: HexUserLevels = userLevels,
): HexUserRole | undefined {
  return levels[level];
}
