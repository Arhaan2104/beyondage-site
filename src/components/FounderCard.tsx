"use client";

import { useRef, useState } from "react";

/**
 * Founder feature card — the enlarged frame plays the founder's film (mirrors
 * the live site's "Founders Vision"). Static poster + a frosted play disc; a
 * click plays the film with sound inline, a click on the film pauses it. The
 * play disc fades away while it plays, so the film reads clean.
 */
export type Founder = {
  name: string;
  role: string;
  /** National honour written after the name (e.g. "Padma Shri"); shown as a gold badge. */
  honor?: string | null;
  cred: string | null;
  href: string | null;
  video: string;
  poster: string;
};

export default function FounderCard({ name, role, honor, cred, href, video, poster }: Founder) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    videoRef.current?.play().catch(() => {});
  };
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="founder-card reveal">
      <div className={`founder-card__photo founder-card__photo--film${playing ? " is-playing" : ""}`}>
        <video
          ref={videoRef}
          className="founder-card__video"
          src={video}
          poster={poster}
          playsInline
          preload="none"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        <button
          type="button"
          className="founder-card__play"
          onClick={play}
          aria-label={`Play ${name}'s film`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      <div className="founder-card__meta">
        <div className="founder-card__name-row">
          <h3 className="founder-card__name">{name}</h3>
          {honor && (
            <span className="founder-card__honor" title={`${honor} — national honour`}>
              {honor}
            </span>
          )}
        </div>
        <p className="founder-card__role">{role}</p>
        {cred && <p className="founder-card__cred">{cred}</p>}
        {href && (
          <a className="founder-card__more is-link" href={href}>
            View profile <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
