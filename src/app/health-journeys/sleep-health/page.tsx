import type { Metadata } from "next";
import JourneyPage from "@/components/JourneyPage";
import { JOURNEYS } from "@/components/journeyData";

const data = JOURNEYS["sleep-health"];

export const metadata: Metadata = {
  title: "Sleep Health — BeyondAge Health Journeys",
  description: data.lede,
};

export default function Page() {
  return <JourneyPage data={data} />;
}
