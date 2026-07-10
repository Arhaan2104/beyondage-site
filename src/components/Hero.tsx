import Link from "next/link";

/**
 * Full-viewport cinematic hero: the diagnostic-suite film runs subtle and
 * emerald-graded across the whole viewport; a liquid-glass pane floats in
 * front of it (inset, gold hairline, specular streak), and the copy sits
 * centred on the glass — a locked two-line headline, two-line practice
 * line, the gold chevron CTA scaled up, and the Padma credential as quiet
 * proof. Reduced-motion users get the graded poster.
 * (`hero-scene`, distinct from the founder film's `hero-media` housing.)
 */
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-scene" aria-hidden="true">
        <video
          className="hero-scene__video"
          src="/assets/hero-longevity-film.mp4"
          poster="/assets/hero-longevity-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-scene__poster"
          src="/assets/hero-longevity-poster.jpg"
          alt=""
          draggable={false}
        />
        <span className="hero-scene__grade" />
        <span className="hero-scene__scrim" />
        <span className="hero-scene__grain" />
        <span className="hero-scene__vignette" />
      </div>

      <div className="hero-glass" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <span className="hero-eyebrow__mark" aria-hidden="true" />
            By invitation
          </p>
          <h1 className="hero-h1">
            <span className="hero-h1__line">We treat the disease</span>{" "}
            <span className="hero-h1__line">you <em>don&rsquo;t have yet</em>.</span>
          </h1>
          <p className="hero-sub">
            A members-only longevity practice in Gurugram.<br />
            {" "}We find risks early and design the years ahead.
          </p>
          <div className="hero-actions">
            <Link href="/begin-journey" className="hero-cta">
              Begin your journey
            </Link>
          </div>
          <p className="hero-cred">
            <span className="hero-cred__seal" aria-hidden="true" />
            A longevity platform built by a team of<br />
            {" "}India&rsquo;s top <em>Padma awardee</em> physicians.
          </p>
        </div>
      </div>
    </section>
  );
}
