# Version 2 Architecture

The portfolio uses a small server-rendered Next.js/Vinext architecture. The
homepage is a motion-led AIDA landing page; long-form content remains on
destination and case-study routes.

## Structure

```text
app/
  page.tsx                    Portfolio landing-page entry
  work/page.tsx               Selected-work editorial
  work/stillsearch/           StillSearch case study
  work/demo-reel-2026/        Demo Reel 2026 project page
  process/                    Eight-stage working process
  about/                      Typography-only positioning and practice
  contact/                    Discovery call, email, and social links
components/                   Shared primitives and landing-page motion
lib/                          Verified project content and media references
public/                       Fonts, social preview, and hosting metadata
tests/                        Server-render and hosting checks
worker/                       Cloudflare-compatible application entry point
```

## Implementation boundaries

- Keep homepage project films externally hosted and mobile-safe.
- Keep route-owned content close to its route.
- Keep large films on external media delivery.
- Preserve native navigation, keyboard access, and reduced-motion support.
- Add dependencies only when a future approved feature genuinely requires one.
- Do not reintroduce WebGL, loading screens, custom cursors, or legacy intro code.
