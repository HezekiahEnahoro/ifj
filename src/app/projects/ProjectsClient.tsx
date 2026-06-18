"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProjectCard from "@/components/ProjectCard";
import type { Project, ProjectCategory } from "@/lib/types";

type Filter = "all" | ProjectCategory;

const CATEGORIES: { id: Filter; label: string }[] = [
  { id: "all",       label: "All"                },
  { id: "tableau",   label: "Tableau"            },
  { id: "power-bi",  label: "Power BI"           },
  { id: "analytics", label: "Analytics"          },
  { id: "data-viz",  label: "Data Visualization" },
];

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filtered =
    filter === "all" ? initialProjects : initialProjects.filter((p) => p.category === filter);

  const visibleCategories = CATEGORIES.filter(
    (c) => c.id === "all" || initialProjects.some((p) => p.category === c.id)
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--cyan)", fontFamily: "DM Sans, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
          >
            Work
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
            initial={{ opacity: 0, y: 36 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Dashboards I&apos;ve <span className="text-gradient">Built</span>
          </motion.h1>
          <motion.p
            className="text-base max-w-xl mx-auto"
            style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Data visualizations and analytics projects — each with a full case study
            covering the business problem, approach, and outcomes.
          </motion.p>
        </div>

        {/* Filter pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
        >
          {visibleCategories.map((cat) => {
            const active = filter === cat.id;
            const count =
              cat.id === "all"
                ? initialProjects.length
                : initialProjects.filter((p) => p.category === cat.id).length;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--cyan), var(--violet))"
                    : "rgba(255,255,255,0.04)",
                  border: active ? "1px solid transparent" : "1px solid var(--border)",
                  color: active ? "#050812" : "var(--text-2)",
                  fontFamily: "Syne, sans-serif",
                  boxShadow: active ? "0 0 24px var(--cyan-glow)" : "none",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
                <span className="opacity-60 ml-1 text-xs">({count})</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-5xl mb-4">📊</p>
            <p style={{ color: "var(--text-2)" }}>No projects in this category yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
