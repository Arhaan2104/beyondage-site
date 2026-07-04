"use client";

import { useState } from "react";

/**
 * Begin your journey — the contact form (mirrors the live site's /begin-journey:
 * name, email, phone, city, goals + consent). Styled in the BeyondAge editorial
 * system. Submission is a clean placeholder for now: it validates natively, then
 * shows a confirmation. Wire the handler to a CRM / email service where marked.
 */
export default function BeginJourney() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire to a real destination — e.g. POST the form data to /api/begin-journey
    // (a route handler that emails contactus@beyondage.health) or a form service.
    // const data = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitted(true);
  };

  return (
    <section className="section bj" id="begin">
      <div className="measure bj-inner">
        <div className="bj-head reveal">
          <p className="eyebrow bj-eyebrow">Begin your journey</p>
          <h1 className="bj-title">
            The first step is a <em>conversation</em>.
          </h1>
          <p className="bj-lede">
            Tell us a little about yourself and what you want from the years ahead.
            Our team will reach out to arrange your discovery call — the start of a
            members-only practice built around you.
          </p>
        </div>

        {submitted ? (
          <div className="bj-form bj-thanks reveal" role="status">
            <span className="bj-thanks__mark" aria-hidden="true">✓</span>
            <h2 className="bj-thanks__title">Thank you — we&rsquo;ll be in touch.</h2>
            <p className="bj-thanks__note">
              Your details are with our team. Expect a note from us shortly to arrange
              your discovery call.
            </p>
          </div>
        ) : (
          <form className="bj-form reveal" onSubmit={handleSubmit} noValidate={false}>
            <div className="bj-grid">
              <label className="bj-field">
                <span className="bj-label">First name</span>
                <input className="bj-input" type="text" name="firstName" autoComplete="given-name" placeholder="e.g. Ankita" required />
              </label>
              <label className="bj-field">
                <span className="bj-label">Last name</span>
                <input className="bj-input" type="text" name="lastName" autoComplete="family-name" placeholder="e.g. Sharma" required />
              </label>
              <label className="bj-field">
                <span className="bj-label">Email</span>
                <input className="bj-input" type="email" name="email" autoComplete="email" placeholder="ankita.sharma@gmail.com" required />
              </label>
              <label className="bj-field">
                <span className="bj-label">Phone</span>
                <input className="bj-input" type="tel" name="phone" autoComplete="tel" placeholder="99999 12345" required />
              </label>
              <label className="bj-field bj-field--full">
                <span className="bj-label">City</span>
                <input className="bj-input" type="text" name="city" autoComplete="address-level2" placeholder="e.g. Gurugram" />
              </label>
              <label className="bj-field bj-field--full">
                <span className="bj-label">What are your health goals?</span>
                <textarea className="bj-input bj-textarea" name="goals" rows={4} placeholder="Tell us about your health goals and what brings you to BeyondAge." />
              </label>
            </div>

            <label className="bj-consent">
              <input type="checkbox" name="consent" required />
              <span>
                I agree to be contacted by BeyondAge about my enquiry. Membership is
                by invitation.
              </span>
            </label>

            <button type="submit" className="cta cta--emerald bj-submit">
              Begin your journey
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
