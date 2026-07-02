/**
 * The hero's visual payload: "the next thirty years" risk trajectory.
 * Conventional care lets risk climb silently to a late diagnosis; BeyondAge
 * catches it early and bends the curve down. Pure SVG + CSS draw-on-load
 * (no JS), reduced-motion safe, crisp at any size. On-thesis, ownable.
 */

const VB_W = 600;
const VB_H = 380;
const X0 = 70;
const X1 = 572;
const Y0 = 30; // top
const Y1 = 328; // bottom (year axis)

const X = (yr: number) => X0 + (yr / 30) * (X1 - X0);
const Y = (r: number) => Y1 - r * (Y1 - Y0);

type Pt = [number, number];

function smooth(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

// year, cumulative-risk (0..1)
const CONV: Pt[] = [
  [0, 0.06], [6, 0.13], [12, 0.28], [17, 0.53], [21, 0.79], [25, 0.92], [30, 0.98],
].map(([yr, r]) => [X(yr), Y(r)]);

const BEYOND: Pt[] = [
  [0, 0.06], [3, 0.1], [8, 0.12], [15, 0.13], [22, 0.12], [30, 0.105],
].map(([yr, r]) => [X(yr), Y(r)]);

const convD = smooth(CONV);
const beyondD = smooth(BEYOND);
const beyondArea = `${beyondD} L ${X(30).toFixed(1)} ${Y1} L ${X(0).toFixed(1)} ${Y1} Z`;

const MARK: Pt = [X(3), Y(0.1)]; // caught early
const DIAG: Pt = [X(24), Y(0.88)]; // typical late diagnosis

const YEARS = [
  [0, "TODAY"],
  [10, "+10 YRS"],
  [20, "+20"],
  [30, "+30"],
] as const;

export default function DiagnosticInstrument() {
  return (
    <figure className="instrument" aria-label="Projected cardiometabolic risk over thirty years: conventional care versus BeyondAge.">
      <div className="instrument__head">
        <span className="instrument__eyebrow">
          <span className="instrument__live" /> The next thirty years
        </span>
        <span className="instrument__sub">Cardiometabolic risk · projected</span>
      </div>

      <svg className="instrument__svg" viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="beyondFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(183,154,104,0.16)" />
            <stop offset="100%" stopColor="rgba(183,154,104,0)" />
          </linearGradient>
        </defs>

        {/* horizontal grid */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <line key={r} x1={X0} x2={X1} y1={Y(r)} y2={Y(r)} className="instrument__grid" />
        ))}
        {/* year ticks */}
        {YEARS.map(([yr, label]) => (
          <g key={yr}>
            <line x1={X(yr)} x2={X(yr)} y1={Y0} y2={Y1} className="instrument__grid instrument__grid--v" />
            <text x={X(yr)} y={Y1 + 26} className="instrument__axis" textAnchor={yr === 0 ? "start" : yr === 30 ? "end" : "middle"}>
              {label}
            </text>
          </g>
        ))}
        <text x={X0} y={Y0 - 12} className="instrument__axislabel">LOW RISK ↑ HIGH</text>

        {/* area under the BeyondAge curve */}
        <path d={beyondArea} className="instrument__area" />

        {/* conventional path — climbs to a late diagnosis */}
        <path d={convD} pathLength={1} className="instrument__curve instrument__curve--conv" />
        {/* BeyondAge path — caught early, bent down */}
        <path d={beyondD} pathLength={1} className="instrument__curve instrument__curve--beyond" />

        {/* typical late diagnosis marker */}
        <g className="instrument__diag">
          <circle cx={DIAG[0]} cy={DIAG[1]} r={3.5} className="instrument__dot instrument__dot--conv" />
          <text x={DIAG[0] - 10} y={DIAG[1] - 12} className="instrument__note instrument__note--conv" textAnchor="end">
            Typical diagnosis
          </text>
        </g>

        {/* caught-early marker */}
        <g className="instrument__mark">
          <circle cx={MARK[0]} cy={MARK[1]} r={14} className="instrument__halo" />
          <circle cx={MARK[0]} cy={MARK[1]} r={4} className="instrument__dot instrument__dot--beyond" />
          <text x={MARK[0] + 16} y={MARK[1] - 10} className="instrument__note instrument__note--beyond">
            Caught at year 3
          </text>
        </g>
      </svg>

      <figcaption className="instrument__legend">
        <span className="instrument__key instrument__key--conv">Conventional care</span>
        <span className="instrument__key instrument__key--beyond">With BeyondAge</span>
      </figcaption>
    </figure>
  );
}
