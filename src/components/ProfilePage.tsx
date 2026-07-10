import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import type { TeamMember } from "./teamData";
import { teamNeighbours } from "./teamData";

/**
 * A single bench-member profile, rendered from verbatim beyondage.health
 * content in the site's editorial system — mirroring the Health Journey pages.
 * Structure: dark hero (framed portrait "viewport" + role + credentials) →
 * Profile (bio + a focus / credentials / recognition sidebar) → more of the
 * bench → the single conversion. One call to action, no invented claims.
 */
export default function ProfilePage({ data }: { data: TeamMember }) {
  const INVITE = "/begin-journey";
  const others = teamNeighbours(data.slug, 3);

  return (
    <>
      <SiteHeader />
      <main>
        {/* ---- Hero ---- */}
        <section className="jp-hero pp-hero">
          <div className="jp-hero__bg" aria-hidden="true">
            <div className="pp-hero__grid" />
            <div className="jp-hero__grain" />
          </div>
          <div className="measure jp-hero__inner">
            <div className="jp-hero__copy">
              <p className="eyebrow jp-hero__eyebrow">
                <Link href="/#team" className="jp-hero__crumb">The Bench</Link>
              </p>
              <h1 className="jp-hero__title">{data.name}</h1>
              <p className="jp-hero__tagline">{data.role}</p>
              <ul className="pp-cred" aria-label="Qualifications">
                {data.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="jp-hero__actions">
                <Link href={INVITE} className="cta cta--chevron">Begin your journey</Link>
              </div>
            </div>

            <figure className="pp-portrait">
              <div className="pp-portrait__frame">
                <div className="pp-portrait__screen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/team/${data.img}.png`} alt={data.name} />
                  <span className="pp-portrait__ticks" aria-hidden="true">
                    <i /><i /><i /><i />
                  </span>
                </div>
              </div>
            </figure>
          </div>
        </section>

        {/* ---- Profile ---- */}
        <section className="section warm pp-about">
          <div className="measure pp-about__wrap">
            <div className="pp-about__main reveal">
              <h2 className="pp-about__title">About</h2>
              {data.bio.map((p, i) => (
                <p key={i} className="pp-about__p">{p}</p>
              ))}
            </div>

            <aside className="pp-about__side reveal">
              {data.focus && data.focus.length > 0 && (
                <div className="pp-side__block">
                  <p className="pp-side__k">Focus</p>
                  <ul className="pp-chips">
                    {data.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pp-side__block">
                <p className="pp-side__k">Credentials</p>
                <ul className="jp-list pp-side__list">
                  {data.credentials.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              {data.awards && data.awards.length > 0 && (
                <div className="pp-side__block">
                  <p className="pp-side__k">Recognition</p>
                  <ul className="jp-list pp-side__list">
                    {data.awards.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* ---- More of the bench ---- */}
        <section className="section warm jp-related pp-related">
          <div className="measure">
            <div className="pp-people__grid">
              {others.map((o) => (
                <a key={o.slug} href={`/our-team/${o.slug}`} className="pp-people__card reveal">
                  <span className="pp-people__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/assets/team/${o.img}.png`} alt={o.name} loading="lazy" />
                  </span>
                  <span className="pp-people__meta">
                    <span className="pp-people__cat">{o.category}</span>
                    <span className="pp-people__name">{o.name}</span>
                    <span className="pp-people__more">View profile <span aria-hidden="true">↗</span></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The invitation (single conversion) ---- */}
        <section className="section jp-cta" id="invitation">
          <div className="jp-cta__bg" aria-hidden="true"><div className="jp-cta__grain" /></div>
          <div className="measure jp-cta__inner reveal">
            <p className="eyebrow jp-cta__eyebrow">By invitation, Gurugram</p>
            <h2 className="jp-cta__title">Care, coordinated by this bench.</h2>
            <p className="jp-cta__body">
              Schedule a consultation with our Healthcare Coordinator to discover how
              BeyondAge can optimise your health.
            </p>
            <Link href={INVITE} className="cta cta--chevron jp-cta__btn">Begin your journey</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
