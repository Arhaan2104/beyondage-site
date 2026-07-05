"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Why BeyondAge — the thesis chapter. A dark, cinematic manifesto that states
 * the practice's whole idea in one breath: serious disease builds silently for
 * years, so the intelligent move is to find it early and act in the decades
 * before it arrives.
 *
 * Its centrepiece is a bespoke, *operable* diagnostic instrument — a "risk
 * across your life" readout you can scrub (drag / hover / arrow-keys). It draws
 * two paths: the silent progression that climbs unfelt until a late diagnosis,
 * and the BeyondAge path caught early at 40. Everything below the symptom
 * threshold is asymptomatic — the visual argument for the premise.
 *
 * Content is accurate to beyondage.health and the brief: advanced diagnostics,
 * genomics and AI, read by a bench of India's most respected specialists,
 * become a personalised plan and ongoing care. Three deep programmes: Cardiac,
 * Metabolic, Sleep.
 */

/* ---- model (pure) — age domain, the two risk paths, plot geometry ---- */
const A0 = 35, A1 = 75, CATCH = 40, THRESH = 0.8;
const PL = 50, PR = 770, PT = 46, PB = 286;
const VBW = 820, VBH = 348;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const tOf = (a: number) => (a - A0) / (A1 - A0);
/** Silent progression, untreated: rises slowly then accelerates. */
const silent = (a: number) => 0.05 + 0.92 * Math.pow(tOf(a), 2);
/** BeyondAge: tracks the silent path until the catch, then holds to a calm, low
 *  plateau — kept clearly off the baseline so it reads as its own path, not the axis. */
