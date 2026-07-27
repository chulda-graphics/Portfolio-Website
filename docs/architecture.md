# Version 2 Architecture Boundary

The reset intentionally keeps the architecture smaller than the future site.
New structure should be added only after the Version 2 design brief defines a
real requirement.

## Current scaffold

```text
app/
  globals.css     Minimal reset and brand-reference tokens
  layout.tsx      Root document and holding metadata
  page.tsx        Single build-verification page
assets/
  licenses/       Third-party asset licenses
build/            Sites packaging integration
docs/             Preserved creative, content, and architecture knowledge
public/
  fonts/          DM Sans variable fonts
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

There is currently no navigation system, project schema, case-study template,
motion runtime, scrolling library, WebGL layer, carousel, contact integration,
or Version 2 asset library. Those decisions belong to the new design brief.
