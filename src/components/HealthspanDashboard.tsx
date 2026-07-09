"use client";

/**
 * "See the product" — a crisp, native recreation of BeyondAge's real member
 * dashboard (the "Your Heart Protocol" screen shown on beyondage.health). Every
 * value here is taken verbatim from that product image — nothing invented:
 * Healthspan Score 89/100, Biological Age 32.4 yrs, Adherence 88%, the biomarker
 * deltas, the precision actions, and the four daily rings. Rendered in the
 * emerald/gold system and floated on a diagnostic-instrument field.
 *
 * On scroll into view the whole panel "assembles": the gauge needle sweeps up,
 * the headline figures count up, and the daily rings draw on. Reduced-motion
 * skips straight to the final values.
 */

import { useEffect, useRef, useState } from "react";

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

/* eases a number from 0 to target once `run` is true */
function useCountUp(target: number, run: boolean, decimals = 0, duration = 1150) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0, start = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setVal(target));
      return () => cancelAnimationFrame(raf);
    }
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Number((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, decimals, duration]);
  return val;
}

const polar = (v: number, r: number) => {
  const t = (Math.PI * (100 - v)) / 100; // 0 -> left(π), 100 -> right(0)
  return [100 + r * Math.cos(t), 100 - r * Math.sin(t)];
};
const arc = (v0: number, v1: number, r: number) => {
  const [x0, y0] = polar(v0, r);
  const [x1, y1] = polar(v1, r);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

function Gauge({ value }: { value: number }) {
  const [nx, ny] = polar(value, 60);
  return (
    <svg className="dash-gauge" viewBox="0 0 200 118" role="img" aria-label={`Healthspan score ${value} of 100`}>
      <path d={arc(0, 42, 80)} className="dash-gauge__seg dash-gauge__seg--low" />
      <path d={arc(42, 72, 80)} className="dash-gauge__seg dash-gauge__seg--mid" />
      <path d={arc(72, 100, 80)} className="dash-gauge__seg dash-gauge__seg--high" />
      <line x1="100" y1="100" x2={nx.toFixed(1)} y2={ny.toFixed(1)} className="dash-gauge__needle" />
      <circle cx="100" cy="100" r="5" className="dash-gauge__hub" />
    </svg>
  );
}

function Ring({ label, pct, live }: { label: string; pct: number; live: boolean }) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const v = useCountUp(pct, live, 0, 1150);
  return (
    <div className="dash-ring">
      <div className="dash-ring__chart">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={R} className="dash-ring__track" />
          <circle
            cx="32" cy="32" r={R}
            className="dash-ring__val"
            transform="rotate(-90 32 32)"
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - v / 100) }}
          />
        </svg>
        <span className="dash-ring__pct">{v}%</span>
      </div>
      <span className="dash-ring__label">{label}</span>
    </div>
  );
}

const BIOMARKERS = [
  { name: "ApoB", from: "120", to: "72", unit: "mg/dL", dir: "down" },
  { name: "HbA1c", from: "6.1", to: "5.2", unit: "%", dir: "down" },
  { name: "HRV", from: "30", to: "78", unit: "ms", dir: "up" },
] as const;

const ACTIONS = [
  { t: "Limit glucose spikes: finish eating by 8 PM", done: true },
  { t: "2.0g Omega-3 supplementation with a meal", done: true },
  { t: "30 min of Zone 2 cardio (a walk counts)", done: false },
] as const;

const RINGS = [
  ["Nutrition", 85],
  ["Movement", 82],
  ["Sleep", 80],
  ["Recovery", 85],
] as const;

export default function HealthspanDashboard() {
  const [deviceRef, live] = useInView<HTMLDivElement>(0.3);
  const score = useCountUp(89, live);
  const bioAge = useCountUp(32.4, live, 1);
  const adherence = useCountUp(88, live);
  return (
    <section className="section dash" id="dashboard">
      <div className="dash-field" aria-hidden="true">
        <span className="dash-field__grid" />
        <span className="dash-field__node dash-field__node--1" />
        <span className="dash-field__node dash-field__node--2" />
        <span className="dash-field__node dash-field__node--3" />
        <span className="dash-field__node dash-field__node--4" />
        <span className="dash-field__grain" />
      </div>

      <div className="measure dash-inner">
        <div className="reveal dash-head">
          <h2 className="dash-title">
            Your health, made <em>legible</em>.
          </h2>
          <p className="lede dash-lede">
            Every plan lives in one place, continuously optimised for you.
          </p>
        </div>

        <div className="reveal dash-device" ref={deviceRef}>
          <div className="dash-screen">
            <div className="dash-topbar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.png" alt="BeyondAge" className="logo logo--ivory dash-topbar__logo" />
              {/* decorative live-signal — ambient product telemetry, not data */}
              <span className="dash-topbar__sig" aria-hidden="true">
                <span className="dash-topbar__live" />
                <span className="dash-topbar__eq"><i /><i /><i /><i /></span>
              </span>
            </div>

            <div className="dash-body">
              <div className="dash-row dash-row--top">
                <div className="dash-card dash-card--gauge">
                  <Gauge value={score} />
                  <div className="dash-gauge__read">
                    <strong>{score}</strong><span>/100</span>
                  </div>
                  <p className="dash-card__label">BeyondAge Healthspan Score</p>
                </div>
                <div className="dash-card dash-card--stat">
                  <p className="dash-card__label">Biological Age</p>
                  <p className="dash-stat"><strong>{bioAge.toFixed(1)}</strong><span>yrs</span></p>
                </div>
                <div className="dash-card dash-card--stat">
                  <p className="dash-card__label">Adherence</p>
                  <p className="dash-stat dash-stat--gold"><strong>{adherence}</strong><span>%</span></p>
                </div>
              </div>

              <div className="dash-row dash-row--mid">
                <div className="dash-card dash-card--bio">
                  <p className="dash-card__h">Biomarker Snapshot</p>
                  <ul className="dash-bio">
                    {BIOMARKERS.map((b) => (
                      <li key={b.name} className="dash-bio__row">
                        <span className="dash-bio__name">{b.name}</span>
                        <span className="dash-bio__delta">
                          <span className="dash-bio__from">{b.from}</span>
                          <span className={`dash-bio__arrow dash-bio__arrow--${b.dir}`}>→</span>
                          <span className="dash-bio__to">{b.to}</span>
                          <span className="dash-bio__unit">{b.unit}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dash-card dash-card--actions">
                  <p className="dash-card__h">Today&rsquo;s Precision Actions</p>
                  <ul className="dash-actions">
                    {ACTIONS.map((a) => (
                      <li key={a.t} className={`dash-action${a.done ? " is-done" : ""}`}>
                        <span className="dash-action__box" aria-hidden="true">{a.done ? "✓" : ""}</span>
                        {a.t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="dash-row dash-row--rings">
                {RINGS.map(([label, pct]) => (
                  <Ring key={label} label={label} pct={pct as number} live={live} />
                ))}
              </div>
            </div>
          </div>
          <p className="dash-device__note">Illustrative member dashboard. Figures shown as on beyondage.health</p>
        </div>
      </div>
    </section>
  );
}
