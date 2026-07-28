import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Dhrex, an independent SaaS motion designer working remotely worldwide.",
};

export default function AboutPage() {
  return (
    <main className="page-shell">
      <SiteHeader current="about" />

      <section className="about-opening" aria-labelledby="about-title">
        <p className="eyebrow">About / Dhrex</p>
        <h1 id="about-title">
          I don&apos;t just animate interfaces—I shape how people experience
          software.
        </h1>
      </section>

      <section className="about-grid">
        <p className="about-lead">
          I specialise in premium product motion that makes SaaS products feel
          intuitive, polished, and desirable.
        </p>

        <div className="about-copy">
          <p>
            Before I animate anything, I focus on understanding the product:
            what problem it solves, who it is for, and what people should feel
            while using it. The strongest motion comes from understanding, not
            decoration.
          </p>
          <p>
            Timing, easing, typography, scene rhythm, micro-interactions, and
            sound all shape how premium a product feels. Those small decisions
            turn useful motion into an experience people trust and remember.
          </p>
          <p>
            Rather than chasing trends, I study why excellent digital products
            feel effortless, then translate those principles into original work
            that belongs to each client&apos;s product and brand.
          </p>
        </div>
      </section>

      <section className="about-manifesto">
        <p className="eyebrow">What I believe</p>
        <p>
          Motion is not the final layer of a product. It is part of the product
          itself.
        </p>
      </section>

      <section className="about-facts" aria-label="Practice details">
        <div>
          <p>Practice</p>
          <p>SaaS motion graphics</p>
          <p>Product launch films</p>
          <p>Interface motion</p>
          <p>SaaS video editing</p>
        </div>
        <div>
          <p>Based</p>
          <p>Remote worldwide</p>
        </div>
        <div>
          <p>Available</p>
          <p>Freelance projects</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
