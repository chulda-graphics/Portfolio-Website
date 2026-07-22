"use client";

import dynamic from "next/dynamic";

export const MacbookIntroLazy = dynamic(
  () => import("./macbook-intro").then((module) => module.MacbookIntro),
  {
    ssr: false,
    loading: () => (
      <section className="macbook-intro macbook-intro-loading" aria-label="Enter the Dhrex portfolio">
        <div className="macbook-sticky">
          <div className="model-fallback" aria-hidden="true">
            <span>Dhrex</span>
            <strong>Clarity,<br />set in motion.</strong>
          </div>
        </div>
      </section>
    ),
  },
);
