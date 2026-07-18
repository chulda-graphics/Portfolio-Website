"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/lib/projects";

export function ProjectSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userIsChoosing, setUserIsChoosing] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeProject = projects[activeIndex];

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || userIsChoosing || !autoRotate) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % projects.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [userIsChoosing, autoRotate]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const chooseProject = (index: number) => {
    setActiveIndex(index);
    setUserIsChoosing(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setUserIsChoosing(false), 9000);
  };

  const status = useMemo(
    () => (activeProject.href ? "View case study" : "In development"),
    [activeProject],
  );

  const preview = (
    <div className="project-preview-card" key={activeProject.index}>
      <img src={activeProject.cover} alt={activeProject.alt} />
      <div className="project-preview-shade" />
      <div className="project-preview-meta">
        <span>{activeProject.index} / 10</span>
        <span>{status}</span>
      </div>
      <div className="project-preview-title">
        <span>{activeProject.descriptor}</span>
        <strong>{activeProject.title}</strong>
      </div>
    </div>
  );

  return (
    <section className="work-index" aria-labelledby="work-title">
      <div className="work-intro">
        <p className="eyebrow">Selected work / 2026</p>
        <h1 id="work-title">
          Clarity,
          <br />
          set in motion.
        </h1>
        <p className="work-intro-copy">
          Purpose-led motion for SaaS products. Every frame is built to explain,
          guide, and connect.
        </p>
        <button
          className="rotation-toggle"
          type="button"
          onClick={() => setAutoRotate((value) => !value)}
          aria-pressed={!autoRotate}
        >
          <span aria-hidden="true">{autoRotate ? "Ⅱ" : "▶"}</span>
          {autoRotate ? "Pause project rotation" : "Resume project rotation"}
        </button>
      </div>

      <div className="preview-orbit" aria-live="polite">
        <span className="orbit-line orbit-line-one" aria-hidden="true" />
        <span className="orbit-line orbit-line-two" aria-hidden="true" />
        {activeProject.href ? (
          <Link
            className="project-preview-link"
            href={activeProject.href}
            aria-label={`View ${activeProject.title} case study`}
          >
            {preview}
          </Link>
        ) : (
          <div className="project-preview-link is-inert">{preview}</div>
        )}
      </div>

      <ol className="project-rail" aria-label="Project index">
        {projects.map((project, index) => (
          <li
            key={`${project.index}-${project.title}`}
            data-active={index === activeIndex}
            onPointerEnter={() => chooseProject(index)}
          >
            {project.href ? (
              <Link
                href={project.href}
                onFocus={() => chooseProject(index)}
                aria-label={`${project.index}. ${project.title}, ${project.descriptor}`}
              >
                <span className="project-number">{project.index}</span>
                <span className="project-name">{project.title}</span>
                <span className="project-kind">{project.descriptor}</span>
                <span className="project-year">{project.year}</span>
              </Link>
            ) : (
              <div aria-label={`${project.index}. Coming soon`}>
                <span className="project-number">{project.index}</span>
                <span className="project-name">{project.title}</span>
                <span className="project-kind">{project.descriptor}</span>
                <span className="project-year">{project.year}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
