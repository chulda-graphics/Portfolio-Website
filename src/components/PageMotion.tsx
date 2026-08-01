"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } })
        .from(".route-nav-reveal", { y: -20, autoAlpha: 0 })
        .from(".route-hero-line", { yPercent: 110, stagger: .1 }, "<.1")
        .from(".route-hero-copy, .route-hero-art", { y: 28, autoAlpha: 0, stagger: .12 }, "<.25");

      gsap.utils.toArray<HTMLElement>(".scale-reveal").forEach((el) => {
        gsap.fromTo(el, { scale: .84, autoAlpha: .35 }, { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "center 58%", scrub: .7 } });
      });

      gsap.utils.toArray<HTMLElement>(".stack-card").forEach((card, index) => {
        gsap.from(card, { y: 90 + index * 15, rotation: index % 2 ? 1.2 : -1.2, autoAlpha: 0, scrollTrigger: { trigger: card, start: "top 88%", end: "top 58%", scrub: .65 } });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return <main ref={root} className={`route-shell ${className}`}>{children}</main>;
}
