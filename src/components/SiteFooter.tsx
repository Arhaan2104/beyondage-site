"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Shared site footer. Content and links mirror the live beyondage.health footer
 * (newsletter, socials, Company / Legal / Contact, the signature base line),
 * rebuilt in our premium emerald-and-gold register.
 *
 * In-page anchors (#journeys, #team, …) resolve to the homepage: on "/" they stay
 * bare so SmoothScroll's Lenis handler catches them; on any other route they
 * become root-absolute ("/#journeys") so the browser navigates home and lands.
 */

// Exact social destinations from the live site.
const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/beyondage.health?igsh=ZzRlZXVrMnl5Z2Rh",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@beyondage.health",
    path: "M23.5 6.5a3 3 0 0 0-2.12-2.12C19.5 3.87 12 3.87 12 3.87s-7.5 0-9.38.51A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51A3 3 0 0 0 23.5 17.5 31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.24 3.6Z",
  },
  {
    name: "X",
    href: "https://x.com/beyondagehealth?s=20",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.7l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/beyondagehealth/",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 9.5h5.16V21H2.4Zm7.9 0h4.95v1.57h.07c.69-1.24 2.38-2.55 4.9-2.55 5.24 0 6.2 3.35 6.2 7.7V21h-5.16v-5.68c0-1.35-.02-3.1-1.89-3.1-1.9 0-2.19 1.48-2.19 3v5.78H10.3Z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1CpQbbj518/",
    path: "M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z",
  },
];

// Legal docs live on the canonical beyondage.health pages.
const LEGAL = [
  { label: "Privacy Policy", href: "https://beyondage.health/privacy-policy" },
  { label: "Terms of Service", href: "https://beyondage.health/terms-of-service" },
  { label: "Cookie Policy", href: "https://beyondage.health/cookie-policy" },
];

export default function SiteFooter() {
  const pathname = usePathname();
  const home = pathname === "/";
  const to = (hash: string) => (home ? hash : `/${hash}`);

  const onSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    window.location.href = `mailto:contactus@beyondage.health?subject=${encodeURIComponent(
      "Newsletter signup"
    )}&body=${encodeURIComponent(`Please add ${email ?? ""} to the BeyondAge newsletter.`)}`;
  };

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

          <form className="footer__news" onSubmit={onSubscribe}>
            <label htmlFor="footer-news" className="footer__news-label">
              Sign up for our newsletter
            </label>
            <div className="footer__news-field">
              <input
                id="footer-news"
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
              />
              <button type="submit">Subscribe</button>
            </div>
          </form>

          <div className="footer__social">
            <span className="footer__social-label">Follow us</span>
            <div className="footer__social-row">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer__social-link"
                  aria-label={s.name}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor" d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Company</h4>
            <a href={to("#how")}>How it works</a>
            <a href={to("#journeys")}>Health Journeys</a>
            <Link href="/our-team">Our team</Link>
            <Link href="/begin-journey">Begin your journey</Link>
          </div>
          <div className="footer__col">
            <h4>Legal</h4>
            {LEGAL.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <a href="mailto:contactus@beyondage.health">contactus@beyondage.health</a>
            <span>Gurugram, India</span>
            <span>Available: 9:00 AM &ndash; 8:00 PM (Mon&ndash;Sat)</span>
            <Link href="/begin-journey">Contact us</Link>
          </div>
        </div>
      </div>

      <div className="footer__base measure">
        <span>&copy; 2026 BeyondAge. All rights reserved.</span>
        <span className="footer__sig">Built by top physicians. Powered by clinical science.</span>
      </div>
    </footer>
  );
}
