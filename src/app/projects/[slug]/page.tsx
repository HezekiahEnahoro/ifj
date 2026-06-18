import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import { readData } from "@/lib/data";
import type { Project } from "@/lib/types";
import ImageGallery from "@/components/ImageGallery";

export const revalidate = 0;

const categoryStyle: Record<string, { label: string; cls: string }> = {
  tableau:    { label: "Tableau",            cls: "tag-cyan"   },
  "power-bi": { label: "Power BI",           cls: "tag-violet" },
  analytics:  { label: "Analytics",          cls: "tag-amber"  },
  "data-viz": { label: "Data Visualization", cls: "tag-cyan"   },
};

const categoryEmoji: Record<string, string> = {
  tableau:    "📊",
  "power-bi": "📈",
  analytics:  "🔍",
  "data-viz": "🎨",
};

export async function generateStaticParams() {
  const { projects } = await readData();
  return projects.map((p: Project) => ({ slug: p.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await readData();
  const project = projects.find((p) => p.id === slug);

  if (!project) notFound();

  const cat = categoryStyle[project.category] ?? { label: project.category, cls: "tag-cyan" };
  const emoji = categoryEmoji[project.category] ?? "📊";
  const hasImage = !!project.image;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors group"
          style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Work
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.cls}`}>
              {cat.label}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
          >
            {project.title}
          </h1>

          <p
            className="text-base leading-relaxed mb-6 max-w-3xl"
            style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-7">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  color: "var(--text-1)",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                <Github size={15} /> View Code
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, var(--cyan), var(--violet))",
                  color: "#050812",
                  fontFamily: "Syne, sans-serif",
                  boxShadow: "0 0 20px var(--cyan-glow)",
                }}
              >
                <ExternalLink size={15} /> View Dashboard
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text-3)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hero image / gallery */}
        <div className="mb-12">
          {project.images && project.images.length > 1 ? (
            <ImageGallery images={project.images} title={project.title} />
          ) : (
            <div
              className="relative h-56 sm:h-80 md:h-96 rounded-2xl overflow-hidden"
              style={{ background: "rgba(10,17,38,0.8)", border: "1px solid var(--border)" }}
            >
              {hasImage ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.12) 0%, rgba(168,85,247,0.12) 100%)" }}
                >
                  <span className="text-7xl">{emoji}</span>
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(5,8,18,0.5) 0%, transparent 55%)" }}
              />
            </div>
          )}
        </div>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {project.metrics.map((metric, i) => (
              <div
                key={i}
                className="glass rounded-xl p-5 text-center"
                style={{ border: "1px solid rgba(0,217,255,0.08)" }}
              >
                <p className="text-xl sm:text-2xl font-extrabold mb-1 text-gradient" style={{ fontFamily: "Syne, sans-serif" }}>
                  {metric.value}
                </p>
                <p className="text-xs leading-snug" style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}>
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Overview */}
        {project.long_description && (
          <section className="mb-12">
            <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>
              Overview
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}>
              {project.long_description}
            </p>
          </section>
        )}

        {/* Challenges / Solutions / Outcomes */}
        {(project.challenges?.length > 0 || project.solutions?.length > 0 || project.outcomes?.length > 0) && (
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {project.challenges?.length > 0 && (
              <div className="glass rounded-2xl p-6" style={{ borderLeft: "2px solid rgba(248,113,113,0.45)" }}>
                <h2 className="text-base font-extrabold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>Challenges</h2>
                <ul className="space-y-3">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      <span style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }}>▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.solutions?.length > 0 && (
              <div className="glass rounded-2xl p-6" style={{ borderLeft: "2px solid rgba(52,211,153,0.45)" }}>
                <h2 className="text-base font-extrabold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>Solutions</h2>
                <ul className="space-y-3">
                  {project.solutions.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      <span style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }}>✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.outcomes?.length > 0 && (
              <div className="glass rounded-2xl p-6" style={{ borderLeft: "2px solid rgba(168,85,247,0.45)" }}>
                <h2 className="text-base font-extrabold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>Outcomes</h2>
                <ul className="space-y-3">
                  {project.outcomes.map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      <span style={{ color: "var(--violet)", flexShrink: 0, marginTop: 2 }}>→</span>{o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer nav */}
        <div
          className="flex flex-wrap justify-between items-center gap-4 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
          >
            <ArrowLeft size={15} /> All Work
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--cyan), var(--violet))",
              color: "#050812",
              fontFamily: "Syne, sans-serif",
              boxShadow: "0 0 24px var(--cyan-glow)",
            }}
          >
            Hire Me
          </Link>
        </div>

      </div>
    </div>
  );
}
