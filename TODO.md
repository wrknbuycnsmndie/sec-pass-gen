# Astro 14KB Migration Plan

Goal: replace the current Next.js + React app with a minimal Astro static site and keep the password generator simple, testable, SEO-friendly, and extremely small.

## Hard constraint / grill

The requested **14KB limit is only realistic for the critical app shell**: HTML + CSS + first-party JS needed to render and use the generator.

It is **not realistic** if the budget includes current public assets:

- `public/favicon.ico` is about 264KB.
- `public/secgenpassword.png` is about 1.8MB.

Plan assumption: keep those files for favicon/SEO/OG metadata as requested, but do not render the large image in the first viewport. The performance budget below measures critical HTML/CSS/JS transfer, preferably gzip and/or brotli.

## Target architecture

- Framework: Astro static output.
- Runtime UI: no React, no Zustand, no Motion.
- Password logic: keep `src/lib/password.ts` framework-independent and testable.
- Interactivity: tiny first-party TypeScript module for controls, localStorage preferences, clipboard, and status messages.
- Styling: Astro + CSS/Tailwind-compatible CSS, with small CSS animations instead of Motion.
- SEO: Astro layout owns all metadata.

## Target dependency cleanup

Remove:

- `next`
- `react`
- `react-dom`
- `zustand`
- `motion`
- `framer-motion` transitive usage/imports
- `next-themes`
- `eslint-config-next`
- Radix/ShadCN UI packages after replacing controls with native HTML
- `sonner`
- `lucide-react`

Add/keep:

- `astro`
- `typescript`
- `eslint`
- `tailwindcss` only if generated CSS remains inside budget
- `@tailwindcss/vite` only if using Tailwind v4 through Vite
- `@astrojs/sitemap` for SEO sitemap

## SEO target

Use:

- Title: `SecPassGen Password Generator | wrknbuycnsmndie`
- Description: concise secure password generator description.
- Favicon: `/favicon.ico`
- OG image: `/secgenpassword.png`
- Twitter card: `summary_large_image`
- Canonical URL: requires final deployed domain.
- Sitemap: via `@astrojs/sitemap`.
- Robots: generated `robots.txt` pointing to sitemap.

Open question before implementation: what is the final production domain for Astro `site`?

## File-level migration checklist

### 1. Add Astro skeleton

- [ ] Add `astro.config.mjs`.
- [ ] Configure `output: 'static'`.
- [ ] Configure `site` once domain is known.
- [ ] Configure sitemap integration.
- [ ] Configure CSS pipeline.
- [ ] Add `src/layouts/BaseLayout.astro`.
- [ ] Add `src/pages/index.astro`.
- [ ] Add `src/pages/robots.txt.ts`.

### 2. Replace Next page/layout files

- [ ] Move metadata from `src/pages/index.tsx` into `BaseLayout.astro`.
- [ ] Replace `_document.tsx` with Astro `<html>`, `<head>`, and `<body>` in layout.
- [ ] Replace `_app.tsx` with Astro layout composition.
- [ ] Convert `Header` to Astro/static HTML.
- [ ] Convert `Hero` to Astro/static HTML.
- [ ] Convert `Footer` to Astro/static HTML.
- [ ] Remove `src/pages/api/hello.ts`.

### 3. Replace React password UI

- [ ] Create `src/components/PasswordGenerator.astro` using native HTML controls.
- [ ] Create `src/scripts/password-generator.ts` for browser behavior.
- [ ] Keep generated password out of localStorage.
- [ ] Persist only preferences: length and selected character sets.
- [ ] Use native `<input type="range">` instead of Radix Slider.
- [ ] Use native checkboxes instead of Radix Checkbox.
- [ ] Use native button text/icons or small inline SVG.
- [ ] Add accessible labels for every control.
- [ ] Add inline status region for errors/copy success instead of Sonner.

### 4. Keep password logic testable

- [ ] Keep `src/lib/password.ts` as the source of generation rules.
- [ ] Keep current tests for password generation.
- [ ] Add DOM-free tests for preference serialization if useful.
- [ ] Remove Zustand store tests after replacing the store, or rewrite them around small pure helpers.
- [ ] Default password length should likely become `16` for a secure generator.

### 5. Replace animations

- [ ] Remove Motion imports and dependencies.
- [ ] Add tiny CSS keyframes for fade/slide-in.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Avoid JS-driven animations.

### 6. Remove Next/React files

Delete after Astro version builds:

- [ ] `next.config.ts`
- [ ] `next-env.d.ts`
- [ ] `src/pages/index.tsx`
- [ ] `src/pages/_app.tsx`
- [ ] `src/pages/_document.tsx`
- [ ] `src/pages/api/hello.ts`
- [ ] React component files that become unused
- [ ] ShadCN/Radix UI files that become unused

### 7. Update tooling

- [ ] Update `package.json` scripts:
  - `dev`: `astro dev`
  - `build`: `astro build`
  - `preview`: `astro preview`
  - `lint`: no Next config/files
  - `test`: keep Node tests
- [ ] Update `eslint.config.mjs` to remove `eslint-config-next`.
- [ ] Update `tsconfig.json` for Astro types and no Next env.
- [ ] Update CI only if script names change.
- [ ] Update README tech stack and commands.

## Performance budget

Target critical transfer budget:

- HTML: <= 5KB gzip
- CSS: <= 6KB gzip
- JS: <= 3KB gzip
- Total critical HTML + CSS + JS: <= 14KB gzip

Important: this excludes `/favicon.ico` and `/secgenpassword.png`. If those count, the current asset sizes make the 14KB goal impossible without optimizing or replacing them.

Measurement checklist:

- [ ] Build with `npm run build`.
- [ ] Measure `dist/index.html` gzip/brotli size.
- [ ] Measure generated CSS gzip/brotli size.
- [ ] Measure generated password-generator JS gzip/brotli size.
- [ ] Confirm no React/Next chunks exist in `dist/`.
- [ ] Confirm first viewport does not load `secgenpassword.png`.

## Acceptance criteria

- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] No `next`, `react`, `react-dom`, `zustand`, or `motion` in `package.json`.
- [ ] Password generation behavior matches current tests.
- [ ] Preferences persist; generated password does not persist.
- [ ] Copy button works with graceful failure message.
- [ ] Theme works if we keep dark mode, without `next-themes`.
- [ ] Page has title, description, canonical, OG, Twitter card, favicon, sitemap, robots.
- [ ] Critical HTML + CSS + JS is at or below 14KB gzip, or any overage is documented.

## Progress

- [x] Astro static shell added.
- [x] Next.js, React, Zustand, Motion removed from the app path.
- [x] Plain CSS replaces Tailwind for the UI.
- [x] Password generation stays in `src/lib/password.ts`.
- [x] Browser preferences now use a tiny native script and `localStorage`.
- [x] Tests pass.
- [x] Critical shell now measures about 5.1KB gzip (`index.html` + CSS), excluding the large public assets.

## Open questions before the next iteration

1. What production domain should be used for canonical URLs and sitemap?
2. Should we keep dark mode as-is, or remove it for even less JS?
3. Do you want a sitemap/robots pass next once the domain is known?
4. Should the public favicon and OG image be optimized or replaced later?
