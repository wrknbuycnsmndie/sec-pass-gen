import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const projectFiles = ["src/**/*.{js,jsx,mjs,ts,tsx,mts,cts}", "tests/**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];
const projectTypeScriptFiles = ["src/**/*.{ts,tsx,mts,cts}", "tests/**/*.{ts,tsx,mts,cts}"];
const toolingJavaScriptFiles = ["eslint.config.mjs", "postcss.config.mjs"];

export default defineConfig([
  ...nextCoreWebVitals.map((config) => ({
    ...config,
    ...(Array.isArray(config.files) && config.files.length > 0 ? { files: projectFiles } : {}),
  })),
  ...nextTypeScript.map((config) => ({
    ...config,
    ...(Array.isArray(config.files) && config.files.length > 0 ? { files: projectTypeScriptFiles } : {}),
  })),
  {
    files: projectFiles,
    rules: {
      "react/display-name": "off",
    },
  },
  {
    files: toolingJavaScriptFiles,
  },
  {
    files: ["next.config.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
      },
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
