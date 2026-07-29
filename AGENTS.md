# Repository Guidelines

Whatever action you can do yourself, please do yourself. This includes starting apps and verification.

Never use the Sites skill for designing this repository.

## Project Structure & Module Organization

This is a server-rendered Next.js 16 portfolio built through Vinext for Cloudflare Workers.

- `app/` contains routes and route-owned UI (`page.tsx`, `work/`, `process/`, `about/`, and `contact/`).
- `components/` contains shared navigation, video, and GSAP motion behavior.
- `lib/` stores verified project content and external media references.
- `public/` holds fonts, social previews, and Cloudflare headers; keep large films on external delivery.
- `worker/` is the Cloudflare application entry point; `tests/` contains server-render and deployment checks.
- `docs/` records creative, content, and architecture constraints. Read these before changing layout, copy, or motion.

## Build, Test, and Development Commands

Use Node.js 22.13+.

- `npm install` installs the locked dependencies.
- `npm run dev` starts the Vinext development server.
- `npm run build` creates the production Worker bundle in `dist/`.
- `npm run start` serves the production build locally.
- `npm run lint` checks source and configuration files with ESLint.
- `npm test` builds first, then runs the Node test suite against rendered HTML and Cloudflare output.

Run `npm run lint && npm test` before opening a pull request.

## Coding Style & Naming Conventions

Follow the existing TypeScript/React style: two-space indentation, semicolons, double quotes, and trailing commas in multiline structures. Use kebab-case filenames (`project-video.tsx`), PascalCase component names, and camelCase variables/functions. Keep route-specific content in its route and shared behavior in `components/`. Preserve accessible native navigation, keyboard support, reduced-motion handling, and mobile-safe video attributes. Use GSAP only in client-side components and clean up animations on unmount.

## Testing Guidelines

Tests use `node:test` and strict assertions. Add focused cases to `tests/*.test.mjs`; name tests by observable behavior, not implementation details. Verify response status, accessible rendered markup, important route content, security headers, and Cloudflare bindings. There is no numeric coverage threshold, but every new route or critical interaction should receive a regression test.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, sentence-case subjects such as `Refine loader and stabilize portfolio motion`. Keep each commit focused. Pull requests should include a concise summary, validation commands run, linked issue when applicable, and screenshots or recordings for visual or motion changes. Call out Cloudflare configuration, dependency, accessibility, or externally hosted media changes explicitly.

## Architecture Guardrails

Keep the homepage as a scrolling AIDA landing page with externally hosted project media and a direct email CTA. Do not introduce WebGL or custom cursors. Never commit secrets; configure deployment values through Cloudflare bindings.
