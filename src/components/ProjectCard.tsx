"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    technologies: string[];
    image: string;
    demo_url?: string | null;
    github_url?: string | null;
    // legacy camelCase aliases (kept for any static data still in use)
    demoUrl?: string;
    githubUrl?: string;
  };
}

const categoryStyle: Record<string, { label: string; cls: string }> = {
  tableau:    { label: "Tableau",            cls: "tag-cyan"   },
  "power-bi": { label: "Power BI",           cls: "tag-violet" },
  analytics:  { label: "Analytics",          cls: "tag-amber"  },
  "data-viz": { label: "Data Visualization", cls: "tag-cyan"   },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const cat = categoryStyle[project.category] ?? { label: project.category, cls: "tag-cyan" };
  const demoUrl = project.demo_url ?? project.demoUrl;
  const githubUrl = project.github_url ?? project.githubUrl;
  const isExternal = project.image?.startsWith("http") ?? false;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass glass-hover rounded-2xl overflow-hidden flex flex-col h-full group"
      style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden" style={{ background: "rgba(10,17,38,0.8)" }}>
        {!imageError && project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={isExternal}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,217,255,0.15) 0%, rgba(168,85,247,0.15) 100%)",
            }}
          >
            <span className="text-5xl">
              {project.category === "tableau" ? "📊" : project.category === "power-bi" ? "📈" : project.category === "analytics" ? "🔍" : "🎨"}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-end justify-center pb-4 gap-3"
          style={{ background: "linear-gradient(to top, rgba(5,8,18,0.85) 0%, transparent 60%)" }}
        >
          {githubUrl && (
            <motion.a
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--text-1)",
              }}
              aria-label="GitHub"
            >
              <Github size={16} />
            </motion.a>
          )}
          {demoUrl && (
            <motion.a
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 rounded-lg transition-all"
              style={{
                background: "var(--cyan-dim)",
                border: "1px solid rgba(0,217,255,0.3)",
                color: "var(--cyan)",
              }}
              aria-label="Live Dashboard"
            >
              <ExternalLink size={16} />
            </motion.a>
          )}
        </motion.div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.cls}`}>
            {cat.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3
          className="text-lg font-bold mb-2 transition-colors duration-200 group-hover:text-cyan-400"
          style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
          onMouseEnter={() => {}}
        >
          {project.title}
        </h3>

        <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: "var(--text-2)" }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map(tech => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--text-3)",
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span
              className="px-2 py-0.5 rounded text-xs"
              style={{ color: "var(--text-3)", background: "rgba(255,255,255,0.03)" }}
            >
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Details link */}
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group/link"
          style={{ color: "var(--cyan)", fontFamily: "Syne, sans-serif" }}
        >
          Case Study
          <ArrowUpRight
            size={15}
            className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </Link>
      </div>
    </motion.div>
  );
}
