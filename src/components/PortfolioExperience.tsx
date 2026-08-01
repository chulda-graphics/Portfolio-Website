"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const phases = [
  { number: "01", name: "Understand", copy: "Find the product truth, the audience tension, and the one idea motion needs to make unmistakable." },
  { number: "02", name: "Structure", copy: "Turn complexity into a clear narrative system: script, rhythm, storyboard, and visual logic." },
  { number: "03", name: "Give it life", copy: "Design motion, transitions, and sound so every moment teaches, reassures, or persuades." },
  { number: "04", name: "Make it useful", copy: "Deliver an adaptable motion language built for launches, product education, and brand memory." },
];

const clients = ["STILLSEARCH", "NORTHSTAR AI", "LAYER", "SIGNAL", "FORM", "ARC SYSTEMS"];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={diagonal ? "arrow diagonal" : "arrow"}>→</span>;
}

function MotionWindow({ variant = "search" }: { variant?: "search" | "reel" }) {
  return (
    <div className={`motion-window ${variant}`} aria-hidden="true">
      <div className="window-bar"><i /><i /><i /><span>{variant === "search" ? "stillsearch.ai" : "chulda / motion reel"}</span></div>
      {variant === "search" ? (
        <div className="search-stage">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="search-copy"><span>FIND THE SIGNAL</span><strong>Search less.<br />Discover more.</strong></div>
          <div className="search-ui"><span>What are you looking for?</span><b>↗</b></div>
        </div>
      ) : (
        <div className="reel-stage"><span>PLAY</span><strong>00:58</strong><div className="reel-disc" /></div>
      )}
    </div>
  );
}

export function PortfolioExperience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 900px)",
    }, (context) => {
      if (!context.conditions?.motion) return;

      const intro = gsap.timeline({ defaults: { duration: 1, ease: "power4.out" } });
      intro
        .from(".nav-shell", { y: -24, autoAlpha: 0 })
        .from(".hero-line", { yPercent: 110, stagger: 0.12 }, "<0.1")
        .from(".hero-copy, .hero-actions", { y: 24, autoAlpha: 0, stagger: 0.12 }, "<0.35")
        .from(".hero-visual", { scale: 0.9, rotation: 2, autoAlpha: 0 }, "<0.05");

      gsap.utils.toArray<HTMLElement>(".reveal-media").forEach((media) => {
        gsap.fromTo(media, { scale: 0.82, autoAlpha: 0.35 }, {
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { trigger: media, start: "top 92%", end: "center 58%", scrub: 0.7 },
        });
      });

      if (context.conditions?.desktop) {
        gsap.to(".process-track", {
          yPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: ".process-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
        ScrollTrigger.create({
          trigger: ".process-section",
          start: "top top",
          end: "bottom bottom",
          pin: ".process-sticky",
          pinSpacing: false,
        });
      }

      gsap.to(".marquee-track", { xPercent: -50, duration: 24, repeat: -1, ease: "none" });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <main ref={root} className="site-shell">
      <header className="nav-wrap">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Chulda home"><span>C</span> CHULDA</a>
          <div className="nav-links"><a href="#work">Work</a><a href="#process">Process</a><a href="#about">About</a></div>
          <a className="nav-contact" href="mailto:hello@chulda.graphics">Let’s talk <Arrow diagonal /></a>
        </nav>
      </header>

      <section id="top" className="hero section-pad">
        <div className="hero-grid">
          <div className="hero-heading" aria-label="Motion that makes products make sense">
            <div className="line-clip"><h1 className="hero-line">Motion that makes</h1></div>
            <div className="line-clip"><h1 className="hero-line accent-line">products</h1></div>
            <div className="line-clip"><h1 className="hero-line">make sense.</h1></div>
          </div>
          <div className="hero-aside">
            <p className="hero-copy">I turn complex SaaS and AI products into clear, engaging stories people understand—and remember.</p>
            <div className="hero-actions"><a className="button primary" href="#work">See the thinking <Arrow /></a><a className="text-link" href="#process">How I work <Arrow diagonal /></a></div>
          </div>
        </div>
        <div className="hero-visual reveal-media">
          <div className="visual-caption"><span>Product story / Motion system / Launch film</span><span>Selected work — 2025</span></div>
          <MotionWindow />
          <div className="hero-orb orb-a" /><div className="hero-orb orb-b" />
        </div>
      </section>

      <section className="statement section-pad" id="about">
        <p className="statement-kicker">The work behind the movement</p>
        <h2>Good motion doesn’t decorate a product. It <em>reveals</em> what makes it valuable.</h2>
        <div className="statement-foot"><p>Strategy gives every frame a job. Design makes the idea intuitive. Motion makes it stay with you.</p><span>Based in the Philippines<br />Working worldwide</span></div>
      </section>

      <section id="work" className="work section-pad">
        <div className="section-heading"><h2>Selected work</h2><p>Built to clarify.<br />Designed to connect.</p></div>
        <div className="bento-grid">
          <a className="project-card project-main" href="#stillsearch">
            <div className="card-top"><span>StillSearch</span><span>SaaS / Product film</span><Arrow diagonal /></div>
            <div className="card-media reveal-media"><MotionWindow /></div>
            <div className="card-bottom"><h3>Making discovery feel effortless.</h3><p>A product story that turns a complex AI search workflow into one clear, human idea.</p></div>
          </a>
          <a className="project-card project-reel" href="#showreel">
            <div className="card-top"><span>Motion reel</span><span>Selected moments</span><Arrow diagonal /></div>
            <div className="card-media reveal-media"><MotionWindow variant="reel" /></div>
            <div className="card-bottom"><h3>Ideas, made visible.</h3></div>
          </a>
          <a className="project-card project-next" href="mailto:hello@chulda.graphics">
            <div className="card-top"><span>Next collaboration</span><Arrow diagonal /></div>
            <div className="next-rings" aria-hidden="true"><i /><i /><i /></div>
            <div className="card-bottom"><h3>Your product could be next.</h3></div>
          </a>
        </div>
      </section>

      <section className="marquee" aria-label="Selected clients">
        <div className="marquee-track">{[...clients, ...clients].map((client, index) => <span key={`${client}-${index}`}>{client}<i /></span>)}</div>
      </section>

      <section id="process" className="process-section">
        <div className="process-sticky">
          <div className="process-intro"><p>How ideas become motion</p><h2>Clarity<br />before<br /><em>keyframes.</em></h2></div>
          <div className="process-track">
            {phases.map((phase) => <article className="process-card" key={phase.number}><span>{phase.number}</span><h3>{phase.name}</h3><p>{phase.copy}</p><div className="phase-line"><i /></div></article>)}
          </div>
        </div>
      </section>

      <section className="belief section-pad">
        <blockquote>“Chulda didn’t just make the product look good. The motion gave our team a clearer way to explain why it matters.”</blockquote>
        <div className="quote-credit"><span>Product lead</span><span>AI search platform</span></div>
      </section>

      <footer id="contact" className="footer section-pad">
        <div className="footer-top"><span>Have a product worth understanding?</span><span>Available for select projects</span></div>
        <a href="mailto:hello@chulda.graphics" className="footer-cta">Let’s make it<br /><em>click.</em><Arrow diagonal /></a>
        <div className="footer-bottom"><span>© 2026 Chulda</span><div><a href="#">LinkedIn</a><a href="#">Behance</a><a href="#">Instagram</a></div><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
