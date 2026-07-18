import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";

export const metadata: Metadata = {
  title: "Demo Reel 2026",
  description:
    "A detailed look at Dhrex's 2026 motion design reel—direction, animation, editing, and the precision behind the final film.",
};

export default function DemoReelCaseStudy() {
  return (
    <CaseStudy
      eyebrow="Personal work / Motion reel / 2026"
      title="Demo Reel 2026"
      summary="A compact statement of how I think in motion: clarity first, rhythm with purpose, and craft down to the frame."
      video="https://pub-8843028733224946913b21df4054c3ae.r2.dev/Video%20Demo%20Reel%202026.mp4"
      poster="/assets/demo-reel-cover.png"
      details={[
        { label: "Role", value: "Direction, design, animation, edit" },
        { label: "Scope", value: "Personal showcase" },
        { label: "Outcome", value: "Helped close a paid project" },
      ]}
      sections={[
        {
          number: "01",
          label: "Context",
          title: "A reel with a point of view.",
          body: [
            "Without a client brief to lean on, the reel needed to communicate more than range. It had to make my standards visible: purposeful composition, exact timing, and motion that helps an idea land.",
            "The goal was not to collect every technique in one film. It was to create a clear signal for SaaS founders looking for someone who understands both product and presentation.",
          ],
        },
        {
          number: "02",
          label: "Challenge",
          title: "Turn separate moments into one system.",
          body: [
            "A reel can become visual noise when every shot competes for attention. The challenge was to bring different fragments together without flattening their character or sacrificing pace.",
            "I treated the edit as an interface: each transition needed to orient the viewer, maintain momentum, and make the next idea feel inevitable.",
          ],
        },
        {
          number: "03",
          label: "Approach",
          title: "Still frames first. Motion second.",
          body: [
            "I developed the visual sequence through still frames, establishing hierarchy, contrast, and rhythm before moving into animation. This kept every scene accountable to the idea it needed to communicate.",
            "From there, the motion system focused on measured transitions, precise easing, typography, and sound—small choices that make the whole film feel composed rather than assembled.",
          ],
        },
        {
          number: "04",
          label: "Result",
          title: "Self-directed work that created momentum.",
          body: [
            "The final reel became a concise proof of capability and helped convert interest into a paid project. More importantly, it established the standard I want every future SaaS collaboration to meet.",
          ],
        },
      ]}
      nextProject={{ title: "StillSearch", href: "/work/stillsearch" }}
    />
  );
}
