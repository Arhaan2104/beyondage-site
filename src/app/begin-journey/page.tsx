import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BeginJourney from "@/components/BeginJourney";

export const metadata: Metadata = {
  title: "Begin your journey — BeyondAge",
  description:
    "Start the conversation. Tell us about your goals and our team will arrange your discovery call — a members-only longevity practice in Gurugram.",
};

export default function BeginJourneyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <BeginJourney />
      </main>
      <SiteFooter />
    </>
  );
}
