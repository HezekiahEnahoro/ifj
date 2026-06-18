"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Profile, Experience, Education } from "@/lib/types";

export default function AboutClient({
  profile,
  experiences,
  education,
}: {
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
}) {
  const [heroRef,     heroInView]     = useInView({ triggerOnce: true, threshold: 0.05 });
  const [interestRef, interestInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [expRef,      expInView]      = useInView({ triggerOnce: true, threshold: 0.05 });
  const [eduRef,      eduInView]      = useInView({ triggerOnce: true, threshold: 0.1 });

  const name       = profile?.name      || "Your Name";
  const title      = profile?.title     || "Tableau & Data Visualization Developer";
  const bio        = profile?.bio       || ["Tell your story here."];
  const photoUrl   = profile?.photo_url || null;
  const resumeUrl  = profile?.resume_url || null;

  const interests = profile?.interests?.length
    ? profile.interests
    : [
        { icon: "📊", title: "Data Storytelling",  desc: "Making numbers speak through compelling visual narratives" },
        { icon: "🔍", title: "Business Analytics", desc: "Connecting data insights to real business decisions"        },
        { icon: "🚀", title: "Continuous Growth",  desc: "Always learning new tools and visualization best practices" },
      ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Hero ──────────────────────────────── */}
        <div ref={heroRef} className="grid md:grid-cols-2 gap-14 items-center mb-24">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--cyan)", fontFamily: "DM Sans, sans-serif" }}
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.15 }}
            >
              About Me
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold mb-6"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              {name} —{" "}
              <span className="text-gradient">{title}</span>
            </motion.h1>

            {bio.map((p, i) => (
              <motion.p
                key={i}
                className="text-base leading-relaxed mb-4"
                style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {p}
              </motion.p>
            ))}

            {resumeUrl && (
              <motion.a
                href={resumeUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold mt-2"
                style={{
                  background: "linear-gradient(135deg, var(--cyan), var(--violet))",
                  color: "#050812",
                  fontFamily: "Syne, sans-serif",
                  boxShadow: "0 0 24px var(--cyan-glow)",
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download size={16} /> Download Resume
              </motion.a>
            )}
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div
              className="hidden md:block absolute rounded-full pulse-ring"
              style={{ width: 360, height: 360, background: "transparent", border: "1px solid rgba(168,85,247,0.2)" }}
            />
            <motion.div
              className="relative overflow-hidden blob-morph w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]"
              style={{
                border: "1px solid rgba(168,85,247,0.25)",
                boxShadow: "0 0 50px var(--violet-glow), 0 30px 70px rgba(0,0,0,0.6)",
              }}
              whileHover={{ scale: 1.03 }}
            >
              {photoUrl ? (
                <Image src={photoUrl} alt={name} fill className="object-cover" priority unoptimized />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-6xl"
                  style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.08), rgba(168,85,247,0.08))" }}
                >
                  👤
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(5,8,18,0.5) 0%, transparent 60%)" }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Passions ──────────────────────────── */}
        <section ref={interestRef} className="mb-24">
          <motion.h2
            className="text-3xl font-extrabold mb-8 text-center"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={interestInView ? { opacity: 1, y: 0 } : {}}
          >
            What drives me
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {interests.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass glass-hover rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 36 }}
                animate={interestInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8 }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Experience ───────────────────────────── */}
        {experiences.length > 0 && (
          <section ref={expRef} className="mb-24">
            <motion.h2
              className="text-3xl font-extrabold mb-12"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={expInView ? { opacity: 1, y: 0 } : {}}
            >
              Experience
            </motion.h2>

            <div className="relative">
              <div
                className="absolute left-6 top-0 bottom-0 w-px"
                style={{ background: "linear-gradient(to bottom, var(--cyan), var(--violet), transparent)" }}
              />
              <div className="space-y-10">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    className="relative pl-16"
                    initial={{ opacity: 0, x: -30 }}
                    animate={expInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.2 }}
                  >
                    <div
                      className="absolute left-4 top-4 w-5 h-5 rounded-full -translate-x-1/2 flex items-center justify-center"
                      style={{
                        background: "var(--bg-deep)",
                        border: `2px solid ${exp.color || "var(--cyan)"}`,
                        boxShadow: `0 0 12px ${exp.color || "var(--cyan)"}66`,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: exp.color || "var(--cyan)" }} />
                    </div>

                    <motion.div
                      className="glass glass-hover rounded-xl p-6"
                      style={{ borderLeft: `2px solid ${exp.color || "var(--cyan)"}44` }}
                      whileHover={{ x: 6 }}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>{exp.title}</h3>
                          <p className="text-sm font-medium" style={{ color: exp.color || "var(--cyan)" }}>{exp.company}</p>
                        </div>
                        <span
                          className="text-xs px-3 py-1 rounded-full"
                          style={{
                            background: `${exp.color || "var(--cyan)"}15`,
                            border: `1px solid ${exp.color || "var(--cyan)"}33`,
                            color: exp.color || "var(--cyan)",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {exp.achievements.map((a, j) => (
                          <li key={j} className="flex gap-2 text-sm" style={{ color: "var(--text-2)" }}>
                            <span style={{ color: exp.color || "var(--cyan)" }}>▸</span>{a}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Education ─────────────────────────── */}
        {education.length > 0 && (
          <section ref={eduRef} className="mb-16">
            <motion.h2
              className="text-3xl font-extrabold mb-10"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={eduInView ? { opacity: 1, y: 0 } : {}}
            >
              Education &amp; Certifications
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  className="glass glass-hover rounded-xl p-5"
                  initial={{ opacity: 0, y: 30 }}
                  animate={eduInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>{edu.degree}</h3>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--cyan)" }}>{edu.institution}</p>
                  <p className="text-xs mb-2" style={{ color: "var(--text-3)" }}>{edu.period}</p>
                  {edu.detail && <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{edu.detail}</p>}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
