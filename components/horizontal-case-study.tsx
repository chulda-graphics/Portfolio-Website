"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function HorizontalCaseStudy({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stage.current || !track.current) return;
    const desktop = window.matchMedia("(min-width: 901px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let distance = 0;
    let frame = 0;

    const measure = () => {
      if (!stage.current || !track.current) return;
      const enabled = desktop.matches && !reduceMotion.matches;
      distance = enabled ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0;
      stage.current.style.height = enabled ? `${window.innerHeight + distance}px` : "auto";
      track.current.style.transform = "translate3d(0,0,0)";
      update();
    };

    const update = () => {
      if (!stage.current || !track.current || !distance) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!stage.current || !track.current) return;
        const rect = stage.current.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / distance));
        track.current.style.transform = `translate3d(${-distance * progress}px,0,0)`;
        stage.current.style.setProperty("--case-progress", String(progress));
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track.current);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", update, { passive: true });
    desktop.addEventListener("change", measure);
    reduceMotion.addEventListener("change", measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", update);
      desktop.removeEventListener("change", measure);
      reduceMotion.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={stage} className="case-horizontal-stage">
      <div className="case-horizontal-viewport">
        <div ref={track} className="case-horizontal-track">
          {children}
        </div>
      </div>
    </div>
  );
}
