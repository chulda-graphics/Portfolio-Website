"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { projects } from "@/lib/projects";

const ROTATION_INTERVAL = 4600;

function carouselPosition(index: number, activeIndex: number) {
  const forward = (index - activeIndex + projects.length) % projects.length;
  if (forward === 0) return "active";
  return forward === 1 ? "next" : "previous";
}

export function ProjectSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hovered, setHovered] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectProject = (index: number, pause = true) => {
    setActiveIndex((index + projects.length) % projects.length);
    if (!pause) return;
    setAutoRotate(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoRotate(true), 8000);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || hovered || !autoRotate) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % projects.length);
    }, ROTATION_INTERVAL);
    return () => window.clearInterval(interval);
  }, [autoRotate, hovered]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const tiltCard = (event: ReactPointerEvent<HTMLElement>) => {
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

  const toggleAutoRotate = () => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    setAutoRotate((value) => !value);
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
        className="project-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            selectProject(activeIndex + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            selectProject(activeIndex - 1);
          }
        }}
      >
        <div className="carousel-orbit" aria-hidden="true" />
        <div className="carousel-stage">
          {projects.map((project, index) => {
            const position = carouselPosition(index, activeIndex);
            const active = position === "active";
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
                className="project-carousel-item"
                data-position={position}
                key={project.index}
                aria-hidden={!active}
              >
                {active && project.href ? (
                  <Link
                    href={project.href}
                    data-cursor="View"
                    aria-label={`View ${project.title} case study`}
                  >
                    {card}
                  </Link>
                ) : active ? (
                  <div aria-label={`${project.title}, ${project.descriptor}`}>{card}</div>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => selectProject(index)}
                    aria-label={`Show ${project.title}`}
                  >
                    {card}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="carousel-controls">
          <button type="button" onClick={() => selectProject(activeIndex - 1)} aria-label="Previous project">←</button>
          <button
            type="button"
            onClick={toggleAutoRotate}
            aria-label={autoRotate ? "Pause project rotation" : "Resume project rotation"}
            aria-pressed={!autoRotate}
          >
            {autoRotate ? "Ⅱ" : "▶"}
          </button>
          <button type="button" onClick={() => selectProject(activeIndex + 1)} aria-label="Next project">→</button>
        </div>
      </div>

      <ol className="project-rail" aria-label="Project index">
        {projects.map((project, index) => (
          <li key={project.index} data-active={index === activeIndex}>
            <button type="button" onClick={() => selectProject(index)} aria-current={index === activeIndex ? "true" : undefined}>
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
