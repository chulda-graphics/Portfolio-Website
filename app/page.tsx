import Link from "next/link";

const destinations = [
  {
    index: "01",
    label: "Work",
    href: "/work",
    note: "Selected motion and launch films",
  },
  {
    index: "02",
    label: "Process",
    href: "/process",
    note: "From product understanding to delivery",
  },
  {
    index: "03",
    label: "About",
    href: "/about",
    note: "A precise, purpose-led practice",
  },
  {
    index: "04",
    label: "Contact",
    href: "/contact",
    note: "Start a project with Dhrex",
  },
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <header className="home-header">
        <p className="home-name">Dhrex</p>
        <p className="home-role">Premium SaaS Motion Graphics</p>
      </header>

      <nav className="home-navigation" aria-label="Portfolio sections">
        <ul>
          {destinations.map((destination) => (
            <li key={destination.href}>
              <Link href={destination.href}>
                <span className="navigation-meta">
                  <span className="navigation-index" aria-hidden="true">
                    {destination.index}
                  </span>
                  <span className="navigation-note">{destination.note}</span>
                </span>
                <span className="navigation-label">
                  {destination.label}
                  <span className="navigation-arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="home-footer">
        <p>Independent portfolio / 2026</p>
        <p>Remote worldwide</p>
      </footer>
    </main>
  );
}
