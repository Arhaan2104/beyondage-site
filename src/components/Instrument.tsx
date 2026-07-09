"use client";

import { useEffect, useRef } from "react";

/**
 * Instrument — a small, refined 3D-wireframe visual engine (canvas 2D, custom
 * perspective projection + additive glow + depth fog + slow motion). One
 * cohesive "diagnostic instrument" language, varied per card, in BeyondAge's
 * emerald/gold. Built to read futuristic and intricate (Greptile-tier) while
 * staying on the practice's own thesis: reading the body in depth.
 *
 * Perf: a single shared rAF drives only the on-screen instruments; off-screen
 * ones are unregistered via IntersectionObserver, and the cadence is capped
 * (60fps desktop / 30fps touch) since the motion is slow ambient drift.
 * Reduced-motion → one static frame, no loop. roundRect has a manual fallback
 * for older Safari/iOS.
 */
export type InstrumentVariant = "scan" | "network" | "signal" | "protocol" | "gauge" | "flow";

/* ---- shared animation manager (one rAF for all visible instruments) ----
   The motion is slow and ambient, so we cap the cadence: 60fps on desktop
   (identical to a 60Hz reference, but halves the work on 120Hz ProMotion
   displays) and 30fps on touch devices (imperceptible for this drift, and it
   spares mobile CPU/GPU + battery). Frame-skipping only drops draws — the scenes
   are time-parametrised, so motion speed is unchanged, just its refresh. */
type Tick = (now: number) => void;
const ticks = new Set<Tick>();
let rafId = 0;
let lastFrame = 0;
let minDelta = -1; // resolved lazily, client-side, on first start
const resolveMinDelta = () => {
  if (typeof window === "undefined") return 1000 / 60 - 4;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  return 1000 / (coarse ? 30 : 60) - 4; // -4ms tolerance so a 60Hz display never under-runs
};
const runLoop = (now: number) => {
  rafId = requestAnimationFrame(runLoop);
  if (now - lastFrame < minDelta) return; // throttle to the target cadence
  lastFrame = now;
  for (const t of ticks) t(now);
};
const startLoop = () => {
  if (minDelta < 0) minDelta = resolveMinDelta();
  if (!rafId) rafId = requestAnimationFrame(runLoop);
};
const stopIfIdle = () => { if (rafId && ticks.size === 0) { cancelAnimationFrame(rafId); rafId = 0; } };

/* ---- math ---- */
type V3 = [number, number, number];
const rotY = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const rotX = ([x, y, z]: V3, a: number): V3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];

/* palette */
const EM = "47,174,122";       // #2fae7a
const EM_DK = "10,138,99";     // #0a8a63
const GOLD = "217,184,108";    // #d9b86c
const GOLD_BR = "241,221,166"; // #f1dda6

/* ctx.roundRect is absent on Safari < 16 / iOS < 16, where calling it throws and
   would break every node. Feature-detect once and fall back to a manual path —
   pixel-identical where native exists, correct everywhere else. */
