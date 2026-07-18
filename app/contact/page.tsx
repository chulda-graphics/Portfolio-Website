import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Schedule a discovery call with Dhrex for SaaS motion design, UI animation, or a product launch film. Available remotely worldwide.",
};

const socials = [
  ["Instagram", "https://www.instagram.com/dhrex.in.motion/"],
  ["TikTok", "https://www.tiktok.com/@dhrex.in.motion"],
  ["LinkedIn", "https://www.linkedin.com/in/dhrex-ca%C3%B1ezo/"],
  ["X", "https://x.com/dhrexinmotion"],
  ["Facebook", "https://www.facebook.com/canezo.dhrex/"],
];

export default function ContactPage() {
  return (
    <main id="main-content">
      <SiteHeader />
      <article className="contact-page">
        <header className="contact-hero">
          <p className="eyebrow">
            <span className="availability-dot" aria-hidden="true" />
            Available for freelance / Remote worldwide
          </p>
          <h1>Bring clarity to your product.</h1>
          <p>
            If your SaaS product needs a launch film or purposeful UI motion,
            let&apos;s talk about what people need to understand—and how motion can
            make it click.
          </p>
        </header>

        <section className="contact-actions" aria-label="Contact options">
          <a
            className="primary-contact"
            href="https://calendly.com/chulda-graphics2022/30min"
            target="_blank"
            rel="noreferrer"
            aria-label="Schedule a discovery call, opens in a new tab"
          >
            <span>Primary</span>
            <strong>Schedule a discovery call</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="secondary-contact"
            href="mailto:chulda.graphics2022@gmail.com"
          >
            <span>Email</span>
            <strong>chulda.graphics2022@gmail.com</strong>
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="socials" aria-labelledby="socials-title">
          <h2 id="socials-title">Follow the work</h2>
          <div>
            {socials.map(([label, href], index) => (
              <a href={href} target="_blank" rel="noreferrer" key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
