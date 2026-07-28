type SiteHeaderProps = {
  current?: "work" | "process" | "about" | "contact";
};

const navigation = [
  { label: "Work", href: "/work", key: "work" },
  { label: "Process", href: "/process", key: "process" },
  { label: "About", href: "/about", key: "about" },
  { label: "Contact", href: "/contact", key: "contact" },
] as const;

export function SiteHeader({ current }: SiteHeaderProps) {
  const currentLabel =
    navigation.find((item) => item.key === current)?.label ?? "Index";

  return (
    <header className="site-header">
      <div className="site-rail">
        <a className="site-wordmark" href="/" aria-label="Dhrex — homepage">
          Dhrex
        </a>
        <p className="site-rail-section">{currentLabel}</p>
      </div>

      <a className="site-mobile-wordmark" href="/" aria-label="Dhrex — homepage">
        Dhrex
      </a>

      <p className="site-discipline">SaaS Motion Designer</p>

      <nav aria-label="Primary navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={current === item.key ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