const HAS_ROUND_RECT =
  typeof CanvasRenderingContext2D !== "undefined" &&
  typeof CanvasRenderingContext2D.prototype.roundRect === "function";
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (HAS_ROUND_RECT) { ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type Draw = (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void;

/* faint perspective grid — floor + ceiling receding to a horizon (shared base) */
function grid(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, drift = 0) {
  const vpX = W / 2, vpY = H * 0.46;
  ctx.save();
  ctx.lineWidth = 1;
  // converging verticals
  for (let i = -7; i <= 7; i++) {
    const fx = vpX + i * (W * 0.115);
    const a = 0.06 - Math.abs(i) * 0.004;
    ctx.strokeStyle = `rgba(${GOLD},${Math.max(0.012, a)})`;
    ctx.beginPath(); ctx.moveTo(vpX + i * (W * 0.012), vpY); ctx.lineTo(fx, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(vpX + i * (W * 0.012), vpY); ctx.lineTo(fx, 0); ctx.stroke();
  }
  // depth rows (animated toward viewer)
  const rows = 9;
  for (let k = 0; k < rows; k++) {
    const tt = ((k + (drift ? (t * drift) % 1 : 0)) / rows);
    const e = tt * tt;
    const a = 0.05 * (1 - tt) + 0.008;
    ctx.strokeStyle = `rgba(${EM},${a})`;
    const yF = vpY + (H - vpY) * e;
    ctx.beginPath(); ctx.moveTo(0, yF); ctx.lineTo(W, yF); ctx.stroke();
    const yC = vpY - vpY * e;
    ctx.beginPath(); ctx.moveTo(0, yC); ctx.lineTo(W, yC); ctx.stroke();
  }
  ctx.restore();
}

/* additive glowing node (rounded square, blueprint style) */
function node(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rgb: string, a: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = `rgba(${rgb},${a})`;
  ctx.shadowBlur = s * 3.2;
  ctx.fillStyle = `rgba(${rgb},${a})`;
  ctx.beginPath();
  const r = s * 0.32;
  roundRectPath(ctx, x - s / 2, y - s / 2, s, s, r);
  ctx.fill();
  ctx.restore();
}

/* draw a projected polyline with per-segment depth alpha + optional glow */
function polyDepth(ctx: CanvasRenderingContext2D, pts: number[][], rgb: string, base: number, glow = false, lw = 1.1) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0, d0] = pts[i];
    const [x1, y1, d1] = pts[i + 1];
    const dep = (d0 + d1) / 2; // 0..1, 1 = front
    const a = base * (0.18 + 0.82 * dep);
    ctx.strokeStyle = `rgba(${rgb},${a})`;
    ctx.lineWidth = lw * (0.7 + 0.6 * dep);
    if (glow && dep > 0.6) { ctx.shadowColor = `rgba(${rgb},${a})`; ctx.shadowBlur = 6; } else ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

/* ---------- scene factories ---------- */
function makeScene(v: InstrumentVariant): Draw {
  if (v === "scan") {
    const LAT = 9, LON = 18;
    return (ctx, W, H, t) => {
      grid(ctx, W, H, t);
      const R = Math.min(W, H) * 0.3, cx = W / 2, cy = H * 0.46, a = t * 0.32;
      const persp = (z: number) => 1 / (1 - z * 0.32);
      const P = (vx: number, vy: number, vz: number): number[] => {
        const vv: V3 = rotX(rotY([vx, vy, vz], a), 0.42);
        const pz = persp(vv[2]);
        return [cx + vv[0] * R * pz, cy - vv[1] * R * pz, (vv[2] + 1) / 2];
      };
      // latitude rings + longitude lines
      for (let i = 1; i < LAT; i++) {
        const phi = -Math.PI / 2 + (Math.PI * i) / LAT;
        const ring: number[][] = [];
        for (let j = 0; j <= LON; j++) {
          const th = (2 * Math.PI * j) / LON;
          ring.push(P(Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)));
        }
        polyDepth(ctx, ring, EM, 0.5, true);
      }
      for (let j = 0; j < LON; j += 1) {
        const th = (2 * Math.PI * j) / LON;
        const line: number[][] = [];
        for (let i = 0; i <= LAT; i++) {
          const phi = -Math.PI / 2 + (Math.PI * i) / LAT;
          line.push(P(Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)));
        }
        polyDepth(ctx, line, EM, 0.34);
      }
      // sweeping scan plane (gold ring travelling top→bottom through the sphere)
      const sy = Math.sin(t * 0.8) * 0.9;
      const scan: number[][] = [];
      for (let j = 0; j <= LON; j++) {
        const th = (2 * Math.PI * j) / LON;
        const r = Math.sqrt(Math.max(0, 1 - sy * sy));
        scan.push(P(r * Math.cos(th), sy, r * Math.sin(th)));
      }
      polyDepth(ctx, scan, GOLD_BR, 0.95, true, 1.5);
      // orbiting data nodes
      for (let k = 0; k < 4; k++) {
        const ang = a * 1.4 + (k * Math.PI) / 2;
        const p = P(1.35 * Math.cos(ang), 0.2 * Math.sin(ang * 1.3 + k), 1.35 * Math.sin(ang));
        node(ctx, p[0], p[1], 6 * (0.7 + 0.5 * p[2]), GOLD, 0.5 + 0.4 * p[2]);
      }
    };
  }

  if (v === "network") {
    const N = 11;
    const sats = Array.from({ length: N }, (_, k) => ({
      r: 0.85 + (k % 3) * 0.28,
      tilt: (k / N) * Math.PI - Math.PI / 2,
      phase: (k * 2.399),
      speed: 0.18 + (k % 4) * 0.05,
      up: k % 2 === 0,
    }));
    return (ctx, W, H, t) => {
      grid(ctx, W, H, t);
      const R = Math.min(W, H) * 0.32, cx = W / 2, cy = H * 0.46, a = t * 0.16;
      const persp = (z: number) => 1 / (1 - z * 0.34);
      const P = (vx: number, vy: number, vz: number): number[] => {
        const vv: V3 = rotY([vx, vy, vz], a);
        const pz = persp(vv[2]);
        return [cx + vv[0] * R * pz, cy - vv[1] * R * pz, (vv[2] + 1) / 2];
      };
      const core = P(0, 0, 0);
      const pos = sats.map((s) => {
        const ang = s.phase + t * s.speed;
        let p: V3 = [s.r * Math.cos(ang), 0, s.r * Math.sin(ang)];
        p = rotX(p, s.tilt);
        return P(p[0], p[1], p[2]);
      });
      // links core→sat
      for (const p of pos) polyDepth(ctx, [core, p], EM, 0.4);
      // faint inter-node links (near neighbours)
      for (let i = 0; i < pos.length; i++) {
        const p = pos[i], q = pos[(i + 3) % pos.length];
        polyDepth(ctx, [p, q], EM_DK, 0.14);
      }
      for (const p of pos) node(ctx, p[0], p[1], 6.5 * (0.7 + 0.5 * p[2]), GOLD, 0.45 + 0.45 * p[2]);
      node(ctx, core[0], core[1], 11, GOLD_BR, 0.95);
    };
  }

  if (v === "signal") {
    const traces = [
      { y: 0.34, amp: 0.10, freq: 3.1, sp: 1.0, rgb: GOLD, label: "ApoB" },
      { y: 0.56, amp: 0.07, freq: 4.2, sp: 1.3, rgb: EM, label: "HbA1c" },
      { y: 0.76, amp: 0.13, freq: 2.4, sp: 0.8, rgb: GOLD_BR, label: "HRV" },
    ];
    return (ctx, W, H, t) => {
      // baseline grid
      ctx.save(); ctx.lineWidth = 1;
      for (const tr of traces) { ctx.strokeStyle = `rgba(${EM},0.06)`; ctx.beginPath(); ctx.moveTo(W * 0.08, H * tr.y); ctx.lineTo(W * 0.94, H * tr.y); ctx.stroke(); }
      ctx.restore();
      for (const tr of traces) {
        const pts: number[][] = [];
        for (let i = 0; i <= 60; i++) {
          const x = 0.08 + (i / 60) * 0.86;
          const yy = tr.y + tr.amp * Math.sin(x * tr.freq * Math.PI * 2 + t * tr.sp) * Math.sin(x * Math.PI);
          pts.push([W * x, H * yy, 1]);
        }
        polyDepth(ctx, pts, tr.rgb, 0.85, true, 1.6);
        // riding node
        const hx = 0.08 + ((t * 0.12 + tr.freq * 0.1) % 1) * 0.86;
        const hy = tr.y + tr.amp * Math.sin(hx * tr.freq * Math.PI * 2 + t * tr.sp) * Math.sin(hx * Math.PI);
        node(ctx, W * hx, H * hy, 6, tr.rgb, 0.9);
        ctx.save();
        ctx.font = "600 8px ui-monospace, Menlo, monospace";
        ctx.fillStyle = `rgba(${tr.rgb},0.7)`;
        ctx.fillText(tr.label, W * 0.08, H * tr.y - H * 0.06);
        ctx.restore();
      }
    };
  }

  if (v === "protocol") {
    // A precision plan as a perspective "board": four lifestyle/treatment lanes
    // receding into depth, each a sequence of phase nodes. Progress is staggered
    // per lane (done → emerald + check, current → gold pulse, future → faint), a
    // gold thread traces the completed path, and a "now" line sweeps the board.
    // time runs left→right (X); four lanes stack in depth (Z) on a gently
    // reclined plane, so back lanes sit higher and smaller — a roadmap in 3D.
    const LANES = 4, PHASES = 6, tilt = 0.62, yaw = 0.12;
    const uP = (p: number) => -1 + (p / (PHASES - 1)) * 2;
    const zL = (l: number) => -0.62 + (l / (LANES - 1)) * 1.4;
    const drawCheck = (ctx2: CanvasRenderingContext2D, x: number, y: number, s: number) => {
      ctx2.save();
      ctx2.strokeStyle = `rgba(${GOLD_BR},0.95)`; ctx2.lineWidth = 1.2; ctx2.lineCap = "round"; ctx2.lineJoin = "round";
      ctx2.beginPath(); ctx2.moveTo(x - s, y); ctx2.lineTo(x - s * 0.2, y + s * 0.85); ctx2.lineTo(x + s, y - s * 0.9); ctx2.stroke();
      ctx2.restore();
    };
    return (ctx, W, H, t) => {
      grid(ctx, W, H, t);
      const cx = W / 2, cy = H * 0.5, R = Math.min(W, H) * 0.46;
      const persp = (z: number) => 1 / (1 - z * 0.26);
      const P = (u: number, z: number): number[] => {
        let p: V3 = [u, 0, z];
        p = rotX(p, tilt); p = rotY(p, yaw);
        const pz = persp(p[2]);
        return [cx + p[0] * R * pz, cy - p[1] * R * pz, (p[2] + 1) / 2];
      };
      const prog = ((t * 0.16) % 1) * (PHASES + 1) - 0.5;
      // lane rails (time direction) + phase columns (across lanes)
      for (let l = 0; l < LANES; l++) {
        const line: number[][] = [];
        for (let p = 0; p < PHASES; p++) line.push(P(uP(p), zL(l)));
        polyDepth(ctx, line, EM, 0.24);
      }
      for (let p = 0; p < PHASES; p++) {
        const line: number[][] = [];
        for (let l = 0; l < LANES; l++) line.push(P(uP(p), zL(l)));
        polyDepth(ctx, line, EM_DK, 0.1);
      }
      // per-lane gold progress thread + nodes (staggered completion)
      for (let l = 0; l < LANES; l++) {
        const lprog = prog - l * 0.35;
        const seg: number[][] = [];
        for (let p = 0; p < PHASES; p++) if (p <= lprog + 0.5) seg.push(P(uP(p), zL(l)));
        if (seg.length > 1) polyDepth(ctx, seg, GOLD, 0.72, true, 1.7);
        for (let p = 0; p < PHASES; p++) {
          const pt = P(uP(p), zL(l));
          const dep = 0.72 + 0.5 * pt[2];
          const cur = Math.abs(p - lprog) <= 0.5;
          const done = p < lprog - 0.3;
          if (cur) {
            const pulse = 0.6 + 0.4 * Math.sin(t * 3.8 + l);
            node(ctx, pt[0], pt[1], 8.5 * dep, GOLD_BR, 0.92 * pulse);
          } else if (done) {
            node(ctx, pt[0], pt[1], 6 * dep, EM, 0.58);
            drawCheck(ctx, pt[0], pt[1], 2.5 * dep);
          } else {
            node(ctx, pt[0], pt[1], 4 * dep, EM, 0.24);
          }
        }
      }
      // "now" line sweeping across all lanes at the current time
      const uc = uP(Math.max(0, Math.min(PHASES - 1, prog)));
      const a0 = P(uc, zL(0)), a1 = P(uc, zL(LANES - 1));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(${GOLD_BR},0.45)`; ctx.lineWidth = 1.3;
      ctx.shadowColor = `rgba(${GOLD},0.7)`; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
      ctx.restore();
    };
  }

  if (v === "gauge") {
    const rings = [
      { r: 1.0, tilt: 0.5, spin: 0.3, rgb: EM },
      { r: 0.74, tilt: -0.7, spin: -0.45, rgb: EM_DK },
      { r: 0.5, tilt: 0.9, spin: 0.6, rgb: GOLD },
    ];
    return (ctx, W, H, t) => {
      const R = Math.min(W, H) * 0.3, cx = W / 2, cy = H * 0.47;
      const persp = (z: number) => 1 / (1 - z * 0.3);
      for (const rg of rings) {
        const a = t * rg.spin;
        const pts: number[][] = [];
        for (let i = 0; i <= 48; i++) {
          const th = (i / 48) * Math.PI * 2;
          let p: V3 = [rg.r * Math.cos(th), rg.r * Math.sin(th), 0];
          p = rotX(p, rg.tilt); p = rotY(p, a);
          const pz = persp(p[2]);
          pts.push([cx + p[0] * R * pz, cy - p[1] * R * pz, (p[2] + 1) / 2]);
        }
        polyDepth(ctx, pts, rg.rgb, 0.6, true, 1.3);
      }
      // gold progress arc (89%) on the outer plane, facing forward
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(${GOLD_BR},0.9)`; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.shadowColor = `rgba(${GOLD},0.8)`; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * 0.89);
      ctx.stroke();
      ctx.restore();
      node(ctx, cx, cy, 7 + Math.sin(t * 1.5) * 1.5, GOLD_BR, 0.9);
    };
  }

  // flow — grid tunnel + rising trend ribbon with flowing nodes
  return (ctx, W, H, t) => {
    grid(ctx, W, H, t, 0.32);
    const vpX = W / 2, vpY = H * 0.46;
    const pts: number[][] = [];
    for (let i = 0; i <= 40; i++) {
      const u = i / 40; // 0 far → 1 near
      const e = u * u;
      const x = vpX + (W * 0.36) * (u * 0.9) * Math.sin(u * 3 + 0.6);
      const y = vpY + (H - vpY) * e - (H * 0.16) * u; // rises toward viewer
      pts.push([x, y, u]);
    }
    // area glow under the ribbon
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createLinearGradient(0, vpY, 0, H);
    g.addColorStop(0, `rgba(${GOLD},0)`); g.addColorStop(1, `rgba(${GOLD},0.14)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(pts[pts.length - 1][0], H); ctx.lineTo(pts[0][0], H); ctx.closePath(); ctx.fill();
    ctx.restore();
    polyDepth(ctx, pts, GOLD, 0.85, true, 1.7);
    // flowing nodes travelling toward the viewer (interpolated between path
    // samples so they glide smoothly instead of snapping node-to-node)
    for (let k = 0; k < 4; k++) {
      const u = ((t * 0.24 + k / 4) % 1);
      const f = u * 40;
      const idx = Math.min(pts.length - 2, Math.floor(f));
      const fr = f - idx;
      const a = pts[idx], b = pts[idx + 1];
      const px = a[0] + (b[0] - a[0]) * fr, py = a[1] + (b[1] - a[1]) * fr;
      node(ctx, px, py, 5 + 5 * u, GOLD_BR, 0.3 + 0.6 * u);
    }
  };
}

export default function Instrument({ variant }: { variant: InstrumentVariant }) {
  const canRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;
    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const scene = makeScene(variant);
    const render = (now: number) => { ctx.clearRect(0, 0, W, H); scene(ctx, W, H, now * 0.001); };
    render(performance.now());

    const tick: Tick = (now) => render(now);
    let registered = false;
    const io = new IntersectionObserver(
      (es) => {
        const vis = es[0].isIntersecting;
        if (vis && !reduce) { if (!registered) { ticks.add(tick); registered = true; startLoop(); } }
        else { if (registered) { ticks.delete(tick); registered = false; stopIfIdle(); } if (vis) render(performance.now()); }
      },
      { rootMargin: "140px" }
    );
    io.observe(host);

    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { resize(); render(performance.now()); }, 150); };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      if (registered) { ticks.delete(tick); stopIfIdle(); }
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
    };
  }, [variant]);

  return (
    <>
      <canvas ref={canRef} className="inst-canvas" aria-hidden="true" />
    </>
  );
}
