import { readData } from "@/lib/data";
import AboutClient from "./AboutClient";

export const revalidate = 0;

export default async function AboutPage() {
  const { profile, experience, education } = await readData();

  return (
    <AboutClient
      profile={profile}
      experiences={experience}
      education={education}
    />
  );
}
