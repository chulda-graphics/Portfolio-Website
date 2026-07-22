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
  const echoes = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const travel = useRef(0);
  const previousPoint = useRef<{ x: number; y: number } | null>(null);
  const lastEchoPoint = useRef<{ x: number; y: number } | null>(null);
  const echoIndex = useRef(0);
  const pointerFrame = useRef(0);
  const pointerPoint = useRef({ x: 0, y: 0 });
  const reduceMotion = useRef(false);

  useEffect(() => {
    if (!section.current) return;
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    return () => {
      cancelAnimationFrame(pointerFrame.current);
      observer.disconnect();
    };
  }, [frames]);

  const changeFrame = (direction: number) => {
    setFrameIndex((current) => (current + direction + frames.length) % frames.length);
  };

  const placeFollower = (x: number, y: number) => {
    pointerPoint.current = { x, y };
    if (pointerFrame.current) return;
    pointerFrame.current = requestAnimationFrame(() => {
      pointerFrame.current = 0;
      follower.current?.style.setProperty("--frame-x", `${pointerPoint.current.x}px`);
      follower.current?.style.setProperty("--frame-y", `${pointerPoint.current.y}px`);
    });
  };

  const leaveEcho = (x: number, y: number, index: number) => {
    if (reduceMotion.current) return;
    const node = echoes.current[echoIndex.current % echoes.current.length];
    if (!node) return;
    echoIndex.current += 1;
    const image = node.querySelector("img");
    if (image) image.src = frames[index];
    node.getAnimations().forEach((animation) => animation.cancel());
    node.style.setProperty("--echo-x", `${x}px`);
    node.style.setProperty("--echo-y", `${y}px`);
    node.style.zIndex = String(2 + (echoIndex.current % echoes.current.length));
    const rotation = ((echoIndex.current % 5) - 2) * 0.7;
    node.animate(
      [
        { opacity: 0.62, transform: `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(.96) rotate(${rotation}deg)` },
        { opacity: 0, transform: `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(.86) rotate(${rotation * 1.4}deg)` },
      ],
      { duration: 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" },
    );
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
        lastEchoPoint.current = null;
      }}
      onPointerMove={(event) => {
        if (!section.current || event.pointerType !== "mouse") return;
        const rect = section.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (previousPoint.current) {
          travel.current += Math.hypot(x - previousPoint.current.x, y - previousPoint.current.y);
        }
        previousPoint.current = { x, y };
        const nextIndex = Math.floor(travel.current / 42) % frames.length;
        const last = lastEchoPoint.current;
        if (!last || Math.hypot(x - last.x, y - last.y) >= 58) {
          setFrameIndex(nextIndex);
          leaveEcho(x, y, nextIndex);
          lastEchoPoint.current = { x, y };
        }
        placeFollower(x, y);
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

      <div className="frame-echoes" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="frame-echo"
            key={index}
            ref={(node) => { echoes.current[index] = node; }}
          >
            <img src={frames[0]} alt="" width="960" height="540" decoding="async" />
          </div>
        ))}
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
