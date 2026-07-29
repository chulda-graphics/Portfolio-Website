# Repository Guidelines

Whatever action you can do yourself, please do yourself. This includes starting apps and performing verification.

Never use the Sites skill for designing this project.

## Project Structure & Module Organization

This repository is a clean slate for a Next.js portfolio landing page. Keep application code in `src/`: routes and layouts in `src/app/`, reusable UI in `src/components/`, animation utilities in `src/lib/`, and shared types in `src/types/`. Store static assets in `public/`; group portfolio media by project, for example `public/work/project-name/`. Co-locate component styles and tests with the component when practical. Avoid large page files—extract narrative sections and motion sequences into focused components.

## Build, Test, and Development Commands

Use npm and commit the generated `package-lock.json`. After the Next.js scaffold is added, maintain these standard scripts:

- `npm install` installs locked dependencies.
- `npm run dev` starts the local development server.
- `npm run build` creates the production build and catches integration errors.
- `npm run start` serves the production build locally.
- `npm run lint` runs ESLint.
- `npm test` runs the automated test suite once one is configured.

Run lint, tests, and a production build before opening a pull request.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and two-space indentation. Prefer named exports for reusable modules. Name components in PascalCase (`CaseStudyIntro.tsx`), hooks with a `use` prefix (`useReducedMotion.ts`), and utilities in camelCase. Use kebab-case for route segments and asset folders. Keep animation timing and easing tokens centralized rather than duplicating magic numbers. Respect `prefers-reduced-motion`, semantic HTML, keyboard navigation, and meaningful alternative text. Use the repository formatter and ESLint configuration once introduced; do not bypass rules without explanation.

## Testing Guidelines

Add tests alongside source files as `*.test.ts` or `*.test.tsx`. Prioritize navigation, interactive motion states, reduced-motion behavior, and content rendering. Use React Testing Library for component behavior and Playwright for critical page flows when those tools are added. Every bug fix should include a regression test when feasible.

## Commit & Pull Request Guidelines

History uses short, imperative, sentence-case subjects such as `Refine loader and editorial page transitions`. Keep each commit focused and avoid generic messages. Pull requests should explain the user-facing intent, summarize implementation choices, link relevant issues, and list verification performed. Include desktop and mobile screenshots or recordings for visual or motion changes, plus notes about accessibility and performance impacts.

## Security & Configuration

Never commit secrets or local `.env*` files. Document required variables in `.env.example`, use `NEXT_PUBLIC_` only for values safe to expose in the browser, and optimize large media before adding it to `public/`.
