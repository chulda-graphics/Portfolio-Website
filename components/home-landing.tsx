"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

const processSteps = [
  ["Understand", "The product, audience, problem, and feeling come before movement."],
  ["Frame", "Still frames establish the visual language before animation begins."],
  ["Move", "Purposeful timing turns product ideas into a clear visual story."],
  ["Refine", "Revisions, polish, and delivery make every detail hold together."],
] as const;

export function HomeLanding() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.from(".landing-nav, .hero-copy > *, .hero-aside", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        delay: 1.5,
      });

      const words = gsap.utils.toArray<HTMLElement>(".belief-word");
      gsap.set(words, { opacity: 0.12 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".belief-copy",
          start: "top 78%",
          end: "bottom 48%",
          scrub: 0.7,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, index) => {
        gsap.set(card, { zIndex: index + 1 });
        gsap.fromTo(
          card,
          { y: index === 0 ? 0 : 90, scale: 0.96 },
          {
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              end: "top 40%",
              scrub: 0.7,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  const belief = "Motion should make software clearer, more desirable, and easier to remember.";

  return (
    <main ref={rootRef} className="landing-shell overflow-x-hidden w-full max-w-full">
      <nav className="landing-nav" aria-label="Primary navigation">
        <Link className="landing-wordmark" href="/" aria-label="Dhrex home">
          Dhrex Cañezo
        </Link>
        <div className="landing-nav-links">
          <a href="#work">Work</a>
          <Link href="/process">Process</Link>
          <Link href="/about">About</Link>
        </div>
        <a className="nav-contact" href="mailto:chulda.graphics2022@gmail.com">
          Start a project
        </a>
      </nav>

      <section className="landing-hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="hero-kicker">Independent SaaS motion designer / Remote worldwide</p>
          <h1 id="home-heading">Make software impossible to overlook.</h1>
          <p className="hero-intro">
            I turn product thinking into precise motion systems and launch films that make software click.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#work">View selected work</a>
            <a className="button button-light" href="mailto:chulda.graphics2022@gmail.com">Email Dhrex</a>
          </div>
        </div>
        <aside className="hero-aside" aria-label="Design philosophy">
          <div className="hero-orbit" aria-hidden="true">
            <span>D</span>
          </div>
          <p>Not decoration. A visual voice your product can own.</p>
          <span className="hero-aside-line" aria-hidden="true" />
          <p>Available for select launch films and product-motion systems.</p>
        </aside>
      </section>

      <section className="belief-section" aria-label="Motion philosophy">
        <p className="belief-copy">
          {belief.split(" ").map((word, index) => (
            <span className="belief-word" key={`${word}-${index}`}>{word}{" "}</span>
          ))}
          <span className="inline-image" aria-hidden="true" />
        </p>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-heading">
        <div className="section-heading-row">
          <h2 id="work-heading">Work with a reason to move.</h2>
          <p>Selected product stories and the value they created.</p>
        </div>

        <div className="work-bento">
          <Link className="work-tile work-tile-primary" href="/work/stillsearch">
            <video autoPlay loop muted playsInline preload="metadata" aria-label="StillSearch launch film preview">
              <source src={projects.stillsearch.video} type="video/mp4" />
            </video>
            <span className="work-overlay" />
            <span className="work-tile-top"><span>StillSearch</span><span>Launch film</span></span>
            <span className="work-tile-bottom"><strong>A clearer visual-search story.</strong><span>View case study ↗</span></span>
          </Link>

          <Link className="work-tile work-tile-reel" href="/work/demo-reel-2026">
            <video autoPlay loop muted playsInline preload="metadata" aria-label="Demo Reel 2026 preview">
              <source src={projects.demoReel.video} type="video/mp4" />
            </video>
            <span className="work-overlay" />
            <span className="work-tile-top"><span>Demo Reel 2026</span><span>Direction / Design / Motion</span></span>
            <span className="work-tile-bottom"><strong>One reel. One paid project closed.</strong><span>Play the reel ↗</span></span>
          </Link>

          <article className="work-tile quote-tile">
            <blockquote>“Exceptional creative taste, technical skill, and a genuine sense of ownership.”</blockquote>
            <p>John Lexter Laguinday, Founder of StillSearch</p>
          </article>

          <a className="work-tile availability-tile" href="mailto:chulda.graphics2022@gmail.com">
            <span>Currently booking</span>
            <strong>Bring the product. I’ll help people feel why it matters.</strong>
            <span>Discuss a project ↗</span>
          </a>
        </div>
      </section>

      <section className="desire-section" aria-labelledby="desire-heading">
        <div className="section-heading-row">
          <h2 id="desire-heading">Clarity compounds.</h2>
          <p>Every decision earns the next frame.</p>
        </div>
        <div className="card-stack">
          {processSteps.map(([title, copy], index) => (
            <article className="stack-card" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" aria-labelledby="process-heading">
        <h2 id="process-heading">A process built to remove guesswork.</h2>
        <div className="process-accordion">
          {processSteps.map(([title, copy]) => (
            <article tabIndex={0} key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="landing-marquee" aria-hidden="true">
        <div><span>Product motion</span><span>Launch films</span><span>UI animation</span><span>SaaS stories</span><span>Product motion</span><span>Launch films</span></div>
      </div>

      <section className="landing-cta" aria-labelledby="cta-heading">
        <p>Save a place for the work you want remembered.</p>
        <h2 id="cta-heading">Let’s make your product feel inevitable.</h2>
        <a href="mailto:chulda.graphics2022@gmail.com">chulda.graphics2022@gmail.com ↗</a>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Dhrex Cañezo</p>
        <div><a href="https://www.instagram.com/dhrex.in.motion/">Instagram</a><a href="https://www.linkedin.com/in/dhrex-ca%C3%B1ezo/">LinkedIn</a><a href="https://x.com/dhrexinmotion">X</a></div>
        <p>Remote worldwide</p>
      </footer>
    </main>
  );
}
