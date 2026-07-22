export type Project = {
  index: string;
  title: string;
  descriptor: string;
  year: string;
  cover: string;
  coverAvif: string;
  width: number;
  height: number;
  href?: string;
  alt: string;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Demo Reel 2026",
    descriptor: "Personal motion reel",
    year: "2026",
    cover: "/assets/demo-reel-cover-v1.webp",
    coverAvif: "/assets/demo-reel-cover-v1.avif",
    width: 1600,
    height: 889,
    href: "/work/demo-reel-2026",
    alt: "Demo Reel 2026 cover showing the Dhrex portfolio on a phone mockup",
  },
  {
    index: "02",
    title: "StillSearch",
    descriptor: "SaaS launch film",
    year: "2026",
    cover: "/assets/stillsearch-cover-v1.webp",
    coverAvif: "/assets/stillsearch-cover-v1.avif",
    width: 1600,
    height: 886,
    href: "/work/stillsearch",
    alt: "StillSearch launch film cover showing its visual search interface",
  },
  {
    index: "03",
    title: "Coming Soon",
    descriptor: "Next SaaS story",
    year: "—",
    cover: "/assets/coming-soon-v1.webp",
    coverAvif: "/assets/coming-soon-v1.avif",
    width: 433,
    height: 287,
    alt: "A minimal visual indicating the next SaaS motion project is coming soon",
  },
];
