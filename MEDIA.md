# Media manifest

All visual assets used by the website are either stored in `public/assets` or
referenced here as externally hosted production media.

| Project | Local poster | Video source |
| --- | --- | --- |
| Demo Reel 2026 | `public/assets/demo-reel-cover.png` | `https://pub-8843028733224946913b21df4054c3ae.r2.dev/Video%20Demo%20Reel%202026.mp4` |
| StillSearch | `public/assets/stillsearch-cover.png` | `https://pub-8843028733224946913b21df4054c3ae.r2.dev/StillSearch%20Launch%20Video.mp4` |
| Coming Soon (03–10) | `public/assets/coming-soon.png` | None |

The MP4 files remain on the supplied Cloudflare R2 media host because each is
approximately 45 MB. They are loaded only on their case-study route with
`preload="metadata"` and a local poster, keeping the first page responsive.
