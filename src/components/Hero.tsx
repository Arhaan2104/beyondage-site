import Link from "next/link";

/**
 * Editorial hero: the value proposition, left. The right-hand media slot is
 * intentionally empty for now — a reworked hero visual is coming — so the layout
 * collapses to a single column and the headline holds the frame on its own.
 */
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg__base" />
        <div className="hero-bg__engrave" />
        <div className="hero-bg__glow hero-bg__glow--1" />
        <div className="hero-bg__glow hero-bg__glow--2" />
        <div className="hero-bg__glow hero-bg__glow--3" />
        <div className="hero-bg__grain" />
        <div className="hero-bg__sheen" />
        <div className="hero-bg__vignette" />
      </div>

      <div className="hero-inner">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">By invitation</p>
          <h1 className="hero-h1">
            We treat the disease you <em>don&rsquo;t have yet</em>.
          </h1>
          <p className="hero-sub">
            A members-only longevity practice in Gurugram.<br />
            We find risks early and design the years ahead.
          </p>
          <div className="hero-actions">
            <Link href="/begin-journey" className="cta cta--emerald">
              Begin your journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
