import { defineConfig } from "tsup";

export default defineConfig({
  banner: {
    js: ' "use client";',
  },
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
});
