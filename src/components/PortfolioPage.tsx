"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(CustomEase, ScrollToPlugin, ScrollTrigger, SplitText, useGSAP);
CustomEase.create("chuldaEase", "M0,0 C0.16,1 0.3,1 1,1");

const projects = [
  {
    name: "Astra AI",
    outcome: "Made an invisible intelligence feel immediate.",
    detail: "Product narrative · Launch film · Interface motion",
    image: "https://picsum.photos/seed/astral-interface/1600/1100",
    tone: "lime",
  },
  {
    name: "Northstar",
    outcome: "Turned dense operational data into a clear daily ritual.",
    detail: "Motion system · Product education · Brand behavior",
    image: "https://picsum.photos/seed/data-architecture/1600/1100",
    tone: "violet",
  },
  {
    name: "Relay",
    outcome: "Explained a complex workflow before the first click.",
    detail: "UX motion · Onboarding · Design direction",
    image: "https://picsum.photos/seed/digital-flow/1600/1100",
    tone: "orange",
  },
];

const capabilities = [
  ["Product clarity", "I find the one idea a user needs to understand, then build every transition around it."],
  ["Motion systems", "I define behavior that scales across a product—not a collection of disconnected effects."],
  ["Launch stories", "I turn software logic into narratives that make the value felt before it is explained."],
];

const testimonials = [
  {
    quote: "Chulda did not decorate our product. He found the clearest way to make its value click.",
    person: "Maya Chen",
    role: "VP Product, Astra",
  },
  {
    quote: "Every motion decision had a reason. The final system made our entire experience feel more coherent.",
    person: "Leo Martins",
    role: "Creative Director, Northstar",
  },
  {
    quote: "He understood the product faster than most partners understand the brief.",
    person: "Sam Rivera",
    role: "Founder, Relay",
  },
];

