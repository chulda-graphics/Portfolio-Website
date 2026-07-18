import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Dhrex, a SaaS motion designer who shapes how people understand and experience software through precise, purposeful motion.",
};

const principles = [
  {
    number: "01",
    title: "Understand before animating",
    copy: "I start with the product: what it solves, who it serves, and what someone should understand or feel.",
  },
  {
    number: "02",
    title: "Give every movement a job",
    copy: "Motion should guide attention, reinforce usability, or create a useful connection—never exist as surface decoration.",
  },
  {
    number: "03",
    title: "Polish the details people feel",
    copy: "Timing, easing, typography, rhythm, micro-interactions, and sound shape whether a product feels truly premium.",
  },
];

const process = [
  "Discovery call",
  "Research",
  "Still frames",
  "Strategy call",
  "Animation",
  "Revisions",
  "Polish",
  "Delivery",
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <SiteHeader />
      <article className="about-page">
        <header className="about-hero">
          <p className="eyebrow">About Dhrex</p>
          <h1>
            I don&apos;t just animate interfaces—I shape how people experience
            software.
          </h1>
          <p>
            I create premium product motion that helps SaaS products feel
            intuitive, polished, and desirable. The strongest motion comes from
            understanding, not decoration.
          </p>
        </header>

        <section className="about-manifesto" aria-labelledby="manifesto-title">
          <p className="section-label">How I think</p>
          <div>
            <h2 id="manifesto-title">Motion is part of the product itself.</h2>
            <p>
              I approach every project as both a designer and a user. Before I
              animate anything, I work to understand the product, the problem it
              solves, and the experience it should create. That understanding
              gives every frame a reason to exist.
            </p>
            <p>
              I study why the world&apos;s best digital products feel effortless,
              then reinterpret those principles into original motion that fits
              each client&apos;s product and brand.
            </p>
          </div>
        </section>

        <section className="principles" aria-label="Design principles">
          {principles.map((principle) => (
            <article key={principle.number}>
              <span>{principle.number}</span>
              <h2>{principle.title}</h2>
              <p>{principle.copy}</p>
            </article>
          ))}
        </section>

        <section className="process" aria-labelledby="process-title">
          <div className="process-heading">
            <p className="section-label">Process</p>
            <h2 id="process-title">From product understanding to final polish.</h2>
          </div>
          <ol>
            {process.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-cta">
          <p>Have a SaaS product worth understanding?</p>
          <Link href="/contact">Let&apos;s make it clear ↗</Link>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
