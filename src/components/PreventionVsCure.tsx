"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Why not a normal check-up" — the predict-vs-cure thesis.
 *
 * The contrast is drawn, not tabled: the reactive annual check-up (a flat trace
 * that only blips once disease has arrived) set against BeyondAge (a live,
 * continuously-read signal on a glossy dark instrument card). Then the five P's
 * of the framework as a living spine — stations light in sequence and a gold
 * pulse keeps flowing through it. Reduced-motion shows the finished state.
 */
const USUAL = [
  "Looks for disease only once it has arrived",
  "One snapshot, read against population averages",
  "Nothing changes until symptoms do",
];

const BEYOND = [
  "Predicts risk early from your biomarkers, genetics and lifestyle",
  "Read against your own trajectory, tracked over time",
  "AI interpretation, read by a specialist bench",
  "Continuity of care, adjusted as you go",
];

const FIVE_P = [
  { p: "Predict", body: "Your future risks, read from your genetics, biomarkers and lifestyle." },
  { p: "Prevent", body: "Proactive, science-led interventions that delay decline." },
  { p: "Personalise", body: "Interventions crafted for you, from cellular signals to daily rhythms." },
  { p: "Participate", body: "Real-time data and expert guidance, so you own the journey." },
  { p: "Purposeful", body: "Physical, mental, emotional and spiritual health, lived with depth." },
];

/* the reactive trace: flat, then one late QRS blip, then flat — "detects too late" */
const FLAT = "M6 22 H150 l4 -12 l4 24 l5 -12 H218";
/* the live signal: a continuous, gently-read waveform */
const WAVE =
  "M6 22 C 28 8 44 8 64 22 C 84 36 100 36 120 22 C 140 8 156 8 176 22 C 190 31 200 27 218 22";

/* fires true once the element scrolls into view (immediately if reduced-motion) */
function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setInView(true); return; }
    const io = new IntersectionObserver(
      (es) => { if (es[0].isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export default function PreventionVsCure() {
  const [cmpRef, cmpIn] = useInView<HTMLDivElement>(0.35);
  const [spineRef, spineIn] = useInView<HTMLDivElement>(0.22);

  return (
    <section className="section pvc" id="why">
      <div className="measure">
        <div className="pvc-head reveal">
          <p className="eyebrow chapter-eyebrow">Why not a normal check-up</p>
          <h2 className="chapter-title pvc-title">
            <span className="pvc-title__line">Predict early. Prevent fully.</span>
            <span className="pvc-title__line">So you may <em>never need a cure</em>.</span>
          </h2>
        </div>

        {/* Reactive (recessive) vs BeyondAge (dominant), drawn as two signals */}
        <div className={`pvc-vs${cmpIn ? " is-in" : ""}`} ref={cmpRef}>
          {/* The annual check-up — a flat trace, ghost panel */}
          <div className="pvc-vs__old">
            <div className="pvc-vs__top">
              <span className="pvc-vs__k">The annual check-up</span>
              <span className="pvc-vs__tag">Reactive</span>
            </div>
            <svg className="pvc-sig" viewBox="0 0 224 44" aria-hidden="true">
              <line className="pvc-sig__axis" x1="6" y1="22" x2="218" y2="22" />
              <path className="pvc-sig__flat" d={FLAT} />
              <circle className="pvc-sig__blip" cx="158" cy="22" r="2.4" />
            </svg>
            <ul className="pvc-vs__list">
              {USUAL.map((t, i) => (
                <li key={t} style={{ ["--i" as string]: String(i) }}>
                  <span className="pvc-vs__mk pvc-vs__mk--x" aria-hidden="true">✕</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BeyondAge — a live signal on a glossy dark instrument card */}
          <div className="pvc-vs__new">
            <div className="pvc-vs__sheen" aria-hidden="true" />
            <div className="pvc-vs__top">
              <span className="pvc-vs__k pvc-vs__k--gold">
                <i className="pvc-vs__live" /> BeyondAge
              </span>
              <span className="pvc-vs__tag pvc-vs__tag--gold">Predictive</span>
            </div>
            <svg className="pvc-sig pvc-sig--live" viewBox="0 0 224 44" aria-hidden="true">
              <line className="pvc-sig__axis pvc-sig__axis--dk" x1="6" y1="22" x2="218" y2="22" />
              <path className="pvc-sig__wave" d={WAVE} pathLength={1} />
              <path className="pvc-sig__pulse" d={WAVE} pathLength={1} />
            </svg>
            <ul className="pvc-vs__list">
              {BEYOND.map((t, i) => (
                <li key={t} style={{ ["--i" as string]: String(i) }}>
                  <span className="pvc-vs__mk pvc-vs__mk--check" aria-hidden="true">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The five P's — a living spine */}
        <div className={`pvc-5p${spineIn ? " is-in" : ""}`} ref={spineRef}>
          <p className="pvc-5p__title">The five P&rsquo;s of the BeyondAge framework</p>
          <ol className="pvc-spine">
            <span className="pvc-spine__rail" aria-hidden="true" />
            <span className="pvc-spine__pulse" aria-hidden="true" />
            {FIVE_P.map(({ p, body }, i) => (
              <li key={p} className="pvc-p" style={{ ["--i" as string]: String(i) }}>
                <span className="pvc-p__node" aria-hidden="true" />
                <span className="pvc-p__head">
                  <span className="pvc-p__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pvc-p__word">{p}</span>
                </span>
                <span className="pvc-p__body">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
