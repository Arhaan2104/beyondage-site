import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FounderCard, { type Founder } from "@/components/FounderCard";
import { TEAM, TEAM_ORDER } from "@/components/teamData";

export const metadata: Metadata = {
  title: "Our Team | BeyondAge",
  description:
    "Internationally renowned specialists in healthspan optimisation, the physician bench behind BeyondAge, a members-only longevity practice in Gurugram.",
};

// Founders — the two feature films (mirrors the live site's "Our Founders").
const FOUNDERS: Founder[] = [
  {
    name: "Dr Arvinder Soin",
    role: "Founder & Chairman",
    cred: "Padma Shri. India's liver-transplant pioneer, close to 5,000 transplants.",
    href: "/our-team/dr-arvind-soin",
    video: "/assets/soin-interview.mp4",
    poster: "/assets/soin-poster.jpg",
  },
  {
    name: "Dr Vritti Loomba",
    role: "Founder & CEO",
    cred: "Co-founder of BeyondAge, the physician-led longevity practice in Gurugram.",
    href: null,
    video: "/assets/loomba-interview.mp4",
    poster: "/assets/loomba-poster.jpg",
  },
];

const EXPERTS = TEAM_ORDER.map((slug) => TEAM[slug]);

export default function OurTeamPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section bench team">
          <div className="measure">
            <div className="reveal bench-head team__head">
              <p className="eyebrow bench-eyebrow">
                <Link href="/" className="team__crumb">BeyondAge</Link> Our Team
              </p>
              <h2 className="bench-title">
                Internationally renowned specialists
                <span className="bench-title__line"><em>in healthspan optimisation.</em></span>
              </h2>
              <p className="team__lede">
                A bench of physicians who shaped cardiology, endocrinology, sleep medicine
                and diagnostics in India, now turning that expertise upstream, to the
                decades before disease would ever arrive.
              </p>
            </div>

            {/* Our Experts — the full roster */}
            <div className="team__group">
              <p className="team__grouplabel">Our Experts</p>
              <div className="bench-grid team__grid">
                {EXPERTS.map((m) => (
                  <Link key={m.slug} href={`/our-team/${m.slug}`} className="bench-card reveal">
                    <div className="bench-card__photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/assets/team/${m.img}.png`} alt={m.name} loading="lazy" />
                      <span className="bench-card__more" aria-hidden="true">View profile ↗</span>
                    </div>
                    <figcaption>
                      <span className="bench-card__name">{m.name}</span>
                      <span className="bench-card__role">{m.category}</span>
                    </figcaption>
                  </Link>
                ))}
              </div>
            </div>

            {/* Our Founders — the feature films */}
            <div className="team__group team__group--founders">
              <p className="team__grouplabel">Our Founders</p>
              <p className="team__groupsub">
                The visionaries behind a new era of science-backed healthy ageing.
              </p>
              <div className="founders-row">
                {FOUNDERS.map((f) => (
                  <FounderCard key={f.name} {...f} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
