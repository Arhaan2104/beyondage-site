"use client";

import { useEffect, useRef, useState } from "react";

const DIMENSIONS = [
  {
    n: "01",
    label: "Physical",
    title: "Body",
    image: "/assets/healthspan-dimensions/physical.jpg",
    alt: "A person holding a graceful standing yoga pose, silhouetted against an ocean sunset",
    pills: ["Free from illness", "Peak performance", "Weight optimisation", "Age reversal"],
  },
  {
    n: "02",
    label: "Mental",
    title: "Mind",
    image: "/assets/healthspan-dimensions/mental.jpg",
    alt: "An older man absorbed in a game of chess in a sunlit garden",
    pills: ["Healthy mind", "Sharp memory", "Stress reduction", "Emotional equilibrium"],
  },
  {
    n: "03",
    label: "Social",
    title: "Connection",
    image: "/assets/healthspan-dimensions/social.jpg",
    alt: "Three generations of a family sitting close together on a park bench",
    pills: ["Deep connections", "Work-life balance", "Community bonding", "Healthy relationships"],
  },
  {
    n: "04",
    label: "Spiritual",
    title: "Purpose",
    image: "/assets/healthspan-dimensions/spiritual.jpg",
    alt: "A hiker and his dog cresting a mountain ridge at sunrise",
    pills: ["Inner strength", "Harmony", "Mental resilience", "Purpose"],
  },
];

export default function HealthspanDimensions() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [stacked, setStacked] = useState(false);

  const goToDimension = (index: number) => {
    setActive(index);
    const pin = pinRef.current;
    if (!pin || stacked) return;

    const total = pin.offsetHeight - window.innerHeight;
    const start = window.scrollY + pin.getBoundingClientRect().top;
    const target = start + Math.min(total - 1, Math.max(0, (index / DIMENSIONS.length) * total + 2));
    const lenis = (window as unknown as { lenis?: { scrollTo?: (target: number) => void } }).lenis;

    if (lenis?.scrollTo) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const pinnable = window.matchMedia("(min-width: 921px)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");

    let raf = 0;
    let attached = false;

    const measure = () => {
      raf = 0;
      const rect = pin.getBoundingClientRect();
      const total = pin.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const idx = Math.min(DIMENSIONS.length - 1, Math.floor(progress * DIMENSIONS.length));
      setActive((current) => (current === idx ? current : idx));
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    const sync = () => {
      const on = pinnable.matches && motionOk.matches;
      setStacked(!on);
      if (on && !attached) {
        window.addEventListener("scroll", kick, { passive: true });
        window.addEventListener("resize", kick);
        attached = true;
        measure();
      } else if (!on && attached) {
        window.removeEventListener("scroll", kick);
        window.removeEventListener("resize", kick);
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
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

  return (
    <section className="hsd" id="healthspan">
      <div className="hsd-pin" ref={pinRef}>
        <div
          className="hsd-stage"
          style={{
            ["--active" as string]: String(active),
            ["--progress" as string]: `${((active + 1) / DIMENSIONS.length) * 100}%`,
          }}
        >
          <div className="hsd-runhead">
            <h2 className="hsd-runhead__title">
              <em>Healthspan</em> isn&rsquo;t<br />one number.
            </h2>
            <p className="hsd-runhead__sub">
              Four dimensions of a life<br />well-lived, measured together.
            </p>
          </div>

          {DIMENSIONS.map((dimension, index) => {
            const shown = stacked || index === active;

            return (
              <article
                key={dimension.label}
                className={`hsd-panel${index === active ? " is-active" : ""}`}
                aria-hidden={stacked ? undefined : index !== active}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? "scale(1)" : "scale(1.035)",
                  pointerEvents: shown ? "auto" : "none",
                  zIndex: index === active ? 1 : 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hsd-panel__img"
                  src={dimension.image}
                  alt={dimension.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
                <div className="hsd-panel__scrim" aria-hidden="true" />
                <div className="hsd-panel__grain" aria-hidden="true" />

                <div className="hsd-copy">
                  <p className="hsd-kicker">
                    {dimension.n} / {dimension.label}
                  </p>
                  <h3>{dimension.title}</h3>
                  <ul className="hsd-pills" aria-label={`${dimension.label} outcomes`}>
                    {dimension.pills.map((pill) => (
                      <li key={pill}>{pill}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}

          <nav className="hsd-rail" aria-label="Healthspan dimensions">
            <span className="hsd-rail__track" aria-hidden="true" />
            <span
              className="hsd-rail__fill"
              aria-hidden="true"
              style={{ width: `${((active + 1) / DIMENSIONS.length) * 100}%` }}
            />
            {DIMENSIONS.map((dimension, index) => (
              <button
                key={dimension.label}
                type="button"
                className={`hsd-rail__item${index === active ? " is-active" : ""}`}
                aria-current={index === active}
                onClick={() => goToDimension(index)}
              >
                {dimension.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
