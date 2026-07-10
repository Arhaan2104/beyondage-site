"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The case for prevention — the thesis, stated in numbers.
 *
 * A calm editorial header ("Disease is decided long before it's diagnosed") over
 * three readouts that count up as the section enters view: the top hairline draws
 * left→right, the column dividers ink in, and each figure tallies from zero with
 * an easing curve — a quiet, instrument-like reveal rather than a flourish.
 *
 * Each stat maps to one of the three programmes (heart, metabolism, sleep), so
 * the numbers set up the journeys that follow.
 */
const STATS = [
  { value: 53, unit: "yrs", cap: "Average age of a first heart attack in Indian men. A decade early." },
  { value: 315, unit: "M", cap: "Indians live with hypertension. Most don’t know it yet." },
  { value: 60, unit: "%", cap: "of adults sleep too little to fully repair, night after night." },
];

const DUR = 1500;   // count-up duration per figure
const STAGGER = 150; // per-column head start
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function CaseForPrevention() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [vals, setVals] = useState<number[]>(() => STATS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => {
        setVals(STATS.map((s) => s.value));
        setInView(true);
      });
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        setInView(true);
        const start = performance.now();
        const tick = (now: number) => {
          let done = true;
          const next = STATS.map((s, i) => {
            const t = clamp((now - start - i * STAGGER) / DUR, 0, 1);
            if (t < 1) done = false;
            const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
            return Math.round(s.value * e);
          });
          setVals(next);
          if (!done) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section cfp" id="prevention">
      <div className="cfp-wrap">
        <div className="cfp-top">
          <div className="reveal cfp-lead">
            <h2 className="cfp-title">
              <span className="cfp-title__line">Disease is <em>decided</em></span>
              <span className="cfp-title__line">long before it&rsquo;s <em>diagnosed</em>.</span>
            </h2>
            <p className="cfp-sub">
              It builds for years, while every report still reads <em>normal</em>.
            </p>
          </div>
        </div>

        <div className={`cfp-stats${inView ? " is-in" : ""}`} ref={ref}>
          <span className="cfp-stats__rule" aria-hidden="true" />
          {STATS.map((s, i) => (
            <div className="cfp-stat" key={s.cap} style={{ ["--i" as string]: String(i) }}>
              <p className="cfp-stat__num">
                <span className="cfp-stat__val">{vals[i]}</span>
                {s.unit && <span className="cfp-stat__unit">{s.unit}</span>}
              </p>
              <p className="cfp-stat__cap">{s.cap}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
