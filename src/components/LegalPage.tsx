import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { LegalDoc } from "@/components/legalContent";

/**
 * Legal reading page — a single narrow column of the policy text, set in our
 * warm register with Newsreader headings. The body is the verbatim copy from
 * beyondage.health (see legalContent.ts); this component only frames and styles it.
 */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <SiteHeader />
      <main>
        <article className="section legal">
          <div className="measure legal__inner">
            <header className="legal__head reveal">
              <p className="eyebrow legal__eyebrow">
                <Link href="/" className="legal__crumb">BeyondAge</Link> Legal
              </p>
              <h1 className="legal__title">{doc.title}</h1>
            </header>
            <div
              className="legal__body reveal"
              dangerouslySetInnerHTML={{ __html: doc.body }}
            />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
