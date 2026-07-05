"use client";

import { useEffect, useState } from "react";

/**
 * Bespoke motion diagrams for the middle "Diagnostics & Interventions" section of
 * each Health Journey page. One intricate, domain-accurate illustration per kind,
 * built in the same hairline-SVG language as the instrument engine (emerald trace,
 * gold accents, monospace labels). Structural lines draw themselves on when an
 * ancestor gains `.is-drawn`; particle motion (blood flow, glucose uptake, the
 * sleep playhead) loops as a live readout. Reduced-motion users get the finished,
 * still diagram. Everything is illustrative — not BeyondAge data.
 *
 *   · cardiac    — coronary artery cross-section: flow, wall (IMT) and plaque.
 *   · metabolic  — glucose crossing the membrane via insulin-opened GLUT4 channels.
 *   · sleep      — overnight architecture: hypnogram, per-stage EEG, HR/HRV.
 */

const DW = 680,
  DH = 300;

const f = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : "0");
const poly = (pts: [number, number][]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join(" ");
const sample = (fn: (x: number) => number, x0: number, x1: number, n = 150): [number, number][] => {
  const a: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + (i / n) * (x1 - x0);
    a.push([x, fn(x)]);
  }
  return a;
};
const hexAt = (cx: number, cy: number, r: number) => {
  const p: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return poly(p) + "Z";
};