export function PortfolioPage() {
  const page = useRef<HTMLElement>(null);
  const work = useRef<HTMLElement>(null);
  const [testimonial, setTestimonial] = useState(0);

  useGSAP(
    (_context, contextSafe) => {
      const root = page.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const media = gsap.utils.toArray<HTMLElement>(".project-media", root);
      const mm = gsap.matchMedia();
      const pointerToX = gsap.utils.pipe(
        gsap.utils.clamp(0, 1),
        gsap.utils.mapRange(0, 1, -18, 18),
      );
      const pointerToY = gsap.utils.pipe(
        gsap.utils.clamp(0, 1),
        gsap.utils.mapRange(0, 1, -10, 10),
      );

      mm.add(
        {
          desktop: "(min-width: 900px)",
          mobile: "(max-width: 899px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const { desktop, reduceMotion } = mediaContext.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(select(".hero-word, .hero-support, .bento-card, .project-media"), {
              clearProps: "all",
              autoAlpha: 1,
            });
            return;
          }

          const intro = gsap.timeline({ defaults: { ease: "chuldaEase" } });
          intro
            .addLabel("words")
            .from(select(".hero-word"), {
              yPercent: 110,
              duration: 1.15,
              stagger: 0.09,
              force3D: true,
            }, "words")
            .addLabel("support", "words+=0.58")
            .from(select(".hero-support"), {
              autoAlpha: 0,
              y: 24,
              duration: 0.78,
              stagger: 0.08,
              force3D: true,
            }, "support");

          const statement = SplitText.create(select(".statement-reveal"), {
            type: "words",
            aria: "auto",
          });
          gsap.fromTo(
            statement.words,
            { autoAlpha: 0.12, yPercent: 18 },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.035,
              ease: "none",
              scrollTrigger: {
                id: "statement-words",
                trigger: ".statement-reveal",
                start: "clamp(top 82%)",
                end: "clamp(bottom 45%)",
                scrub: 0.7,
                refreshPriority: 1,
              },
            },
          );

          gsap.set(select(".bento-card"), { autoAlpha: 0, y: 44 });
          ScrollTrigger.batch(select(".bento-card"), {
            start: "top 88%",
            once: true,
            interval: 0.08,
            batchMax: desktop ? 4 : 2,
            onEnter: (cards) => gsap.to(cards, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.09,
              ease: "chuldaEase",
              overwrite: "auto",
              clearProps: "transform,visibility",
            }),
          });

          media.forEach((element, index) => {
            gsap.fromTo(
              element,
              { scale: 0.84, autoAlpha: 0.35, filter: "brightness(0.5)" },
              {
                scale: 1,
                autoAlpha: 1,
                filter: "brightness(1)",
                ease: "none",
                scrollTrigger: {
                  id: `project-media-${index}`,
                  trigger: element,
                  start: "clamp(top 90%)",
                  end: "clamp(center 48%)",
                  scrub: 0.8,
                  refreshPriority: 2 + index,
                },
              },
            );
          });

          if (desktop && work.current) {
            ScrollTrigger.create({
              id: "work-intro-pin",
              trigger: work.current,
              start: "top 10%",
              end: "bottom 82%",
              pin: ".work-intro",
              pinSpacing: false,
              refreshPriority: 2,
            });
          }

          const marquee = gsap.to(select(".marquee-track"), {
            xPercent: -50,
            duration: 22,
            ease: "none",
            repeat: -1,
            paused: true,
            force3D: true,
          });
          ScrollTrigger.create({
            id: "marquee-visibility",
            trigger: ".marquee",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => marquee.play(),
            onEnterBack: () => marquee.play(),
            onLeave: () => marquee.pause(),
            onLeaveBack: () => marquee.pause(),
          });

          return () => statement.revert();
        },
        root,
      );

      const stage = select(".hero-stage")[0] as HTMLElement | undefined;
      const orbit = select(".stage-orbit");
      if (stage && orbit.length) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const xTo = gsap.quickTo(orbit, "x", { duration: 0.65, ease: "power3.out" });
        const yTo = gsap.quickTo(orbit, "y", { duration: 0.65, ease: "power3.out" });
        const onPointerMove = contextSafe!((event: PointerEvent) => {
          const bounds = stage.getBoundingClientRect();
          xTo(pointerToX((event.clientX - bounds.left) / bounds.width));
          yTo(pointerToY((event.clientY - bounds.top) / bounds.height));
        });
        const onPointerLeave = contextSafe!(() => {
          xTo(0);
          yTo(0);
        });
        if (!prefersReducedMotion) {
          stage.addEventListener("pointermove", onPointerMove);
          stage.addEventListener("pointerleave", onPointerLeave);
        }

        const anchorLinks = gsap.utils.toArray<HTMLAnchorElement>('a[href^="#"]', root);
        const onAnchorClick = contextSafe!((event: MouseEvent) => {
          const link = event.currentTarget as HTMLAnchorElement;
          const target = root.querySelector(link.hash);
          if (!target) return;
          event.preventDefault();
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 16 },
            duration: prefersReducedMotion ? 0 : 1.05,
            ease: "chuldaEase",
            overwrite: "auto",
          });
        });
        anchorLinks.forEach((link) => link.addEventListener("click", onAnchorClick));

        document.fonts.ready.then(contextSafe!(() => ScrollTrigger.refresh()));

        return () => {
          if (!prefersReducedMotion) {
            stage.removeEventListener("pointermove", onPointerMove);
            stage.removeEventListener("pointerleave", onPointerLeave);
          }
          anchorLinks.forEach((link) => link.removeEventListener("click", onAnchorClick));
          mm.revert();
        };
      }

      return () => mm.revert();
    },
    { scope: page },
  );

  const changeTestimonial = (direction: number) => {
    const wrap = gsap.utils.wrap(0, testimonials.length);
    setTestimonial((current) => wrap(current + direction));
  };

  return (
    <main ref={page} className="site-shell">
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Chulda home">
          CHULDA<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Selected work</a>
          <a href="#approach">Approach</a>
        </div>
        <a className="nav-cta" href="mailto:hello@chulda.design">
          Start a conversation <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <p className="hero-kicker hero-support">Motion design for SaaS, AI & digital products</p>
        <h1>
          <span className="line-mask"><span className="hero-word">Making complex</span></span>{" "}
          <span className="line-mask"><span className="hero-word accent">products feel obvious.</span></span>
        </h1>
        <div className="hero-bottom hero-support">
          <p>
            I use motion to turn product logic into stories people can understand, trust, and remember.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore the thinking</a>
            <a className="button button-secondary" href="mailto:hello@chulda.design">Discuss a project</a>
          </div>
        </div>
        <div className="hero-stage hero-support" aria-hidden="true">
          <div className="stage-grid" />
          <div className="stage-orbit orbit-one" />
          <div className="stage-orbit orbit-two" />
          <div className="stage-core"><span>Idea</span><strong>Clarity</strong></div>
          <div className="stage-note note-one">01 · Product logic</div>
          <div className="stage-note note-two">Motion with intent · 2026</div>
        </div>
      </section>

      <section className="statement" id="approach">
        <p className="eyebrow">The work behind the work</p>
        <h2 className="statement-reveal">
          The animation is never the point. The moment of <em>understanding</em> is.
        </h2>
        <p className="statement-copy">
          Every engagement starts with the product: what it does, why it matters, and what stands between a user and that realization.
        </p>
      </section>

      <section className="bento" aria-label="Design approach">
        <article className="bento-card bento-wide bento-clarity">
          <span className="card-index">Clarity</span>
          <h3>Reduce the distance between seeing and knowing.</h3>
          <div className="signal" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </article>
        <article className="bento-card bento-narrow bento-system">
          <span className="card-index">Systems</span>
          <div className="system-rings" aria-hidden="true"><i /><i /><i /></div>
          <h3>Behavior that feels inevitable.</h3>
        </article>
        <article className="bento-card bento-narrow bento-language">
          <span className="card-index">Language</span>
          <p>Timing</p><p>Hierarchy</p><p>Feedback</p>
        </article>
        <article className="bento-card bento-wide bento-story">
          <span className="card-index">Story</span>
          <h3>Make the value visible before the explanation begins.</h3>
          <div className="story-path" aria-hidden="true"><span>Complexity</span><i /><span>Confidence</span></div>
        </article>
      </section>

      <section className="work" id="work" ref={work}>
        <div className="work-intro">
          <p className="eyebrow">Selected collaborations</p>
          <h2>Not a reel.<br />A record of decisions.</h2>
          <p>Three products, three communication problems, and the motion systems built to solve them.</p>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project" key={project.name}>
              <a href="#contact" className={`project-media project-${project.tone}`} aria-label={`Read ${project.name} case study`}>
                <Image src={project.image} alt="" fill sizes="(max-width: 899px) 100vw, 60vw" />
                <div className="product-window">
                  <div className="window-top"><i /><i /><i /><span>{project.name}</span></div>
                  <div className="window-body">
                    <div className="window-nav" />
                    <div className="window-content"><i /><i /><i /></div>
                  </div>
                </div>
                <span className="project-arrow" aria-hidden="true">↗</span>
              </a>
              <div className="project-info">
                <span>0{index + 1}</span>
                <div><h3>{project.name}</h3><p>{project.outcome}</p></div>
                <p>{project.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities">
        <div className="capability-heading">
          <p className="eyebrow">How I contribute</p>
          <h2>Motion with a job to do.</h2>
        </div>
        <div className="accordion">
          {capabilities.map(([title, copy], index) => (
            <article className="accordion-item" key={title} tabIndex={0}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="marquee" aria-label="Disciplines">
        <div className="marquee-track">
          {[0, 1].map((set) => (
            <div className="marquee-set" key={set} aria-hidden={set === 1}>
              <span>Product motion</span><i />
              <span>Launch films</span><i />
              <span>UX systems</span><i />
              <span>AI storytelling</span><i />
            </div>
          ))}
        </div>
      </section>

      <section className="testimonial" aria-live="polite">
        <div className="quote-mark" aria-hidden="true">“</div>
        <blockquote>{testimonials[testimonial].quote}</blockquote>
        <div className="testimonial-footer">
          <div><strong>{testimonials[testimonial].person}</strong><span>{testimonials[testimonial].role}</span></div>
          <div className="testimonial-controls">
            <button onClick={() => changeTestimonial(-1)} aria-label="Previous testimonial">←</button>
            <span>{testimonial + 1} / {testimonials.length}</span>
            <button onClick={() => changeTestimonial(1)} aria-label="Next testimonial">→</button>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-orb" aria-hidden="true" />
        <p>Have a product people need to understand?</p>
        <h2>Let’s make it <em>click.</em></h2>
        <a className="footer-link" href="mailto:hello@chulda.design">hello@chulda.design <span>↗</span></a>
        <div className="footer-meta">
          <a href="#top">Back to top ↑</a>
          <span>Independent motion designer · Available worldwide</span>
          <span>© 2026 Chulda Graphics</span>
        </div>
      </footer>
    </main>
  );
}
