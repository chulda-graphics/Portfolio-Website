"use client";

import { Step, Stepper } from "./Stepper";

const chapters = [
  { label: "Discover", title: "Find the product truth.", stages: ["Discovery", "Research"], copy: "Align on the audience, business goal, and product reality before deciding what the motion should say." },
  { label: "Define", title: "Build the narrative logic.", stages: ["Script", "Storyboard"], copy: "Turn complexity into a concise promise, then solve sequence and pacing before production begins." },
  { label: "Design", title: "Create a visual system.", stages: ["Styleframes", "Asset creation"], copy: "Develop a distinct language of interface, illustration, type, and spatial rules designed for animation." },
  { label: "Animate", title: "Give every moment a job.", stages: ["Animation", "Sound design"], copy: "Use rhythm, focus, transition, and sound to explain relationships and make the product feel intuitive." },
  { label: "Refine", title: "Deliver a system that lasts.", stages: ["Revision", "Delivery"], copy: "Sharpen the work against its objective and hand over adaptable assets for launches, education, and growth." },
];

export function ProcessStepper() {
  return (
    <section className="process-stepper-section" aria-labelledby="project-path-title">
      <div className="process-stepper-heading"><p>Explore the project path</p><h2 id="project-path-title">One connected process. Five decisive chapters.</h2></div>
      <Stepper nextButtonText="Next chapter" completeButtonText="Finish path">
        {chapters.map(chapter => (
          <Step key={chapter.label}>
            <div className="process-stepper-label">{chapter.label}</div>
            <h2>{chapter.title}</h2>
            <p>{chapter.copy}</p>
            <div className="process-stepper-stages">{chapter.stages.map(stage => <span key={stage}>{stage}</span>)}</div>
          </Step>
        ))}
      </Stepper>
    </section>
  );
}
