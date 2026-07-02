/* Throwaway specimen board — compare display faces on the real hero line.
   Not part of the site; delete once the brand face is chosen. */
import { Newsreader, Spectral } from "next/font/google";

const newsreader = Newsreader({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });
const spectral = Spectral({ subsets: ["latin"], weight: ["300", "400"] });

const FACES = [
  { name: "Didot", note: "Ultra-luxury Didone. Vogue / Harper's. Cold, glamorous, fashion-grade.", stack: '"Didot","GFS Didot","Bodoni 72",serif', tier: "System · free · Apple devices" },
  { name: "Hoefler Text", note: "Classic literary roman. Warm, intellectual, deeply trustworthy.", stack: '"Hoefler Text","Hoefler Text Pro",serif', tier: "System · free · Apple devices" },
  { name: "Baskerville", note: "Transitional serif. Calm authority — the typeface of considered prose.", stack: '"Baskerville","Baskerville Old Face",serif', tier: "System · free · Apple devices" },
  { name: "Iowan Old Style", note: "Sturdy, grounded, humane. Reads certain without trying.", stack: '"Iowan Old Style",serif', tier: "System · free · current fallback" },
  { name: "Newsreader", note: "Contemporary editorial serif. Optical, modern, not in the AI-slop set.", stack: newsreader.style.fontFamily, tier: "Webfont · free · self-hostable" },
  { name: "Spectral", note: "Calm screen-native serif. Quiet, precise, restrained.", stack: spectral.style.fontFamily, tier: "Webfont · free · self-hostable" },
];

const LICENSED: [string, string][] = [
  ["Signifier — Klim", "Renaissance roman, reconstructed sharp. Intellectual gravitas. My pick for credibility."],
  ["Domaine Display — Klim", "Luxury fashion serif, high contrast. More overt glamour."],
  ["Reckless — Displaay", "Modern editorial Didone. Current, fashionable, rare."],
  ["GT Super — Grilli", "Warm 70s editorial revival. Confident, characterful."],
];

export default function TypeSpecimen() {
  return (
    <div
      style={{
        background:
          "radial-gradient(120% 70% at 50% 6%, rgba(110,126,108,0.12), transparent 58%), linear-gradient(180deg,#14342b 0%,#0b211b 90%)",
        color: "#f5f1e8",
        minHeight: "100vh",
        padding: "clamp(2rem,6vw,6rem) clamp(1.25rem,5vw,5rem)",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      <p style={{ textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.72rem", color: "#6e7e6c", marginBottom: "0.4rem" }}>
        BeyondAge · Display face specimen
      </p>
      <p style={{ color: "rgba(245,241,232,0.6)", maxWidth: "52ch", lineHeight: 1.6, marginTop: 0 }}>
        The hero line, set in six rare / non-slop candidates. System faces render natively on the
        Apple devices your audience uses (zero licensing).
      </p>

      {FACES.map((f) => (
        <div key={f.name} style={{ borderTop: "1px solid rgba(245,241,232,0.14)", padding: "2.4rem 0" }}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.1rem", flexWrap: "wrap" }}>
            <span style={{ color: "#bfa472", letterSpacing: "0.04em", fontSize: "0.9rem" }}>{f.name}</span>
            <span style={{ color: "#6e7e6c", fontSize: "0.72rem", letterSpacing: "0.08em" }}>{f.tier}</span>
          </div>
          <h2 style={{ fontFamily: f.stack, fontWeight: 400, fontSize: "clamp(1.9rem,4.4vw,3.4rem)", lineHeight: 1.08, letterSpacing: "-0.018em", margin: 0, maxWidth: "20ch" }}>
            Serious disease builds in silence.
            <br />
            <span style={{ color: "rgba(245,241,232,0.78)" }}>We read it, years before it speaks.</span>
          </h2>
          <p style={{ color: "rgba(245,241,232,0.5)", fontSize: "0.86rem", marginTop: "1rem" }}>{f.note}</p>
        </div>
      ))}

      <div style={{ borderTop: "1px solid rgba(245,241,232,0.14)", paddingTop: "2.4rem", marginTop: "1rem" }}>
        <p style={{ color: "#bfa472", letterSpacing: "0.04em", fontSize: "0.9rem" }}>
          Licensed tier — if you want a face no one else has
        </p>
        {LICENSED.map(([n, d]) => (
          <p key={n} style={{ color: "rgba(245,241,232,0.7)", maxWidth: "60ch", lineHeight: 1.55 }}>
            <span style={{ color: "#f5f1e8" }}>{n}.</span> {d}
          </p>
        ))}
      </div>
    </div>
  );
}
