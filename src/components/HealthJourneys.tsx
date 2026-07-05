"use client";

import { useEffect, useRef } from "react";
import { VIZ, VBW, VBH, type InstrumentKind } from "./journeyInstruments";

/**
 * Health Journeys — the body, read in depth.
 *
 * Three deep programmes, each rendered as a bespoke, medically-literal
 * instrument (see journeyInstruments.tsx for the shared engine): a Lead-II ECG,
 * a post-meal glucose response, and an overnight hypnogram. Each trace draws
 * itself on when the grid scrolls into view and a short gold pulse then travels
 * the signal. The traces are illustrative diagrams; the readout chips name the
 * real markers each programme measures (per beyondage.health).
 */

type Journey = {
  idx: string;
  k: string;
  title: string;
  slug: string;
  body: string;
  chips: string[];
  kind: InstrumentKind;
};
const JOURNEYS: Journey[] = [
  {
    idx: "01", k: "Heart & vascular", title: "Cardiac", slug: "heart-health",
    body: "Advanced cardiovascular screening and precision biomarkers, to catch heart disease decades before symptoms appear.",
    chips: ["Calcium score", "AI-aided CT Angio", "Focused Genome"],
    kind: "cardiac",
  },
  {
    idx: "02", k: "Glucose, insulin & liver", title: "Metabolic", slug: "metabolic-health",
    body: "Precision testing that restores insulin sensitivity and energy metabolism, the dysfunction behind most chronic disease.",
    chips: ["Insulin sensitivity", "Autonomic analysis", "Retinal screening"],
    kind: "metabolic",
  },
  {
    idx: "03", k: "Recovery & brain", title: "Sleep", slug: "sleep-health",
    body: "Comprehensive sleep diagnostics and circadian-rhythm work to restore deep sleep, and protect brain and metabolic health.",
    chips: ["Polysomnography", "HRV", "Psychomotor vigilance"],
    kind: "sleep",
  },
];

export default function HealthJourneys() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
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
    <section className="section warm" id="journeys">
      <div className="measure">
        <div className="reveal jrny-head">
          <h2 className="chapter-title jrny-title">
            <span className="jrny-title__line">The body, read in <em>depth</em>,</span>
            <span className="jrny-title__line">long before anything goes wrong.</span>
          </h2>
          <p className="lede jrny-lede">
            <span className="jrny-lede__line">
              Three programmes that read signals across heart, metabolism, and sleep
            </span>
            <span className="jrny-lede__line">to help you act in time.</span>
          </p>
        </div>

        <div className="jrny-grid" ref={gridRef}>
          {JOURNEYS.map((j) => {
            const Viz = VIZ[j.kind];
            return (
              <a key={j.title} className="jrny reveal" href={`/health-journeys/${j.slug}`}>
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

                <div className="jrny__reads">
                  {j.chips.map((c) => (
                    <span key={c} className="jrny__chip">{c}</span>
                  ))}
                </div>

                <span className="jrny__more">
                  Begin your journey <span aria-hidden="true">→</span>
                </span>
              </a>
            );
          })}
        </div>

        <p className="jrny-note reveal">
          Illustrative traces. The diagnostics each journey names are drawn from
          beyondage.health.
        </p>
      </div>
    </section>
  );
}