const beyond = (a: number) => {
  if (a <= CATCH) return silent(a);
  const sc = silent(CATCH);
  return sc + (0.17 - sc) * (1 - Math.exp(-(a - CATCH) * 0.1));
};
const X = (a: number) => PL + tOf(a) * (PR - PL);
const Y = (v: number) => PB - v * (PB - PT);
const dia = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z`;
/** Age where the silent path crosses the symptom threshold — the late diagnosis. */
const DIAG = A0 + Math.sqrt((THRESH - 0.05) / 0.92) * (A1 - A0);

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


export default function WhyBeyondAge() {
  const [age, setAge] = useState(58);
  const svgRef = useRef<SVGSVGElement>(null);
  const figRef = useRef<HTMLElement>(null);
  const userRef = useRef(false);
  const rafRef = useRef(0);

  // Reveal: scan the plot open left→right, then auto-sweep the playhead once to
  // teach that it's operable — unless the visitor has already grabbed it.
  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        fig.classList.add("is-drawn");
        io.disconnect();
        if (reduce || userRef.current) return;
        const dur = 2200;
        const start = performance.now();
        const step = (now: number) => {
          if (userRef.current) return;
          const p = clamp((now - start) / dur, 0, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setAge(A0 + e * (A1 - A0));
          if (p < 1) rafRef.current = requestAnimationFrame(step);
          else setAge(58);
        };
        // small beat after the scan reveal begins
        rafRef.current = requestAnimationFrame(() =>
          (rafRef.current = requestAnimationFrame(step))
        );
      },
      { threshold: 0.35 }
    );
    io.observe(fig);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const grab = () => {
    userRef.current = true;
    cancelAnimationFrame(rafRef.current);
  };
  const fromPointer = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const svgX = (clientX - r.left) * (VBW / r.width);
    setAge(clamp(A0 + ((svgX - PL) / (PR - PL)) * (A1 - A0), A0, A1));
  };
  const onDown = (e: React.PointerEvent) => {
    grab();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    fromPointer(e.clientX);
  };
  const onMove = (e: React.PointerEvent) => {
    // hover-scrub on mouse; drag-scrub (buttons held) on touch/pen
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    grab();
    fromPointer(e.clientX);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1,
      PageUp: 5, PageDown: -5,
    };
    let next: number | null = null;
    if (e.key in map) next = age + map[e.key];
    else if (e.key === "Home") next = A0;
    else if (e.key === "End") next = A1;
    if (next === null) return;
    e.preventDefault();
    grab();
    setAge(clamp(next, A0, A1));
  };

  const a = Math.round(age);
  const convPct = Math.round(silent(age) * 100);
  const beyPct = Math.round(beyond(age) * 100);
  const caption =
    a < CATCH
      ? "The first signals — silent, and years early."
      : a < Math.round(DIAG)
      ? "Caught at 40. Every year, the gap between the two paths widens."
      : "On the old path, this is where the diagnosis finally arrives.";

  const px = X(age);

  return (
    <section className="section why" id="about">
      <div className="why-field" aria-hidden="true">
        <div className="why-field__grid" />
        <div className="why-field__grain" />
      </div>

      <div className="measure why-inner">
        <div className="reveal why-head">
          <p className="eyebrow why-eyebrow">
            <span className="why-eyebrow__mark" /> What is BeyondAge
          </p>
          <h2 className="why-thesis">
            <span className="why-thesis__line">Serious disease builds in silence for years.</span>
            <span className="why-thesis__line">We find it while it&rsquo;s still a whisper.</span>
            <span className="why-thesis__line">And act in the <em>decades before it would ever arrive</em>.</span>
          </h2>
        </div>

        {/* Signature instrument — operable risk-across-your-life readout */}
        <figure className="reveal why-inst" ref={figRef}>
          <div className="why-inst__top">
            <span className="why-inst__tag">
              <i className="why-inst__live" /> Risk across your life · drag to explore
            </span>
            <div className="why-inst__readout">
              <span className="why-inst__age">AGE {a}</span>
              <span className="why-inst__stat why-inst__stat--conv">
                Untreated <b>{convPct}%</b>
              </span>
              <span className="why-inst__stat why-inst__stat--beyond">
                BeyondAge <b>{beyPct}%</b>
              </span>
            </div>
          </div>

          <svg
            ref={svgRef}
            className="why-inst__svg"
            viewBox={`0 0 ${VBW} ${VBH}`}
            role="slider"
            tabIndex={0}
            aria-label="Risk across your life, by age"
            aria-valuemin={A0}
            aria-valuemax={A1}
            aria-valuenow={a}
            aria-valuetext={`Age ${a}. ${caption}`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onKeyDown={onKey}
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
              <linearGradient id="whyPlay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#064d39" stopOpacity="0" />
                <stop offset="0.16" stopColor="#064d39" stopOpacity="0.42" />
                <stop offset="0.84" stopColor="#064d39" stopOpacity="0.42" />
                <stop offset="1" stopColor="#064d39" stopOpacity="0" />
              </linearGradient>
              <clipPath id="whyReveal">
                <rect className="why-reveal-rect" x={PL} y="0" height={VBH} />
              </clipPath>
            </defs>

            {/* whisper-fine vertical guides at each decade */}
            {TICKS.map((t) => (
              <line key={`v${t}`} className="why-g" x1={X(t)} y1={PT} x2={X(t)} y2={PB} />
            ))}
            <line className="why-base" x1={PL} y1={PB} x2={PR} y2={PB} />

            {/* scan-revealed content */}
            <g clipPath="url(#whyReveal)">
              {/* symptom threshold — a fine dotted line; everything under it is silent */}
              <line className="why-thr" x1={PL} y1={Y(THRESH)} x2={PR} y2={Y(THRESH)} />
              <text className="why-thrlab" x={PL + 2} y={Y(THRESH) - 9}>
                SYMPTOMS APPEAR
              </text>

              {/* soft area washes, then the two solid paths */}
              <path className="why-convarea" d={CONV_AREA} />
              <path className="why-beyarea" d={BEY_AREA} />
              <path className="why-bey" d={BEY_PATH} />
              <path className="why-conv" d={CONV_PATH} />

              {/* late diagnosis — where the silent path crosses into symptoms */}
              <path className="why-diag" d={dia(X(DIAG), Y(THRESH), 4.5)} />
              <text className="why-diaglab" x={X(DIAG) - 10} y={Y(THRESH) - 9} textAnchor="end">
                DIAGNOSIS
              </text>

              {/* caught-early — a slim leader up from the point the paths part */}
              <line className="why-catch" x1={X(CATCH)} y1={Y(silent(CATCH))} x2={X(CATCH)} y2={Y(0.46)} />
              <circle className="why-catchdot" cx={X(CATCH)} cy={Y(silent(CATCH))} r={3} />
              <text className="why-catchlab" x={X(CATCH) - 5} y={Y(0.46) - 5}>
                CAUGHT · 40
              </text>
            </g>

            {/* axis */}
            {TICKS.map((t) => (
              <text key={`ax${t}`} className="why-ax" x={X(t)} y={PB + 22} textAnchor="middle">
                {t}
              </text>
            ))}
            <text className="why-note" x={PL} y={VBH - 12}>
              ASYMPTOMATIC — THE BODY GIVES NO WARNING
            </text>

            {/* playhead (unclipped, follows the scrubber) */}
            <line className="why-playline" x1={px} y1={PT - 4} x2={px} y2={PB} stroke="url(#whyPlay)" />
            <circle className="why-dot why-dot--conv" cx={px} cy={Y(silent(age))} r={3.6} />
            <circle className="why-dot why-dot--bey" cx={px} cy={Y(beyond(age))} r={3.6} />
          </svg>

          <figcaption className="why-inst__cap">
            <span className="why-inst__caption">{caption}</span>
          </figcaption>
        </figure>

        {/* The founder's shift — from treating end-stage illness to preventing it */}
        <div className="reveal why-founder">
          <figure className="why-founder__photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/soin-poster.jpg" alt="Dr Arvinder Soin, Founder &amp; Chairman of BeyondAge" loading="lazy" />
          </figure>
          <div className="why-founder__body">
            <p className="eyebrow why-founder__eyebrow">Why BeyondAge exists</p>
            <blockquote className="why-founder__quote">
              For a career, he saved lives at the very end.{" "}
              <em>BeyondAge is the other end of that story.</em>
            </blockquote>
            <p className="why-founder__bio">
              Dr Arvinder Soin performed India&rsquo;s first liver transplant, and
              close to five thousand since — a Padma Shri for the work. BeyondAge
              turns that expertise upstream: finding disease in the decades before it
              would ever arrive.
            </p>
            <p className="why-founder__name">
              Dr Arvinder Soin <span>· Founder &amp; Chairman</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
