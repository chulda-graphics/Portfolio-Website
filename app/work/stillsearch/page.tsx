import type { Metadata } from "next";
import Link from "next/link";
import { ProjectVideo } from "@/components/project-video";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "StillSearch Case Study",
  description:
    "A detailed look at the creative solution and process behind the StillSearch launch film.",
};

export default function StillSearchPage() {
  const project = projects.stillsearch;

  return (
    <main className="page-shell case-page">
      <SiteHeader current="work" />

      <header className="case-heading">
        <p className="eyebrow">Case study / {project.index}</p>
        <h1>{project.title}</h1>
        <p>Helping filmmakers find the right frame—faster.</p>
      </header>

      <ProjectVideo
        className="case-film"
        src={project.video}
        label="StillSearch product launch film"
      />

      <section className="case-facts" aria-label="Project details">
        <div>
          <p>Client</p>
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
          <p>Scope</p>
          <p>Product launch film</p>
        </div>
      </section>

      <section className="case-narrative">
        <p className="case-section-number">01 / Context</p>
        <h2>A visual-search product needed a launch film that made its difference immediately clear.</h2>
        <div className="case-body">
          <p>
            StillSearch helps filmmakers find static frames from dynamic
            content for creative reference. The product needed a focused launch
            film that could introduce the idea, distinguish the experience from
            competing search tools, and demonstrate how the website works.
          </p>
          <p>
            The previous motion work did not communicate the product with the
            quality or clarity required for launch. The new film needed to make
            a complex workflow feel immediate, useful, and easy to trust.
          </p>
        </div>
      </section>

      <section className="case-statement">
        <p>The creative solution</p>
        <p>Turn product education into a coherent visual argument.</p>
      </section>

      <section className="case-narrative case-narrative-split">
        <p className="case-section-number">02 / Direction</p>
        <h2>Show the differentiator, the workflow, and the features as one continuous story.</h2>
        <div className="case-body">
          <p>
            The main concept positioned StillSearch as the better visual search
            experience for filmmakers. Instead of separating the product pitch
            from the demonstration, the film used the interface itself to carry
            the story.
          </p>
          <p>
            I recreated the website UI in After Effects, then designed motion
            around the way a filmmaker would naturally understand the product:
            discover the difference, see the search behavior, and recognize the
            practical value of its features.
          </p>
        </div>
      </section>

      <section className="case-process" aria-labelledby="case-process-title">
        <p className="eyebrow">03 / Execution</p>
        <h2 id="case-process-title">A precise system from interface to final polish.</h2>
        <ol>
          <li><span>01</span><p>Study the supplied storyboard and script.</p></li>
          <li><span>02</span><p>Recreate the product interface for animation.</p></li>
          <li><span>03</span><p>Define hierarchy, pacing, and scene rhythm.</p></li>
          <li><span>04</span><p>Animate the product workflow and core features.</p></li>
          <li><span>05</span><p>Refine timing, transitions, typography, and sound.</p></li>
        </ol>
      </section>

      <blockquote className="case-quote">
        <p>
          “Dhrex has both exceptional creative taste and the technical skill to
          produce a strong launch video, but as a founder, what impressed me
          most was his sense of ownership.”
        </p>
        <footer>
          John Lexter Laguinday<br />Founder, StillSearch
        </footer>
      </blockquote>

      <nav className="next-project" aria-label="Next project">
        <p>Next project / 02</p>
        <Link href="/work/demo-reel-2026">Demo Reel 2026 ↗</Link>
      </nav>

      <SiteFooter />
    </main>
  );
}
