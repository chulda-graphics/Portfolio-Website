# Cloudflare static hosting

## Verified locally

Astro `output: static`, `build.format: directory`. Each route generates an HTML file in `dist`. No Cloudflare adapter, server functions, server-only feature, database or API required. Self-hosted CSS, scripts, fonts, favicon and `_headers` live in the same output. `404.html` provides custom not-found handling on Pages instead of an SPA catch-all.

Cloudflare Pages settings for this repository:

- Framework preset: Astro
- Root directory: repository root
- Build command: `npm run build`
- Build output directory: `dist`
- Node: 24 (`.node-version`)
- Production branch: owner-approved branch only; never this implementation branch
- Preview branch: `implementation/phase-1-experience-plan`

References: [Cloudflare Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) and [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).

## Remote verification limits

Phase 1 and the pre-Phase 2 audit found a failed Workers build, not a verified Pages project. Cloudflare dashboard required sign-in. During Phase 2 the owner confirmed that the implementation branch is now isolated to previews and cannot deploy production. This authorizes the requested branch push; dashboard settings and hosting type have not been independently verified.

Do not add a Workers deploy script or `wrangler` target just to repair an unrelated integration. If the account still builds Workers rather than Pages, resolve that in hosting settings with the owner. Do not describe a Workers preview as a verified Pages deployment.

For a Pages preview, verify `/`, `/work`, `/work/project-template`, `/about`, `/contact`, direct refresh and an unknown URL. Report a preview URL only after receiving it from a successful deployment and loading it. A local preview is not a Cloudflare deployment.
