# Version 2 Architecture

The portfolio uses a small server-rendered Next.js/Vinext architecture. The
homepage is intentionally isolated as a non-scrolling navigation index; all
long-form content lives on destination and case-study routes.

## Structure

```text
app/
  page.tsx                    Fixed, one-viewport portfolio index
  work/page.tsx               Selected-work editorial
  work/stillsearch/           StillSearch case study
  work/demo-reel-2026/        Demo Reel 2026 project page
  process/                    Eight-stage working process
  about/                      Typography-only positioning and practice
  contact/                    Discovery call, email, and social links
components/                   Shared header, footer, and video primitives
lib/                          Verified project content and media references
public/                       Fonts, social preview, and hosting metadata
tests/                        Server-render and hosting checks
worker/                       Cloudflare-compatible application entry point
```

## Implementation boundaries

- Keep the homepage non-scrollable and free of project media.
- Keep route-owned content close to its route.
- Keep large films on external media delivery.
- Preserve native navigation, keyboard access, and reduced-motion support.
- Add dependencies only when a future approved feature genuinely requires one.
- Do not reintroduce WebGL, loading screens, custom cursors, or legacy intro code.
