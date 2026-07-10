"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Shared bespoke medical-instrument engine — one source of truth for the
 * Health Journeys section on the homepage and the three journey pages.
 *
 *   · cardiac    — a Lead-II ECG trace (real P-QRS-T morphology) on ECG paper.
 *   · metabolic  — a post-meal glucose response over the normal range.
 *   · sleep      — an overnight hypnogram stepping through the sleep stages.
 *
 * Everything is hairline SVG in the brand palette (emerald trace, gold accents,
 * monospace instrument type). Traces draw themselves on when an ancestor gains
 * `.is-drawn`; a short gold pulse then travels the signal like a live monitor.
 * Reduced-motion users get the finished, still instrument. The traces are
 * illustrative diagrams — not BeyondAge data.
 */

/* ---- shared plot geometry (one coordinate system for all three) ---- */
export const VBW = 300, VBH = 166;
const PL = 16, PR = 284, PT = 22, PB = 140;
const AX = 153; // axis-label baseline

const f = (n: number) => n.toFixed(1);
const poly = (pts: [number, number][]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join(" ");

/* Registration corner marks — the "precision instrument" tell. */
const CORNERS = (() => {
  const s = 6;
  const c: string[] = [];
  ([[PL, PT, 1, 1], [PR, PT, -1, 1], [PL, PB, 1, -1], [PR, PB, -1, -1]] as const).forEach(
    ([x, y, dx, dy]) => c.push(`M${x + dx * s} ${y}L${x} ${y}L${x} ${y + dy * s}`)
  );
  return c.join(" ");
})();

/* ---------- Cardiac · Lead-II ECG ---------- */
const ecgDefl = (ph: number) => {
  const g = (m: number, s: number, a: number) => a * Math.exp(-((ph - m) ** 2) / (2 * s * s));
  return (
    g(0.17, 0.024, 0.13) - // P
    g(0.30, 0.008, 0.10) + // Q
    g(0.345, 0.009, 1.0) - // R
    g(0.39, 0.011, 0.24) + // S
    g(0.62, 0.05, 0.30) //   T
  );
};
const ECG_PATH = (() => {
  const beats = 3, N = 540, mid = 90, amp = 54;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const x = PL + (i / N) * (PR - PL);
    const ph = ((i / N) * beats) % 1;
    pts.push([x, mid - ecgDefl(ph) * amp]);
  }
  return poly(pts);
})();

/* ---------- Metabolic · post-meal glucose response (illustrative) ----------
   A single glucose excursion over the hours after a load — rise then recover —
   read against the normal range. Illustrates blood-sugar / insulin sensitivity,
   both named on beyondage.health; NOT a continuous-glucose monitor. */
const H0 = 0, H1 = 3.5;
/* The plot keeps a left gutter inside the viewBox so the end-anchored y-tick
   labels render whole at every size (at PL they clipped off the edge). */
const M_PL = 34;
const Xh = (h: number) => M_PL + ((h - H0) / (H1 - H0)) * (PR - M_PL);
const Yg = (g: number) => PB - ((g - 55) / (165 - 55)) * (PB - PT);
const gluc = (h: number) => {
  const b = (m: number, s: number, a: number) => a * Math.exp(-((h - m) ** 2) / (2 * s * s));
  // baseline ~85, sharp post-load peak ~150 near 0.7h, recovering toward ~92 by 3h
  return 85 + b(0.72, 0.42, 66) + b(1.5, 0.7, 10) * Math.exp(-h * 0.3);
};
const GLU_PEAK_H = 0.72;
const GLU_PATH = (() => {
  const N = 260;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const h = H0 + (i / N) * (H1 - H0);
    pts.push([Xh(h), Yg(gluc(h))]);
  }
  return poly(pts);
})();
const GLU_PEAK: [number, number] = [Xh(GLU_PEAK_H), Yg(gluc(GLU_PEAK_H))];

/* ---------- Sleep · overnight hypnogram ---------- */
// stage rows: 0 Awake (top) … 4 N3 / deep (bottom)
const STAGES = ["Awake", "REM", "N1", "N2", "N3"] as const;
/* Left gutter wide enough for "Awake" — the stage labels clipped at PL. */
const S_PL = 44;
const Xn = (h: number) => S_PL + (h / 7) * (PR - S_PL);
const Yr = (row: number) => PT + 10 + (row / 4) * (PB - PT - 18);
// [start, end, stageRow] — a realistic night: quick descent to deep, then
// cycles of lighter sleep punctuated by lengthening REM toward morning.
const HYPNO: [number, number, number][] = [
  [0.0, 0.2, 0], [0.2, 0.55, 2], [0.55, 1.15, 3], [1.15, 1.75, 4],
  [1.75, 2.15, 3], [2.15, 2.45, 1], [2.45, 3.0, 3], [3.0, 3.55, 4],
  [3.55, 3.95, 3], [3.95, 4.45, 1], [4.45, 4.95, 3], [4.95, 5.2, 2],
  [5.2, 5.75, 1], [5.75, 6.1, 3], [6.1, 6.65, 1], [6.65, 7.0, 0],
];
const HYPNO_PATH = (() => {
  const pts: [number, number][] = [];
  HYPNO.forEach(([s, e, r]) => {
    pts.push([Xn(s), Yr(r)]);
    pts.push([Xn(e), Yr(r)]);
  });
  return poly(pts);
})();
const REM_SEGS = HYPNO.filter(([, , r]) => r === 1).map(([s, e]) => ({
  d: `M${f(Xn(s))} ${f(Yr(1))}L${f(Xn(e))} ${f(Yr(1))}`,
}));

