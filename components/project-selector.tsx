"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { projects } from "@/lib/projects";

const AUTOPLAY_SPEED = 0.082;

function wrapDistance(value: number) {
  const count = projects.length;
  return ((value + count / 2) % count + count) % count - count / 2;
}

function wrapIndex(value: number) {
  return ((value % projects.length) + projects.length) % projects.length;
}

export function ProjectSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const carousel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<Array<HTMLDivElement | null>>([]);
  const progress = useRef(0);
  const velocity = useRef(AUTOPLAY_SPEED);
  const targetProgress = useRef<number | null>(null);
  const resumeAt = useRef(0);
  const animationClock = useRef(0);
  const hovered = useRef(false);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);
  const draggedDistance = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let previousTime = performance.now();
    let renderedActive = -1;
    let renderedProgress = Number.NaN;
    let renderedWidth = 0;

    const positionItems = () => {
      const stageWidth = stage.current?.clientWidth ?? window.innerWidth;
      const nextActive = wrapIndex(Math.round(progress.current));
      if (nextActive !== renderedActive) {
        renderedActive = nextActive;
        setActiveIndex(nextActive);
      }

      items.current.forEach((item, index) => {
        if (!item) return;
        const distance = wrapDistance(index - progress.current);
        const angle = distance * (Math.PI * 2 / projects.length);
        const horizontal = Math.sin(angle);
        const depth = (Math.cos(angle) + 1) / 2;
        const scale = 0.68 + depth * 0.32;
        const x = horizontal * stageWidth * 0.43;
        const y = Math.abs(horizontal) * stageWidth * 0.018 + (1 - depth) * 8;
        const z = (depth - 0.5) * 190;
        const opacity = 0.08 + Math.pow(depth, 1.7) * 0.92;
        const active = index === nextActive;

        item.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${-horizontal * 14}deg) rotateZ(${horizontal * 1.25}deg) scale(${scale})`;
        item.style.opacity = String(opacity);
        item.style.zIndex = String(Math.round(depth * 100));
        item.style.pointerEvents = active ? "auto" : "none";
        item.dataset.active = active ? "true" : "false";
      });
    };

    const draw = (time: number) => {
      animationClock.current = time;
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (reduceMotion && targetProgress.current !== null) {
        progress.current = targetProgress.current;
        targetProgress.current = null;
      } else if (!reduceMotion && !dragging.current) {
        if (targetProgress.current !== null) {
          const distance = targetProgress.current - progress.current;
          const blend = 1 - Math.exp(-delta * 5.2);
          progress.current += distance * blend;
          velocity.current *= Math.exp(-delta * 8);
          if (Math.abs(distance) < 0.0015) {
            progress.current = targetProgress.current;
            targetProgress.current = null;
            velocity.current = 0;
            resumeAt.current = time + 650;
          }
        } else {
          const canAutoplay = playing
            && time >= resumeAt.current
            && document.body.dataset.productIntro !== "true";
          const desiredSpeed = canAutoplay
            ? AUTOPLAY_SPEED * (hovered.current ? 0.32 : 1)
            : 0;
          const blend = 1 - Math.exp(-delta * 2.7);
          velocity.current += (desiredSpeed - velocity.current) * blend;
          progress.current += velocity.current * delta;
        }
      }

      if (Math.abs(progress.current) > 1200 && targetProgress.current === null) {
        progress.current %= projects.length;
      }
      const stageWidth = stage.current?.clientWidth ?? window.innerWidth;
      if (
        Math.abs(progress.current - renderedProgress) > 0.0001
        || stageWidth !== renderedWidth
      ) {
        renderedProgress = progress.current;
        renderedWidth = stageWidth;
        positionItems();
      }
      frame = requestAnimationFrame(draw);
    };

    positionItems();
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const moveToProject = (index: number) => {
    const distance = wrapDistance(index - progress.current);
    targetProgress.current = progress.current + distance;
    resumeAt.current = animationClock.current + 900;
  };

  const moveBy = (amount: number) => {
    targetProgress.current = progress.current + amount;
    resumeAt.current = animationClock.current + 900;
  };

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging.current = true;
    draggedDistance.current = 0;
    dragStartX.current = event.clientX;
    dragStartProgress.current = progress.current;
    targetProgress.current = null;
    velocity.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };

  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const width = stage.current?.clientWidth ?? window.innerWidth;
    const distance = event.clientX - dragStartX.current;
    draggedDistance.current = Math.max(draggedDistance.current, Math.abs(distance));
    progress.current = dragStartProgress.current - distance / Math.max(width * 0.42, 1);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    resumeAt.current = animationClock.current + 850;
    velocity.current = 0;
    event.currentTarget.releasePointerCapture(event.pointerId);
    delete event.currentTarget.dataset.dragging;
  };

  const tiltCard = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragging.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--card-tilt-x", `${x * 3.5}deg`);
    event.currentTarget.style.setProperty("--card-tilt-y", `${y * -3}deg`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--card-tilt-x");
    event.currentTarget.style.removeProperty("--card-tilt-y");
  };

  return (
    <section className="work-index" data-home-portal aria-labelledby="work-title">
      <div className="work-intro">
        <p className="eyebrow">Selected work / 2026</p>
        <h1 id="work-title">Clarity,<br />set in motion.</h1>
        <p className="work-intro-copy">
          Purpose-led motion for SaaS products. Every frame is built to explain,
          guide, and connect.
        </p>
      </div>

      <div
        ref={carousel}
        className="project-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Continuously rotating selected projects"
        tabIndex={0}
        onPointerEnter={() => { hovered.current = true; }}
        onPointerLeave={() => { hovered.current = false; }}
        onFocus={() => { hovered.current = true; }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) hovered.current = false;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            moveBy(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveBy(-1);
          }
        }}
        onClickCapture={(event) => {
          if (draggedDistance.current > 6) {
            event.preventDefault();
            event.stopPropagation();
            draggedDistance.current = 0;
          }
        }}
      >
        <div className="carousel-orbit" aria-hidden="true" />
        <div
          ref={stage}
          className="carousel-stage"
          onPointerDown={beginDrag}
          onPointerMove={drag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {projects.map((project, index) => {
            const active = index === activeIndex;
            const card = (
              <article
                className={`carousel-card${project.href ? "" : " is-coming"}`}
                onPointerMove={active ? tiltCard : undefined}
                onPointerLeave={active ? resetTilt : undefined}
              >
                <picture>
                  <source srcSet={project.coverAvif} type="image/avif" />
                  <img
                    src={project.cover}
                    alt={active ? project.alt : ""}
                    width={project.width}
                    height={project.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </picture>
                <div className="carousel-card-shade" />
                {!project.href ? <div className="coming-soon-grid" aria-hidden="true" /> : null}
                <div className="carousel-card-topline">
                  <span>{project.index} / {String(projects.length).padStart(2, "0")}</span>
                  <span>{project.href ? "View case study" : "In development"}</span>
                </div>
                <div className="carousel-card-title">
                  <span>{project.descriptor}</span>
                  <strong>{project.title}</strong>
                </div>
              </article>
            );

            return (
              <div
                ref={(element) => { items.current[index] = element; }}
                className="project-carousel-item"
                key={project.index}
                aria-hidden={!active}
              >
                {active && project.href ? (
                  <Link href={project.href} data-cursor="View" aria-label={`View ${project.title} case study`}>
                    {card}
                  </Link>
                ) : active ? (
                  <div aria-label={`${project.title}, ${project.descriptor}`}>{card}</div>
                ) : (
                  <div>{card}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="carousel-controls">
          <button type="button" onClick={() => moveBy(-1)} aria-label="Previous project">←</button>
          <button
            type="button"
            onClick={() => {
              setPlaying((value) => !value);
              resumeAt.current = animationClock.current + 500;
            }}
            aria-label={playing ? "Pause project rotation" : "Resume project rotation"}
            aria-pressed={!playing}
          >
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button type="button" onClick={() => moveBy(1)} aria-label="Next project">→</button>
        </div>
      </div>

      <ol className="project-rail" aria-label="Project index">
        {projects.map((project, index) => (
          <li key={project.index} data-active={index === activeIndex}>
            <button type="button" onClick={() => moveToProject(index)} aria-current={index === activeIndex ? "true" : undefined}>
              <span className="project-number">{project.index}</span>
              <span className="project-name">{project.title}</span>
              <span className="project-kind">{project.descriptor}</span>
              <span className="project-year">{project.year}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
