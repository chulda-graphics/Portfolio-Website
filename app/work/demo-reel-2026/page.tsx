import type { Metadata } from "next";
import { ProjectVideo } from "@/components/project-video";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Demo Reel 2026",
  description:
    "A personal motion reel directed, designed, animated, and edited by Dhrex.",
};

export default function DemoReelPage() {
  const project = projects.demoReel;

  return (
    <main className="page-shell case-page">
      <SiteHeader current="work" />

      <header className="case-heading">
        <p className="eyebrow">Personal work / {project.index}</p>
        <h1>Demo Reel<br />2026</h1>
        <p>A concentrated statement of craft, rhythm, and range.</p>
      </header>

      <ProjectVideo
        className="case-film"
        src={project.video}
        label="Dhrex Demo Reel 2026"
      />

      <section className="case-facts" aria-label="Project details">
        <div>
          <p>Project</p>
          <p>{project.client}</p>
        </div>
        <div>
          <p>Role</p>
          <p>{project.role}</p>
        </div>
        <div>
          <p>Year</p>
          <p>{project.year}</p>
        </div>
        <div>
          <p>Outcome</p>
          <p>Helped close one paid project</p>
        </div>
      </section>

      <section className="case-narrative">
        <p className="case-section-number">01 / Intent</p>
        <h2>A reel designed as a point of view—not a collection of disconnected clips.</h2>
        <div className="case-body">
          <p>
            The Demo Reel 2026 brings together selected fragments of my
            direction, design, animation, and editing into a single concise
            piece. It was created to communicate how I think, not just what
            software I can use.
          </p>
          <p>
            Every scene was designed and assembled by me. The pacing moves
            between interface motion, typographic rhythm, and visual systems to
            present a focused picture of the work I want to create for SaaS
            products.
          </p>
        </div>
      </section>

      <section className="case-statement">
        <p>The result</p>
        <p>One precise introduction to the work—and the project that opened the next door.</p>
      </section>

      <section className="case-narrative case-narrative-split">
        <p className="case-section-number">02 / Craft</p>
        <h2>Direction, design, animation, and edit shaped as one continuous rhythm.</h2>
        <div className="case-body">
          <p>
            The piece treats typography, transitions, scale, and sound as one
            system. Rather than maximizing the number of shots, it gives each
            idea enough time to register and contributes to a deliberate whole.
          </p>
          <p>
            It represents the standard I bring to client work: motion built to
            explain, guide, and connect—never movement for its own sake.
          </p>
        </div>
      </section>

      <nav className="next-project" aria-label="Next project">
        <p>Next project / 01</p>
        <a href="/work/stillsearch">StillSearch ↗</a>
      </nav>

      <SiteFooter />
    </main>
  );
}
