import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="availability-dot" aria-hidden="true" />
        Available for freelance projects
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <a
          href="https://calendly.com/chulda-graphics2022/30min"
          target="_blank"
          rel="noreferrer"
        >
          Schedule a call ↗
        </a>
      </nav>
      <p>© {new Date().getFullYear()} Dhrex</p>
    </footer>
  );
}
