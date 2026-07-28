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
  ".process-list article",
  ".process-principle",
  ".about-grid",
  ".about-manifesto",
  ".about-facts",
  ".contact-actions",
  ".contact-footer",
  ".case-film",
  ".case-facts",
  ".case-narrative",
  ".case-statement > *",
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
  const progressRef = useRef<HTMLSpanElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const root = rootRef.current;
    const loader = loaderRef.current;
    const progress = progressRef.current;
    const route = routeRef.current;

    if (!root || !loader || !progress || !route) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isFirstRender = !hasMounted.current;
    hasMounted.current = true;
    const hasSeenIntro = window.sessionStorage.getItem("dhrex-intro-seen") === "1";
    const splits: SplitText[] = [];
    const hoverCleanups: Array<() => void> = [];

    const context = gsap.context(() => {
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

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
            { yPercent: 0, duration: 0.82 },
          )
          .fromTo(
            ".loader-meta > *",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
            0.18,
          )
          .fromTo(
            ".loader-rule-fill",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.05, ease: "power2.inOut" },
            0.08,
          )
          .to(
            ".loader-word",
            {
              letterSpacing: "-0.075em",
              scale: 0.985,
              duration: 0.55,
              ease: "power2.inOut",
            },
            0.7,
          )
          .to(loader, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "power4.inOut",
          })
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
              duration: 0.9,
              stagger: 0.08,
              ease: "power4.out",
              delay: isFirstRender && !hasSeenIntro ? 1.45 : 0.08,
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(revealSelector).forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.82,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
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
              duration: 0.65,
              stagger: 0.06,
              ease: "power3.out",
              delay: isFirstRender && !hasSeenIntro ? 1.6 : 0.05,
            },
          );
        }

        if (window.matchMedia("(pointer: fine)").matches) {
          root.querySelectorAll<HTMLElement>(".work-media-link").forEach((link) => {
            const media = link.querySelector<HTMLElement>("video");
            if (!media) return;

            const moveX = gsap.quickTo(media, "x", {
              duration: 0.55,
              ease: "power3.out",
            });
            const moveY = gsap.quickTo(media, "y", {
              duration: 0.55,
              ease: "power3.out",
            });

            const handleMove = (event: PointerEvent) => {
              const bounds = link.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;
              moveX(x * 8);
              moveY(y * 8);
            };
            const handleLeave = () => {
              moveX(0);
              moveY(0);
            };

            link.addEventListener("pointermove", handleMove);
            link.addEventListener("pointerleave", handleLeave);
            hoverCleanups.push(() => {
              link.removeEventListener("pointermove", handleMove);
              link.removeEventListener("pointerleave", handleLeave);
            });
          });
        }
      }

      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: reducedMotion ? false : 0.15,
        },
      });
    }, root);

    return () => {
      document.body.classList.remove("is-intro-playing");
      route.inert = false;
      hoverCleanups.forEach((cleanup) => cleanup());
      context.revert();
      splits.reverse().forEach((split) => split.revert());
    };
  }, [pathname]);

  return (
    <div className="experience-root" ref={rootRef}>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <div className="site-loader" ref={loaderRef} aria-hidden="true">
        <div className="loader-meta">
          <p>Dhrex / 2026</p>
          <p>Motion for software</p>
        </div>
        <p className="loader-word">
          <span>Dhrex</span>
        </p>
        <div className="loader-rule">
          <span className="loader-rule-fill" />
        </div>
      </div>

      <div className="route-content" key={pathname} ref={routeRef}>
        {children}
      </div>
    </div>
  );
}
