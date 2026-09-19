import { expect, test } from "vitest";
import { roleForLevel, userLevels, type HexUserLevels } from "../src/shared/user-levels.js";

test("a known level resolves to its role", () => {
  expect(roleForLevel(20)).toBe("member");
  expect(roleForLevel(50)).toBe("staff");
  expect(roleForLevel(80)).toBe("admin");
});

test("an unrecognised level resolves to undefined", () => {
  expect(roleForLevel(0)).toBeUndefined();
  expect(roleForLevel(35)).toBeUndefined();
  expect(roleForLevel(99)).toBeUndefined();
  expect(roleForLevel(-1)).toBeUndefined();
});

test("a caller on a different backend can supply its own table", () => {
  const older: HexUserLevels = { 34: "former-staff", 35: "janitor", 40: "moderator", 50: "admin" };
  expect(roleForLevel(50, older)).toBe("admin");
  expect(roleForLevel(50)).toBe("staff");
  expect(roleForLevel(35, older)).toBe("janitor");
});

test("the table covers the roles that carry a colour", () => {
  const roles = Object.values(userLevels);
  expect(new Set(roles).size).toBe(roles.length);
  expect(roles).toEqual([
    "blocked",
    "member",
    "privileged",
    "former-staff",
    "staff",
    "janitor",
    "moderator",
    "admin",
  ]);
});
