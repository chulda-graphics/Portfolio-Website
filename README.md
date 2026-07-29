# Dhrex Cañezo Portfolio

A motion-led portfolio for SaaS motion designer Dhrex Cañezo. Built with React, Vite, and GSAP as a static site suitable for Cloudflare Pages.

## Development

```bash
npm install
npm run dev
```

Run `npm run build` to generate the production site in `dist/`. The included `wrangler.jsonc` deploys that directory as Cloudflare Worker static assets with SPA routing. Use `npm run deploy` for a direct deployment. For a connected Cloudflare build, use `npm run build` as the build command and `npx wrangler deploy` as the deploy command.

## Verification

```bash
npm run lint
npm test
npm run build
```
