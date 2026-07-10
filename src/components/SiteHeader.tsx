"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type SubItem = { title: string; sub: string; href?: string; idx?: string };
type NavLink = {
  href: string;
  label: string;
  menu?: { eyebrow: string; items: SubItem[]; foot: { label: string; href: string } };
};

// The three primary nav destinations, each with a considered dropdown:
// Health Journeys links straight to the three real program pages; The Bench and
// How it works preview their contents and hand off to the full section/page.
const LINKS: NavLink[] = [
  {
    href: "#journeys",
    label: "Health Journeys",
    menu: {
      eyebrow: "Programs",
      items: [
        { title: "Heart Health", sub: "Read the signal early, act before it arrives.", href: "/health-journeys/heart-health" },
        { title: "Metabolic Health", sub: "Caught early, dysfunction can be reversed.", href: "/health-journeys/metabolic-health" },
        { title: "Sleep Health", sub: "Deepen the quality of your recovery.", href: "/health-journeys/sleep-health" },
      ],
      foot: { label: "All health journeys", href: "#journeys" },
    },
  },
  {
    href: "#team",
    label: "The Bench",
    menu: {
      eyebrow: "The physicians",
      items: [
        { title: "Dr Arvinder Soin", sub: "Founder & Chairman", href: "/our-team/dr-arvind-soin" },
        { title: "Dr Vritti Lamba", sub: "Longevity Physician", href: "/our-team/dr-vritti-lamba" },
        { title: "Dr Vinayak Agrawal", sub: "Medical Director, Preventive Cardiology", href: "/our-team/dr-vinayak-agarwal" },
      ],
      foot: { label: "Meet the full bench", href: "/our-team" },
    },
  },
  {
    href: "#how",
    label: "How it works",
    menu: {
      eyebrow: "The process",
      items: [
        { title: "Discovery call", sub: "Map your goals with our team.", idx: "01" },
        { title: "Consultation", sub: "Meet your longevity physician.", idx: "02" },
        { title: "Diagnostics", sub: "Labs, imaging, biomarkers, genomics.", idx: "03" },
        { title: "Your plan", sub: "A precision optimisation plan.", idx: "04" },
        { title: "Monitoring", sub: "Ongoing follow-up and adjustment.", idx: "05" },
      ],
      foot: { label: "See the full process", href: "#how" },
    },
  },
];

// Fuller set for the mobile menu — the site's real sections, in page order.
const MENU: [string, string][] = [
  ["#what-you-get", "What you get"],
  ["#healthspan", "Healthspan"],
  ["#journeys", "Health Journeys"],
  ["#how", "How it works"],
  ["#team", "The Bench"],
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
  // On the homepage the nav starts as the dark-blueprint variant over the
  // cinematic hero (see .nav--onhero) and floats on scroll; every other route
  // has a dark hero with no variant, so the nav floats immediately.
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
      <header className={`nav${floating ? " is-floating" : ""}${home ? " nav--onhero" : ""}`}>
        <div className="nav__bar">
          <Link href="/" className="nav__logo" aria-label="BeyondAge home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="BeyondAge" className="nav__logo-img" />
          </Link>

          <nav className="nav__links">
            {LINKS.map(({ href, label, menu }) => (
              <div className="nav__item" key={href}>
                <a
                  href={to(href)}
                  className="nav__link"
                  aria-haspopup={menu ? "menu" : undefined}
                >
                  {label}
                  {menu && (
                    <svg className="nav__caret" viewBox="0 0 10 6" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </a>

                {menu && (
                  <div className="nav__menu" role="menu" aria-label={label}>
                    <div className="nav__menu-card">
                      <p className="nav__menu-eyebrow">{menu.eyebrow}</p>
                      <div className="nav__menu-list">
                        {menu.items.map((it) => {
                          const inner = (
                            <>
                              {it.idx ? (
                                <span className="nav__menu-idx" aria-hidden="true">{it.idx}</span>
                              ) : (
                                <span className="nav__menu-dot" aria-hidden="true" />
                              )}
                              <span className="nav__menu-tt">
                                <span className="nav__menu-title">{it.title}</span>
                                <span className="nav__menu-sub">{it.sub}</span>
                              </span>
                              {it.href && (
                                <span className="nav__menu-arrow" aria-hidden="true">&rarr;</span>
                              )}
                            </>
                          );
                          return it.href ? (
                            <a key={it.title} href={it.href} className="nav__menu-row" role="menuitem">
                              {inner}
                            </a>
                          ) : (
                            <div key={it.title} className="nav__menu-row nav__menu-row--static">
                              {inner}
                            </div>
                          );
                        })}
                      </div>
                      <a
                        href={menu.foot.href.startsWith("#") ? to(menu.foot.href) : menu.foot.href}
                        className="nav__menu-foot"
                        role="menuitem"
                      >
                        {menu.foot.label}
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
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
