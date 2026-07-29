"use client";

import { useState } from "react";

type Phase = {
  index: string;
  title: string;
  copy: string;
};

type ProcessAccordionProps = {
  phases: readonly Phase[];
};

export function ProcessAccordion({ phases }: ProcessAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="process-list" aria-label="Working process">
      {phases.map((phase, index) => {
        const isOpen = index === activeIndex;
        const panelId = `process-panel-${phase.index}`;

        return (
          <article className={isOpen ? "is-open" : undefined} key={phase.index}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setActiveIndex(index)}
            >
              <span>{phase.index}</span>
              <span className="process-title">{phase.title}</span>
              <span className="process-indicator" aria-hidden="true" />
            </button>
            <div
              className="process-panel"
              id={panelId}
              aria-hidden={!isOpen}
            >
              <div>
                <p>{phase.copy}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
