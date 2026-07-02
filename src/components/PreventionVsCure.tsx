import DiagnosticInstrument from "@/components/DiagnosticInstrument";

/**
 * "Why not a normal check-up" — the practice's real predict-vs-cure thesis
 * (the 5-P framework line "Predict Early. Prevent Fully. So You May Never Need A
 * Cure." is taken verbatim from beyondage.health). The right column is the
 * diagnostic instrument: conventional care climbs silently to a late diagnosis;
 * BeyondAge catches risk early and bends the curve down.
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

export default function PreventionVsCure() {
  return (
    <section className="section pvc" id="why">
      <div className="measure">
        <div className="pvc-grid">
          <div className="reveal">
            <p className="eyebrow chapter-eyebrow">Why not a normal check-up</p>
            <h2 className="chapter-title pvc-title">
              Predict early. Prevent fully. So you may <em>never need a cure</em>.
            </h2>
            <div className="pvc-compare">
              <div className="pvc-cmp">
                <div className="pvc-cmp__col pvc-cmp__col--old">
                  <p className="pvc-cmp__tag">The annual check-up</p>
                  {USUAL.map((t) => (
                    <p key={t} className="pvc-cmp__item">{t}</p>
                  ))}
                </div>
                <div className="pvc-cmp__col pvc-cmp__col--new">
                  <p className="pvc-cmp__tag">BeyondAge</p>
                  {BEYOND.map((t) => (
                    <p key={t} className="pvc-cmp__item">{t}</p>
                  ))}
                </div>
              </div>
            </div>
            <p className="pvc-kicker">
              Most disease climbs silently for years before a diagnosis. We find it in
              the decades when it still <em>changes the outcome</em>.
            </p>
          </div>
          <div className="reveal">
            <DiagnosticInstrument />
          </div>
        </div>
      </div>
    </section>
  );
}
