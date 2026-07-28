"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

type MotionExperienceProps = {
  children: React.ReactNode;
};

const revealSelector = [
  ".work-project",
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
  const currentSection = pathname.startsWith("/work")
    ? "Work"
    : pathname.startsWith("/process")
      ? "Process"
      : pathname.startsWith("/about")
        ? "About"
        : pathname.startsWith("/contact")
          ? "Contact"
          : "Index";
  const rootRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderCountRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);

    const root = rootRef.current;
    const loader = loaderRef.current;
    const loaderCount = loaderCountRef.current;
    const progress = progressRef.current;
    const smoothWrapper = smoothWrapperRef.current;
    const smoothContent = smoothContentRef.current;
    const route = routeRef.current;

    if (
      !root ||
      !loader ||
      !loaderCount ||
      !progress ||
      !smoothWrapper ||
      !smoothContent ||
      !route
    ) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isFirstRender = !hasMounted.current;
    hasMounted.current = true;
    const isHome = pathname === "/";
    const splits: SplitText[] = [];
    let smoother: ScrollSmoother | undefined;
    const context = gsap.context(() => {
      if (!reducedMotion && !isHome) {
        smoother = ScrollSmoother.create({
          wrapper: smoothWrapper,
          content: smoothContent,
          smooth: 1.05,
          smoothTouch: 0.12,
          effects: true,
          normalizeScroll: false,
        });

        gsap.fromTo(
          progress,
          { scaleX: 0, autoAlpha: 0 },
          {
            scaleX: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              start: 1,
              end: "max",
              scrub: 0.18,
            },
          },
        );
      } else {
        gsap.set(progress, { scaleX: 0, autoAlpha: 0 });
      }

      if (reducedMotion) {
        route.inert = false;
        gsap.set(loader, { display: "none" });
      } else if (isFirstRender) {
        document.body.classList.add("is-intro-playing");
        route.inert = true;
        const count = { value: 0 };

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            document.body.classList.remove("is-intro-playing");
            route.inert = false;
          },
        });

        intro
          .set(loader, { display: "block", clipPath: "inset(0 0 0 0)" })
          .set(".loader-identity", { autoAlpha: 0 })
          .fromTo(
            ".loader-mark",
            { autoAlpha: 0, scale: 0.965 },
            { autoAlpha: 1, scale: 1, duration: 0.42 },
          )
          .fromTo(
            ".loader-glow",
            { xPercent: -42, scale: 0.86 },
            { xPercent: 42, scale: 1.08, duration: 1.3, ease: "sine.inOut" },
            0,
          )
          .to(
            ".loader-mark",
            { autoAlpha: 0, y: -8, duration: 0.28, ease: "power2.in" },
            0.5,
          )
          .set(".loader-identity", { autoAlpha: 1 }, 0.64)
          .fromTo(
            ".loader-name span",
            { yPercent: 112 },
            { yPercent: 0, duration: 0.68, ease: "power4.out" },
            0.64,
          )
          .fromTo(
            ".loader-discipline span",
            { autoAlpha: 0, yPercent: 45 },
            { autoAlpha: 1, yPercent: 0, duration: 0.48 },
            0.82,
          )
          .fromTo(
            ".loader-meta > *:not(.loader-count)",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.05 },
            0.88,
          )
          .to(
            count,
            {
              value: 100,
              duration: 0.86,
              ease: "power2.out",
              onUpdate: () => {
                loaderCount.textContent = String(Math.round(count.value)).padStart(
                  3,
                  "0",
                );
              },
            },
            0.68,
          )
          .to(
            loader,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.76,
              ease: "power4.inOut",
            },
            1.5,
          )
          .set(loader, { display: "none" });
      } else {
        route.inert = false;
        gsap.set(loader, { display: "none" });
      }

      if (!reducedMotion) {
        if (isHome) {
          gsap.fromTo(
            ".home-header > *, .home-navigation li, .home-footer > *",
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              stagger: 0.055,
              ease: "power3.out",
              delay: isFirstRender ? 1.72 : 0.04,
            },
          );
        }

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
              delay: isFirstRender ? 1.72 : 0.04,
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
              delay: isFirstRender ? 1.78 : 0.03,
            },
          );
        }
      }

    }, root);

    return () => {
      document.body.classList.remove("is-intro-playing");
      route.inert = false;
      smoother?.kill();
      context.revert();
      splits.reverse().forEach((split) => split.revert());
    };
  }, [pathname]);

  return (
    <div
      className={`experience-root${pathname === "/" ? " is-home-route" : ""}`}
      ref={rootRef}
    >
      <div className="site-loader" ref={loaderRef} aria-hidden="true">
        <div className="loader-glow" />
        <p className="loader-mark">Dhrex</p>
        <div className="loader-identity">
          <p className="loader-name">
            <span>dhrex</span>
          </p>
          <p className="loader-discipline">
            <span>SaaS motion designer</span>
          </p>
          <div className="loader-meta">
            <p>Portfolio / 2026</p>
            <p className="loader-count">
              <span ref={loaderCountRef}>000</span>
              <span aria-hidden="true">%</span>
            </p>
            <p>Remote worldwide</p>
          </div>
        </div>
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      {pathname !== "/" ? (
        <aside className="site-rail" aria-label="Current section">
          <Link className="site-wordmark" href="/" aria-label="Dhrex — homepage">
            Dhrex
          </Link>
          <p className="site-rail-section">{currentSection}</p>
        </aside>
      ) : null}

      <div className="smooth-wrapper" ref={smoothWrapperRef}>
        <div className="smooth-content" ref={smoothContentRef}>
          <div className="route-content" key={pathname} ref={routeRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
