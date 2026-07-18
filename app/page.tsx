import type { Metadata } from "next";
import { LoadingScreen } from "@/components/loading-screen";
import { ProjectSelector } from "@/components/project-selector";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "SaaS Motion Designer",
  description:
    "Dhrex creates precise, purpose-led motion design that makes SaaS products easier to understand, trust, and remember.",
};

export default function WorkPage() {
  return (
    <main id="main-content">
      <LoadingScreen />
      <SiteHeader />
      <ProjectSelector />
      <section className="work-statement" aria-labelledby="work-statement-title">
        <p className="eyebrow">Purpose over decoration</p>
        <h2 id="work-statement-title">
          Motion that gives software a clearer voice.
        </h2>
        <p>
          I help SaaS teams turn complex products into visual stories that feel
          intuitive, considered, and worth remembering.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
