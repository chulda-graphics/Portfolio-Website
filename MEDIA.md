# Media manifest

All visual assets used by the website are either stored in `public` or referenced
here as externally hosted production media.

| Project | Local poster | Video source |
| --- | --- | --- |
| Demo Reel 2026 | `public/assets/demo-reel-cover-v1.webp` | `https://pub-8843028733224946913b21df4054c3ae.r2.dev/Video%20Demo%20Reel%202026.mp4` |
| StillSearch | `public/assets/stillsearch-cover-v1.webp` | `https://pub-8843028733224946913b21df4054c3ae.r2.dev/StillSearch%20Launch%20Video.mp4` |
| Coming Soon (03) | `public/assets/coming-soon-v1.webp` | None |

The MP4 files remain on the supplied Cloudflare R2 media host because each is
approximately 45 MB. Their sources attach only when the film panel approaches
the viewport, while local posters keep each case study immediately legible.

Each film also has twenty versioned, automatically selected WebP stills under
`public/frames`. The MacBook intro uses the supplied model at
`public/models/macbook-pro-14-m5-v1.glb`; it is lazy-loaded as a separate client
chunk and never blocks the rest of the portfolio.
