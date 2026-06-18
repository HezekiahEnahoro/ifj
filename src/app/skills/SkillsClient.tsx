"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Skill } from "@/lib/types";

type SkillGroup = { color: string; skills: Skill[] };

function groupByCategory(skills: Skill[]): Record<string, SkillGroup> {
  return skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = { color: s.category_color, skills: [] };
    acc[s.category].skills.push(s);
    return acc;
  }, {} as Record<string, SkillGroup>);
}

export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const grouped = groupByCategory(skills);
  const categories = Object.entries(grouped);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--cyan)", fontFamily: "DM Sans, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
          >
            Toolkit
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
            initial={{ opacity: 0, y: 36 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Skills &amp; <span className="text-gradient">Technologies</span>
          </motion.h1>
          <motion.p
            className="text-base max-w-xl mx-auto"
            style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            My toolkit for building dashboards that turn raw data into clear decisions.
          </motion.p>
        </div>

        {/* Skills grid */}
        {categories.length > 0 ? (
          <div ref={skillsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {categories.map(([category, { color, skills: catSkills }], ci) => (
              <motion.div
                key={category}
                className="glass glass-hover rounded-xl p-5"
                initial={{ opacity: 0, y: 40 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ci * 0.07 }}
                whileHover={{ y: -5 }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}33` }}
                  >
                    <span style={{ color }}>✦</span>
                  </div>
                  <h3
                    className="font-bold text-sm"
                    style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
                  >
                    {category}
                  </h3>
                </div>

                {/* Skill bars */}
                <div className="space-y-3">
                  {catSkills.map((skill, si) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs" style={{ color: "var(--text-2)" }}>{skill.name}</span>
                        <span className="text-xs font-semibold" style={{ color }}>{skill.level}%</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                          initial={{ width: 0 }}
                          animate={skillsInView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            duration: 1.1,
                            delay: ci * 0.07 + si * 0.06 + 0.3,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📊</p>
            <p style={{ color: "var(--text-2)" }}>Skills will appear here once added in the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
