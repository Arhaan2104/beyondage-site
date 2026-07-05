/**
 * "Why not a normal check-up" — the predict-vs-cure thesis, told through one
 * centrepiece: the annual check-up set against BeyondAge, side by side. Below it,
 * the 5 P's of the BeyondAge Framework (Predict · Prevent · Personalise ·
 * Participate · Purposeful) — the practice's own method, named on the live site
 * and retold here in our voice.
 */
const USUAL = [
  "Reactive — it looks for disease once it has already arrived",
  "A one-time snapshot, read against population averages",
  "Numbers handed back with little interpretation",
  "Nothing changes until symptoms do",
];

const BEYOND = [
  "Predicts risk early from your biomarkers, genetics and lifestyle",
  "Read against your own trajectory, tracked over time",
  "AI-driven interpretation, read by a specialist bench",
  "Continuity of care — the plan is adjusted as you go",
];

// The five P's, verbatim in spirit from beyondage.health's framework.
const FIVE_P = [
  { p: "Predict", body: "Your future risks, read from your genetics, deep biomarkers and lifestyle." },
  { p: "Prevent", body: "Advanced diagnostics and proactive, science-led interventions that delay decline." },
  { p: "Personalise", body: "Interventions crafted for you — from cellular signals to daily rhythms." },
  { p: "Participate", body: "Real-time data and expert guidance, so you own your health journey." },
  { p: "Purposeful", body: "Physical, mental, emotional and spiritual health — a life lived with depth." },
];

export default function PreventionVsCure() {
  return (
    <section className="section pvc" id="why">
      <div className="measure">
        <div className="pvc-head reveal">
          <p className="eyebrow chapter-eyebrow">Why not a normal check-up</p>
          <h2 className="chapter-title pvc-title">
            <span className="pvc-title__line">Predict early. Prevent fully.</span>
            <span className="pvc-title__line">So you may <em>never need a cure</em>.</span>
          </h2>
          <p className="pvc-lede">
            Most disease climbs silently for years before a diagnosis. We find it in the
            decades when it still changes the outcome.
          </p>
        </div>

        {/* The comparison — the centrepiece of the section */}
        <div className="pvc-cmp reveal">
          <div className="pvc-cmp__col pvc-cmp__col--old">
            <p className="pvc-cmp__tag">The annual check-up</p>
            <ul className="pvc-cmp__list">
              {USUAL.map((t) => (
                <li key={t} className="pvc-cmp__item">{t}</li>
              ))}
            </ul>
          </div>
          <div className="pvc-cmp__col pvc-cmp__col--new">
            <p className="pvc-cmp__tag">BeyondAge</p>
            <ul className="pvc-cmp__list">
              {BEYOND.map((t) => (
                <li key={t} className="pvc-cmp__item">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* The 5 P's framework — what BeyondAge actually does */}
        <div className="pvc-5p reveal">
          <p className="pvc-5p__title">The five P&rsquo;s of the BeyondAge framework</p>
          <ol className="pvc-5p__grid">
            {FIVE_P.map(({ p, body }, i) => (
              <li key={p} className="pvc-5p__item">
                <span className="pvc-5p__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="pvc-5p__p">{p}</span>
                <span className="pvc-5p__body">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
