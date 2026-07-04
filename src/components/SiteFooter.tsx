"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Shared site footer. In-page anchors (#journeys, #team, …) resolve to the
 * homepage: on "/" they stay bare so SmoothScroll's Lenis handler catches them;
 * on any other route they become root-absolute ("/#journeys") so the browser
 * navigates home and lands on the section.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const home = pathname === "/";
  const to = (hash: string) => (home ? hash : `/${hash}`);

  return (
    <footer className="footer">
      <div className="footer__inner measure">
        <div className="footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="BeyondAge" className="logo logo--ivory footer__logo" />
          <p>
            A physician-led preventive and longevity practice for those who intend
            to age on their own terms.
          </p>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <h4>Practice</h4>
            <a href={to("#journeys")}>Health Journeys</a>
            <a href={to("#team")}>The Bench</a>
            <a href={to("#how")}>How it works</a>
            <Link href="/begin-journey">Begin your journey</Link>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <a href="mailto:contactus@beyondage.health">contactus@beyondage.health</a>
            <span>Gurugram, India</span>
            <span>9:00 – 20:00 · Mon–Sat</span>
          </div>
          <div className="footer__col">
            <h4>Follow</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>
      <div className="footer__base measure">
        <span>© 2026 BeyondAge. All rights reserved.</span>
        <span className="footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </span>
      </div>
    </footer>
  );
}
