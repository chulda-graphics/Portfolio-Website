import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";

export const metadata: Metadata = {
  title: "StillSearch Launch Film",
  description:
    "How Dhrex translated StillSearch's SaaS product into a clear launch film through UI recreation, product storytelling, and precise motion design.",
};

export default function StillSearchCaseStudy() {
  return (
    <CaseStudy
      eyebrow="StillSearch / Product launch film / 2026"
      title="StillSearch"
      summary="Making a better visual-search experience immediately understandable to the filmmakers it was built for."
      video="https://pub-8843028733224946913b21df4054c3ae.r2.dev/StillSearch%20Launch%20Video.mp4"
      poster="/assets/stillsearch-cover.png"
      details={[
        { label: "Client", value: "StillSearch" },
        { label: "Role", value: "Motion design, UI recreation" },
        { label: "Deliverable", value: "SaaS launch film" },
      ]}
      sections={[
        {
          number: "01",
          label: "Product",
          title: "Search built for the way filmmakers think.",
          body: [
            "StillSearch helps filmmakers find static frames inside dynamic content for research and creative reference. Its value lives in a specific distinction: it makes visual discovery feel native to the filmmaking process.",
            "The launch film needed to communicate that difference, explain how the product works, and surface its most useful features in one coherent narrative.",
          ],
        },
        {
          number: "02",
          label: "Challenge",
          title: "Clarity under launch pressure.",
          body: [
            "StillSearch was preparing to launch on a compressed timeline. The existing motion did not communicate the product with the clarity or quality the launch demanded, so the new film needed to become ready quickly without feeling rushed.",
            "My responsibility began with the supplied script and storyboard. I focused on translating that foundation into a visual system that could carry the product's value from scene to scene.",
          ],
        },
        {
          number: "03",
          label: "Execution",
          title: "Rebuild the product to control the story.",
          body: [
            "I recreated the website interface inside After Effects so every interaction, camera move, and transition could be directed around the message. That control made it possible to simplify dense product moments without misrepresenting the experience.",
            "The motion was designed to reveal the differentiator first, then teach the workflow and features through a measured sequence of demonstrations. Each transition had a functional job: preserve context, guide attention, or connect one benefit to the next.",
          ],
        },
        {
          number: "04",
          label: "Polish",
          title: "A launch film that speaks with confidence.",
          body: [
            "The final pass refined pacing, easing, hierarchy, and detail so the film felt as considered as the product it introduced. The result gave StillSearch a clearer visual voice for launch while keeping the experience useful to its intended audience.",
            "Performance analytics will be added when they become available; this case study currently focuses on the process and creative solution.",
          ],
        },
      ]}
      testimonial={{
        quote:
          "Dhrex has both exceptional creative taste and the technical skill to produce a strong launch video, but as a founder, what impressed me most was his sense of ownership. He understood what we were building, cared about getting every detail right, and brought thoughtful creative judgment throughout the process. He was genuinely easy to work with and dependable from start to finish.",
        name: "John Lexter Laguinday",
        role: "Founder, StillSearch",
        companyUrl: "https://stillsearch.com/",
      }}
      nextProject={{ title: "Demo Reel 2026", href: "/work/demo-reel-2026" }}
    />
  );
}
