# Dhrex — SaaS Motion Designer

The production source for Dhrex's personal portfolio: an original, monochrome,
motion-led experience for SaaS founders and software teams.

## Pages

- `/` — Work index with two live projects and eight Coming Soon entries
- `/work/demo-reel-2026` — Demo Reel 2026 case study
- `/work/stillsearch` — StillSearch launch-film case study
- `/about` — Design philosophy and working process
- `/contact` — Discovery call, email, and social links

## Development

```bash
npm install
npm run dev
```

Run the production checks with:

```bash
npm test
```

## Media

Project covers are stored in `public/assets`. The two project films stream from
the client's Cloudflare R2 delivery URLs documented in `MEDIA.md`; keeping the
large MP4 files on the media CDN preserves fast repository operations and avoids
static-host file-size limits.

## Technology

Next.js, React, TypeScript, CSS, vinext, and the Cloudflare Workers-compatible
Sites runtime.
