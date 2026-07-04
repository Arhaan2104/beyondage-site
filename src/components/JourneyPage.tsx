import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { DrawInView, InstrumentPanel } from "./journeyInstruments";
import type { JourneyData } from "./journeyData";

/**
 * A single Health Journey page (heart / metabolic / sleep), rendered from
 * verbatim beyondage.health content in the site's editorial system. Structure:
 * dark hero (bespoke instrument + the page's epidemiological stat) → Diagnostics
 * & Interventions (consultations · diagnostics · interventions + the goal) →
 * Common Concerns (accessible <details> accordion) → other journeys → the single
 * conversion. Per the brief: one call to action, no invented claims.
 */
export default function JourneyPage({ data }: { data: JourneyData }) {
  const INVITE = "/begin-journey";
  return (
    <>
      <SiteHeader />
      <main>
        {/* ---- Hero ---- */}
        <section className="jp-hero">
          <div className="jp-hero__bg" aria-hidden="true">
            <div className="jp-hero__grain" />
          </div>
          <div className="measure jp-hero__inner">
            <div className="jp-hero__copy">
              <p className="eyebrow jp-hero__eyebrow">
                <Link href="/#journeys" className="jp-hero__crumb">Health Journeys</Link>
                <span aria-hidden="true">·</span> {data.index} / 03
              </p>
              <h1 className="jp-hero__title">{data.title}</h1>
              <p className="jp-hero__tagline">{data.tagline}</p>
              <p className="jp-hero__lede">{data.lede}</p>
              <div className="jp-hero__actions">
                <Link href={INVITE} className="cta cta--gold">Begin your journey</Link>
                <div className="jp-hero__stat">
                  <strong className="jp-hero__stat-val">{data.stat.value}</strong>
                  <span className="jp-hero__stat-label">{data.stat.label}</span>
                </div>
              </div>
            </div>

            <DrawInView className="jp-hero__viz" threshold={0.3}>
              <InstrumentPanel kind={data.kind} chan={data.instrument.chan} unit={data.instrument.unit} />
              <p className="jp-hero__viz-cap">{data.instrument.caption}</p>
            </DrawInView>
          </div>
        </section>

        {/* ---- Diagnostics & Interventions ---- */}
        <section className="section warm jp-diag">
          <div className="measure">
            <div className="reveal">
              <p className="eyebrow chapter-eyebrow">Diagnostics &amp; Interventions</p>
              <h2 className="chapter-title">Everything measured — then a plan built around you.</h2>
              <p className="lede">{data.intro}</p>
            </div>

            <div className="jp-cols">
              <div className="jp-col reveal">
                <p className="jp-col__k"><span className="jp-col__n">01</span> Consultations &amp; assessments</p>
                <ul className="jp-list">
                  {data.consultations.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
              <div className="jp-col reveal">
                <p className="jp-col__k"><span className="jp-col__n">02</span> Diagnostics &amp; imaging</p>
                <ul className="jp-list">
                  {data.diagnostics.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div className="jp-col reveal">
                <p className="jp-col__k"><span className="jp-col__n">03</span> Personalised interventions</p>
                <ul className="jp-list">
                  {data.interventions.map((i) => <li key={i}>{i}</li>)}
                </ul>
                {data.monitoring && data.monitoring.length > 0 && (
                  <>
                    <p className="jp-col__sub">Monitoring</p>
                    <ul className="jp-list jp-list--sub">
                      {data.monitoring.map((m) => <li key={m}>{m}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <blockquote className="jp-goal reveal">
              <p>{data.goal}</p>
            </blockquote>
          </div>
        </section>

        {/* ---- Common Concerns ---- */}
        <section className="section jp-faq">
          <div className="measure jp-faq__wrap">
            <div className="reveal jp-faq__head">
              <p className="eyebrow chapter-eyebrow">Common Concerns</p>
              <h2 className="chapter-title">Questions our members ask.</h2>
            </div>
            <div className="jp-faq__list reveal">
              {data.faqs.map((f) => (
                <details key={f.q} className="jp-faq__item">
                  <summary className="jp-faq__q">
                    <span>{f.q}</span>
                    <span className="jp-faq__ico" aria-hidden="true" />
                  </summary>
                  <p className="jp-faq__a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Other journeys ---- */}
        <section className="section warm jp-related">
          <div className="measure">
            <p className="eyebrow chapter-eyebrow jp-related__eyebrow">Continue exploring</p>
            <div className="jp-related__grid">
              {data.related.map((r) => (
                <a key={r.slug} href={`/health-journeys/${r.slug}`} className="jp-related__card reveal">
                  <span className="jp-related__k">Health Journey</span>
                  <span className="jp-related__title">{r.title}</span>
                  <span className="jp-related__more">Explore <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The invitation (single conversion) ---- */}
        <section className="section jp-cta" id="invitation">
          <div className="jp-cta__bg" aria-hidden="true"><div className="jp-cta__grain" /></div>
          <div className="measure jp-cta__inner reveal">
            <p className="eyebrow jp-cta__eyebrow">By invitation · Gurugram</p>
            <h2 className="jp-cta__title">Ready to begin your journey?</h2>
            <p className="jp-cta__body">
              Schedule a consultation with our Healthcare Coordinator to discover how
              BeyondAge can optimise your health.
            </p>
            <Link href={INVITE} className="cta cta--gold jp-cta__btn">Begin your journey</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
