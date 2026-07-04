"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * Health Journeys — the body, read in depth.
 *
 * Three deep programmes, each rendered as a bespoke, medically-literal
 * instrument rather than a generic card:
 *   · Cardiac    — a Lead-II ECG trace (real P-QRS-T morphology) on ECG paper.
 *   · Metabolic  — a 24-hour continuous-glucose curve over a target band.
 *   · Sleep      — an overnight hypnogram stepping through the sleep stages.
 *
 * Everything is hairline SVG in the brand palette (emerald trace, gold accents,
 * monospace instrument type) — no gradients, no fills-as-decoration. Each trace
 * draws itself on when the grid scrolls into view (pathLength-normalised
 * stroke-dashoffset), and a short gold pulse then travels the signal like a live
 * monitor readout. Reduced-motion users get the finished, still instrument.
 *
 * The traces are illustrative diagrams; the readout chips name the real markers
 * each programme measures (per beyondage.health) — no invented patient values.
 */

/* ---- shared plot geometry (one coordinate system for all three) ---- */
const VBW = 300, VBH = 166;
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

/* ---------- Metabolic · 24-hour continuous glucose ---------- */
const H0 = 6, H1 = 24;
const Xh = (h: number) => PL + ((h - H0) / (H1 - H0)) * (PR - PL);
const Yg = (g: number) => PB - ((g - 55) / (160 - 55)) * (PB - PT);
const gluc = (h: number) => {
  const b = (m: number, s: number, a: number) => a * Math.exp(-((h - m) ** 2) / (2 * s * s));
  return 86 + b(8, 1.05, 38) + b(13, 1.25, 54) + b(19.3, 1.35, 45) - b(6.5, 1.6, 5);
};
const CGM_PATH = (() => {
  const N = 260;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const h = H0 + (i / N) * (H1 - H0);
    pts.push([Xh(h), Yg(gluc(h))]);
  }
  return poly(pts);
})();
const CGM_PEAK: [number, number] = [Xh(13), Yg(gluc(13))];

/* ---------- Sleep · overnight hypnogram ---------- */
// stage rows: 0 Awake (top) … 4 N3 / deep (bottom)
const STAGES = ["Awake", "REM", "N1", "N2", "N3"] as const;
const Xn = (h: number) => PL + (h / 7) * (PR - PL);
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

/* ---- content — accurate to beyondage.health's three programmes ---- */
type Journey = {
  idx: string;
  k: string;
  title: string;
  chan: string;
  unit: string;
  body: string;
  chips: string[];
  kind: "cardiac" | "metabolic" | "sleep";
};
const JOURNEYS: Journey[] = [
  {
    idx: "01", k: "Heart & vascular", title: "Cardiac",
    chan: "ECG · Lead II", unit: "mV",
    body: "Coronary calcium scoring, AI-aided CT angiography, advanced lipid and genetic panels — read against your own trajectory, not a population average.",
    chips: ["CAC · Agatston", "ApoB", "Lipoprotein(a)"],
    kind: "cardiac",
  },
  {
    idx: "02", k: "Glucose, insulin & liver", title: "Metabolic",
    chan: "CGM · 24 h", unit: "mg/dL",
    body: "Continuous glucose, autonomic and retinal screening, insulin and fatty-liver mapping. The dysfunction behind most disease, found early.",
    chips: ["Fasting glucose", "HbA1c", "Fasting insulin"],
    kind: "metabolic",
  },
  {
    idx: "03", k: "Recovery & brain", title: "Sleep",
    chan: "Hypnogram · 7 h", unit: "stage",
    body: "Polysomnography, HRV and circadian profiling, psychomotor vigilance. The recovery your next thirty years are built on.",
    chips: ["Deep & REM", "HRV", "Circadian phase"],
    kind: "sleep",
  },
];

/* ---- per-instrument grids + content ---- */
function CardiacViz() {
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

function MetabolicViz() {
  const yTicks = [70, 100, 140];
  const xTicks = [8, 12, 16, 20];
  return (
    <>
      <rect className="j-band" x={PL} y={Yg(140)} width={PR - PL} height={Yg(70) - Yg(140)} />
      <path className="j-corner" d={CORNERS} />
      {yTicks.map((g) => (
        <g key={g}>
          <line className={g === 70 || g === 140 ? "j-bandline" : "j-grid"} x1={PL} y1={Yg(g)} x2={PR} y2={Yg(g)} />
          <text className="j-axis" x={PL - 3} y={Yg(g) + 2.5} textAnchor="end">{g}</text>
        </g>
      ))}
      {xTicks.map((h) => (
        <text key={h} className="j-axis" x={Xh(h)} y={AX} textAnchor="middle">{h}h</text>
      ))}
      <path className="j-trace" d={CGM_PATH} pathLength={1} />
      <path className="j-pulse" d={CGM_PATH} pathLength={1} />
      <circle className="j-marker" cx={CGM_PEAK[0]} cy={CGM_PEAK[1]} r={3} />
      <text className="j-lab" x={CGM_PEAK[0]} y={CGM_PEAK[1] - 6} textAnchor="middle">POST-MEAL</text>
      <text className="j-lab j-lab--em" x={PL + 2} y={Yg(70) + 9}>TARGET RANGE</text>
    </>
  );
}

function SleepViz() {
  return (
    <>
      <path className="j-corner" d={CORNERS} />
      {STAGES.map((s, r) => (
        <g key={s}>
          <line className="j-grid" x1={PL} y1={Yr(r)} x2={PR} y2={Yr(r)} />
          <text className="j-axis" x={PL - 3} y={Yr(r) + 2.5} textAnchor="end">{s}</text>
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
      <text className="j-lab j-lab--em" x={PR - 2} y={Yr(1) - 6} textAnchor="end">REM</text>
    </>
  );
}

const VIZ = { cardiac: CardiacViz, metabolic: MetabolicViz, sleep: SleepViz };

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
        <div className="reveal">
          <p className="eyebrow chapter-eyebrow">Health Journeys</p>
          <h2 className="chapter-title">
            The body, read in <em>depth</em> — long before anything goes wrong.
          </h2>
          <p className="lede">
            Built by top physicians, powered by clinical science. Three deep
            programmes read the signal across heart, metabolism and sleep, and act
            in the years when it still changes the outcome.
          </p>
        </div>

        <div className="jrny-grid" ref={gridRef}>
          {JOURNEYS.map((j) => {
            const Viz = VIZ[j.kind];
            return (
              <article key={j.title} className="jrny reveal">
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
              </article>
            );
          })}
        </div>

        <p className="jrny-note reveal">
          Illustrative signal traces · the markers each programme reads are drawn
          from beyondage.health.
        </p>
      </div>
    </section>
  );
}
