import { readData } from "@/lib/data";
import SkillsClient from "./SkillsClient";

export const revalidate = 0;

export default async function SkillsPage() {
  const { skills } = await readData();

  return <SkillsClient skills={skills} />;
}
