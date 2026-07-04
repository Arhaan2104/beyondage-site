import Instrument, { type InstrumentVariant } from "@/components/Instrument";

/**
 * "What you get" — the concrete deliverables of a BeyondAge membership. Every
 * item is drawn from beyondage.health (the five-step process, the 5-P framework,
 * the real member dashboard). Each card carries an animated diagnostic-instrument
 * visual (see Instrument.tsx) — the practice's own thesis: the body, read in depth.
 */
const ITEMS: { variant: InstrumentVariant; title: string; text: string }[] = [
  {
    variant: "scan",
    title: "Advanced diagnostics",
    text: "Lab tests, imaging, biomarkers, genomics and AI-driven interpretations — curated for the early detection of disease risk.",
  },
  {
    variant: "network",
    title: "A longevity specialist bench",
    text: "A dedicated longevity physician, backed by a bench of internationally renowned specialists across every system.",
  },
  {
    variant: "signal",
    title: "A deep biomarker profile",
    text: "Markers like ApoB, HbA1c and HRV, read against your own baseline and tracked as they move over time.",
  },
  {
    variant: "protocol",
    title: "A precision health plan",
    text: "A personalised optimisation plan combining lifestyle interventions and proven anti-aging treatments — your protocol, not a template.",
  },
  {
    variant: "gauge",
    title: "Healthspan and biological age",
    text: "Your BeyondAge Healthspan Score and biological age — the whole picture, made legible and tracked.",
  },
  {
    variant: "flow",
    title: "Continuity of care & monitoring",
    text: "Coaches and a health team who follow up regularly and adjust your plan — so the gains hold and compound.",
  },
];

export default function WhatYouGet() {
  return (
    <section className="section wyg" id="what-you-get">
      <div className="measure">
        <div className="reveal wyg-head">
          <p className="eyebrow chapter-eyebrow">What you get</p>
          <h2 className="chapter-title wyg-title">
            Everything you need to age on your <em>own terms</em>.
          </h2>
          <p className="lede">
            Not a one-time report. A physician-led system — diagnostics, a plan, and a
            team — that reads your health in depth and keeps optimising it.
          </p>
        </div>
        <div className="wyg-grid">
          {ITEMS.map((it) => (
            <article key={it.title} className="wyg-card reveal">
              <div className={`wyg-viz wyg-viz--${it.variant}`}>
                <Instrument variant={it.variant} />
              </div>
              <div className="wyg-card__body">
                <h3 className="wyg-card__title">{it.title}</h3>
                <p className="wyg-card__text">{it.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
