import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

/* Newsreader is self-hosted at build by next/font — identical on every device,
   not an AI-slop face. It's the brand's editorial serif (display). Body/UI uses
   the native system sans, which is premium and weightless. A licensed display
   face can later override --font-display-licensed in globals.css. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
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
    <html lang="en" className={newsreader.variable}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
