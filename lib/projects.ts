export type Project = {
  index: string;
  title: string;
  descriptor: string;
  year: string;
  cover: string;
  href?: string;
  alt: string;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Demo Reel 2026",
    descriptor: "Personal motion reel",
    year: "2026",
    cover: "/assets/demo-reel-cover.png",
    href: "/work/demo-reel-2026",
    alt: "Demo Reel 2026 cover showing the Dhrex portfolio on a phone mockup",
  },
  {
    index: "02",
    title: "StillSearch",
    descriptor: "SaaS launch film",
    year: "2026",
    cover: "/assets/stillsearch-cover.png",
    href: "/work/stillsearch",
    alt: "StillSearch launch film cover showing its visual search interface",
  },
  ...Array.from({ length: 8 }, (_, item) => ({
    index: String(item + 3).padStart(2, "0"),
    title: "Coming Soon",
    descriptor: "Future SaaS project",
    year: "—",
    cover: "/assets/coming-soon.png",
    alt: "Coming soon project placeholder",
  })),
];
