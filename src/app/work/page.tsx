import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/PageMotion";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Work — Chulda", description: "Selected SaaS, AI, and digital product motion work." };

const projects = [
  { href: "/work/stillsearch", name: "StillSearch", type: "AI search / Product film", copy: "Making discovery feel effortless.", className: "work-still", image: "/assets/illustrations/stillsearch-signal.jpg" },
  { href: "/work/showreel", name: "Motion reel", type: "Selected moments / 2026", copy: "Ideas, made visible.", className: "work-reel", image: "/assets/illustrations/demo-reel-motion.jpg" },
  { href: "/work/coming-soon", name: "In progress", type: "New case study", copy: "The next product story is taking shape.", className: "work-soon", image: "/assets/illustrations/coming-soon-system.jpg" },
];

export default function WorkPage() {
  return <PageMotion className="work-page">
    <div className="route-nav-reveal"><SiteNav /></div>
    <section className="route-hero light-hero"><div className="route-hero-aside"><p className="route-hero-copy">Selected product stories where strategy, design, and motion work as one system.</p><span className="icon-link">Scroll to explore <ArrowDown size={14} aria-hidden="true" /></span></div><div><div className="route-line-clip"><h1 className="route-hero-line">Work with</h1></div><div className="route-line-clip"><h1 className="route-hero-line"><em>something to say.</em></h1></div></div></section>
    <section className="work-list">
      {projects.map((project, index) => <Link className={`work-row ${project.className} stack-card`} href={project.href} key={project.name}><div className="work-row-head"><span>{project.name}</span><span>{project.type}</span><b aria-hidden="true"><ArrowUpRight size={16} /></b></div><div className="work-row-art scale-reveal"><Image src={project.image} alt="" fill sizes="(max-width: 899px) 100vw, 52vw" /><i /><i /><strong>{index === 0 ? "SEARCH LESS" : index === 1 ? "PLAY / 00:58" : "COMING SOON"}</strong></div><h2>{project.copy}</h2></Link>)}
    </section>
    <SiteFooter nextLabel="See how I work." nextHref="/process" />
  </PageMotion>;
}
