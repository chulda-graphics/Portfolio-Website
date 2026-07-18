"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduceMotion ? 180 : 1450;
    const startedAt = performance.now();
    let frame = 0;

    const update = (time: number) => {
      const elapsed = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 100));
      if (elapsed < 1) {
        frame = requestAnimationFrame(update);
      } else {
        window.setTimeout(() => setVisible(false), reduceMotion ? 40 : 260);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="loading-screen"
      data-visible={visible}
      aria-hidden={!visible}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Preparing selected work</span>
      <div className="loader-topline">
        <span>Dhrex</span>
        <span>SaaS motion designer</span>
      </div>
      <div className="loader-counter" aria-hidden="true">
        {String(progress).padStart(3, "0")}
      </div>
      <div className="loader-rail" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  );
}
