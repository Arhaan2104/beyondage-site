import type { MetadataRoute } from "next";

/**
 * Web app manifest — installable PWA metadata and the maskable-safe brand icons
 * (the BeyondAge mark on ivory). Theme/background colours match the site.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeyondAge — Longevity medicine, by invitation",
    short_name: "BeyondAge",
    description:
      "A physician-led preventive and longevity practice in Gurugram. We catch disease while it is still a whisper — years before the diagnosis.",
    start_url: "/",
    display: "standalone",
    background_color: "#ece4d3",
    theme_color: "#06301f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
