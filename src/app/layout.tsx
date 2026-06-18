import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Jane Doe — Tableau & Data Visualization Developer",
  description:
    "Portfolio of Jane Doe — Tableau Developer specializing in data visualization, interactive dashboards, and business analytics.",
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
  authors: [{ name: "Jane Doe" }],
  openGraph: {
    title: "Jane Doe — Tableau & Data Visualization Developer",
    description:
      "Portfolio showcasing Tableau dashboards, data visualization, and analytics projects",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourportfolio.com",
    siteName: "Jane Doe Portfolio",
    images: [],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jane Doe — Tableau & Data Visualization Developer",
    description:
      "Portfolio showcasing Tableau dashboards, data visualization, and analytics projects",
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
