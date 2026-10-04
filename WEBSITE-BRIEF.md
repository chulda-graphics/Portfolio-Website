# DHREX portfolio — Phase 1 experience proposal

Status: awaiting design approval. Research performed 2026-10-04. Documentation only; no site implementation.

## Repository and hosting audit

- Supplied repository: https://github.com/chulda-graphics/Portfolio-Website (carried forward from the earlier message; the Phase 1 URL placeholder does not replace it).
- Verified origin fetch/push URL matches; default branch `main`; clean checkout at `f6abb9b` (`Clean website repository for fresh rebuild`). No tracked site files, project guidance, package manifest, framework, assets, CI workflow, or Cloudflare configuration existed.
- Planning branch: `implementation/phase-1-experience-plan`. No existing work overwritten.
- No current website URL supplied; repository homepage is unset.
- GitHub check on main: failed `Workers Builds: official-website`. This is evidence of a Workers integration, not confirmation of Cloudflare Pages. Dashboard redirects to sign-in; project type, production branch, build command, output directory, domains and preview settings remain unverified.
- Before implementation/deployment, confirm Pages versus Workers with the owner and authenticated settings. Production stays approval-gated. Use branch previews only after verifying isolation from production; no deploy commands or main changes in Phase 1.
- No framework to preserve today. Later recommendation: a small static-first framework with generated HTML for every route (Astro is a candidate), selectively using GSAP for the five approved effects. Choose after approval; React Bits is reference material, not a reason to change stacks.

## Visual direction

Personal SaaS motion-design portfolio: the work, craft and person are the content. Draft hero: “SaaS stories. / Designed to move.” with “Dhrex — Motion Designer” as supporting identity. Confirm wording before implementation. No invented clients, impact metrics, testimonials or availability claims.

Use Bayad's warm paper `#F6F4EF`, white `#FFFFFF`, ink `#1D1B17`, secondary ink `#5F5A50`, borders `#E7E3DB` and sparse green `#1C7F53`. Generous editorial space, wide two-line display headings, readable body type, rounded media corners around 14–20px, fine borders and quiet shadows. Propose licensed/self-hosted Geist plus system fallbacks; do not redistribute Apple fonts or symbols.

Glass only on navigation and secondary controls; opaque content, project captions and contact information. Opaque fallback when contrast/transparency needs demand it. Green is an accent, not a full-page wash. Project footage supplies color. No stock imagery or reference-site assets in the portfolio.

The supplied [Bayad design reference](docs/references/BAYAD-DESIGN.md) is preserved here as source material. Its ledger layout, native Swift helpers, app navigation and “no decorative motion” rule describe Bayad; they do not override this portfolio request. No Bayad screenshots were attached or present in the repository, so screenshot-derived visual validation is still pending.

## Reference → borrowed principle → website location

