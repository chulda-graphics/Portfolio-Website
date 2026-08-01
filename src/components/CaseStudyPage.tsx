import Link from "next/link";
import { ArrowDown, Play } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "./PageMotion";
import { SiteFooter, SiteNav } from "./SiteChrome";

type CaseStudy = {
  title: string;
  descriptor: string;
  summary: string;
  accent: string;
  sections: Array<{ title: string; copy: string }>;
  nextLabel: string;
  nextHref: string;
};

export function CaseStudyPage({ project }: { project: CaseStudy }) {
  return (
    <PageMotion className="case-page" >
      <div className="route-nav-reveal"><SiteNav inverse /></div>
      <section className="case-hero route-hero">
        <div className="case-hero-meta"><span>{project.descriptor}</span><span>Strategy / Direction / Motion</span></div>
        <div className="route-line-clip"><h1 className="route-hero-line">{project.title}</h1></div>
        <div className="case-hero-bottom"><p className="route-hero-copy">{project.summary}</p><Link className="icon-link" href="#film">Watch the final film <ArrowDown size={14} aria-hidden="true" /></Link></div>
        <div className={`case-art ${project.accent} route-hero-art scale-reveal`}><div className="case-art-orbit"><i /><i /><i /></div><strong>{project.title}</strong><span>PLAY FILM</span></div>
      </section>

      <section id="film" className="case-film"><div className="film-frame scale-reveal"><span>FINAL FILM</span><button aria-label={`Play ${project.title} film`}><Play size={24} weight="fill" aria-hidden="true" /></button><b>00:58</b></div></section>

      <section className="case-overview"><p>The brief</p><h2>{project.summary}</h2><div><span>Role<br /><strong>Creative direction<br />Design & animation</strong></span><span>Deliverables<br /><strong>Product film<br />Motion system</strong></span></div></section>

      <section className="case-story">
        {project.sections.map((section, index) => (
          <article className="story-row stack-card" key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2><p>{section.copy}</p>
            <div className={`story-visual visual-${(index % 4) + 1}`} aria-hidden="true"><i /><i /><i /><strong>{section.title}</strong></div>
          </article>
        ))}
      </section>

      <section className="case-outcome"><p>Final outcome</p><h2>A motion system built to make the product easier to understand—and harder to forget.</h2><div className="outcome-signal"><i /><i /><i /><span>Clarity in every frame</span></div></section>
      <SiteFooter nextLabel={project.nextLabel} nextHref={project.nextHref} />
    </PageMotion>
  );
}
