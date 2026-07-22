"use client";

import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BOOKING_EVENT = "dhrex:open-booking";

export function openBooking() {
  window.dispatchEvent(new Event(BOOKING_EVENT));
}

export function MotionSystem() {
  const pathname = usePathname();
  const router = useRouter();
  const [transition, setTransition] = useState<"idle" | "covering" | "revealing">("idle");
  const [bookingOpen, setBookingOpen] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const navigationPending = useRef(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
    });
    let frame = 0;
    const render = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const updateHeader = () => {
      document.body.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      delete document.body.dataset.scrolled;
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  useEffect(() => {
    if (!navigationPending.current) return;
    navigationPending.current = false;
    setTransition("revealing");
    transitionTimer.current = window.setTimeout(() => setTransition("idle"), 720);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        transition !== "idle"
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target || anchor.download || anchor.dataset.noTransition === "true") return;

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname ||
        destination.protocol === "mailto:" ||
        destination.protocol === "tel:"
      ) {
        return;
      }

      event.preventDefault();
      navigationPending.current = true;
      setTransition("covering");
      transitionTimer.current = window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, 430);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    };
  }, [router, transition]);

  useEffect(() => {
    const showBooking = () => setBookingOpen(true);
    window.addEventListener(BOOKING_EVENT, showBooking);
    return () => window.removeEventListener(BOOKING_EVENT, showBooking);
  }, []);

  useEffect(() => {
    if (!bookingOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.dataset.modalOpen = "true";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBookingOpen(false);
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>("button, iframe, [href], input, select, textarea")]
        .filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      delete document.body.dataset.modalOpen;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [bookingOpen]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches || !cursor.current) return;

    let pointerX = -100;
    let pointerY = -100;
    let renderedX = -100;
    let renderedY = -100;
    let frame = 0;

    const draw = () => {
      renderedX += (pointerX - renderedX) * 0.18;
      renderedY += (pointerY - renderedY) * 0.18;
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${renderedX}px, ${renderedY}px, 0)`;
      }
      frame = requestAnimationFrame(draw);
    };
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.current?.setAttribute("data-visible", "true");
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>("a, button, input, textarea, select, [data-cursor]");
      const label = interactive?.dataset.cursor ?? "";
      cursor.current?.setAttribute("data-active", interactive ? "true" : "false");
      if (cursorLabel.current) cursorLabel.current.textContent = label;
    };
    const onLeave = () => cursor.current?.setAttribute("data-visible", "false");

    frame = requestAnimationFrame(draw);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="route-transition" data-phase={transition} aria-hidden="true">
        <span>Dhrex</span>
        <span>Clarity in motion</span>
      </div>

      <div ref={cursor} className="custom-cursor" data-visible="false" aria-hidden="true">
        <span ref={cursorLabel} />
      </div>

      {bookingOpen ? (
        <div
          className="booking-backdrop"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setBookingOpen(false);
          }}
        >
          <div
            ref={dialog}
            className="booking-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <div className="booking-heading">
              <div>
                <p className="eyebrow">30 minutes / Discovery</p>
                <h2 id="booking-title">Schedule a call</h2>
              </div>
              <button ref={closeButton} type="button" onClick={() => setBookingOpen(false)}>
                Close
              </button>
            </div>
            <iframe
              src="https://calendly.com/chulda-graphics2022/30min?embed_type=Inline&hide_gdpr_banner=1&background_color=080808&text_color=f5f5f2&primary_color=f5f5f2"
              title="Schedule a discovery call with Dhrex"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
