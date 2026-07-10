import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

/**
 * The Health Journeys index — our version of beyondage.health/health-journeys/upcoming,
 * rebuilt in the site's editorial system rather than the source's neon-image grid.
 * Structure: centred dark hero → light catalogue (Available now → In development)
 * → the single conversion. The three live programmes link out; the forthcoming
 * ones read as a calm, forthcoming registry (no invented clinical claims).
 */
const LIVE: { title: string; k: string; slug: string }[] = [
  { title: "Heart Health", k: "Heart & vascular", slug: "heart-health" },
  { title: "Metabolic Health", k: "Glucose, insulin & liver", slug: "metabolic-health" },
  { title: "Sleep Health", k: "Recovery & brain", slug: "sleep-health" },
];

// Verbatim from the live site's coming-soon grid, in order.
const UPCOMING: string[] = [
  "Brain Health",
  "Cancer Prevention",
  "Gut Health",
  "Liver Health",
  "Lung Health",
  "Musculoskeletal Fitness",
  "Sexual Health",
  "Mental Health",
  "Aesthetics",
  "Men's Health",
  "Women's Health",
  "Mindfulness",
  "Detox",
];

export default function UpcomingJourneys() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ---- Hero ---- */}
        <section className="jp-hero uj-hero">
          <div className="jp-hero__bg" aria-hidden="true">
            <div className="pp-hero__grid" />
            <div className="jp-hero__grain" />
          </div>
          <div className="measure uj-hero__inner">
            <p className="eyebrow jp-hero__eyebrow uj-hero__eyebrow">
              <Link href="/#journeys" className="jp-hero__crumb">Health Journeys</Link>
            </p>
            <h1 className="jp-hero__title uj-hero__title">
              The whole body,<br />one system at a time.
            </h1>
            <p className="jp-hero__lede uj-hero__lede">
              Precision-designed journeys across every vital system &mdash; advanced
              diagnostics, cutting-edge science and personalised interventions to
              help you stay ahead of disease and optimise lifelong performance.
            </p>
          </div>
        </section>

        {/* ---- Catalogue: available now, then in development ---- */}
        <section className="section jp-related uj-catalog">
          <div className="measure">
            {/* Available now */}
            <div className="reveal uj-head">
              <p className="eyebrow uj-head__k">Available now</p>
              <h2 className="chapter-title uj-head__title">Three programmes, live today.</h2>
            </div>
            <div className="uj-live-grid">
              {LIVE.map((j) => (
                <a
                  key={j.slug}
                  href={`/health-journeys/${j.slug}`}
                  className="jp-related__card reveal"
                >
                  <span className="jp-related__k">{j.k}</span>
                  <span className="jp-related__title">{j.title}</span>
                  <span className="jp-related__more">
                    Explore <span aria-hidden="true">&rarr;</span>
                  </span>
                </a>
              ))}
            </div>

            {/* In development */}
            <div className="reveal uj-head uj-head--soon">
              <p className="eyebrow uj-head__k">In development</p>
              <h2 className="chapter-title uj-head__title">More systems, coming soon.</h2>
              <p className="lede uj-head__lede">
                New journeys are added as the programme grows, each built to the same
                clinical standard as the three above.
              </p>
            </div>
            <ul className="uj-soon-grid" aria-label="Health journeys in development">
              {UPCOMING.map((name) => (
                <li key={name} className="uj-soon reveal">
                  <span className="uj-soon__title">{name}</span>
                  <span className="uj-soon__tag">Coming soon</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- The invitation (single conversion) ---- */}
        <section className="section jp-cta" id="invitation">
          <div className="jp-cta__bg" aria-hidden="true"><div className="jp-cta__grain" /></div>
          <div className="measure jp-cta__inner reveal">
            <p className="eyebrow jp-cta__eyebrow">By invitation, Gurugram</p>
            <h2 className="jp-cta__title">Ready to begin your journey?</h2>
            <p className="jp-cta__body">
              Schedule a consultation with our Healthcare Coordinator to discover how
              BeyondAge can optimise your health.
            </p>
            <Link href="/begin-journey" className="cta cta--chevron jp-cta__btn">Begin your journey</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
