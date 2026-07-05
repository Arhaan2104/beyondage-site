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
  chan: string;
  unit: string;
  body: string;
  chips: string[];
  kind: InstrumentKind;
};
const JOURNEYS: Journey[] = [
  {
    idx: "01", k: "Heart & vascular", title: "Cardiac", slug: "heart-health",
    chan: "ECG · Lead II", unit: "mV",
    body: "Advanced cardiovascular screening and precision biomarkers — to detect and prevent heart disease decades before symptoms appear.",
    chips: ["Calcium score", "AI-aided CT Angio", "Focused Genome"],
    kind: "cardiac",
  },
  {
    idx: "02", k: "Glucose, insulin & liver", title: "Metabolic", slug: "metabolic-health",
    chan: "Glucose · Response", unit: "mg/dL",
    body: "Precision metabolic testing that restores insulin sensitivity and energy metabolism — the dysfunction behind most chronic disease, found early.",
    chips: ["Insulin sensitivity", "Autonomic analysis", "Retinal screening"],
    kind: "metabolic",
  },
  {
    idx: "03", k: "Recovery & brain", title: "Sleep", slug: "sleep-health",
    chan: "Hypnogram · 7 h", unit: "stage",
    body: "Comprehensive sleep diagnostics and circadian-rhythm optimisation — to restore deep sleep, and protect brain and metabolic health.",
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
          <p className="eyebrow chapter-eyebrow">Health Journeys</p>
          <h2 className="chapter-title">
            The body, read in <em>depth</em> — long before anything goes wrong.
          </h2>
          <p className="lede jrny-lede">
            <span className="jrny-lede__line">
              Three deep programmes read the signal across heart, metabolism and sleep,
            </span>
            <span className="jrny-lede__line">and help you act in time.</span>
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
                  <div className="jrny__strip">
                    <span className="jrny__chan">
                      <i className="jrny__live" /> {j.chan}
                    </span>
                    <span className="jrny__unit">{j.unit}</span>
                  </div>
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
          Illustrative signal traces — not BeyondAge data. The diagnostics each
          journey names are drawn from beyondage.health/health-journeys.
        </p>
      </div>
    </section>
  );
}
