"use client";

import { useEffect, useRef } from "react";

/**
 * The risk instrument — a calm, static readout of one idea: serious-disease risk
 * climbs with age, but caught early at 40 the BeyondAge path holds low while the
 * untreated path keeps rising. Two directly-labelled paths and a single clear
 * "Caught at 40" marker — nothing else to decode. The traces draw themselves on
 * when the card scrolls into view.
 *
 * Illustrative — a conceptual model of how early detection bends the curve, not
 * patient-specific data.
 */

/* ---- model (pure) — age domain, the two risk paths, plot geometry ---- */
const A0 = 35, A1 = 75, CATCH = 40;
const PL = 50, PR = 770, PT = 46, PB = 286;
const VBW = 820, VBH = 348;

const tOf = (a: number) => (a - A0) / (A1 - A0);
/** Untreated: rises slowly, then accelerates. */
const silent = (a: number) => 0.05 + 0.92 * Math.pow(tOf(a), 2);
/** BeyondAge: tracks the untreated path until the catch at 40, then holds to a
 *  calm, low plateau — kept clearly off the baseline so it reads as its own path. */
const beyond = (a: number) => {
  if (a <= CATCH) return silent(a);
  const sc = silent(CATCH);
  return sc + (0.17 - sc) * (1 - Math.exp(-(a - CATCH) * 0.1));
};
const X = (a: number) => PL + tOf(a) * (PR - PL);
const Y = (v: number) => PB - v * (PB - PT);

function pathFor(fn: (a: number) => number) {
  const N = 72;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const a = A0 + (i / N) * (A1 - A0);
    d += `${i ? "L" : "M"}${X(a).toFixed(1)} ${Y(fn(a)).toFixed(1)} `;
  }
  return d.trim();
}
const areaFor = (fn: (a: number) => number) =>
  `${pathFor(fn)} L${X(A1).toFixed(1)} ${PB} L${X(A0).toFixed(1)} ${PB} Z`;

const CONV_PATH = pathFor(silent);
const CONV_AREA = areaFor(silent);
const BEY_PATH = pathFor(beyond);
const BEY_AREA = areaFor(beyond);
const TICKS = [35, 45, 55, 65, 75];

export default function RiskInstrument() {
  const figRef = useRef<HTMLElement>(null);

  // Draw the traces on when the card scrolls into view.
  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        fig.classList.add("is-drawn");
        io.disconnect();
      },
      { threshold: 0.35 }
    );
    io.observe(fig);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="reveal why-inst" ref={figRef}>
      <div className="why-inst__top">
        <span className="why-inst__tag">
          <i className="why-inst__live" /> Risk of serious disease, by age
        </span>
      </div>

      <svg
        className="why-inst__svg why-inst__svg--static"
        viewBox={`0 0 ${VBW} ${VBH}`}
        role="img"
        aria-label="Serious-disease risk rises with age. Caught early at 40, the BeyondAge path stays low while the untreated path climbs steeply."
      >
        <defs>
          <linearGradient id="whyConv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9724f" stopOpacity="0.16" />
            <stop offset="0.55" stopColor="#c9724f" stopOpacity="0.045" />
            <stop offset="1" stopColor="#c9724f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="whyBey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a8a63" stopOpacity="0.16" />
            <stop offset="0.6" stopColor="#0a8a63" stopOpacity="0.04" />
            <stop offset="1" stopColor="#0a8a63" stopOpacity="0" />
          </linearGradient>
          <clipPath id="whyReveal">
            <rect className="why-reveal-rect" x={PL} y="0" height={VBH} />
          </clipPath>
        </defs>

        {/* whisper-fine vertical guides at each decade + baseline */}
        {TICKS.map((t) => (
          <line key={`v${t}`} className="why-g" x1={X(t)} y1={PT} x2={X(t)} y2={PB} />
        ))}
        <line className="why-base" x1={PL} y1={PB} x2={PR} y2={PB} />

        <g clipPath="url(#whyReveal)">
          {/* soft area washes, then the two solid paths */}
          <path className="why-convarea" d={CONV_AREA} />
          <path className="why-beyarea" d={BEY_AREA} />
          <path className="why-bey" d={BEY_PATH} />
          <path className="why-conv" d={CONV_PATH} />

          {/* the one clear annotation: caught early, at 40 — a full-height guide,
              a node where the paths part, and a label held at the top */}
          <line className="why-catchline" x1={X(CATCH)} y1={PT + 4} x2={X(CATCH)} y2={PB} />
          <circle className="why-catchdot why-catchdot--halo" cx={X(CATCH)} cy={Y(silent(CATCH))} r={7} />
          <circle className="why-catchdot" cx={X(CATCH)} cy={Y(silent(CATCH))} r={4} />
          <text className="why-catchlab" x={X(CATCH)} y={PT - 6} textAnchor="middle">
            Caught at 40
          </text>
        </g>

        {/* direct path labels stay outside the reveal mask so the diagram is
            legible even while the traces draw in. */}
        <text className="why-linelab why-linelab--conv" x={PR} y={Y(silent(A1)) - 13} textAnchor="end">
          Untreated
        </text>
        <text className="why-linelab why-linelab--bey" x={PR} y={Y(beyond(A1)) - 14} textAnchor="end">
          With BeyondAge
        </text>

        {/* age axis */}
        {TICKS.map((t) => (
          <text key={`ax${t}`} className="why-ax" x={X(t)} y={PB + 22} textAnchor="middle">
            {t}
          </text>
        ))}
      </svg>
    </figure>
  );
}
