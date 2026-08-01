import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export const metadata: Metadata = { title: "StillSearch — Chulda", description: "A product motion case study for an AI search platform." };

const project = {
  title: "StillSearch",
  descriptor: "AI search / Product film / 2025",
  summary: "Turning an intelligent search workflow into a simple story about finding the signal faster.",
  accent: "case-blue",
  sections: [
    { title: "Challenge", copy: "The product could search broadly, connect ideas, and surface useful patterns—but its value was buried under the complexity of how it worked." },
    { title: "Research", copy: "We mapped the moments where users lost confidence, then found the emotional center: less time sorting through noise, more time recognizing what matters." },
    { title: "Strategy", copy: "The narrative moved from information overload to one precise signal. Every transition had to reduce friction, not simply add spectacle." },
    { title: "Storyboard", copy: "A sequence of visual questions and answers established the rhythm before animation began, keeping the product—not the effect—as the protagonist." },
    { title: "Styleframes", copy: "Soft spatial depth, decisive blue, and restrained interface details gave the system intelligence without making it feel mechanical." },
    { title: "Asset creation", copy: "Search fields, result clusters, orbit systems, and modular UI states were rebuilt for animation at every campaign format." },
    { title: "Motion design", copy: "Elements organize themselves around user intent. Scale, focus, and directional flow make the product logic readable before a word is spoken." },
    { title: "Sound design", copy: "A quiet tonal system reinforces discovery: broad textures resolve into precise signals as the story becomes clearer." },
    { title: "Behind the scenes", copy: "Modular scenes and reusable timing systems let the launch film expand into shorter social, product, and sales-support edits." },
  ],
  nextLabel: "Watch the motion reel.", nextHref: "/work/showreel",
  videoUrl: "https://pub-8843028733224946913b21df4054c3ae.r2.dev/StillSearch%20Launch%20Video.mp4",
  poster: "/assets/illustrations/stillsearch-signal.webp",
};

export default function StillSearchPage() { return <CaseStudyPage project={project} />; }
