import { readData } from "@/lib/data";
import ContactClient from "./ContactClient";

export const revalidate = 0;

export default async function ContactPage() {
  const { profile } = await readData();
  return <ContactClient profile={profile} />;
}