| Reference | Borrowed principle | Portfolio location |
| --- | --- | --- |
| [Lando Norris](https://landonorris.com/) | Immersive opening, changes of scale, deliberate chapter pacing | Home hero and zoom-out; use Dhrex's own footage and identity, no racing branding |
| [OFF+BRAND case study](https://www.itsoffbrand.com/our-work/lando-norris) | Explain objective, role and execution alongside substantial media | `/work/<slug>` case-study narrative |
| [Lando Awwwards record](https://www.awwwards.com/sites/lando-norris) | Interaction ambition, assessed independently from visual identity | Motion benchmark only |
| [Exo Ape](https://www.exoape.com/) | Large media, generous white space, contextual “View” cursor | Selected work and card-to-project transition |
| [Dennis Snellenberg](https://dennissnellenberg.com/) | Personal positioning, concise navigation, expressive menu | About, navigation and restrained pointer feedback |
| [React Bits](https://reactbits.dev/) | Small, adjustable effects instead of a whole visual theme | Optional hero text reveal/mask prototype; evaluate license and cost before adopting code |
| [Joris Brianti — Awwwards](https://www.awwwards.com/sites/joris-brianti-portfolio), [live](https://jorisbrianti.fr/) | Clear personal identity, compact nav and scroll-revealed introduction | About introduction; avoid blocking percentage preloader |
| [Giats — Awwwards](https://www.awwwards.com/sites/https-giats-me), [live](https://giats.me/) | Pale canvas, asymmetric media and clear contact action | Light visual balance and contact CTA; avoid decorative 3D workload |

## Observation scope and limitations

Live browser inspection used desktop 1440×900 and narrow 390×844 (Lando initially 464px). These are browser viewports, not physical touch-device tests. Wheel scrolling, menu opening and component controls were exercised; snapshots capture intermediate frames as well as end states. No frame-rate or timing measurements were made.

- Lando: close-up hero moved into dark message chapter on narrow scrolling; mobile has “Tap to lock” interaction. Desktop opened a dark image-collage menu with four main links. Desktop scrolling was attempted, but the captured state remained the menu/hero, so the exact desktop zoom choreography is not verified.
- OFF+BRAND: desktop and narrow scrolling moved from helmet media/title into objective and services; mobile nav collapses and its menu control was opened. This is a case-study website, not a substitute for inspecting Lando live.
- Awwwards: Lando record visually inspected and scrolled; additional Joris/Giats records inspected and followed to live sites. Award media are evidence about the submitted design, not verification of the current live implementation.
- Exo Ape: desktop scroll from full-bleed Venice opening into white, asymmetric project gallery. Pointer positioned over a card during scroll displayed a circular “View” treatment. Card activation started a large media transition. Narrow retest verified a stacked project gallery, menu opening/closing and card URL `/work/ottografie`; complete gallery traversal was not tested.
- Dennis: narrow scroll moved portrait/name hero into introduction and work; menu opened with a curved panel edge and blue close button, and desktop reflow showed the final right-side navigation panel. Full project hover behavior was not verified.
- React Bits: desktop scroll and Aurora preset click verified live demo/code changes. Narrow layout collapses nav to a menu control. Component-gallery navigation, cursor/mask demos and complete mobile traversal were not tested.
- Joris: live desktop/narrow layouts inspected; narrow scroll revealed the introduction. Nav destinations read; click navigation and project transition not yet tested.
- Giats: desktop and narrow scroll into introduction and live menu opening tested. Narrow hero rearranges its media mosaic and retains the menu; full case-study navigation not verified.
- Dedicated pointer-hover/move is unavailable in the exposed browser controls. Only incidental Exo Ape card hover was observed; magnetic buttons and masks are proposed, not claimed as tested. Reduced-motion behavior on reference sites was not verified. Keep proposed fallbacks explicit rather than copying unknown behavior.

## Site map and button destinations

| Route | Purpose |
| --- | --- |
| `/` | Identity + reel, selected work sequence, brief about, contact invitation |
| `/work` | All approved projects in a readable grid/list |
| `/work/<slug>` | Project intro; role/scope; problem; motion approach; final media; genuine outcomes; next project |
| `/about` | Personal story, craft, process and portrait |
| `/contact` | Verified email/contact channels and collaboration prompt |

| Primary action | Real destination contract |
| --- | --- |
| View Work | `/work` |
| Play Reel | `/#reel`: opens accessible dialog playing a repository-hosted reel; direct hash load opens the same dialog. Escape/close restores focus and pauses playback. Native inline player fallback. Missing reel: omit action until supplied, never a dummy link. |
| Project card | `/work/<approved-slug>` via ordinary anchor. Candidate `/work/bayad` only if the owner confirms it as a portfolio project and supplies content. |
| Back to Work | `/work`; preserve prior list position when applicable |
| Next Project | Next published `/work/<slug>` in explicit editorial order; final project returns to `/work` labelled “All Work” |
| Contact | `/contact` everywhere; its email action uses the owner's verified `mailto:` address (currently missing) |

Logo → `/`; global links Home/Work/About/Contact use their routes. No `#` placeholders, guessed email, invented projects or reliance on browser-history Back for core navigation.

## One cohesive motion sequence

Home proceeds from attention (identity/reel) to interest (selected work), desire (case-study craft), and action (contact). Work and detail pages prioritize readable content. One pinned horizontal sequence on Home only.

| Interaction / trigger | Animation and end state | Mobile / reduced-motion fallback |
| --- | --- | --- |
| Cinematic hero / first entry, once poster is ready | 700–900ms masked text rise with short stagger; media gently settles from 1.04 to 1.0. Ends with full identity, two readable CTAs and visible poster. Never block content waiting for video. | Narrow: shorter fade, no oversized crop hiding identity. Reduced motion: content visible immediately; static poster; user-started reel. |
| Zoom-out into selected work / scroll through hero boundary | Desktop scrub over roughly one viewport: hero media shrinks into a rounded frame while work title and first card appear. Ends in the work chapter; text remains legible outside transformed media. | Narrow: normal document flow, gentle optional fade, no pin. Reduced motion: static framed media and ordinary vertical flow. |
| Horizontal project sequence / reach Home selected work | Desktop pin with vertical scrolling translating 3–4 approved cards horizontally; travel equals track width minus viewport width. Ends by unpinning into About/contact, with visible progress and All Work link. Keyboard-accessible links; no mandatory drag. | Narrow and reduced motion: stacked vertical cards, no pin, scrub or forced horizontal travel. |
| Card → case study / activate project anchor | If supported, shared poster grows into the case-study hero over 450–600ms, with caption fading out and detail title appearing. Ends at real project URL with focus on main heading. Back restores list context. Anchor navigation remains functional if animation fails. | Narrow: brief fade or direct route navigation. Reduced motion: immediate navigation. |
| Cursor / fine pointer enters project media | Keep native cursor; add a small “View” follower and a subtle localized reveal of the alternate still, eased within the media bounds. Ends/removes on leave; no full-screen shader or text obstruction. | Touch/coarse pointer: no follower/mask; persistent visible project title/CTA. Reduced motion: static hover/focus border, no following or reveal movement. |

All motion is enhancement: normal scroll, semantic links, visible keyboard focus, 44px controls, no cursor-dependent access. Prefer transforms/opacity; clean up timelines across routes and viewport changes. Under reduced motion, also remove autoplay decorative video. Reel playback always follows a user action and offers controls/captions.

## Required assets and approval inputs

- Owner's 20–45s reel (duration suggestion), optimized video and poster, caption track/transcript, and licensed music rights if sound is included.
- 3–4 selected projects: actual names/slugs, permission-cleared stills/clips, role, dates, scope, story and verifiable outcomes. Larger archive can follow.
- Bayad screenshots or exports for personality validation; redact payment/contact data. The design document alone does not establish screenshot appearance.
- Portrait, short bio, verified email/social URLs and desired availability statement.
- Font/icon/asset licenses stored in repository alongside acquired assets. No borrowed reference imagery, logos or copy.

## Approval boundary and next phase

Approve the light paper/green direction, proposed routes and five-interaction sequence before coding. Then resolve project/reel/contact inputs and Cloudflare hosting settings. Static output must include direct-loadable project routes, metadata, 404 behavior and repository-owned configuration. Lazy-load below-fold media; prioritize hero poster and keep script scope small. Do not merge, deploy production, install a framework or add UI code in Phase 1.
