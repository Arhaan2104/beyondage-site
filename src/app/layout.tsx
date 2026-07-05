import type { Metadata, Viewport } from "next";
import { Playfair_Display, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

/* Playfair Display is self-hosted at build by next/font — the brand's editorial
   serif (display): a high-contrast Didone that matches the BeyondAge logo
   wordmark. Body/UI is Schibsted Grotesk: a precise, editorial grotesque that
   reads clinical and premium, distinctive without shouting, and highly legible —
   deliberately uncommon in the longevity space (no system-sans/Inter default). */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beyondage.health";
const DESCRIPTION =
  "A physician-led preventive and longevity practice in Gurugram. We catch disease while it is still a whisper — years before the diagnosis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BeyondAge — Longevity medicine, by invitation",
    template: "%s · BeyondAge",
  },
  description: DESCRIPTION,
  applicationName: "BeyondAge",
  keywords: [
    "longevity medicine",
    "preventive healthcare",
    "healthspan",
    "biological age",
    "precision diagnostics",
    "longevity clinic Gurugram",
    "BeyondAge",
  ],
  authors: [{ name: "BeyondAge" }],
  creator: "BeyondAge",
  publisher: "BeyondAge",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "BeyondAge",
    title: "BeyondAge — Longevity medicine, by invitation",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "BeyondAge — Longevity medicine, by invitation",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece4d3" },
    { media: "(prefers-color-scheme: dark)", color: "#06301f" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${schibsted.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
