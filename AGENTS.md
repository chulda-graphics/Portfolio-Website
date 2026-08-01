# Repository Guidelines

> Whatever action you can do yourself, please do yourself; this includes starting apps and verification.

## Agent-Specific Instructions

Never use the Sites skill for designing this website. Work directly in the Next.js repository and independently perform all safe, in-scope implementation, app-starting, and verification tasks available to you.

Use `@phosphor-icons/react` as the default icon system for interface actions. Do not use emoji, Unicode arrows, or hand-authored SVGs when an equivalent Phosphor icon exists. Import from the package's SSR entry point in Server Components, mark decorative icons `aria-hidden`, and provide accessible names for icon-only controls.

## Project Structure & Module Organization

This repository is a clean starting point for a Next.js motion-design portfolio. Use the App Router and keep route code under `src/app/` (for example, `src/app/work/[slug]/page.tsx`). Place reusable UI in `src/components/`, animation utilities in `src/lib/motion/`, styles in `src/styles/`, and static media in `public/`. Group project assets by slug, such as `public/projects/stillsearch/`. Store tests beside covered code or in `tests/` for complete user flows.

Store generated illustrations, project imagery, video metadata, and other display media in [`public/assets/`](public/assets/). Follow its asset manifest when adding or replacing landing-page content. Prefer original project-specific illustrations over stock imagery, preserve meaningful filenames, and optimize raster assets before committing them.

## Build, Test, and Development Commands

The application has not been scaffolded yet. Once `package.json` is added, expose these standard npm scripts and keep this section synchronized with them:

- `npm install` installs locked dependencies.
- `npm run dev` starts the local Next.js development server.
- `npm run build` creates a production build and catches route or type errors.
- `npm run start` serves the production build locally.
- `npm run lint` runs the configured ESLint checks.
- `npm test` runs the automated test suite once one is configured.

Run `npm run build` and `npm run lint` before a pull request.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and two-space indentation. Prefer Server Components; add `"use client"` only where browser APIs or interaction require it. Name components in PascalCase (`ProjectCard.tsx`), hooks in camelCase with a `use` prefix, and route folders or asset slugs in lowercase kebab-case. Keep motion purposeful and respect `prefers-reduced-motion`. Use the formatter and ESLint configuration committed to the repository; do not introduce competing style tools.

## Testing Guidelines

No test framework or coverage threshold is currently configured. When adding one, use `*.test.ts(x)` for unit and component tests and reserve `tests/e2e/` for browser flows. Prioritize navigation, project case-study rendering, contact actions, responsive layouts, reduced-motion behavior, and accessible keyboard interaction. Document any new test commands in `package.json` and this file.

## Commit & Pull Request Guidelines

Recent history uses short, imperative subjects such as `Build motion-led portfolio landing page` and `Fix Cloudflare static deployment`. Follow that style and keep each commit scoped. Pull requests should explain the intent, summarize implementation decisions, list verification commands, and link relevant issues. Include before/after screenshots or recordings for visual and motion changes, plus notes on performance, accessibility, or asset-size impact.

## Security & Assets

Never commit credentials or production secrets. Keep local values in `.env.local` and provide safe placeholders in `.env.example`. Optimize images and videos before committing; prefer modern formats and avoid adding unlicensed assets.
