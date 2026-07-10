import React from "react";

/**
 * Bespoke hairline glyphs for the forthcoming Health Journeys — one per system,
 * drawn in the site's precision-instrument language (thin emerald stroke, a
 * single gold focal accent) so the "coming soon" registry reads as a cohesive
 * scientific catalogue rather than clip-art. Consistent 40×40 viewBox; styling
 * (stroke colour/width/caps, gold accents) lives in `.uj-glyph` CSS.
 *
 * The three live programmes use their real instruments (journeyInstruments.tsx);
 * these stand in for systems not yet online.
 */

export type UpcomingSystem = { name: string; k: string; glyph: React.JSX.Element };

const dot = (cx: number, cy: number, r = 1.6) => (
  <circle className="g-dot" cx={cx} cy={cy} r={r} />
);

export const UPCOMING_SYSTEMS: UpcomingSystem[] = [
  {
    name: "Brain Health",
    k: "Cognition & neuro",
    glyph: (
      <>
        <circle cx="15.5" cy="20" r="8.5" />
        <circle cx="24.5" cy="20" r="8.5" />
        <path d="M20 11.6v16.8" />
        <path d="M15.5 15.5q3.4 2.2 0 4.4" />
        <path d="M24.5 15.5q-3.4 2.2 0 4.4" />
        {dot(20, 20, 1.5)}
      </>
    ),
  },
  {
    name: "Cancer Prevention",
    k: "Early detection",
    glyph: (
      <>
        <circle cx="20" cy="20" r="11" />
        <circle cx="20" cy="20" r="5" />
        <path d="M20 4.5v4.5M20 31v4.5M4.5 20h4.5M31 20h4.5" />
        {dot(20, 20, 1.6)}
      </>
    ),
  },
  {
    name: "Gut Health",
    k: "Microbiome & digestion",
    glyph: (
      <>
        <path d="M13 10c11 0 11 6.5 0 6.5s-11 6.5 0 6.5 11 6.5 0 6.5" />
        {dot(27.6, 10, 1.5)}
      </>
    ),
  },
  {
    name: "Liver Health",
    k: "Detox & metabolism",
    glyph: (
      <>
        <path d="M8 15.5c0-3.6 3.4-4.6 9-3.6 7.5-1.8 15 1.4 14 7.6-1.2 7.8-9.6 11.4-16.4 8.4C9 25.6 8 20.4 8 15.5Z" />
        <path d="M20.5 12.4v6.2" />
        {dot(25, 19, 1.5)}
      </>
    ),
  },
  {
    name: "Lung Health",
    k: "Respiratory & oxygen",
    glyph: (
      <>
        <path d="M20 8v9" />
        <path d="M20 17c-6 0-9.5 4-8.6 13 .3 3 5 2.8 5-1.2 0-6.8 3.6-8.8 3.6-11.8" />
        <path d="M20 17c6 0 9.5 4 8.6 13-.3 3-5 2.8-5-1.2 0-6.8-3.6-8.8-3.6-11.8" />
        {dot(20, 12, 1.4)}
      </>
    ),
  },
  {
    name: "Musculoskeletal Fitness",
    k: "Bone, muscle & joints",
    glyph: (
      <>
        <circle cx="12.5" cy="12" r="3.1" />
        <circle cx="9" cy="15.5" r="3.1" />
        <circle cx="27.5" cy="28" r="3.1" />
        <circle cx="31" cy="24.5" r="3.1" />
        <path d="M13.5 15.5 26.5 24.5" />
      </>
    ),
  },
  {
    name: "Sexual Health",
    k: "Hormones & vitality",
    glyph: (
      <>
        <path d="M14 8q12 6 0 12-12 6 0 12" />
        <path d="M26 8q-12 6 0 12 12 6 0 12" />
        <path d="M15.6 12h8.8M14.2 20h11.6M15.6 28h8.8" />
        {dot(20, 20, 1.5)}
      </>
    ),
  },
  {
    name: "Mental Health",
    k: "Mood & resilience",
    glyph: (
      <>
        <circle cx="20" cy="18.5" r="9" />
        <path d="M15.5 19.5q4.5-5 9 0" />
        <path d="M12.8 19.5q7.2-8 14.4 0" />
        {dot(20, 18.5, 1.4)}
      </>
    ),
  },
  {
    name: "Aesthetics",
    k: "Skin & anti-aging",
    glyph: (
      <>
        <path d="M20 8c1 6.6 4.4 10 11 11-6.6 1-10 4.4-11 11-1-6.6-4.4-10-11-11 6.6-1 10-4.4 11-11Z" />
        {dot(20, 19, 1.5)}
      </>
    ),
  },
  {
    name: "Men's Health",
    k: "Male physiology",
    glyph: (
      <>
        <circle cx="17" cy="23" r="8" />
        <path d="M23.4 16.6 31 9" />
        <path d="M24.5 9H31v6.5" />
        {dot(17, 23, 1.5)}
      </>
    ),
  },
  {
    name: "Women's Health",
    k: "Female physiology",
    glyph: (
      <>
        <circle cx="20" cy="16" r="8" />
        <path d="M20 24v10" />
        <path d="M15 29h10" />
        {dot(20, 16, 1.5)}
      </>
    ),
  },
  {
    name: "Mindfulness",
    k: "Focus & calm",
    glyph: (
      <>
        <path d="M20 30.5c-3-9 0-17.5 0-17.5s3 8.5 0 17.5Z" />
        <path d="M20 30.5c-6.5-6-8.5-14-8.5-14s8 3.2 8.5 14Z" />
        <path d="M20 30.5c6.5-6 8.5-14 8.5-14s-8 3.2-8.5 14Z" />
        <path d="M10.5 31q9.5 3.4 19 0" />
        {dot(20, 21, 1.4)}
      </>
    ),
  },
  {
    name: "Detox",
    k: "Cellular cleanse",
    glyph: (
      <>
        <path d="M20 7.5s-9 10.4-9 17a9 9 0 0 0 18 0c0-6.6-9-17-9-17Z" />
        <path d="M15.5 25q4.5 4 9 0" />
        {dot(16.5, 22.5, 1.4)}
      </>
    ),
  },
];
