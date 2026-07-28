const destinations = [
  { index: "01", label: "Work", href: "/work" },
  { index: "02", label: "Process", href: "/process" },
  { index: "03", label: "About", href: "/about" },
  { index: "04", label: "Contact", href: "/contact" },
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
              <a href={destination.href}>
                <span className="navigation-index" aria-hidden="true">
                  {destination.index}
                </span>
                <span>{destination.label}</span>
                <span className="navigation-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
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
