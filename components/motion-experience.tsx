"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

type MotionExperienceProps = {
  children: React.ReactNode;
};

const revealSelector = [
  ".work-entry",
  ".closing-statement",
  ".process-list",
  ".process-principle",
  ".about-grid",
  ".about-manifesto",
  ".about-facts",
  ".contact-actions",
  ".contact-footer",
  ".case-film",
  ".case-facts",
  ".case-narrative",
  ".case-statement",
  ".case-process",
  ".case-quote",
  ".next-project",
].join(",");

const headingSelector = [
  ".editorial-hero h1",
  ".about-opening h1",
  ".contact-main h1",
  ".case-heading h1",
].join(",");

export function MotionExperience({ children }: MotionExperienceProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const root = rootRef.current;
    const loader = loaderRef.current;
    const route = routeRef.current;

    if (!root || !loader || !route) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isFirstRender = !hasMounted.current;
    hasMounted.current = true;
    const hasSeenIntro = window.sessionStorage.getItem("dhrex-intro-seen") === "1";
    const splits: SplitText[] = [];
    const context = gsap.context(() => {
      if (reducedMotion) {
        route.inert = false;
        gsap.set(loader, { display: "none" });
      } else if (isFirstRender && !hasSeenIntro) {
        document.body.classList.add("is-intro-playing");
        route.inert = true;

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            document.body.classList.remove("is-intro-playing");
            route.inert = false;
            window.sessionStorage.setItem("dhrex-intro-seen", "1");
          },
        });

        intro
          .set(loader, { display: "grid", clipPath: "inset(0 0 0 0)" })
          .fromTo(
            ".loader-word span",
            { yPercent: 115 },
            { yPercent: 0, duration: 0.64 },
          )
          .fromTo(
            ".loader-meta > *",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.06 },
            0.12,
          )
          .to(
            ".loader-word",
            {
              letterSpacing: "-0.045em",
              scale: 0.985,
              duration: 0.32,
              ease: "power2.inOut",
            },
            0.5,
          )
          .to(
            loader,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.68,
              ease: "power4.inOut",
            },
            0.76,
          )
          .set(loader, { display: "none" });
      } else {
        route.inert = false;
        gsap.set(loader, { display: "none" });
      }

      if (!reducedMotion) {
        const headings = root.querySelectorAll<HTMLElement>(headingSelector);

        headings.forEach((heading) => {
          const split = new SplitText(heading, {
            type: "lines",
            linesClass: "motion-line",
            mask: "lines",
          });
          splits.push(split);

          gsap.fromTo(
            split.lines,
            { yPercent: 108 },
            {
              yPercent: 0,
              duration: 0.75,
              stagger: 0.06,
              ease: "power4.out",
              delay: isFirstRender && !hasSeenIntro ? 1.08 : 0.04,
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(revealSelector).forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.68,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                once: true,
              },
            },
          );
        });

        const pageIntroTargets = root.querySelectorAll(
          ".site-header > :not(.site-rail), .site-rail > *, .editorial-hero .eyebrow, .editorial-hero .hero-note, .about-opening .eyebrow, .contact-main .eyebrow, .case-heading .eyebrow, .case-heading > p:last-child",
        );

        if (pageIntroTargets.length > 0) {
          gsap.fromTo(
            pageIntroTargets,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.045,
              ease: "power3.out",
              delay: isFirstRender && !hasSeenIntro ? 1.14 : 0.03,
            },
          );
        }
      }

    }, root);

    return () => {
      document.body.classList.remove("is-intro-playing");
      route.inert = false;
      context.revert();
      splits.reverse().forEach((split) => split.revert());
    };
  }, [pathname]);

  return (
    <div className="experience-root" ref={rootRef}>
      <div className="site-loader" ref={loaderRef} aria-hidden="true">
        <div className="loader-meta">
          <p>Dhrex / 2026</p>
          <p>Motion for software</p>
        </div>
        <p className="loader-word">
          <span>Dhrex</span>
        </p>
      </div>

      <div className="route-content" key={pathname} ref={routeRef}>
        {children}
      </div>
    </div>
  );
}
