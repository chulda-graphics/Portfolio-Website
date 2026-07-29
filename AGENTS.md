# Repository Guidelines

> Whatever action you can do yourself, please do yourself. This includes starting apps and verification.

> Never use the Sites skill for designing this website.

> Always commit and push website changes directly to the `main` branch. Do not create feature branches unless the user explicitly requests one.

## Project Structure & Module Organization

This repository is in early setup. Reference outputs live in `deliverables/`; `scratch_reference_measure.py` is a one-off utility. Keep production code separate from these files.

Use this structure when scaffolding the portfolio:

- `src/` — page components, styles, GSAP timelines, and application logic.
- `src/components/` — reusable UI sections; use one component per file.
- `src/animations/` — shared timelines, scroll triggers, and motion utilities.
- `public/` — static images, video, fonts, and favicons served unchanged.
- `tests/` — automated tests mirroring the organization under `src/`.
- `deliverables/` — design references and review artifacts, not runtime code.

Optimize large motion-design media before adding it to `public/`. Use descriptive paths such as `public/work/project-name/hero-poster.webp`.

## Build, Test, and Development Commands

No package manager or build scripts are configured yet. After scaffolding, expose the standard scripts below in `package.json` and keep them compatible with a Cloudflare Pages build:

- `npm install` — install locked dependencies.
- `npm run dev` — start the local development server.
- `npm run build` — create the production output used by Cloudflare.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run static analysis and formatting checks.
- `npm test` — execute the automated test suite.

Document any changed command or output directory in `README.md` and Cloudflare configuration.

## Coding Style & Naming Conventions

Use two-space indentation for JavaScript, JSX, CSS, and JSON. Prefer small functional components, semantic HTML, CSS custom properties, and named animation setup/cleanup functions. Use `PascalCase` for components, `camelCase` for functions and variables, and kebab-case for assets and CSS classes. Keep GSAP selectors scoped to component roots and always remove timelines, listeners, and `ScrollTrigger` instances during cleanup. Respect `prefers-reduced-motion`.

## Testing Guidelines

Add tests with each interactive behavior. Name files `*.test.jsx` or `*.test.js`. Cover navigation, email CTA behavior, reduced-motion fallbacks, and animation lifecycle cleanup. Before opening a PR, run lint, tests, and a production build; also check responsive layouts and keyboard navigation manually.

## Commit & Pull Request Guidelines

Git history is unavailable in this workspace, so use concise, imperative Conventional Commits, for example `feat: add featured work reel` or `fix: clean up hero timeline`. Keep commits focused. Pull requests should explain the change, list verification performed, link relevant issues, and include before/after screenshots or recordings for visual and motion changes. Never commit secrets, local environment files, or unlicensed client assets.
