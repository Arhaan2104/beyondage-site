import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import HealthspanDashboard from "@/components/HealthspanDashboard";
import PreventionVsCure from "@/components/PreventionVsCure";
import WhyBeyondAge from "@/components/WhyBeyondAge";
import HealthJourneys from "@/components/HealthJourneys";
import SiteFooter from "@/components/SiteFooter";
import FounderCard, { type Founder } from "@/components/FounderCard";
import Link from "next/link";

const TEAM_BASE = "/our-team";

// Founders — featured, each frame plays their film (from beyondage.health).
// Loomba has no profile page on the live site, so her card does not link.
const FOUNDERS: Founder[] = [
  {
    name: "Dr Arvinder Soin",
    role: "Founder & Chairman",
    cred: "Padma Shri · India's liver-transplant pioneer — close to 5,000 transplants.",
    href: `${TEAM_BASE}/dr-arvind-soin`,
    video: "/assets/soin-interview.mp4",
    poster: "/assets/soin-poster.jpg",
  },
  {
    name: "Dr Vritti Loomba",
    role: "Founder & CEO",
    cred: "Co-founder of BeyondAge — the physician-led longevity practice in Gurugram.",
    href: null,
    video: "/assets/loomba-interview.mp4",
    poster: "/assets/loomba-poster.jpg",
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

// Bench grid is 4-up on desktop; centre whatever doesn't fill the last row.
const BENCH_COLS = 4;
const ORPHANS = SPECIALISTS.length % BENCH_COLS;
const SPLIT = SPECIALISTS.length - ORPHANS;

const renderSpecialist = ([img, name, role, slug]: [string, string, string, string]) => (
  <a
    key={img}
    href={`${TEAM_BASE}/${slug}`}
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
);

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* Why BeyondAge — the thesis: silent disease, caught early, by the bench */}
        <WhyBeyondAge />

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
              {FOUNDERS.map((f) => (
                <FounderCard key={f.name} {...f} />
              ))}
            </div>

            <div className="bench-grid">
              {SPECIALISTS.slice(0, SPLIT).map(renderSpecialist)}
              {/* The roster doesn't divide evenly by four; centre the trailing
                  row and bracket it with two hairline "caliper" rules so the gap
                  reads as a deliberate coda, not a missing card. The rules hide
                  below the 4-column breakpoint, where flex-centring alone suffices. */}
              {ORPHANS > 0 && <span className="bench-rule bench-rule--l" aria-hidden="true" />}
              {SPECIALISTS.slice(SPLIT).map(renderSpecialist)}
              {ORPHANS > 0 && <span className="bench-rule bench-rule--r" aria-hidden="true" />}
            </div>
          </div>
        </section>

        {/* What you get — concrete deliverables (real site content) */}
        <WhatYouGet />

        {/* Health Journeys — bespoke medical instruments per programme */}
        <HealthJourneys />

        {/* How it works — Mederva-style pinned scroll reveal */}
        <HowItWorks />

        {/* See the product — real member dashboard, rebuilt native */}
        <HealthspanDashboard />

        {/* Why not a normal check-up — the comparison + the 5 P's framework */}
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
            <Link href="/begin-journey" className="cta cta--gold invitation__cta">
              Begin your journey
            </Link>
            <p className="invitation__note">
              Membership is limited and by invitation. A physician-led longevity
              practice in Gurugram.
            </p>
          </div>
        </section>

        {/* Footer */}
        <SiteFooter />
      </main>
    </>
  );
}
