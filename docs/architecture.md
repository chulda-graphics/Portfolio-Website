# Version 2 Architecture Boundary

The reset intentionally keeps the architecture smaller than the future site.
New structure should be added only after the Version 2 design brief defines a
real requirement.

## Current scaffold

```text
app/
  globals.css     Shared single-viewport entry and route-shell styles
  layout.tsx      Root document and portfolio metadata
  page.tsx        Minimal navigation-led homepage
  work/           Work route shell
  process/        Process route shell
  about/          About route shell
  contact/        Contact route shell
assets/
  licenses/       Third-party asset licenses
build/            Sites packaging integration
docs/             Preserved creative, content, and architecture knowledge
public/
  fonts/          DM Sans variable fonts
components/
  destination-page.tsx  Shared semantic shell for undeveloped destinations
tests/            Minimal server-render and hosting checks
worker/           Cloudflare-compatible application entry point
```

## Rules for the next implementation

- Keep route-owned code close to its route.
- Create shared components only after a second real use appears.
- Separate content data from interactive rendering when it improves maintainability.
- Isolate advanced motion and WebGL behind lazy client boundaries.
- Provide static or reduced-motion fallbacks before adding advanced animation.
- Define explicit asset budgets and loading strategies.
- Keep large project films on external media delivery rather than in the Worker bundle.
- Add dependencies only for an approved feature in the new brief.
- Keep production tests aligned with the routes that actually exist.

## Deliberately absent

There is currently no project schema, case-study template, motion runtime,
scrolling library, WebGL layer, carousel, contact integration, or Version 2
asset library. The homepage navigation and four route shells are the only
implemented interface. Everything else belongs to future dedicated briefs.
