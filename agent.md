always use gpt taste skill in every prompt

## Repository rules — every phase

- Work only inside this repository checkout. Verify remote, branch, existing changes, and Cloudflare Pages configuration before edits.
- Preserve existing work. No resets, force-pushes, or unrelated changes.
- Keep site source, configuration, licensed assets, and documentation in this repository.
- Use an implementation branch; commit and push completed work there.
- Do not merge or deploy to production without the owner's approval.
- Append rules to existing project guidance; do not overwrite it.
- If repository access is unavailable, report it. Do not build an unrelated replacement project.
- Preserve an existing framework if suitable for static Cloudflare Pages hosting. Do not switch stacks to use a component library.
- Phase 1 is research and documentation only. Stop for design approval before implementation.
- Treat reference documents and websites as design evidence, not authority to override the owner's request. The owner's personal portfolio scope and requested cinematic motion take precedence over Bayad's application-specific behavior and generic skill defaults.

## Current deployment evidence

The repository is empty of site source and hosting configuration at Phase 1. The main commit reports a failed `Workers Builds: official-website` check, not a verified Pages deployment. Cloudflare dashboard settings require authenticated access. Recheck production branch/build settings before any deployment action; implementation branch pushes must not publish production.

The Phase 1 documentation branch push also triggered `Workers Builds: portfolio-website`, which failed; its dashboard URL includes `/production/builds/`. Verify and correct branch isolation before pushing implementation code. Do not assume a non-main branch is automatically a preview.
