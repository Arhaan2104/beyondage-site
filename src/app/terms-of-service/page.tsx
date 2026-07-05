import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DOCS } from "@/components/legalContent";

const doc = LEGAL_DOCS["terms-of-service"];

export const metadata: Metadata = {
  title: `${doc.title} — BeyondAge`,
  description: `${doc.title} for BeyondAge — a physician-led preventive and longevity practice in Gurugram.`,
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
