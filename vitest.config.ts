import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "studio/templates/**"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      // `server-only` is a runtime guard that throws when imported outside a
      // Server Component. Under vitest (node/jsdom) we alias it to its no-op
      // stub so server modules can be unit-tested directly.
      "server-only": resolve(__dirname, "node_modules/server-only/empty.js"),
    },
  },
});
