"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "/", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    if (open) {
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Link className="wordmark" href="/" aria-label="Dhrex, work index">
        Dhrex
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/work/")
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <a
        className="header-cta"
        href="https://calendly.com/chulda-graphics2022/30min"
        target="_blank"
        rel="noreferrer"
      >
        <span className="availability-dot" aria-hidden="true" />
        Book a call
      </a>

      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <div
        ref={menuRef}
        className="mobile-menu"
        id="mobile-navigation"
        data-open={open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link href={item.href} key={item.href} tabIndex={open ? 0 : -1}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-meta">
          <p>Remote worldwide</p>
          <p>Available for freelance</p>
        </div>
      </div>
    </header>
  );
}
