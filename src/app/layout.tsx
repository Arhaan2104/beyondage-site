import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "BeyondAge — Longevity medicine, by invitation",
  description:
    "A physician-led preventive and longevity practice in Gurugram. We catch disease while it is still a whisper — years before the diagnosis.",
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
