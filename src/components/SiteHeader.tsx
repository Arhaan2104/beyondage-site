"use client";

import { useEffect, useState } from "react";

const LINKS: [string, string][] = [
  ["#journeys", "Health Journeys"],
  ["#team", "The Bench"],
  ["#how", "How it works"],
];

export default function SiteHeader() {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
      </div>
    </header>
  );
}
