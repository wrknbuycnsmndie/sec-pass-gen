import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const projectFiles = [
  'src/**/*.{js,jsx,mjs,ts,tsx,mts,cts}',
  'tests/**/*.{js,jsx,mjs,ts,tsx,mts,cts}',
  'astro.config.mjs',
];

const projectTypeScriptFiles = [
  'src/**/*.{ts,tsx,mts,cts}',
  'tests/**/*.{ts,tsx,mts,cts}',
];

export default defineConfig([
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    ...(Array.isArray(config.files) && config.files.length > 0
      ? { files: projectTypeScriptFiles }
      : {}),
  })),
  {
    files: projectFiles,
  },
  globalIgnores(['dist/**', 'node_modules/**', '.astro/**', 'next-env.d.ts']),
]);
