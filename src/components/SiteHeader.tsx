"use client";

import { useEffect, useRef, useState } from "react";

const LINKS: [string, string][] = [
  ["#journeys", "Health Journeys"],
  ["#team", "The Bench"],
  ["#how", "How it works"],
];

// Fuller set for the mobile menu — the site's real sections, in page order.
const MENU: [string, string][] = [
  ["#what-you-get", "What you get"],
  ["#team", "The Bench"],
  ["#journeys", "Health Journeys"],
  ["#how", "How it works"],
  ["#dashboard", "The Product"],
];

type Lenis = { stop?: () => void; start?: () => void; scrollTo?: (t: Element, o?: { offset?: number }) => void };
const getLenis = () => (window as unknown as { lenis?: Lenis }).lenis;

export default function SiteHeader() {
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the menu, handle Escape, and manage focus.
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop?.();
      document.documentElement.style.overflow = "hidden";
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
      window.addEventListener("keydown", onKey);
      wasOpen.current = true;
      return () => window.removeEventListener("keydown", onKey);
    }
    lenis?.start?.();
    document.documentElement.style.overflow = "";
    if (wasOpen.current) { toggleRef.current?.focus(); wasOpen.current = false; }
  }, [open]);

  // Close, then smooth-scroll to the section (Lenis if present, native otherwise).
  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.getElementById(href.slice(1));
    const lenis = getLenis();
    setOpen(false);
    lenis?.start?.();
    document.documentElement.style.overflow = "";
    if (!el) return;
    requestAnimationFrame(() => {
      if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -76 });
      else el.scrollIntoView({ behavior: "smooth" });
    });
    history.replaceState(null, "", href);
  };

  return (
    <>
      <header className={`nav${floating ? " is-floating" : ""}`}>
        <div className="nav__bar">
          <span className="nav__mark nav__mark--tl" aria-hidden="true" />
          <span className="nav__mark nav__mark--tr" aria-hidden="true" />
          <span className="nav__mark nav__mark--bl" aria-hidden="true" />
          <span className="nav__mark nav__mark--br" aria-hidden="true" />

          <a href="/" className="nav__logo" aria-label="BeyondAge — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="BeyondAge" className="nav__logo-img" />
          </a>

          <nav className="nav__links">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href}>
                <span className="nav__ico" aria-hidden="true" />
                {label}
              </a>
            ))}
          </nav>

          <a href="#invitation" className="nav__cta">
            Request an invitation
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span className="nav__toggle-box" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mnav${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="mnav__scrim" onClick={() => setOpen(false)} />
        <div className="mnav__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mnav__top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="BeyondAge" className="logo logo--ivory mnav__logo" />
            <button ref={closeRef} type="button" className="mnav__close" aria-label="Close menu" onClick={() => setOpen(false)}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <nav className="mnav__links">
            {MENU.map(([href, label], i) => (
              <a
                key={href + label}
                href={href}
                className="mnav__link"
                style={{ ["--i" as string]: String(i) }}
                onClick={(e) => go(e, href)}
              >
                <span className="mnav__idx" aria-hidden="true">{`0${i + 1}`}</span>
                {label}
              </a>
            ))}
          </nav>

          <div className="mnav__foot" style={{ ["--i" as string]: String(MENU.length) }}>
            <a href="#invitation" className="cta cta--gold mnav__cta" onClick={(e) => go(e, "#invitation")}>
              Request an invitation
            </a>
            <p className="mnav__contact">
              <a href="mailto:contactus@beyondage.health">contactus@beyondage.health</a>
              <span aria-hidden="true"> · </span>By invitation, Gurugram
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
