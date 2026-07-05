"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * "How it works" — Mederva-style pinned, scroll-driven tab reveal, rebuilt in
 * BeyondAge's emerald/gold palette. The section pins for four screen-heights;
 * scroll advances the active step (01→04), sliding the emerald pill down the
 * numbered list on the left while the right panel — an abstract diagnostic
 * bloom + heading + body — crossfades. Tabs are also clickable. Reduced-motion
 * users get a static, click-only version (no pin, no scroll hijack).
 */
// Content and imagery mirror the live beyondage.health five-step process.
// The right-side photographs are the originals, sourced from the live site.
const STEPS = [
  {
    n: "01",
    tab: "Discovery call",
    heading: "Book your discovery call",
    body: "Connect with our team to understand how we can help you achieve your health goals.",
    img: "/assets/how/step1-discovery.jpg",
  },
  {
    n: "02",
    tab: "Consultation",
    heading: "Initial consultation",
    body: "You meet our longevity physician, who shapes your personalised diagnostics plan around your medical history, lifestyle and goals.",
    img: "/assets/how/step2-consultation.jpg",
  },
  {
    n: "03",
    tab: "Diagnostics",
    heading: "Diagnostics & testing",
    body: "Lab tests, imaging, biomarkers and genomics, read with AI and curated for the early detection of risk.",
    img: "/assets/how/step3-diagnostics.jpg",
  },
  {
    n: "04",
    tab: "Your plan",
    heading: "Personalised health plan",
    body: "Your clinical team translates your advanced-diagnostics results into a precision health-optimisation plan, combining lifestyle interventions and proven anti-aging treatments.",
    img: "/assets/how/step4-plan.jpg",
  },
  {
    n: "05",
    tab: "Monitoring",
    heading: "Continuity of care & monitoring",
    body: "Our coaches and health team follow up with you regularly and adjust the plan to ensure positive health trends and outcomes.",
    img: "/assets/how/step5-monitoring.jpg",
  },
];

export default function HowItWorks() {
  const secRef = useRef<HTMLElement>(null);
  const reducedRef = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    // The pinned, scroll-driven engine only runs where the layout is actually
    // pinned: wide screens with motion allowed. On phones/tablets the CSS unpins
    // and shows every step stacked, so we keep the engine off entirely.
    const pinnable = window.matchMedia("(min-width: 861px)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");

    let raf = 0;
    let attached = false;
    const measure = () => {
      raf = 0;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      setActive((a) => (a === idx ? a : idx));
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(measure); };

    const sync = () => {
      const on = pinnable.matches && motionOk.matches;
      reducedRef.current = !on; // jump() skips the scroll math when not pinned
      if (on && !attached) {
        window.addEventListener("scroll", kick, { passive: true });
        window.addEventListener("resize", kick);
        attached = true;
        measure();
      } else if (!on && attached) {
        window.removeEventListener("scroll", kick);
        window.removeEventListener("resize", kick);
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        attached = false;
        setActive(0);
      }
    };
    sync();
    pinnable.addEventListener("change", sync);
    motionOk.addEventListener("change", sync);
    return () => {
      pinnable.removeEventListener("change", sync);
      motionOk.removeEventListener("change", sync);
      if (attached) {
        window.removeEventListener("scroll", kick);
        window.removeEventListener("resize", kick);
      }
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (i: number) => {
    setActive(i);
    const sec = secRef.current;
    if (!sec || reducedRef.current) return;
    const total = sec.offsetHeight - window.innerHeight;
    const y = sec.offsetTop + ((i + 0.5) / STEPS.length) * total;
    const lenis = (window as unknown as { lenis?: { scrollTo?: (t: number) => void } }).lenis;
    if (lenis?.scrollTo) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={secRef} className="section how" id="how">
      <div className="how-viewport">
        <div className="measure how-inner">
          <div className="reveal">
            <h2 className="chapter-title how-title">How it Works</h2>
          </div>

          <div className="how-grid">
            <ol
              className="how-tabs"
              style={{ ["--active" as string]: String(active) }}
            >
              <span className="how-pill" aria-hidden="true" />
              {STEPS.map((s, i) => (
                <li key={s.n} className="how-tab-row">
                  <button
                    type="button"
                    className={`how-tab${i === active ? " is-active" : ""}`}
                    aria-current={i === active}
                    onClick={() => jump(i)}
                  >
                    <span className="how-tab__label">{s.tab}</span>
                    <span className="how-tab__num">{s.n}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="how-stage">
              {STEPS.map((s, i) => (
                <article
                  key={s.n}
                  className={`how-panel${i === active ? " is-active" : ""}`}
                  aria-hidden={i !== active}
                >
                  <div className="how-viz">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="how-viz__img"
                      src={s.img}
                      alt={s.heading}
                      loading="lazy"
                      draggable={false}
                    />
                    <span className="how-viz__grain" aria-hidden="true" />
                  </div>
                  <h3 className="how-panel__heading">{s.heading}</h3>
                  <p className="how-panel__body">{s.body}</p>
                  <Link href="/begin-journey" className="how-panel__cta">
                    <span aria-hidden="true">↳</span> Begin your journey
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
