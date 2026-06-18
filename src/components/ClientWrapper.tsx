"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import BackToTop from "./BackToTop";
import AmbientBackground from "./AmbientBackground";
import type { Profile } from "@/lib/types";

function getInitials(name: string, logoText: string | null): string {
  if (logoText) return logoText;
  if (!name) return "JD";
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (isAdmin) return;
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((p) => {
        if (p && !p.error) setProfile(p);
      })
      .catch(() => {});
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  const logoText = getInitials(profile?.name ?? "", profile?.logo_text ?? null);

  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <Navbar logoText={logoText} />
      <main className="min-h-screen relative z-10">{children}</main>
      <Footer
        name={profile?.name}
        tagline={profile?.tagline}
        githubUrl={profile?.github_url}
        linkedinUrl={profile?.linkedin_url}
        email={profile?.email}
      />
      <BackToTop />
    </>
  );
}
