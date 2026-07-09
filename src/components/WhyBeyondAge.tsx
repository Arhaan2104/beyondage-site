import FounderFilm from "@/components/FounderFilm";

/**
 * Why BeyondAge — the thesis chapter. A dark, cinematic manifesto that states
 * the practice's whole idea in one breath: serious disease builds silently for
 * years, so the intelligent move is to find it early and act in the decades
 * before it arrives.
 *
 * Its centrepiece is the founder's film — Dr Arvinder Soin on why he built
 * BeyondAge — followed by his defining statement. (The operable risk instrument
 * that once lived here now headlines the "Predict early, prevent fully" chapter.)
 */
export default function WhyBeyondAge() {
  return (
    <section className="section why" id="about">
      <div className="why-field" aria-hidden="true">
        <div className="why-field__grid" />
        <div className="why-field__grain" />
      </div>

      <div className="measure why-inner">
        <div className="reveal why-section-head">
          <h2 className="chapter-title why-title">
            Why We Built <em>BeyondAge</em>
          </h2>
          <span className="mark-divider" aria-hidden="true" />
        </div>

        {/* Editorial split — the words flush-left, the founder's film on the right */}
        <div className="why-split">
          <div className="why-split__text">
            {/* The founder's shift, from treating end-stage illness to preventing it */}
            <div className="reveal why-founder why-founder--solo">
              <div className="why-founder__body">
                <blockquote className="why-founder__quote">
                  &ldquo;I spent my career saving people at the end of illness. The
                  harder fight is making sure <em>they never arrive.</em>&rdquo;
                </blockquote>
                <p className="why-founder__name">
                  Dr. Arvinder Soin, Founder and Chairman, Padma Shri.
                  <span>5000 transplants.</span>
                </p>
              </div>
            </div>
          </div>

          {/* The founder's film — housed as one of the site's own instruments */}
          <div className="reveal why-split__media">
            <FounderFilm />
          </div>
        </div>
      </div>
    </section>
  );
}