function useReducedMotion() {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setRm(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return rm;
}

/* Registration corner marks — the shared "precision instrument" tell. */
const FRAME = (() => {
  const PL = 14,
    PR = DW - 14,
    PT = 14,
    PB = DH - 14,
    s = 9;
  const c: string[] = [];
  ([[PL, PT, 1, 1], [PR, PT, -1, 1], [PL, PB, 1, -1], [PR, PB, -1, -1]] as const).forEach(
    ([x, y, dx, dy]) => c.push(`M${x + dx * s} ${y}L${x} ${y}L${x} ${y + dy * s}`)
  );
  return c.join(" ");
})();

/* =========================================================================
   CARDIAC — coronary artery cross-section (longitudinal)
   ========================================================================= */
const ecgDefl = (ph: number) => {
  const g = (m: number, s: number, a: number) => a * Math.exp(-((ph - m) ** 2) / (2 * s * s));
  return g(0.17, 0.024, 0.13) - g(0.3, 0.008, 0.1) + g(0.345, 0.009, 1.0) - g(0.39, 0.011, 0.24) + g(0.62, 0.05, 0.3);
};

const C_X0 = 48,
  C_X1 = 632,
  C_CY = 190,
  C_R0 = 42,
  C_XC = 366,
  C_SD = 62,
  C_WALL = 14;
const cBump = (x: number) => 48 * Math.exp(-((x - C_XC) ** 2) / (2 * C_SD * C_SD));
const cDent = (x: number) => 13 * Math.exp(-((x - C_XC) ** 2) / (2 * (C_SD * 1.15) ** 2));
const cSup = (x: number) => C_CY - C_R0 + cDent(x);
const cInf = (x: number) => C_CY + C_R0 - cBump(x);
const cSupOut = (x: number) => cSup(x) - C_WALL;
const cInfOut = () => C_CY + C_R0 + C_WALL * 0.55;
const cMid = (x: number) => (cSup(x) + cInf(x)) / 2;

const C_SUP = poly(sample(cSup, C_X0, C_X1));
const C_INF = poly(sample(cInf, C_X0, C_X1));
const C_SUPOUT = poly(sample(cSupOut, C_X0, C_X1));
const C_INFOUT = poly(sample(cInfOut, C_X0, C_X1));
const C_FLOW = poly(sample(cMid, C_X0 + 8, C_X1 - 8));
const C_LUMEN = (() => {
  const top = sample(cSup, C_X0, C_X1);
  const bot = sample(cInf, C_X1, C_X0);
  return (
    "M" +
    top.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L") +
    " L" +
    bot.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L") +
    " Z"
  );
})();
const C_ECGY = 54,
  C_ECGAMP = 15,
  C_BEATS = 4;
const C_ECG = poly(
  sample((x) => {
    const ph = (((x - C_X0) / (C_X1 - C_X0)) * C_BEATS) % 1;
    return C_ECGY - ecgDefl(ph) * C_ECGAMP;
  }, C_X0, C_X1, 560)
);
const C_PLQY = cInf(C_XC) + 16;
const C_CAL_X = 120; // IMT caliper on a healthy segment
const C_FLOW_DOTS = [
  { d: 2.6, b: "0s", g: false },
  { d: 2.6, b: "0.33s", g: false },
  { d: 2.6, b: "0.66s", g: true },
  { d: 2.6, b: "0.99s", g: false },
  { d: 2.6, b: "1.32s", g: false },
  { d: 2.6, b: "1.65s", g: false },
  { d: 2.6, b: "1.98s", g: true },
  { d: 2.6, b: "2.31s", g: false },
];

function CardiacDiagram({ motion }: { motion: boolean }) {
  return (
    <>
      <path className="jd-frame" d={FRAME} />
      {/* ECG clock strip */}
      <path className="jd-ecg" d={C_ECG} pathLength={1} />
      {motion && (
        <circle className="jd-ecg-dot" r={2.4}>
          <animateMotion dur="1.9s" repeatCount="indefinite" path={C_ECG} />
        </circle>
      )}
      <text className="jd-lab jd-lab--em" x={C_X0} y={38}>LEAD II</text>
      <text className="jd-ax" x={C_X1} y={38} textAnchor="end">25 mm/s</text>

      {/* vessel — outer media then intimal lumen walls */}
      <path className="jd-vessel jd-vessel--outer" d={C_SUPOUT} pathLength={1} />
      <path className="jd-vessel jd-vessel--outer" d={C_INFOUT} pathLength={1} />
      <path className="jd-blood" d={C_LUMEN} />
      <path className="jd-vessel" d={C_SUP} pathLength={1} />
      <path className="jd-vessel" d={C_INF} pathLength={1} />

      {/* plaque — lipid core, thin fibrous cap highlight, calcium fleck */}
      <g className="jd-plaque">
        <ellipse className="jd-plaque-core" cx={C_XC} cy={C_PLQY} rx={46} ry={17} />
        <ellipse className="jd-plaque-lipid" cx={C_XC + 6} cy={C_PLQY + 1} rx={26} ry={9} />
        <path
          className="jd-plaque-cap"
          d={poly(sample(cInf, C_XC - 52, C_XC + 52, 40))}
          pathLength={1}
        />
        <circle className="jd-calc" cx={C_XC - 20} cy={C_PLQY - 3} r={3} />
      </g>

      {/* flow particles through the lumen */}
      {motion && (
        <g className="jd-flow">
          {C_FLOW_DOTS.map((p, i) => (
            <circle key={i} className={`jd-flow-dot${p.g ? " jd-flow-dot--gold" : ""}`} r={p.g ? 2.7 : 2.3}>
              <animateMotion dur={`${p.d}s`} begin={p.b} repeatCount="indefinite" path={C_FLOW} />
            </circle>
          ))}
        </g>
      )}

      {/* IMT caliper on a healthy segment */}
      <g className="jd-cal">
        <line x1={C_CAL_X} y1={cSupOut(C_CAL_X)} x2={C_CAL_X} y2={cSup(C_CAL_X)} />
        <line className="jd-cal-tick" x1={C_CAL_X - 5} y1={cSupOut(C_CAL_X)} x2={C_CAL_X + 5} y2={cSupOut(C_CAL_X)} />
        <line className="jd-cal-tick" x1={C_CAL_X - 5} y1={cSup(C_CAL_X)} x2={C_CAL_X + 5} y2={cSup(C_CAL_X)} />
        <text className="jd-lab" x={C_CAL_X - 9} y={(cSupOut(C_CAL_X) + cSup(C_CAL_X)) / 2 + 2.5} textAnchor="end">IMT</text>
      </g>

      {/* stenosis bracket at the narrowing */}
      <g className="jd-brk">
        <line x1={C_XC} y1={cSup(C_XC)} x2={C_XC} y2={cInf(C_XC)} />
        <line className="jd-cal-tick" x1={C_XC - 5} y1={cSup(C_XC)} x2={C_XC + 5} y2={cSup(C_XC)} />
        <line className="jd-cal-tick" x1={C_XC - 5} y1={cInf(C_XC)} x2={C_XC + 5} y2={cInf(C_XC)} />
        <text className="jd-lab jd-lab--em" x={C_XC} y={cSup(C_XC) - 6} textAnchor="middle">STENOSIS</text>
      </g>

      <text className="jd-lab" x={C_X0 + 6} y={C_CY - 22}>LUMEN</text>
      <text className="jd-lab" x={C_X1 - 6} y={cSupOut(C_X1) - 6} textAnchor="end">INTIMA·MEDIA</text>
      <text className="jd-lab jd-lab--em" x={C_XC} y={C_PLQY + 32} textAnchor="middle">VULNERABLE PLAQUE</text>
      <text className="jd-lab" x={306} y={C_PLQY + 18} textAnchor="end">Ca²⁺</text>
    </>
  );
}

/* =========================================================================
   METABOLIC — glucose uptake across the cell membrane
   ========================================================================= */
const M_X0 = 44,
  M_X1 = 424,
  M_BLOODY = 74,
  M_HEAD1 = 150,
  M_HEAD2 = 166,
  M_CYTO = 176;
const M_HEADS = (() => {
  const xs: number[] = [];
  for (let x = M_X0; x <= M_X1; x += 15.4) xs.push(+x.toFixed(1));
  return xs;
})();
const M_REC_X = 116;
const M_GLUT = [242, 338];
const M_MITO = { x: 350, y: 244, rx: 26, ry: 14 };
const M_BLOOD_PATH = `M${M_X0} ${M_BLOODY} L${M_X1} ${M_BLOODY}`;
const uptakePath = (cx: number) => `M${cx - 40} ${M_BLOODY} L${cx} ${M_BLOODY} L${cx} ${M_CYTO + 34}`;
// glucose curve panel (post-meal, flattening into range)
const M_GX = (h: number) => 474 + (h / 3) * 168;
const M_GY = (g: number) => 250 - ((g - 60) / (190 - 60)) * (250 - 150);
const mAfter = (h: number) => 90 + 44 * Math.exp(-((h - 0.7) ** 2) / (2 * 0.44 * 0.44)) * Math.exp(-h * 0.06);
const mBefore = (h: number) => 92 + 92 * Math.exp(-((h - 0.8) ** 2) / (2 * 0.52 * 0.52)) * Math.exp(-h * 0.03);

function MetabolicDiagram({ motion }: { motion: boolean }) {
  // build glucose curve paths directly (h → x,y)
  const afterPts: [number, number][] = [];
  const beforePts: [number, number][] = [];
  for (let i = 0; i <= 90; i++) {
    const h = (i / 90) * 3;
    afterPts.push([M_GX(h), M_GY(mAfter(h))]);
    beforePts.push([M_GX(h), M_GY(mBefore(h))]);
  }
  const AFTER = poly(afterPts);
  const BEFORE = poly(beforePts);

  return (
    <>
      <path className="jd-frame" d={FRAME} />

      {/* blood plasma (above) + cytoplasm (below) grounds */}
      <rect className="jd-plasma" x={14} y={30} width={434} height={M_HEAD1 - 30} />
      <rect className="jd-cyto" x={14} y={M_HEAD2} width={434} height={DH - 14 - M_HEAD2} />

      {/* lipid bilayer membrane */}
      <g className="jd-mem">
        {M_HEADS.map((x, i) => (
          <g key={i}>
            <line className="jd-mem-tail" x1={x} y1={M_HEAD1} x2={x} y2={(M_HEAD1 + M_HEAD2) / 2} />
            <line className="jd-mem-tail" x1={x} y1={M_HEAD2} x2={x} y2={(M_HEAD1 + M_HEAD2) / 2} />
            <circle className="jd-mem-head" cx={x} cy={M_HEAD1} r={3.1} />
            <circle className="jd-mem-head" cx={x} cy={M_HEAD2} r={3.1} />
          </g>
        ))}
      </g>

      {/* insulin receptor with a docked insulin (binding pulse) */}
      <g className="jd-receptor">
        <path d={`M${M_REC_X - 9} ${M_HEAD2 + 4} L${M_REC_X - 5} ${M_HEAD1 - 8} L${M_REC_X - 12} ${M_HEAD1 - 14}`} />
        <path d={`M${M_REC_X + 9} ${M_HEAD2 + 4} L${M_REC_X + 5} ${M_HEAD1 - 8} L${M_REC_X + 12} ${M_HEAD1 - 14}`} />
        <circle className="jd-insulin-dock" cx={M_REC_X} cy={M_HEAD1 - 15} r={6} />
      </g>
      <text className="jd-lab" x={M_REC_X} y={M_HEAD1 - 26} textAnchor="middle">INSULIN</text>
      <text className="jd-lab" x={M_REC_X + 24} y={M_CYTO + 12} textAnchor="start">RECEPTOR</text>

      {/* GLUT4 channels + translocating vesicles */}
      {M_GLUT.map((gx, i) => (
        <g key={i}>
          <line className="jd-glut" x1={gx - 7} y1={M_HEAD1 - 6} x2={gx - 7} y2={M_HEAD2 + 6} />
          <line className="jd-glut" x1={gx + 7} y1={M_HEAD1 - 6} x2={gx + 7} y2={M_HEAD2 + 6} />
          <rect
            className={`jd-vesicle${motion ? " is-live" : ""}`}
            x={gx - 12}
            y={M_CYTO + 30}
            width={24}
            height={16}
            rx={8}
            style={{ animationDelay: `${i * 1.4}s` }}
          />
        </g>
      ))}
      <text className="jd-lab jd-lab--em" x={M_GLUT[0]} y={M_CYTO + 60} textAnchor="middle">GLUT4</text>

      {/* mitochondrion — outer membrane + cristae, ATP glow */}
      <g className="jd-mito">
        <ellipse className={`jd-mito-body${motion ? " is-live" : ""}`} cx={M_MITO.x} cy={M_MITO.y} rx={M_MITO.rx} ry={M_MITO.ry} />
        <path
          className="jd-mito-crista"
          d={`M${M_MITO.x - 20} ${M_MITO.y} q6 -9 12 0 q6 9 12 0 q6 -9 12 0 q6 9 12 0`}
        />
        <circle className={`jd-atp${motion ? " is-live" : ""}`} cx={M_MITO.x} cy={M_MITO.y} r={3} />
      </g>
      <text className="jd-lab" x={M_MITO.x} y={M_MITO.y + M_MITO.ry + 12} textAnchor="middle">ATP · ENERGY</text>

      {/* glucose in the bloodstream + uptake into the cell */}
      <text className="jd-lab" x={M_X0 + 2} y={44} textAnchor="start">GLUCOSE</text>
      {motion && (
        <g className="jd-flow">
          {[0, 0.5, 1.1, 1.7, 2.3].map((b, i) => (
            <path key={`bg${i}`} className="jd-hex" d={hexAt(0, 0, 4)}>
              <animateMotion dur="4.4s" begin={`${b}s`} repeatCount="indefinite" path={M_BLOOD_PATH} />
            </path>
          ))}
          {M_GLUT.map((gx, i) => (
            <path key={`ug${i}`} className="jd-hex jd-hex--em" d={hexAt(0, 0, 4)}>
              <animateMotion dur="3.2s" begin={`${i * 1.6}s`} repeatCount="indefinite" path={uptakePath(gx)} />
            </path>
          ))}
          {[0.8, 2.0].map((b, i) => (
            <circle key={`in${i}`} className="jd-insulin" r={3}>
              <animateMotion dur="4.4s" begin={`${b}s`} repeatCount="indefinite" path={M_BLOOD_PATH} />
            </circle>
          ))}
        </g>
      )}

      {/* glucose curve — the excursion flattening into range */}
      <line className="jd-div" x1={458} y1={40} x2={458} y2={266} />
      <rect className="jd-band" x={474} y={M_GY(140)} width={168} height={M_GY(70) - M_GY(140)} />
      <line className="jd-bandline" x1={474} y1={M_GY(140)} x2={642} y2={M_GY(140)} />
      <line className="jd-bandline" x1={474} y1={M_GY(70)} x2={642} y2={M_GY(70)} />
      <path className="jd-curve-ghost" d={BEFORE} pathLength={1} />
      <path className="jd-curve" d={AFTER} pathLength={1} />
      <text className="jd-lab" x={474} y={44} textAnchor="start">POST-MEAL GLUCOSE</text>
      <text className="jd-lab jd-lab--em" x={476} y={M_GY(70) - 5}>TIME IN RANGE</text>
      <text className="jd-ax" x={474} y={262}>0h</text>
      <text className="jd-ax" x={642} y={262} textAnchor="end">3h</text>
    </>
  );
}

/* =========================================================================
   SLEEP — overnight architecture (hypnogram + EEG morphology + HR/HRV)
   ========================================================================= */
const S_X0 = 52,
  S_X1 = 636;
const Sx = (h: number) => S_X0 + (h / 7) * (S_X1 - S_X0);
const S_STAGES = ["Awake", "REM", "N1", "N2", "N3"] as const;
const Syr = (row: number) => 58 + (row / 4) * 62;
const HYPNO: [number, number, number][] = [
  [0.0, 0.2, 0], [0.2, 0.55, 2], [0.55, 1.15, 3], [1.15, 1.75, 4],
  [1.75, 2.15, 3], [2.15, 2.45, 1], [2.45, 3.0, 3], [3.0, 3.55, 4],
  [3.55, 3.95, 3], [3.95, 4.45, 1], [4.45, 4.95, 3], [4.95, 5.2, 2],
  [5.2, 5.75, 1], [5.75, 6.1, 3], [6.1, 6.65, 1], [6.65, 7.0, 0],
];
const S_HYPNO = (() => {
  const pts: [number, number][] = [];
  HYPNO.forEach(([s, e, r]) => {
    pts.push([Sx(s), Syr(r)]);
    pts.push([Sx(e), Syr(r)]);
  });
  return poly(pts);
})();
const S_REM = HYPNO.filter(([, , r]) => r === 1).map(([s, e]) => `M${f(Sx(s))} ${f(Syr(1))}L${f(Sx(e))} ${f(Syr(1))}`);
const stageAt = (h: number) => {
  for (const [s, e, r] of HYPNO) if (h >= s && h < e) return r;
  return 0;
};
// EEG morphology synthesised per stage — delta (N3), spindles (N2), sawtooth (REM)
const S_EEGY = 172;
const eeg = (x: number) => {
  const h = ((x - S_X0) / (S_X1 - S_X0)) * 7;
  const r = stageAt(h);
  let v: number;
  if (r === 4) v = Math.sin(x * 0.06) + 0.18 * Math.sin(x * 0.15); // deep — slow delta
  else if (r === 3) {
    const burst = Math.exp(-((((x * 0.55) % 46) - 23) ** 2) / 10); // spindle packets
    v = 0.42 * Math.sin(x * 0.17) + burst * 0.7 * Math.sin(x * 1.25);
  } else if (r === 1) v = ((x * 0.07) % 1) * 2 - 1; // REM sawtooth
  else if (r === 0) v = 0.5 * Math.sin(x * 0.55) + 0.2 * Math.sin(x * 0.9); // awake — fast low
  else v = 0.6 * Math.sin(x * 0.32); // N1 — theta
  const amp = [7, 8, 9, 11, 20][r];
  return S_EEGY - v * amp * 0.5;
};
const S_EEG = poly(sample(eeg, S_X0, S_X1, 560));
// HR / HRV — dips through deep sleep, recovers toward morning
const S_HRY = 244;
const hr = (x: number) => {
  const h = ((x - S_X0) / (S_X1 - S_X0)) * 7;
  const r = stageAt(h);
  const dip = r === 4 ? 9 : r === 3 ? 5 : 0;
  const variability = (r <= 1 ? 3 : 1.2) * Math.sin(x * 0.45);
  const bpm = 60 - dip + (h / 7) * 3 + variability;
  return S_HRY - (bpm - 48) / (72 - 48) * 26;
};
const S_HR = poly(sample(hr, S_X0, S_X1, 400));

function SleepDiagram({ motion }: { motion: boolean }) {
  return (
    <>
      <path className="jd-frame" d={FRAME} />

      {/* hypnogram */}
      {S_STAGES.map((s, r) => (
        <g key={s}>
          <line className="jd-grid" x1={S_X0} y1={Syr(r)} x2={S_X1} y2={Syr(r)} />
          <text className="jd-ax" x={S_X0 - 4} y={Syr(r) + 2.5} textAnchor="end">{s}</text>
        </g>
      ))}
      <path className="jd-step" d={S_HYPNO} pathLength={1} />
      {S_REM.map((d, i) => (
        <path key={i} className="jd-rem" d={d} />
      ))}
      <text className="jd-lab jd-lab--em" x={S_X1} y={Syr(1) - 6} textAnchor="end">REM</text>

      {/* EEG morphology */}
      <path className="jd-eeg" d={S_EEG} pathLength={1} />
      <text className="jd-lab" x={S_X0} y={148} textAnchor="start">EEG</text>
      <text className="jd-lab" x={Sx(1.45)} y={200} textAnchor="middle">δ DELTA</text>
      <text className="jd-lab" x={Sx(4.65)} y={200} textAnchor="middle">SPINDLE</text>

      {/* HR / HRV */}
      <path className="jd-hrv" d={S_HR} pathLength={1} />
      <text className="jd-lab" x={S_X0} y={224} textAnchor="start">HR · HRV</text>

      {/* time axis */}
      {[0, 2, 4, 6].map((h) => (
        <text key={h} className="jd-ax" x={Sx(h)} y={280} textAnchor="middle">{h}h</text>
      ))}
      <text className="jd-lab" x={Sx(0)} y={292} textAnchor="start">LIGHTS OUT</text>
      <text className="jd-lab jd-lab--em" x={Sx(7)} y={292} textAnchor="end">WAKE</text>

      {/* playhead sweeping the night */}
      {motion && (
        <g className="jd-sweep">
          <line x1={S_X0} y1={46} x2={S_X0} y2={266} />
          <circle className="jd-sweep-dot" cx={S_X0} cy={46} r={3} />
        </g>
      )}
    </>
  );
}

export type DiagramKind = "cardiac" | "metabolic" | "sleep";
const DIAGRAMS: Record<DiagramKind, (p: { motion: boolean }) => React.JSX.Element> = {
  cardiac: CardiacDiagram,
  metabolic: MetabolicDiagram,
  sleep: SleepDiagram,
};
const META: Record<DiagramKind, { bar: string; unit: string; cap: string }> = {
  cardiac: {
    bar: "CORONARY CROSS-SECTION · LONGITUDINAL",
    unit: "LEAD II · 25 mm/s",
    cap: "Illustrative — how a cardiovascular work-up reads the vessel: pulsatile flow, wall thickness (IMT) and plaque, years before symptoms.",
  },
  metabolic: {
    bar: "GLUCOSE UPTAKE · INSULIN SIGNALLING",
    unit: "POST-MEAL · 0–3h",
    cap: "Illustrative — insulin opens GLUT4 channels so glucose leaves the blood and fuels the cell; restore sensitivity and the post-meal curve flattens into range.",
  },
  sleep: {
    bar: "SLEEP ARCHITECTURE · OVERNIGHT",
    unit: "8h · POLYSOMNOGRAPHY",
    cap: "Illustrative — the night mapped stage by stage: the hypnogram, the EEG signature of each stage, and heart-rate recovery through deep sleep.",
  },
};

export default function JourneyDiagram({ kind }: { kind: DiagramKind }) {
  const reduced = useReducedMotion();
  const Diagram = DIAGRAMS[kind];
  const m = META[kind];
  return (
    <figure className="jp-plate">
      <figcaption className="jp-plate__bar">
        <span className="jp-plate__tag">
          <span className="jp-plate__live" aria-hidden="true" />
          {m.bar}
        </span>
        <span className="jp-plate__unit">{m.unit}</span>
      </figcaption>
      <div className="jp-plate__scroll">
        <svg className="jp-plate__svg" viewBox={`0 0 ${DW} ${DH}`} role="img" aria-label={m.cap}>
          <Diagram motion={!reduced} />
        </svg>
      </div>
      <p className="jp-plate__cap">{m.cap}</p>
    </figure>
  );
}
