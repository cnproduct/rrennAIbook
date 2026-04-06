import { defineConfig } from "tsdown";

export default defineConfig(() => ({
  entry: ["src/create-rrennAIbook.ts"],
  target: "node20",
  format: "cjs",
  minify: true,
  fixedExtension: false,
}));
