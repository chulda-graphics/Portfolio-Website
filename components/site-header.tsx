"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookingButton } from "./booking-button";

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
    document.body.dataset.menuOpen = open ? "true" : "false";
    let focusTimer = 0;
    if (open) {
      focusTimer = window.setTimeout(() => {
        menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      }, 0);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && open) {
        const menuItems = Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
        );
        const first = toggleRef.current;
        const last = menuItems.at(-1);
        if (event.shiftKey && document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last && first) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Link className="wordmark" href="/" aria-label="Dhrex, work index" onClick={() => setOpen(false)}>
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
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <BookingButton
        className="header-cta"
        data-cursor="Book"
      >
        <span className="availability-dot" aria-hidden="true" />
        Book a call
      </BookingButton>

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
            <Link
              href={item.href}
              key={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-meta">
          <p>Remote worldwide</p>
          <p>Available for freelance</p>
        </div>
        <BookingButton className="mobile-booking-button" onClick={() => setOpen(false)}>
          Schedule a discovery call
        </BookingButton>
      </div>
    </header>
  );
}
