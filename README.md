# Dhrex — SaaS Motion Designer

The production source for Dhrex's personal portfolio: an original, monochrome,
motion-led experience for SaaS founders and software teams.

## Pages

- `/` — Scroll-led MacBook intro and a three-project work index
- `/work/demo-reel-2026` — Demo Reel 2026 case study
- `/work/stillsearch` — StillSearch launch-film case study
- `/about` — Design philosophy and working process
- `/contact` — Project inquiry form, in-site discovery call, and social links

## Development

```bash
npm install
npm run dev
```

Run the production checks with:

```bash
npm test
```

## Experience

- Scroll-led MacBook opening using the supplied production GLB model
- Purposeful smooth scrolling, shared internal page transitions, and a refined cursor
- Three-project rotating work index: two complete case studies and one intentional Coming Soon card
- Horizontal desktop case studies with native swipe navigation on touch devices
- Interactive frame previews built from twenty automatically selected stills per film
- In-site Calendly booking modal and an AJAX contact form that keeps visitors on the portfolio

## Media

Project covers use versioned AVIF/WebP assets in `public/assets`. The cursor
previews use compressed WebP frames in `public/frames`, selected from the two
project films with the scripts in `scripts`. The films themselves continue to
stream from the Cloudflare R2 delivery URLs documented in `MEDIA.md`, keeping
each large MP4 outside the Worker static-asset limit.

The contact form uses FormSubmit's AJAX endpoint. The first live submission sends
an activation message to `chulda.graphics2022@gmail.com`; confirm it once to begin
receiving project inquiries.

## Technology

Next.js, React, TypeScript, Three.js, Lenis, CSS, vinext, and the Cloudflare
Workers-compatible Sites runtime. Versioned static assets receive immutable
browser caching while Worker-rendered pages retain short edge revalidation.
