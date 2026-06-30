"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProjectCard from "@/components/ProjectCard";
import type { Project, Profile, Skill } from "@/lib/types";

// 6 chip positions relative to the 300×300 photo reference box
// indices 0-2 = left column (top→bottom), 3-5 = right column (top→bottom)
const CHIP_POS: React.CSSProperties[] = [
  { top: 18,  left:  -158 },
  { top: 118, left:  -158 },
  { top: 218, left:  -158 },
  { top: 18,  right: -158 },
  { top: 118, right: -158 },
  { top: 218, right: -158 },
];

export default function HomeClient({
  profile,
  featuredProjects,
  skills,
}: {
  profile: Profile | null;
  featuredProjects: Project[];
  skills: Skill[];
}) {
  const [heroRef,  heroInView]  = useInView({ triggerOnce: true, threshold: 0.05 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1  });
  const [projRef,  projInView]  = useInView({ triggerOnce: true, threshold: 0.08 });

  const name       = profile?.name      || "Jane Doe";
  const title      = profile?.title     || "Tableau & Data Visualization Developer";
  const tagline    = profile?.tagline   || "Turning complex data into clear, actionable visual stories.";
  const photoUrl   = profile?.photo_url || null;
  const stats      = profile?.stats     || [];
  const openToWork = profile?.open_to_work ?? true;
  const highlights = profile?.highlights?.length
    ? profile.highlights
    : [
        { icon: "📊", title: "Data Visualization",  desc: "Tableau · Power BI · interactive dashboards"  },
        { icon: "🔍", title: "Analytics",           desc: "SQL · Python · turning raw data into insight" },
        { icon: "📋", title: "Reporting",           desc: "Executive reports · automated pipelines"      },
      ];

  // Floating skill chips: use admin-selected IDs if set, else first 6 skills
  const heroSkillIds = profile?.hero_skill_ids ?? [];
  const selectedSkills = heroSkillIds.length
    ? skills.filter(s => heroSkillIds.includes(s.id)).slice(0, 6)
    : skills.slice(0, 6);
  // First 3 → left column (CHIP_POS 0-2), next 3 → right column (CHIP_POS 3-5)
  const skillChips = selectedSkills.map(s => ({ label: s.name }));

  const socials = [
    profile?.github_url          ? { Icon: Github,      href: profile.github_url,             label: "GitHub"        } : null,
    profile?.linkedin_url        ? { Icon: Linkedin,    href: profile.linkedin_url,           label: "LinkedIn"      } : null,
    profile?.tableau_public_url  ? { Icon: ExternalLink,href: profile.tableau_public_url,     label: "Tableau Public"} : null,
    profile?.email               ? { Icon: Mail,        href: `mailto:${profile.email}`,      label: "Email"         } : null,
  ].filter(Boolean) as { Icon: React.ElementType; href: string; label: string }[];

  const firstName = name.split(" ")[0] || "there";

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── Hero ──────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {openToWork && (
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{
                    background: "rgba(0,217,255,0.08)",
                    border: "1px solid rgba(0,217,255,0.2)",
                    color: "var(--cyan)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                  initial={{ opacity: 0, y: -16 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }} />
                  Open to freelance &amp; full-time roles
                </motion.div>
              )}

              <motion.h1
                className="text-5xl md:text-7xl font-extrabold leading-tight mb-4"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
                initial={{ opacity: 0, y: 24 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                Hi, I&apos;m{" "}
                <span className="text-gradient-animate">{firstName}</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl font-medium mb-4"
                style={{ color: "var(--text-2)", fontFamily: "Syne, sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                {title}
              </motion.p>

              <motion.p
                className="text-base leading-relaxed mb-8 max-w-lg"
                style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                {tagline}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 mb-8"
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                    style={{
                      background: "linear-gradient(135deg, var(--cyan), var(--violet))",
                      color: "#050812",
                      fontFamily: "Syne, sans-serif",
                      boxShadow: "0 0 28px var(--cyan-glow)",
                    }}
                  >
                    View Dashboards <ArrowRight size={16} />
                  </Link>
                </motion.div>

                {profile?.resume_url && (
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <a
                      href={profile.resume_url}
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border-glow)",
                        color: "var(--text-1)",
                        fontFamily: "Syne, sans-serif",
                      }}
                    >
                      <Download size={16} /> Resume
                    </a>
                  </motion.div>
                )}
              </motion.div>

              {socials.length > 0 && (
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.75 }}
                >
                  {socials.map(({ Icon, href, label }, i) => (
                    <motion.a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2.5 rounded-lg transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-2)" }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={heroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 + i * 0.08 }}
                      whileHover={{ y: -4, scale: 1.1 }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Right — profile image with floating skill badges */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* Pulse rings centred behind everything */}
              <div
                className="hidden lg:block absolute rounded-full pulse-ring"
                style={{ width: 420, height: 420, background: "transparent", border: "1px solid rgba(0,217,255,0.18)" }}
              />
              <div
                className="hidden lg:block absolute rounded-full pulse-ring"
                style={{ width: 360, height: 360, background: "transparent", border: "1px solid rgba(168,85,247,0.14)", animationDelay: "1s" }}
              />

              {/* Reference box: same footprint as the photo so badge pixel
                  offsets are relative to the photo edges, not the whole column */}
              <div style={{ position: "relative", width: 300, height: 300, flexShrink: 0 }}>

                {/* Floating skill chips */}
                {skillChips.map((chip, i) => (
                  <motion.div
                    key={i}
                    className="hidden lg:flex absolute items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                    style={{
                      ...CHIP_POS[i],
                      background: "rgba(5,8,18,0.82)",
                      border: i === 1
                        ? "1px solid rgba(168,85,247,0.45)"
                        : "1px solid rgba(0,217,255,0.45)",
                      color: "var(--text-1)",
                      backdropFilter: "blur(14px)",
                      fontFamily: "DM Sans, sans-serif",
                      zIndex: 10,
                    }}
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 2.6 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
                  >
                    <span>{chip.label}</span>
                  </motion.div>
                ))}

                {/* Photo — big vertical bounce through the hero, badges/rings stay anchored */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    x: [0, 6, 0, -6, 0],
                    y: [0, -110, 0, 110, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="relative overflow-hidden blob-morph"
                    style={{
                      width: 290,
                      height: 290,
                      border: "1px solid rgba(0,217,255,0.2)",
                      boxShadow: "0 0 60px var(--cyan-glow), 0 30px 80px rgba(0,0,0,0.6)",
                    }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {photoUrl ? (
                      <Image src={photoUrl} alt={name} fill quality={95} className="object-cover" priority unoptimized />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-7xl"
                        style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.1), rgba(168,85,247,0.1))" }}
                      >
                        👤
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,8,18,0.4) 0%, transparent 60%)" }} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-3)", fontFamily: "DM Sans, sans-serif" }}>scroll</span>
          <motion.div
            className="w-px h-10"
            style={{ background: "linear-gradient(to bottom, var(--cyan), transparent)" }}
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ── Highlights ───────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              className="glass glass-hover rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 36 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 + i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <div className="text-3xl mb-3">{h.icon}</div>
              <h3 className="font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>{h.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      {stats.length > 0 && (
        <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="glass rounded-xl p-6 text-center"
                  style={{ border: "1px solid rgba(0,217,255,0.08)" }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 160 }}
                  whileHover={{ scale: 1.06 }}
                >
                  <p className="text-3xl md:text-4xl font-extrabold mb-1 text-gradient" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-2)" }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Projects ─────────────────────── */}
      {featuredProjects.length > 0 && (
        <section ref={projRef} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 30 }}
              animate={projInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--cyan)", fontFamily: "DM Sans, sans-serif" }}>
                Selected Work
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>
                Featured Work
              </h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-7"
              initial="hidden"
              animate={projInView ? "visible" : "hidden"}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {featuredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={projInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-glow)",
                  color: "var(--text-1)",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                All Dashboards <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
