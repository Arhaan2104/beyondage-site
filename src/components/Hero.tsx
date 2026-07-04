"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Editorial hero: value proposition left, the founder film right — housed as a
 * "diagnostic viewport" (the film read like one of the site's own instruments).
 * A telemetry header, gold corner ticks, and a real scrub timeline wrap a native
 * 16:9 film that loops muted as an ambient preview; the disc unmutes it, the
 * expand control opens it full-screen. Telemetry is honest film metadata only
 * (title, runtime, elapsed) — the equalizer is a decorative audio cue, not data.
 */
const RUNTIME = 163; // 2:43, known runtime — avoids a 0:00 flash before metadata

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const [sound, setSound] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(RUNTIME);
  const [progress, setProgress] = useState(0);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!sound) {
      v.muted = false;
      if (!startedRef.current) { v.currentTime = 0; startedRef.current = true; }
      v.play().catch(() => {});
      setSound(true);
    } else {
      v.muted = true;
      setSound(false);
    }
  };

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setElapsed(v.currentTime);
    setDuration(v.duration);
    setProgress(v.currentTime / v.duration);
  };
  const onMeta = () => {
    const v = videoRef.current;
    if (v && v.duration) setDuration(v.duration);
  };

  // Scrub — click/drag or keyboard, mirroring the risk-scrubber pattern.
  const seekFromX = (clientX: number) => {
    const v = videoRef.current;
    const track = scrubRef.current;
    if (!v || !track || !v.duration) return;
    const r = track.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    v.currentTime = p * v.duration;
    setProgress(p);
    setElapsed(p * v.duration);
  };
  const onScrubDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    seekFromX(e.clientX);
  };
  const onScrubMove = (e: React.PointerEvent) => {
    if (e.buttons === 0) return; // drag only
    seekFromX(e.clientX);
  };
  const onScrubKey = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = v.currentTime + 5;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = v.currentTime - 5;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = v.duration;
    if (next === null) return;
    e.preventDefault();
    v.currentTime = Math.min(v.duration, Math.max(0, next));
  };

  const enterFullscreen = () => {
    const el = frameRef.current;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (el?.requestFullscreen) {
      el.requestFullscreen().then(() => {
        if (v) { v.muted = false; v.controls = true; setSound(true); }
      }).catch(() => {});
    } else if (v?.webkitEnterFullscreen) {
      v.muted = false;
      setSound(true);
      v.webkitEnterFullscreen();
    }
  };

  // Strip native controls again once full-screen is dismissed.
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && videoRef.current) videoRef.current.controls = false;
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const pct = `${(progress * 100).toFixed(2)}%`;

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg__base" />
        <div className="hero-bg__engrave" />
        <div className="hero-bg__glow hero-bg__glow--1" />
        <div className="hero-bg__glow hero-bg__glow--2" />
        <div className="hero-bg__glow hero-bg__glow--3" />
        <div className="hero-bg__grain" />
        <div className="hero-bg__sheen" />
        <div className="hero-bg__vignette" />
      </div>

      <div className="hero-inner">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">By invitation</p>
          <h1 className="hero-h1">
            The science of a <em>longer</em> life.
          </h1>
          <p className="hero-sub">
            A members-only longevity practice in Gurugram, built by some of
            India&rsquo;s most respected physicians. We find risk decades early —
            and design the years ahead.
          </p>
          <div className="hero-actions">
            <a href="#invitation" className="cta cta--emerald">
              Request an invitation
            </a>
          </div>
          <p className="hero-cred">
            <span className="hero-cred__faces">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/soin.png" alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/loomba.png" alt="" />
            </span>
            <span className="hero-cred__names">
              <span className="hero-cred__line">
                Founded by <strong>Dr Arvinder Soin</strong>, Padma Shri,
              </span>
              <span className="hero-cred__line">
                &amp; <strong>Dr Vritti Loomba</strong>
              </span>
            </span>
          </p>
        </div>

        <figure className="hero-media">
          <span className="hero-media__halo" aria-hidden="true" />
          <div className="hero-media__housing" ref={frameRef}>
            <div className="hero-media__chrome hero-media__chrome--top">
              <span className="hero-media__id">Dr Arvinder Soin — Why We Built BeyondAge</span>
              <span className="hero-media__meta">
                <span className={`hero-media__eq${sound ? " is-on" : ""}`} aria-hidden="true">
                  <i /><i /><i /><i /><i />
                </span>
                <span className="hero-media__time">
                  {fmt(elapsed)} <span>/ {fmt(duration)}</span>
                </span>
              </span>
            </div>

            <div className="hero-media__screen">
              <video
                ref={videoRef}
                className="hero-media__video"
                src="/assets/soin-interview.mp4"
                poster="/assets/soin-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={onMeta}
                onTimeUpdate={onTime}
              />
              <span className="hero-media__grade" aria-hidden="true" />
              <span className="hero-media__grain" aria-hidden="true" />
              <span className="hero-media__ticks" aria-hidden="true">
                <i /><i /><i /><i />
              </span>

              <button
                type="button"
                className="hero-media__expand"
                onClick={enterFullscreen}
                aria-label="Expand to full screen"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 3H3v6M21 9V3h-6M15 21h6v-6M3 15v6h6" />
                </svg>
              </button>

              <button
                type="button"
                className={`hero-media__play${sound ? " is-playing" : ""}`}
                onClick={toggleSound}
                aria-label={sound ? "Mute" : "Play with sound"}
              >
                {sound ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 9v6h4l5 5V4L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="hero-media__chrome hero-media__chrome--bottom">
              <div
                ref={scrubRef}
                className="hero-media__scrub"
                role="slider"
                tabIndex={0}
                aria-label="Seek film"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(elapsed)}
                aria-valuetext={`${fmt(elapsed)} of ${fmt(duration)}`}
                onPointerDown={onScrubDown}
                onPointerMove={onScrubMove}
                onKeyDown={onScrubKey}
              >
                <span className="hero-media__scrub-track">
                  <span className="hero-media__scrub-fill" style={{ width: pct }} />
                  <span className="hero-media__scrub-head" style={{ left: pct }} />
                </span>
              </div>
            </div>
          </div>

          <figcaption className={`hero-media__cap${sound ? " is-hidden" : ""}`}>
            <span className="hero-media__cap-cred">
              Padma Shri · ~5,000 liver transplants · India&rsquo;s liver-transplant pioneer
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
