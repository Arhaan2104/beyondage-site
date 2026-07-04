import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";
import { TEAM } from "@/components/teamData";

const data = TEAM["dr-simal-soin"];

export const metadata: Metadata = {
  title: `${data.name} — The Bench · BeyondAge`,
  description: `${data.role} · ${data.category}.`,
};

export default function Page() {
  return <ProfilePage data={data} />;
}
