"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

type MotionExperienceProps = {
  children: React.ReactNode;
};

const revealSelector = [
  ".closing-statement",
  ".process-principle",
  ".about-grid",
  ".about-manifesto",
  ".about-facts",
  ".contact-actions",
  ".contact-footer",
  ".case-narrative",
  ".case-statement",
  ".case-process",
  ".case-quote",
  ".next-project",
  ".work-project",
].join(",");

const headingSelector = [
  ".editorial-hero h1",
  ".about-opening h1",
  ".contact-main h1",
  ".case-heading h1",
].join(",");

export function MotionExperience({ children }: MotionExperienceProps) {
  const pathname = usePathname();
  const router = useRouter();
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
  const routeTransitionRef = useRef<HTMLDivElement>(null);
  const routeSheetRef = useRef<HTMLDivElement>(null);
  const transitionLabelRef = useRef<HTMLSpanElement>(null);
  const routeTransitioning = useRef(false);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const root = rootRef.current;
    const loader = loaderRef.current;
    const loaderCount = loaderCountRef.current;
    const progress = progressRef.current;
    const smoothWrapper = smoothWrapperRef.current;
    const smoothContent = smoothContentRef.current;
    const route = routeRef.current;
    const routeTransition = routeTransitionRef.current;
    const routeSheet = routeSheetRef.current;
    const transitionLabel = transitionLabelRef.current;

    if (
      !root ||
      !loader ||
      !loaderCount ||
      !progress ||
      !smoothWrapper ||
      !smoothContent ||
      !route ||
      !routeTransition ||
      !routeSheet ||
      !transitionLabel
    ) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canUseFineMotion = window.matchMedia(
      "(min-width: 769px) and (pointer: fine)",
    ).matches;
    const isFirstRender = !hasMounted.current;
    hasMounted.current = true;
    const isHome = pathname === "/";
    const isTransitionArrival = routeTransitioning.current && !isFirstRender;
    const splits: SplitText[] = [];
    let arrivalTimeline: gsap.core.Timeline | undefined;

    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    smoothWrapper.scrollTop = 0;
    gsap.set(smoothContent, { clearProps: "transform" });
    ScrollTrigger.clearScrollMemory("manual");

    if (isTransitionArrival && !reducedMotion) {
      route.inert = true;
      gsap.set(route, { autoAlpha: 1, y: 28 });
      arrivalTimeline = gsap
        .timeline({
          onComplete: () => {
            gsap.set(routeTransition, { display: "none" });
            document.body.classList.remove("is-route-transitioning");
            routeTransitioning.current = false;
            route.inert = false;
          },
        })
        .to(
          routeSheet,
          {
            yPercent: -108,
            rotation: -1.1,
            duration: 0.78,
            ease: "power4.inOut",
          },
          0.08,
        )
        .to(
          route,
          { y: 0, duration: 0.82, ease: "power4.out", clearProps: "transform" },
          0.14,
        );
    }

    const context = gsap.context(() => {
      if (!reducedMotion && !isHome) {
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
          .set(".loader-identity", { autoAlpha: 1 })
          .set(".loader-window", {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
          })
          .set(".loader-word-left", { xPercent: -145 })
          .set(".loader-word-right", { xPercent: 145 })
          .fromTo(
            ".loader-meta > *",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.04 },
            0.12,
          )
          .fromTo(
            ".loader-window-copy > *",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.06 },
            0.18,
          )
          .to(
            count,
            {
              value: 100,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                loaderCount.textContent = String(Math.round(count.value)).padStart(
                  3,
                  "0",
                );
              },
            },
            0.12,
          )
          .to(
            ".loader-window-copy",
            { autoAlpha: 0, duration: 0.24, ease: "power2.in" },
            0.68,
          )
          .to(
            ".loader-window",
            {
              width: "clamp(6.5rem, 17vw, 16rem)",
              height: "clamp(4rem, 10vw, 9rem)",
              borderRadius: "0.15rem",
              duration: 0.98,
              ease: "power4.inOut",
            },
            0.7,
          )
          .to(
            ".loader-word-left, .loader-word-right",
            { xPercent: 0, duration: 0.92, ease: "power4.inOut" },
            0.78,
          )
          .to(
            loader,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.74,
              ease: "power4.inOut",
            },
            1.76,
          )
          .set(loader, { display: "none" });
      } else {
        route.inert = false;
        gsap.set(loader, { display: "none" });
      }

      if (!reducedMotion) {
        if (!isFirstRender && !isTransitionArrival) {
          gsap.fromTo(
            route,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.3,
              ease: "power2.out",
              clearProps: "opacity,visibility",
            },
          );
        }

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
              delay: isFirstRender ? 2.02 : isTransitionArrival ? 0.22 : 0.02,
            },
          );
        }

        const headings = root.querySelectorAll<HTMLElement>(headingSelector);

        headings.forEach((heading) => {
          const split = new SplitText(heading, {
            type: "lines",
            linesClass: "motion-line",
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
              delay: isFirstRender ? 2.02 : isTransitionArrival ? 0.22 : 0.02,
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

        gsap.utils
          .toArray<HTMLElement>(".case-film")
          .forEach((element) => {
            gsap.fromTo(
              element,
              { clipPath: "inset(0 0 100% 0)" },
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.02,
                ease: "power4.inOut",
                scrollTrigger: {
                  trigger: element,
                  start: "top 92%",
                  once: true,
                },
              },
            );
          });

        const staggerGroups = root.querySelectorAll<HTMLElement>(
          ".case-facts, .process-list",
        );

        staggerGroups.forEach((group) => {
          const children = group.querySelectorAll<HTMLElement>(
            ":scope > div, :scope > article",
          );

          if (children.length === 0) return;

          gsap.fromTo(
            children,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
              stagger: 0.055,
              ease: "power3.out",
              scrollTrigger: {
                trigger: group,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

        if (canUseFineMotion) {
          gsap.utils.toArray<HTMLElement>(".case-film video").forEach((video) => {
            gsap.fromTo(
              video,
              { yPercent: -2.5, scale: 1.035 },
              {
                yPercent: 2.5,
                scale: 1.035,
                ease: "none",
                scrollTrigger: {
                  trigger: video.closest(".case-film"),
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.55,
                },
              },
            );
          });
        }

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
              delay: isFirstRender ? 2.08 : isTransitionArrival ? 0.24 : 0.02,
            },
          );
        }
      }

    }, root);

    const handleRouteClick = (event: MouseEvent) => {
      if (
        reducedMotion ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        routeTransitioning.current
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === pathname ||
        destination.hash
      ) {
        return;
      }

      event.preventDefault();
      routeTransitioning.current = true;
      route.inert = true;
      transitionLabel.textContent =
        anchor.textContent?.replace("↗", "").trim().split(/\s+/).slice(-2).join(" ") ||
        "Next page";
      document.body.classList.add("is-route-transitioning");

      gsap.killTweensOf([routeTransition, routeSheet, route]);
      gsap.set(routeTransition, { display: "block" });
      gsap.fromTo(
        routeSheet,
        { yPercent: 108, rotation: 1.15, scale: 0.985 },
        {
          yPercent: 0,
          rotation: 0,
          scale: 1,
          duration: 0.72,
          ease: "power4.inOut",
          onComplete: () => router.push(`${destination.pathname}${destination.search}`),
        },
      );
      gsap.to(route, {
        y: -22,
        rotation: -0.2,
        scale: 0.987,
        duration: 0.72,
        ease: "power4.inOut",
      });
    };

    root.addEventListener("click", handleRouteClick);

    return () => {
      root.removeEventListener("click", handleRouteClick);
      arrivalTimeline?.kill();
      if (!routeTransitioning.current) {
        document.body.classList.remove(
          "is-intro-playing",
          "is-route-transitioning",
        );
      }
      route.inert = false;
      context.revert();
      splits.reverse().forEach((split) => split.revert());
    };
  }, [pathname, router]);

  return (
    <div
      className={`experience-root${pathname === "/" ? " is-home-route" : ""}`}
      ref={rootRef}
    >
      <div className="site-loader" ref={loaderRef} aria-hidden="true">
        <div className="loader-identity">
          <div className="loader-meta loader-meta-top">
            <p>Portfolio / 2026</p>
            <p className="loader-count">
              <span ref={loaderCountRef}>000</span>
              <span aria-hidden="true">%</span>
            </p>
          </div>
          <div className="loader-stage">
            <span className="loader-word loader-word-left">DH</span>
            <div className="loader-window">
              <div className="loader-window-copy">
                <span>Purpose-led motion</span>
                <span>Clarity in every frame</span>
              </div>
            </div>
            <span className="loader-word loader-word-right">REX</span>
          </div>
          <div className="loader-meta loader-meta-bottom">
            <p>SaaS Motion Designer</p>
            <p>Remote worldwide</p>
          </div>
        </div>
      </div>

      <div
        className="route-transition"
        ref={routeTransitionRef}
        aria-hidden="true"
      >
        <div className="route-transition-sheet" ref={routeSheetRef}>
          <span>DHREX</span>
          <span ref={transitionLabelRef}>Next page</span>
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
