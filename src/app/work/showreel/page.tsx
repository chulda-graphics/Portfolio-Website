import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export const metadata: Metadata = { title: "Motion Reel — Chulda", description: "Selected motion design moments across SaaS, AI, and digital products." };

const project = {
  title: "Motion Reel",
  descriptor: "Selected work / Direction / 2026",
  summary: "A concentrated study of how rhythm, interface motion, and visual systems can make digital products feel alive.",
  accent: "case-orange",
  sections: [
    { title: "Purpose", copy: "The reel is not a collection of effects. It is a fast argument for motion as product communication, brand memory, and emotional clarity." },
    { title: "Featured shots", copy: "Each shot earns its place by revealing a different behavior: explaining hierarchy, creating anticipation, or giving an interface a recognizable voice." },
    { title: "Breakdown", copy: "Sequences are grouped by communication job rather than client, letting pacing build from orientation to energy and finally confidence." },
    { title: "Software used", copy: "After Effects, Cinema 4D, Figma, Illustrator, and a growing set of procedural tools support the idea instead of defining it." },
    { title: "Creative direction", copy: "Contrast carries the edit: dense systems open into quiet frames, sharp interface beats resolve into expressive brand moments." },
    { title: "Motion techniques", copy: "Kinetic type, UI choreography, spatial transitions, 3D camera systems, and shape language are selected to suit the product idea." },
    { title: "Sound design", copy: "Sound supplies structure and materiality. Each layer clarifies pace, scale, or interaction instead of competing with the image." },
    { title: "Behind the scenes", copy: "Style explorations and timing studies reveal the deliberate choices behind moments that are meant to feel effortless." },
    { title: "Credits", copy: "A selection of independent direction, collaborative client work, and creative partnerships. Full credits accompany each published project." },
  ],
  nextLabel: "Explore the process.", nextHref: "/process",
};

export default function ShowreelPage() { return <CaseStudyPage project={project} />; }
