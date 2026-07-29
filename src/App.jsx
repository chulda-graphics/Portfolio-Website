import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    number: "01",
    name: "Stillsearch",
    type: "Product film · SaaS launch",
    outcome: "A complex search workflow made immediately legible.",
    tone: "signal",
  },
  {
    number: "02",
    name: "Metric OS",
    type: "Motion system · Product marketing",
    outcome: "One visual language across launch, sales, and social.",
    tone: "metric",
  },
  {
    number: "03",
    name: "Northstar",
    type: "Explainer · Feature adoption",
    outcome: "From abstract automation to a story teams can repeat.",
    tone: "northstar",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectVisual({ tone }) {
  return (
    <div className={`project-visual ${tone}`} aria-hidden="true">
      <div className="visual-grid" />
      <div className="visual-window">
        <div className="window-bar"><i /><i /><i /></div>
        <div className="window-copy"><span /><span /><span /></div>
        <div className="window-orbit"><b /></div>
      </div>
      <p>PLAY STUDY</p>
    </div>
  );
}

function App() {
  const page = useRef(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".nav", { y: -24, opacity: 0, duration: 0.7 })
      .from(".hero-line > span", { yPercent: 115, stagger: 0.09, duration: 1.15 }, "-=0.35")
      .from(".hero-support > *", { y: 24, opacity: 0, stagger: 0.1, duration: 0.7 }, "-=0.65")
      .from(".hero-frame", { scale: 0.86, rotate: 4, opacity: 0, duration: 1.15 }, "-=0.95");

    gsap.utils.toArray(".project-card").forEach((card, index) => {
      gsap.fromTo(card,
        { y: 110, scale: 0.92 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 34%",
            scrub: true,
          },
        },
      );
      gsap.set(card, { zIndex: index + 1 });
    });

    const words = gsap.utils.toArray(".manifesto-word");
    gsap.fromTo(words,
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".manifesto-copy",
          start: "top 78%",
          end: "bottom 48%",
          scrub: true,
        },
      },
    );
  }, { scope: page });

  const manifesto = "Good motion does more than decorate a product. It turns complexity into conviction, and attention into intent.";

  return (
    <main ref={page} className="site-shell">
      <nav className="nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Dhrex Cañezo, home">DC—26</a>
        <p>SaaS motion designer<br />Based in the Philippines</p>
        <a className="availability" href="mailto:chulda.graphics2022@gmail.com">
          <i /> Available for select projects
        </a>
      </nav>

      <section className="hero" id="top">
        <h1>
          <span className="hero-line"><span>Motion that makes</span></span>
          <span className="hero-line offset"><span>software <em>matter.</em></span></span>
        </h1>
        <div className="hero-support">
          <p>I design product films and motion systems for SaaS teams with something worth noticing.</p>
          <a className="circle-link" href="#work" aria-label="View selected work"><Arrow /></a>
        </div>
        <div className="hero-frame">
          <div className="frame-noise" />
          <div className="frame-interface">
            <span>MAKE IT CLEAR</span>
            <div className="interface-pulse"><i /><i /><i /></div>
            <strong>01:24</strong>
          </div>
        </div>
      </section>

      <section className="work" id="work">
        <header className="section-head">
          <h2>Selected work</h2>
          <p>Recent motion engagements<br />built to move the metric.</p>
        </header>
        <div className="project-stack">
          {projects.map((project) => (
            <article className="project-card" key={project.name} tabIndex="0">
              <div className="project-info">
                <span>{project.number}</span>
                <h3>{project.name}</h3>
                <p>{project.type}</p>
                <p className="outcome">{project.outcome}</p>
                <span className="project-link">View case study <Arrow /></span>
              </div>
              <ProjectVisual tone={project.tone} />
            </article>
          ))}
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>PRODUCT FILMS</span><i>+</i><span>LAUNCH MOTION</span><i>+</i><span>VISUAL SYSTEMS</span><i>+</i>
          <span>PRODUCT FILMS</span><i>+</i><span>LAUNCH MOTION</span><i>+</i><span>VISUAL SYSTEMS</span><i>+</i>
        </div>
      </div>

      <section className="manifesto">
        <div className="manifesto-mark"><span>DC</span><i /></div>
        <p className="manifesto-copy">
          {manifesto.split(" ").map((word, index) => (
            <span className="manifesto-word" key={`${word}-${index}`}>{word} </span>
          ))}
        </p>
      </section>

      <section className="testimonial">
        <blockquote>“Dhrex doesn’t animate screens. He finds the one idea the whole launch can orbit around.”</blockquote>
        <div>
          <span className="portrait" aria-hidden="true">A</span>
          <p>Creative partner<br />SaaS launch team</p>
        </div>
      </section>

      <footer className="footer">
        <p>Have a launch worth<br />saving up for?</p>
        <a href="mailto:chulda.graphics2022@gmail.com">
          Let’s make it move <Arrow />
        </a>
        <div className="footer-bottom">
          <span>© 2026 Dhrex Cañezo</span>
          <span>Motion design · Direction</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}

export default App;
