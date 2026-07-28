import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Dhrex's process for creating clear, purposeful SaaS motion design.",
};

const phases = [
  {
    index: "01",
    title: "Discovery call",
    copy: "Define the product, audience, problem, scope, and the feeling the work needs to create.",
  },
  {
    index: "02",
    title: "Research",
    copy: "Study the software, its market, its users, and the moments where motion can create real clarity.",
  },
  {
    index: "03",
    title: "Still frames",
    copy: "Establish the visual system, composition, typography, and hierarchy before animation begins.",
  },
  {
    index: "04",
    title: "Strategy call",
    copy: "Align on the creative direction and make deliberate decisions before moving into production.",
  },
  {
    index: "05",
    title: "Animation",
    copy: "Build rhythm, transitions, interface movement, and narrative progression with purpose.",
  },
  {
    index: "06",
    title: "Revisions",
    copy: "Refine the work collaboratively, keeping feedback connected to the original objective.",
  },
  {
    index: "07",
    title: "Polish",
    copy: "Tune timing, easing, type, sound, and small interactions until every detail feels resolved.",
  },
  {
    index: "08",
    title: "Delivery",
    copy: "Prepare final files for the right platforms, formats, ratios, and launch conditions.",
  },
];

export default function ProcessPage() {
  return (
    <main className="page-shell">
      <SiteHeader current="process" />

      <section className="editorial-hero process-hero" aria-labelledby="process-title">
        <p className="eyebrow">Process / Eight stages</p>
        <h1 id="process-title">
          Clarity
          <br /> before
          <br /> motion.
        </h1>
        <p className="hero-note">
          The strongest motion comes from understanding—not decoration. Every
          engagement begins with the product and ends with a precise visual
          answer.
        </p>
      </section>

      <section className="process-list" aria-label="Working process">
        {phases.map((phase) => (
          <article key={phase.index}>
            <p>{phase.index}</p>
            <h2>{phase.title}</h2>
            <p>{phase.copy}</p>
          </article>
        ))}
      </section>

      <section className="process-principle">
        <p className="eyebrow">Working principle</p>
        <p>
          Every frame should explain something. Every transition should guide
          attention. Every detail should earn its place.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
