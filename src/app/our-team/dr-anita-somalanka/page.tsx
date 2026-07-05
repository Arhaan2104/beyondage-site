import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";
import { TEAM } from "@/components/teamData";

const data = TEAM["dr-anita-somalanka"];

export const metadata: Metadata = {
  title: `${data.name} | BeyondAge`,
  description: `${data.role}. ${data.category}.`,
};

export default function Page() {
  return <ProfilePage data={data} />;
}
