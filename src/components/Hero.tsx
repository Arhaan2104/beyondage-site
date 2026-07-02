"use client";

import { useRef, useState } from "react";

/**
 * Editorial hero: value proposition left, a playable film of Dr Soin right
 * (Neko-style contained panel). The film loops muted as an ambient preview;
 * clicking unmutes and plays it with sound.
 */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!sound) {
      v.muted = false;
      v.currentTime = 0;
      v.play().catch(() => {});
      setSound(true);
    } else {
      v.muted = true;
      setSound(false);
    }
  };

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
          <p className="eyebrow hero-eyebrow">BeyondAge · By invitation</p>
          <h1 className="hero-h1">
            The science of a <em>longer</em> life.
          </h1>
          <p className="hero-sub">
            A members-only longevity practice in Gurugram, led by some of India&rsquo;s
            most respected physicians and powered by clinical science. We find risk
            decades early — and design the years ahead.
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
            <span>
              Founded by <strong>Dr Arvinder Soin</strong>, Padma Shri, &amp;{" "}
              <strong>Dr Vritti Loomba</strong>
            </span>
          </p>
        </div>

        <figure className="hero-media">
          <span className="hero-media__halo" aria-hidden="true" />
          <div className="hero-media__frame">
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
            />
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
          <figcaption className={`hero-media__cap${sound ? " is-hidden" : ""}`}>
            <span className="hero-media__cap-k">Watch · 2:43</span>
            <span className="hero-media__cap-t">Dr Arvinder Soin — why we built BeyondAge</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
