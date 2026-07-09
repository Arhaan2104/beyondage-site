"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

type Lenis = { stop?: () => void; start?: () => void; scrollTo?: (t: Element | number, o?: { offset?: number }) => void };
const getLenis = () => (window as unknown as { lenis?: Lenis }).lenis;
const anchorTarget = (el: Element) =>
  window.scrollY + el.getBoundingClientRect().top - 16;

export default function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  // On the homepage keep bare "#section" so SmoothScroll's Lenis handler catches
  // it; on any other route make it root-absolute so the browser navigates home.
  const to = (hash: string) => (home ? hash : `/${hash}`);
  // The homepage hero is light paper (nav floats only on scroll); every other
  // route has a dark hero, so the nav floats immediately for legibility.
  const [floating, setFloating] = useState(!home);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setFloating(!home || window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

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
  // `hash` is always the bare "#section". Off the homepage we let the anchor's
  // /#section href navigate home; on the homepage we smooth-scroll in place.
  const go = (e: React.MouseEvent, hash: string) => {
    const lenis = getLenis();
    setOpen(false);
    lenis?.start?.();
    document.documentElement.style.overflow = "";
    if (!home) return;
    e.preventDefault();
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    requestAnimationFrame(() => {
      if (lenis?.scrollTo) lenis.scrollTo(anchorTarget(el));
      else window.scrollTo({ top: anchorTarget(el), behavior: "smooth" });
    });
    history.replaceState(null, "", hash);
  };

  return (
    <>
      <header className={`nav${floating ? " is-floating" : ""}`}>
        <div className="nav__bar">
          <span className="nav__mark nav__mark--tl" aria-hidden="true" />
          <span className="nav__mark nav__mark--tr" aria-hidden="true" />
          <span className="nav__mark nav__mark--bl" aria-hidden="true" />
          <span className="nav__mark nav__mark--br" aria-hidden="true" />

          <Link href="/" className="nav__logo" aria-label="BeyondAge home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="BeyondAge" className="nav__logo-img" />
          </Link>

          <nav className="nav__links">
            {LINKS.map(([href, label]) => (
              <a key={href} href={to(href)}>
                <span className="nav__ico" aria-hidden="true" />
                {label}
              </a>
            ))}
          </nav>

          <Link href="/begin-journey" className="nav__cta">
            Begin your journey
          </Link>

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
                href={to(href)}
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
            <Link href="/begin-journey" className="cta cta--gold mnav__cta" onClick={() => setOpen(false)}>
              Begin your journey
            </Link>
            <p className="mnav__contact">
              <a href="mailto:contactus@beyondage.health">contactus@beyondage.health</a>
              <span className="mnav__contact-sub">By invitation, Gurugram</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
