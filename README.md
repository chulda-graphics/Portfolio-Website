# DHREX portfolio

Static personal SaaS motion-design portfolio. Built with Astro, CSS tokens and self-hosted Geist. No server rendering, API, CMS, contact backend or advanced motion in Phase 2.

## Local workflow

Use Node 24 and npm. Run `npm ci`, `npm run check`, `npm run build`, `npm test`, then `npm run preview -- --host 127.0.0.1 --port 4321`.

Routes: `/`, `/work`, `/work/project-template`, `/about`, `/contact`, and a generated `404.html`. Each route has its own static HTML file. Page changes use normal browser navigation, including Back/Forward and direct loads. The mobile menu uses native details/summary and works without JavaScript; JavaScript adds Escape and outside-click dismissal.

## Content

Owner-confirmed identity: Dhrex, SaaS motion designer. No project assets, reel, portrait, biography, verified contact address or project results supplied. Those absences are labelled on the relevant pages. `src/data/site.ts` is the content source; add approved project records there to generate `/work/<slug>` routes. The case-study template is explicitly a preview and marked `noindex`. Add media under `public/media/` and record rights in `docs/ASSETS.md`. Never publish sample claims as finished portfolio content.

## Design

Shared foundations are in `src/styles/tokens.css`; layout and component rules are in `src/styles/global.css`. Bayad's paper, green, hairlines, spacing rhythm and soft surfaces inform the visual system. Glass is confined to navigation and secondary buttons, with an opaque base fallback. Main content stays opaque and readable. All assets are local, with no external font service.

## Hosting

See [Cloudflare settings](docs/DEPLOYMENT.md). Static compatibility is verified by the production build; remote settings require separate verification. No deployment command is included in npm scripts. Never merge or deploy production without approval.
