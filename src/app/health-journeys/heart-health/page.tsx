import type { Metadata } from "next";
import JourneyPage from "@/components/JourneyPage";
import { JOURNEYS } from "@/components/journeyData";

const data = JOURNEYS["heart-health"];

export const metadata: Metadata = {
  title: "Heart Health | BeyondAge",
  description: data.lede,
};

export default function Page() {
  return <JourneyPage data={data} />;
}
