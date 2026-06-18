import { readData } from "@/lib/data";
import HomeClient from "./HomeClient";

export const revalidate = 0;

export default async function Home() {
  const { profile, projects, skills } = await readData();
  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3);

  return <HomeClient profile={profile} featuredProjects={featuredProjects} skills={skills} />;
}
