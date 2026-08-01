import type { Metadata } from "next";
import { PageMotion } from "@/components/PageMotion";
import { ProcessStepper } from "@/components/ProcessStepper";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Process — Chulda", description: "A strategic motion-design process built around clarity." };
const phases = [
  ["Discovery", "Align on the product, audience, business goal, and the change the work needs to create."],
  ["Research", "Study the product deeply enough to separate what is merely complicated from what is genuinely important."],
  ["Script", "Turn product logic into a concise narrative with a clear promise, progression, and point of view."],
  ["Storyboard", "Solve sequence, visual logic, and pacing before expensive production decisions are locked."],
  ["Styleframes", "Define a visual language that belongs to the product and holds together across every touchpoint."],
  ["Asset creation", "Build animation-ready interface, illustration, type, and spatial systems with reuse in mind."],
  ["Animation", "Use rhythm, focus, and transition to explain relationships and guide attention with intention."],
  ["Sound design", "Give interactions weight, pace, and emotional resolution without overwhelming the idea."],
  ["Revision", "Review against the objective—not subjective novelty—and sharpen every frame that is not doing its job."],
  ["Delivery", "Export organized, adaptable assets for launches, campaigns, product education, and future growth."],
];

export default function ProcessPage() { return <PageMotion className="process-page"><div className="route-nav-reveal"><SiteNav inverse /></div><section className="route-hero process-route-hero"><div><div className="route-line-clip"><h1 className="route-hero-line">Clarity before</h1></div><div className="route-line-clip"><h1 className="route-hero-line"><em>keyframes.</em></h1></div></div><p className="route-hero-copy">A deliberate path from complex product thinking to motion people can understand, trust, and remember.</p></section><section className="process-manifesto"><p>Motion starts long before anything moves.</p><h2>The strongest animation decisions are usually strategy decisions in disguise.</h2></section><ProcessStepper /><section className="phase-list">{phases.map(([name, copy], index) => <article className="phase-row stack-card" key={name}><span>{String(index + 1).padStart(2,"0")}</span><h2>{name}</h2><p>{copy}</p><div className="phase-symbol" aria-hidden="true"><i /><i /></div></article>)}</section><section className="process-principles"><h2>Three things remain constant.</h2><div><article><strong>Understand first.</strong><p>Good motion depends on knowing what the product is really trying to say.</p></article><article><strong>Design the system.</strong><p>A reusable language creates more value than a single polished moment.</p></article><article><strong>Make every frame useful.</strong><p>Movement should clarify, persuade, orient, or reward—never simply occupy time.</p></article></div></section><SiteFooter nextLabel="Meet the designer." nextHref="/about" /></PageMotion>; }
