import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  cacheDir: "node_modules/.vite-preflight",
  test: {
    include: ["test/preflight/*.spec.ts"],
    testTimeout: 30000,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
