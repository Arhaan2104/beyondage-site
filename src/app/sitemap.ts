import type { MetadataRoute } from "next";
import { TEAM_ORDER } from "@/components/teamData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beyondage.health";
const JOURNEYS = ["heart-health", "metabolic-health", "sleep-health"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...JOURNEYS.map((s) => `/health-journeys/${s}`),
    ...TEAM_ORDER.map((s) => `/our-team/${s}`),
  ];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
