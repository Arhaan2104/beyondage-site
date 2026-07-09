"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Why not a normal check-up" — the predict-vs-cure thesis.
 *
 * The five P's of the framework, drawn as a horizontal process rail: stations
 * light in sequence as the rail draws in. Reduced-motion shows the finished
 * state. (The operable risk instrument now headlines the "Case for prevention"
 * section above.)
 */
const FIVE_P = [
  { p: "Predict", body: "Your future risks, read from your genetics, biomarkers and lifestyle." },
  { p: "Prevent", body: "Proactive, science-led interventions that delay decline." },
  { p: "Personalise", body: "Interventions crafted for you, from cellular signals to daily rhythms." },
  { p: "Participate", body: "Real-time data and expert guidance, so you own the journey." },
  { p: "Purposeful", body: "Physical, mental, emotional and spiritual health, lived with depth." },
];

/* fires true once the element scrolls into view (immediately if reduced-motion) */
function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
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
  const [spineRef, spineIn] = useInView<HTMLDivElement>(0.22);

  return (
    <section className="section pvc" id="why">
      <div className="measure">
        <div className="pvc-head reveal">
          <h2 className="chapter-title pvc-title">
            <span className="pvc-title__line">Predict early. Prevent fully.</span>
            <span className="pvc-title__line">So you may <em>never need a cure</em>.</span>
          </h2>
          <span className="mark-divider mark-divider--warm" aria-hidden="true" />
        </div>

        {/* The five P's — a horizontal process rail: stations light in sequence
            as the rail draws in, left to right. */}
        <div className={`pvc-5p${spineIn ? " is-in" : ""}`} ref={spineRef}>
          <p className="pvc-5p__title">The five P&rsquo;s of the BeyondAge framework</p>
          <ol className="pvc-track">
            <span className="pvc-track__rail" aria-hidden="true" />
            {FIVE_P.map(({ p, body }, i) => (
              <li key={p} className="pvc-pp" style={{ ["--i" as string]: String(i) }}>
                <span className="pvc-pp__node" aria-hidden="true" />
                <span className="pvc-pp__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="pvc-pp__word">{p}</span>
                <span className="pvc-pp__body">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
