import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import { readData } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await readData();

  const name  = profile.name  || "Portfolio";
  const title = profile.title || "Tableau & Data Visualization Developer";
  const tagline =
    profile.tagline ||
    "Portfolio showcasing Tableau dashboards, data visualization, and analytics projects";
  const fullTitle = `${name} — ${title}`;
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || "https://yourportfolio.com";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: fullTitle,
    description: tagline,
    keywords: [
      "Tableau Developer",
      "Data Visualization",
      "Business Analytics",
      "Power BI",
      "Dashboard Design",
      "SQL",
      "Data Analysis",
      "Remote",
    ],
    authors: [{ name }],
    openGraph: {
      title: fullTitle,
      description: tagline,
      url: siteUrl,
      siteName: `${name} Portfolio`,
      images: profile.photo_url ? [{ url: profile.photo_url }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: tagline,
      images: profile.photo_url ? [profile.photo_url] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
