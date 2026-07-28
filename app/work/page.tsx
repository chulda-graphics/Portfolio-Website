import type { Metadata } from "next";
import Link from "next/link";
import { ProjectVideo } from "@/components/project-video";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected product motion, launch films, and interface animation by Dhrex.",
};

export default function WorkPage() {
  return (
    <main className="page-shell">
      <SiteHeader current="work" />

      <section className="editorial-hero work-hero" aria-labelledby="work-title">
        <p className="eyebrow">Selected work / 2026</p>
        <h1 id="work-title">
          Motion gives
          <br /> software a
          <br /> clearer voice.
        </h1>
        <p className="hero-note">
          Product motion and launch films designed to make software easier to
          understand, trust, and remember.
        </p>
      </section>

      <section className="work-showcase" aria-label="Selected projects">
        <article className="work-project">
          <Link
            className="work-project-link"
            href={`/work/${projects.stillsearch.slug}`}
            aria-label="View the StillSearch case study"
          >
            <ProjectVideo
              src={projects.stillsearch.video}
              label="StillSearch launch film preview"
            />
            <div className="work-project-topline">
              <span>{projects.stillsearch.index} / 02</span>
              <span>{projects.stillsearch.descriptor}</span>
              <span>{projects.stillsearch.year}</span>
            </div>
            <div className="work-project-heading">
              <p>{projects.stillsearch.role}</p>
              <h2>{projects.stillsearch.title}</h2>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
        </article>

        <article className="work-project">
          <Link
            className="work-project-link"
            href={`/work/${projects.demoReel.slug}`}
            aria-label="View the Demo Reel 2026 project"
          >
            <ProjectVideo
              src={projects.demoReel.video}
              label="Demo Reel 2026 preview"
            />
            <div className="work-project-topline">
              <span>{projects.demoReel.index} / 02</span>
              <span>{projects.demoReel.descriptor}</span>
              <span>{projects.demoReel.year}</span>
            </div>
            <div className="work-project-heading">
              <p>{projects.demoReel.role}</p>
              <h2>{projects.demoReel.title}</h2>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
        </article>
      </section>

      <section className="closing-statement">
        <p className="eyebrow">Next project</p>
        <h2>Have software that deserves to be understood?</h2>
        <a
          href="https://calendly.com/chulda-graphics2022/30min"
          target="_blank"
          rel="noreferrer"
        >
          Schedule a discovery call ↗
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}
