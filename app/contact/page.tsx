import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a SaaS motion design project with Dhrex or schedule a discovery call.",
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
    <main className="page-shell contact-page">
      <SiteHeader current="contact" />

      <section className="contact-main" aria-labelledby="contact-title">
        <p className="eyebrow">Contact / Remote worldwide</p>
        <h1 id="contact-title">
          Let&apos;s give your software a clearer visual voice.
        </h1>

        <div className="contact-actions">
          <a
            className="contact-primary"
            href="https://calendly.com/chulda-graphics2022/30min"
            target="_blank"
            rel="noreferrer"
          >
            Schedule a discovery call ↗
          </a>
          <a href="mailto:chulda.graphics2022@gmail.com">
            chulda.graphics2022@gmail.com ↗
          </a>
        </div>
      </section>

      <footer className="contact-footer">
        <div>
          <p className="eyebrow">Social</p>
          <ul>
            {socials.map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p>Freelance / SaaS motion / 2026</p>
        <p>© Dhrex Cañezo</p>
      </footer>
    </main>
  );
}
