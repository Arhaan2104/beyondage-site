"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { VIZ, VBW, VBH, type InstrumentKind } from "./journeyInstruments";
import { UPCOMING_SYSTEMS } from "./journeyGlyphs";

/**
 * The Health Journeys index — our version of beyondage.health/health-journeys/upcoming,
 * rebuilt in the site's editorial instrument system (not the source's dark neon-image
 * grid). A centred dark hero → a dark emerald catalogue where the three live
 * programmes render as their real instruments (ECG / glucose / hypnogram, matching
 * every other place they appear) and the forthcoming systems each carry a bespoke
 * hairline glyph → the single conversion. No invented clinical claims.
 */
const LIVE: { title: string; k: string; slug: string; idx: string; body: string; kind: InstrumentKind }[] = [
  {
    title: "Heart Health", k: "Heart & vascular", slug: "heart-health", idx: "01",
    body: "Advanced cardiovascular screening and precision biomarkers, to catch heart disease decades before symptoms appear.",
    kind: "cardiac",
  },
  {
    title: "Metabolic Health", k: "Glucose, insulin & liver", slug: "metabolic-health", idx: "02",
    body: "Precision testing that restores insulin sensitivity and energy metabolism, the dysfunction behind most chronic disease.",
    kind: "metabolic",
  },
  {
    title: "Sleep Health", k: "Recovery & brain", slug: "sleep-health", idx: "03",
    body: "Comprehensive sleep diagnostics and circadian-rhythm work to restore deep sleep, and protect brain and metabolic health.",
    kind: "sleep",
  },
];

export default function UpcomingJourneys() {
  const liveRef = useRef<HTMLDivElement>(null);

  // Draw the live instruments on when the grid scrolls into view (mirrors the
  // homepage Health Journeys section).
  useEffect(() => {
    const el = liveRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        <section className="section uj-catalog">
          <div className="measure">
            {/* Available now — the three live programmes, as their instruments */}
            <div className="reveal uj-head">
              <p className="eyebrow uj-head__k">Available now</p>
              <h2 className="chapter-title uj-head__title">Three programmes, live today.</h2>
            </div>

            <div className="jrny-grid uj-live-grid" ref={liveRef}>
              {LIVE.map((j) => {
                const Viz = VIZ[j.kind];
                return (
                  <a key={j.slug} className="jrny reveal" href={`/health-journeys/${j.slug}`}>
                    <div className="jrny__head">
                      <div>
                        <p className="jrny__k">{j.k}</p>
                        <h3 className="jrny__title">{j.title}</h3>
                      </div>
                      <span className="jrny__idx">{j.idx}</span>
                    </div>

                    <div className="jrny__inst">
                      <svg className="jinst" viewBox={`0 0 ${VBW} ${VBH}`} aria-hidden="true">
                        <Viz />
                      </svg>
                    </div>

                    <p className="jrny__body">{j.body}</p>

                    <span className="jrny__more">
                      Explore <span aria-hidden="true">&rarr;</span>
                    </span>
                  </a>
                );
              })}
            </div>

            {/* In development — a bespoke-glyph registry, set in its own recessed
                tray so it reads as a clearly separate section from the live three */}
            <div className="uj-soon-block">
              <div className="reveal uj-head uj-head--soon">
                <p className="eyebrow uj-head__k">In development</p>
                <h2 className="chapter-title uj-head__title">More systems, coming soon.</h2>
                <p className="lede uj-head__lede">
                  New journeys are added as the programme grows, each built to the same
                  clinical standard as the three above.
                </p>
              </div>

              <ul className="uj-soon-grid" aria-label="Health journeys in development">
                {UPCOMING_SYSTEMS.map((s) => (
                  <li key={s.name} className="uj-soon reveal">
                    <span className="uj-soon__inst" aria-hidden="true">
                      <svg className="uj-glyph" viewBox="0 0 40 40">{s.glyph}</svg>
                    </span>
                    <span className="uj-soon__meta">
                      <span className="uj-soon__k">{s.k}</span>
                      <span className="uj-soon__title">{s.name}</span>
                    </span>
                    <span className="uj-soon__tag">Coming soon</span>
                  </li>
                ))}
              </ul>
            </div>
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
