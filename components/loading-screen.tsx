"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const storageKey = "dhrex-intro-seen";
    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        const skipTimer = window.setTimeout(() => {
          setInstant(true);
          setProgress(100);
          setVisible(false);
          document.body.dataset.loaded = "true";
        }, 0);
        return () => window.clearTimeout(skipTimer);
      }
    } catch {
      // Storage can be unavailable in strict privacy contexts; the intro still works.
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startedAt = performance.now();
    let modelReady = Boolean(document.querySelector("[data-model-ready='true']"));
    let finished = false;
    let frame = 0;

    const onModelReady = () => {
      modelReady = true;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // A repeat view can simply replay when storage is unavailable.
      }
      document.body.dataset.loaded = "true";
      window.dispatchEvent(new Event("dhrex:loaded"));
      window.setTimeout(() => setVisible(false), reduceMotion ? 30 : 150);
    };

    const update = (time: number) => {
      const elapsed = time - startedAt;
      const minimumDuration = reduceMotion ? 120 : 850;
      const maximumDuration = reduceMotion ? 180 : 2400;
      const waitingProgress = Math.min(88, (elapsed / maximumDuration) * 100);
      const complete = elapsed >= maximumDuration || (modelReady && elapsed >= minimumDuration);
      const target = complete ? 100 : waitingProgress;
      setProgress(Math.round(target));
      if (complete) finish();
      else frame = requestAnimationFrame(update);
    };

    window.addEventListener("dhrex:model-ready", onModelReady);
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("dhrex:model-ready", onModelReady);
    };
  }, []);

  return (
    <div
      className="loading-screen"
      data-visible={visible}
      data-instant={instant}
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
