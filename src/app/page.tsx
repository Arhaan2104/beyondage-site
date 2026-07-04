import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import HealthspanDashboard from "@/components/HealthspanDashboard";
import PreventionVsCure from "@/components/PreventionVsCure";
import WhyBeyondAge from "@/components/WhyBeyondAge";
import HealthJourneys from "@/components/HealthJourneys";

const TEAM_BASE = "https://beyondage.health/our-team";

// Founders — featured. Names, roles and imagery from beyondage.health.
// Loomba has no profile page on the live site, so her card does not link.
const FOUNDERS = [
  {
    img: "founder-soin",
    name: "Dr Arvinder Soin",
    role: "Founder & Chairman",
    cred: "Padma Shri · India's liver-transplant pioneer — close to 5,000 transplants.",
    href: `${TEAM_BASE}/dr-arvind-soin`,
  },
  {
    img: "founder-loomba",
    name: "Dr Vritti Loomba",
    role: "Founder & CEO",
    cred: "Co-founder of BeyondAge — the physician-led longevity practice in Gurugram.",
    href: null,
  },
];

// Specialists — verbatim names, roles and profile slugs from /our-team.
const SPECIALISTS: [string, string, string, string][] = [
  ["vinayak", "Dr Vinayak Agrawal", "Medical Director, BeyondAge Preventive Cardiology", "dr-vinayak-agarwal"],
  ["mithal", "Dr Ambrish Mithal", "Metabolic Health", "dr-ambrish-mithal"],
  ["bhatia", "Dr Manvir Bhatia", "Sleep Medicine, Brain Health & Preventive Neurology", "dr-manvir-bhatia"],
  ["navin", "Dr Navin Dang", "Laboratory Medicine, Diagnostic Strategy & Longevity Biomarkers", "dr-navin-dang"],
  ["rohtagi", "Dr Nitesh Rohtagi", "Cancer Prevention, Precision Oncology & Longevity", "dr-nitesh-rohtagi"],
  ["simal", "Dr Simal Soin", "Aesthetic Medicine & Anti-aging", "dr-simal-soin"],
  ["anita", "Dr Anita Somalanka", "Longevity & Lifestyle Medicine Physician", "dr-anita-somalanka"],
  ["arjun", "Dr Arjun Dang", "Healthspan & Functional Lab Diagnostics", "dr-arjun-dang"],
  ["anshika", "Dr Anshika Gupta", "Longevity & Functional Medicine", "dr-anshika-gupta"],
  ["monique", "Ms. Monique Jhingon", "Gut & Microbiome Optimization", "ms-monique-jhigon"],
  ["nidhi", "Dr Nidhi Arora", "Musculoskeletal Rehabilitation", "dr-nidhi-arora"],
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* Why BeyondAge — the thesis: silent disease, caught early, by the bench */}
        <WhyBeyondAge />

        {/* What you get — concrete deliverables (real site content) */}
        <WhatYouGet />

        {/* The bench — founders featured, then the specialist roster */}
        <section className="section bench" id="team">
          <div className="measure">
            <div className="reveal bench-head">
              <p className="eyebrow bench-eyebrow">The Bench</p>
              <h2 className="bench-title">
                Some of the country&rsquo;s most respected specialists.
                <span className="bench-title__line"><em>On one bench.</em></span>
              </h2>
            </div>

            <div className="founders-row">
              {FOUNDERS.map((f) => {
                const inner = (
                  <>
                    <div className="founder-card__photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/assets/team/${f.img}.png`} alt={f.name} loading="lazy" />
                      <span className="founder-card__tag">Founder</span>
                    </div>
                    <div className="founder-card__meta">
                      <h3 className="founder-card__name">{f.name}</h3>
                      <p className="founder-card__role">{f.role}</p>
                      {f.cred && <p className="founder-card__cred">{f.cred}</p>}
                      {f.href && <span className="founder-card__more">View profile <span aria-hidden="true">↗</span></span>}
                    </div>
                  </>
                );
                return f.href ? (
                  <a key={f.img} href={f.href} target="_blank" rel="noreferrer" className="founder-card reveal is-link">
                    {inner}
                  </a>
                ) : (
                  <div key={f.img} className="founder-card reveal">{inner}</div>
                );
              })}
            </div>

            <div className="bench-grid">
              {SPECIALISTS.map(([img, name, role, slug]) => (
                <a
                  key={img}
                  href={`${TEAM_BASE}/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bench-card reveal"
                >
                  <div className="bench-card__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/assets/team/${img}.png`} alt={name} loading="lazy" />
                    <span className="bench-card__more" aria-hidden="true">View profile ↗</span>
                  </div>
                  <figcaption>
                    <span className="bench-card__name">{name}</span>
                    <span className="bench-card__role">{role}</span>
                  </figcaption>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Founders — the shift */}
        <section className="section founders">
          <div className="measure">
            <p className="eyebrow founders-eyebrow">Why BeyondAge exists</p>
            <div className="founders-lead reveal">
              <figure className="founders-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/frame1.png" alt="Dr Arvinder Soin, Founder and Chairman of BeyondAge" />
              </figure>
              <div className="founders-copy">
                <h2 className="founders-quote">
                  For a career, he saved lives at the very end.{" "}
                  <em>BeyondAge is the other end of that story.</em>
                </h2>
                <p className="founders-bio">
                  Dr Arvinder Soin performed India&rsquo;s first liver transplant, and
                  close to five thousand since — a Padma Shri for the work. BeyondAge
                  turns that expertise upstream: finding disease in the decades before it
                  would ever arrive.
                </p>
                <p className="founders-name">
                  Dr Arvinder Soin <span>· Founder &amp; Chairman</span>
                </p>
                <div className="founders-cofounder">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/loomba.png" alt="Dr Vritti Loomba, Founder and CEO of BeyondAge" />
                  <p>
                    <strong>Dr Vritti Loomba</strong> · Founder &amp; CEO. Building the
                    practice, and the circle of peers around it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Journeys — bespoke medical instruments per programme */}
        <HealthJourneys />

        {/* How it works — Mederva-style pinned scroll reveal */}
        <HowItWorks />

        {/* See the product — real member dashboard, rebuilt native */}
        <HealthspanDashboard />

        {/* Why not a normal check-up — predict vs cure + risk instrument */}
        <PreventionVsCure />

        {/* Invitation */}
        <section className="section invitation" id="invitation">
          <div className="invitation__bg" aria-hidden="true">
            <div className="invitation__grain" />
          </div>
          <div className="invitation__inner reveal">
            <p className="eyebrow invitation__eyebrow">By invitation · Gurugram</p>
            <h2 className="invitation__title">
              Choose who to trust with the <em>next thirty years</em>.
            </h2>
            <a href="mailto:contactus@beyondage.health" className="cta cta--gold invitation__cta">
              Request an invitation
            </a>
            <p className="invitation__note">
              Membership is limited and by invitation. A physician-led longevity
              practice in Gurugram.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer__inner measure">
            <div className="footer__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.png" alt="BeyondAge" className="logo logo--ivory footer__logo" />
              <p>
                A physician-led preventive and longevity practice for those who intend
                to age on their own terms.
              </p>
            </div>
            <div className="footer__cols">
              <div className="footer__col">
                <h4>Practice</h4>
                <a href="#journeys">Health Journeys</a>
                <a href="#team">The Bench</a>
                <a href="#how">How it works</a>
                <a href="#invitation">Request an invitation</a>
              </div>
              <div className="footer__col">
                <h4>Contact</h4>
                <a href="mailto:contactus@beyondage.health">contactus@beyondage.health</a>
                <span>Gurugram, India</span>
                <span>9:00 – 20:00 · Mon–Sat</span>
              </div>
              <div className="footer__col">
                <h4>Follow</h4>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
              </div>
            </div>
          </div>
          <div className="footer__base measure">
            <span>© 2026 BeyondAge. All rights reserved.</span>
            <span className="footer__legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
