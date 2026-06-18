import { readData } from "@/lib/data";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 0;

export default async function ProjectsPage() {
  const { projects } = await readData();
  const sorted = projects.sort((a, b) => a.sort_order - b.sort_order);

  return <ProjectsClient initialProjects={sorted} />;
}
