import { BookingButton } from "./booking-button";

const socialLinks = [
  ["Instagram", "https://www.instagram.com/dhrex.in.motion/"],
  ["TikTok", "https://www.tiktok.com/@dhrex.in.motion"],
  ["LinkedIn", "https://www.linkedin.com/in/dhrex-ca%C3%B1ezo/"],
  ["X", "https://x.com/dhrexinmotion"],
  ["Facebook", "https://www.facebook.com/canezo.dhrex/"],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="availability-dot" aria-hidden="true" />
        Available for freelance projects
      </div>
      <nav aria-label="Social links">
        {socialLinks.map(([label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" key={label}>
            {label} ↗
          </a>
        ))}
      </nav>
      <BookingButton className="footer-booking">Schedule a call</BookingButton>
      <p>© {new Date().getFullYear()} Dhrex</p>
    </footer>
  );
}
