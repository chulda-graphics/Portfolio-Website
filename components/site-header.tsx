import Link from "next/link";

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
  return (
    <header className="site-header">
      <Link className="site-mobile-wordmark" href="/" aria-label="Dhrex — homepage">
        Dhrex
      </Link>

      <p className="site-discipline">SaaS Motion Designer</p>

      <nav aria-label="Primary navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current === item.key ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
