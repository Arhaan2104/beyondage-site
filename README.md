# BeyondAge

The site for BeyondAge — a members-only longevity practice in Gurugram, led by
senior physicians and built on clinical science. One long editorial page with a
single argument: find risk decades early, then design the years ahead.

## The page

Top to bottom, each section is its own component:

- **Hero** (`Hero.tsx`) — the value proposition beside a playable film of
  Dr Soin. It loops muted as an ambient preview; a click unmutes it.
- **What you get** (`WhatYouGet.tsx` · `Instrument.tsx`) — the concrete
  deliverables, each carried by a small animated diagnostic instrument.
- **The bench** (`page.tsx`) — the founders, then the specialist roster.
- **Why BeyondAge exists** — the founders' shift from late-stage cure to early
  prevention.
- **Health journeys** — cardiac, metabolic, sleep.
- **How it works** (`HowItWorks.tsx`) — the five-step process. Pinned,
  scroll-driven on desktop; stacked and numbered on phones.
- **The product** (`HealthspanDashboard.tsx`) — a member dashboard rebuilt
  natively: healthspan score, biological age, biomarkers, the day's actions.
- **Predict vs cure** (`PreventionVsCure.tsx` · `DiagnosticInstrument.tsx`) —
  the thesis, next to a risk curve that bends back down.
- **Invitation** — the one call to action.

## Running it

```bash
npm install
npm run dev
```

Then open [localhost:3000](http://localhost:3000). `npm run build` and
`npm start` for production; `npm run lint` for eslint.

## How it's built

- **Next.js 16** (App Router, Turbopack) with React 19 and TypeScript.
- **A handwritten design system** in `src/app/globals.css` — royal emerald lit
  like a gem, gold as the precious accent, ivory for light. Emerald-dark and
  warm-light sections alternate down the page. No component library.
- **Canvas instruments** (`Instrument.tsx`) — a small 3D-wireframe engine
  (custom perspective projection, additive glow, depth fog). One shared
  `requestAnimationFrame` drives every visible instrument; off-screen ones
  unregister via `IntersectionObserver`, and reduced-motion renders a single
  static frame.
- **Smooth scroll** via Lenis, wired in `SmoothScroll.tsx`.
- **Mobile-first.** Every section is designed for the phone and verified there;
  desktop layers on top — the pinned "how it works", the multi-column grids —
  without ever being the baseline.

## Type

The display face is **Newsreader**, self-hosted at build through `next/font` so
it renders identically on every device. Two licensed brand faces can slot in
ahead of it without touching any markup — see `public/fonts/README.md`. Until
they're added, the site falls back to a serif stack (Iowan / Palatino), never a
generic Google webfont.

## A note on the framework

This repo pins a build of Next.js that carries breaking changes from what you
may remember. `AGENTS.md` is the standing rule: read the relevant guide under
`node_modules/next/dist/docs/` before writing code against the framework.