/* ---- per-instrument SVG content ---- */
export function CardiacViz() {
  const v = useMemo(() => {
    const step = 10.6;
    const vx: number[] = [], hy: number[] = [];
    for (let x = PL; x <= PR + 0.1; x += step) vx.push(+x.toFixed(2));
    for (let y = PT; y <= PB + 0.1; y += step) hy.push(+y.toFixed(2));
    return { vx, hy };
  }, []);
  return (
    <>
      {v.vx.map((x, i) => (
        <line key={`v${i}`} className={`j-grid${i % 5 === 0 ? " j-grid--bold" : ""}`} x1={x} y1={PT} x2={x} y2={PB} />
      ))}
      {v.hy.map((y, i) => (
        <line key={`h${i}`} className={`j-grid${i % 5 === 0 ? " j-grid--bold" : ""}`} x1={PL} y1={y} x2={PR} y2={y} />
      ))}
      <path className="j-corner" d={CORNERS} />
      <path className="j-trace" d={ECG_PATH} pathLength={1} />
      <path className="j-pulse" d={ECG_PATH} pathLength={1} />
      <text className="j-lab" x={PL + 2} y={AX}>SINUS RHYTHM</text>
      <text className="j-axis" x={PR - 2} y={AX} textAnchor="end">25 mm/s</text>
    </>
  );
}

export function MetabolicViz() {
  const yTicks = [70, 100, 140];
  const xTicks = [0, 1, 2, 3];
  return (
    <>
      <rect className="j-band" x={M_PL} y={Yg(140)} width={PR - M_PL} height={Yg(70) - Yg(140)} />
      <path className="j-corner" d={CORNERS} />
      {yTicks.map((g) => (
        <g key={g}>
          <line className={g === 70 || g === 140 ? "j-bandline" : "j-grid"} x1={M_PL} y1={Yg(g)} x2={PR} y2={Yg(g)} />
          <text className="j-axis" x={M_PL - 4} y={Yg(g) + 2.5} textAnchor="end">{g}</text>
        </g>
      ))}
      {xTicks.map((h) => (
        <text key={h} className="j-axis" x={Xh(h)} y={AX} textAnchor="middle">{h}h</text>
      ))}
      <path className="j-trace" d={GLU_PATH} pathLength={1} />
      <path className="j-pulse" d={GLU_PATH} pathLength={1} />
      <circle className="j-marker" cx={GLU_PEAK[0]} cy={GLU_PEAK[1]} r={3} />
      <text className="j-lab" x={GLU_PEAK[0] + 4} y={GLU_PEAK[1] - 4} textAnchor="start">PEAK</text>
      <text className="j-lab j-lab--em" x={M_PL + 4} y={Yg(70) + 9}>NORMAL RANGE</text>
    </>
  );
}

export function SleepViz() {
  return (
    <>
      <path className="j-corner" d={CORNERS} />
      {STAGES.map((s, r) => (
        <g key={s}>
          <line className="j-grid" x1={S_PL} y1={Yr(r)} x2={PR} y2={Yr(r)} />
          {/* the REM row label keys the gold epochs itself — no floating tag */}
          <text className={`j-axis${s === "REM" ? " j-lab--em" : ""}`} x={S_PL - 5} y={Yr(r) + 2.5} textAnchor="end">{s}</text>
        </g>
      ))}
      {[1, 3, 5].map((h) => (
        <text key={h} className="j-axis" x={Xn(h)} y={AX} textAnchor="middle">{h}h</text>
      ))}
      <path className="j-trace j-trace--step" d={HYPNO_PATH} pathLength={1} />
      {REM_SEGS.map((s, i) => (
        <path key={i} className="j-rem" d={s.d} />
      ))}
      <path className="j-pulse" d={HYPNO_PATH} pathLength={1} />
    </>
  );
}

export type InstrumentKind = "cardiac" | "metabolic" | "sleep";
export const VIZ: Record<InstrumentKind, () => React.JSX.Element> = {
  cardiac: CardiacViz,
  metabolic: MetabolicViz,
  sleep: SleepViz,
};

/* ---- DrawInView — adds `.is-drawn` once its subtree scrolls into view, so the
   shared draw-on / pulse CSS fires. Reusable standalone (journey-page heroes)
   and anywhere an instrument stands alone rather than inside the grid. ---- */
export function DrawInView({
  className = "",
  threshold = 0.25,
  children,
}: {
  className?: string;
  threshold?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} className={`${className}${drawn ? " is-drawn" : ""}`.trim()}>
      {children}
    </div>
  );
}

/* ---- InstrumentPanel — the framed SVG readout used by the journey-page heroes;
   the homepage grid renders its own framed variant. ---- */
export function InstrumentPanel({
  kind,
  className = "",
}: {
  kind: InstrumentKind;
  className?: string;
}) {
  const Viz = VIZ[kind];
  return (
    <div className={`jrny__inst ${className}`.trim()}>
      <svg className="jinst" viewBox={`0 0 ${VBW} ${VBH}`} aria-hidden="true">
        <Viz />
      </svg>
    </div>
  );
}
