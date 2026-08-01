import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Work", "/work"],
  ["Process", "/process"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function SiteNav({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={`inner-nav-wrap${inverse ? " inverse" : ""}`}>
      <nav className="inner-nav" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Chulda home"><span>C</span> CHULDA</Link>
        <div className="inner-nav-links">{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
        <Link className="nav-contact" href="/contact">Start a project <b aria-hidden="true">↗</b></Link>
      </nav>
    </header>
  );
}

export function SiteFooter({ nextLabel = "Make your product click.", nextHref = "/contact" }: { nextLabel?: string; nextHref?: string }) {
  return (
    <footer className="route-footer">
      <div className="route-footer-top"><span>Available for select collaborations</span><span>SaaS / AI / Digital products</span></div>
      <Link className="route-footer-cta" href={nextHref}>{nextLabel}<b aria-hidden="true">↗</b></Link>
      <div className="route-footer-bottom"><span>© 2026 Chulda</span><div><a href="https://linkedin.com" rel="noreferrer">LinkedIn</a><a href="https://behance.net" rel="noreferrer">Behance</a><a href="https://instagram.com" rel="noreferrer">Instagram</a></div><a href="mailto:hello@chulda.graphics">hello@chulda.graphics</a></div>
    </footer>
  );
}
