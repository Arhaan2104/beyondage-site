import type { Metadata } from "next";
import UpcomingJourneys from "@/components/UpcomingJourneys";

export const metadata: Metadata = {
  title: "Health Journeys | BeyondAge",
  description:
    "Precision-designed health journeys across every vital system — advanced diagnostics, cutting-edge science and personalised interventions. Heart, Metabolic and Sleep are live today, with more systems coming soon.",
};

export default function Page() {
  return <UpcomingJourneys />;
}
