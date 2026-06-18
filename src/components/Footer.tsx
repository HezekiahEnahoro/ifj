"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { name: "About",    href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Skills",   href: "/skills" },
  { name: "Contact",  href: "/contact" },
];

export default function Footer({
  name,
  tagline,
  githubUrl,
  linkedinUrl,
  email,
}: {
  name?: string;
  tagline?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
}) {
  const displayName = name || "Portfolio";
  const displayTagline = tagline || "Turning complex data into clear, actionable visual stories.";

  const socialLinks = [
    githubUrl   ? { Icon: Github,   href: githubUrl,             label: "GitHub"   } : null,
    linkedinUrl ? { Icon: Linkedin, href: linkedinUrl,           label: "LinkedIn" } : null,
    email       ? { Icon: Mail,     href: `mailto:${email}`,     label: "Email"    } : null,
  ].filter(Boolean) as { Icon: React.ElementType; href: string; label: string }[];

  return (
    <footer
      className="relative z-10 mt-20"
      style={{
        background: "rgba(5,8,18,0.9)",
        borderTop: "1px solid rgba(0,217,255,0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              <span style={{ color: "var(--text-1)" }}>{displayName}</span>
              <span style={{ color: "var(--cyan)" }}>.</span>
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              {displayTagline}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--cyan)", fontFamily: "Syne, sans-serif" }}
            >
              Navigate
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <motion.li key={link.name} whileHover={{ x: 6 }} transition={{ duration: 0.18 }}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--text-2)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--violet)", fontFamily: "Syne, sans-serif" }}
            >
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-lg transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--text-2)",
                  }}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(0,217,255,0.35)";
                    el.style.boxShadow = "0 0 18px var(--cyan-glow)";
                    el.style.color = "var(--cyan)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--border)";
                    el.style.boxShadow = "none";
                    el.style.color = "var(--text-2)";
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>

            <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
              Open to freelance &amp; full-time roles.
              <br />
              Response within 24–48 h.
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-3)",
            fontFamily: "DM Sans, sans-serif",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span>© {new Date().getFullYear()} {displayName}. All rights reserved.</span>
          <span
            className="text-gradient"
            style={{ fontFamily: "Syne, sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em" }}
          >
            Built with Next.js &amp; Tailwind CSS
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
