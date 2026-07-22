"use client";

/* eslint-disable @next/next/no-img-element -- frames are pre-sized, pre-compressed interaction sprites */

import { useEffect, useRef, useState } from "react";

type FramePreviewProps = {
  title: string;
  frames: string[];
};

export function FramePreview({ title, frames }: FramePreviewProps) {
  const section = useRef<HTMLElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const travel = useRef(0);
  const previousPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        frames.forEach((source) => {
          const image = new Image();
          image.decoding = "async";
          image.src = source;
        });
        observer.disconnect();
      },
      { rootMargin: "35%" },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, [frames]);

  const changeFrame = (direction: number) => {
    setFrameIndex((current) => (current + direction + frames.length) % frames.length);
  };

  return (
    <section
      ref={section}
      className="case-panel frame-preview"
      data-active={active}
      tabIndex={0}
      aria-label={`${title} interactive frame preview. Move the pointer or use the arrow keys to explore frames.`}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          changeFrame(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          changeFrame(-1);
        }
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setActive(true);
      }}
      onPointerLeave={() => {
        setActive(false);
        previousPoint.current = null;
      }}
      onPointerMove={(event) => {
        if (!section.current || event.pointerType !== "mouse") return;
        const rect = section.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (previousPoint.current) {
          travel.current += Math.hypot(x - previousPoint.current.x, y - previousPoint.current.y);
          setFrameIndex(Math.floor(travel.current / 24) % frames.length);
        }
        previousPoint.current = { x, y };
        if (follower.current) {
          follower.current.style.setProperty("--frame-x", `${x}px`);
          follower.current.style.setProperty("--frame-y", `${y}px`);
        }
      }}
    >
      <div className="frame-preview-heading">
        <p className="eyebrow">Frame preview / {String(frames.length).padStart(2, "0")} stills</p>
        <h2>Move through the film, one decision at a time.</h2>
        <p>Move your cursor across this panel. On touch, swipe the frame rail below.</p>
      </div>

      <div ref={follower} className="frame-follower" aria-hidden="true">
        <img src={frames[frameIndex]} alt="" width="960" height="540" decoding="async" />
        <span>{String(frameIndex + 1).padStart(2, "0")} / {frames.length}</span>
      </div>

      <div className="frame-touch-rail" aria-label={`${title} film stills`}>
        {frames.map((frame, index) => (
          <button
            type="button"
            key={frame}
            aria-label={`Show frame ${index + 1}`}
            aria-pressed={index === frameIndex}
            onClick={() => setFrameIndex(index)}
          >
            <img src={frame} alt="" width="960" height="540" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>

      <div className="frame-progress" aria-hidden="true">
        {frames.map((frame, index) => (
          <span key={frame} data-active={index === frameIndex} />
        ))}
      </div>
    </section>
  );
}
