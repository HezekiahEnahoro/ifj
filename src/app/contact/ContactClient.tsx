"use client";

import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Profile } from "@/lib/types";

export default function ContactClient({ profile }: { profile: Profile | null }) {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [faqRef,    faqInView]    = useInView({ triggerOnce: true, threshold: 0.1 });

  const email           = profile?.email           || null;
  const linkedinUrl     = profile?.linkedin_url    || null;
  const githubUrl       = profile?.github_url      || null;
  const location        = profile?.location        || "Remote";
  const contactTagline  = profile?.contact_tagline || "Have a project or want to collaborate? Send a message and I'll respond within 24–48 hours.";
  const availabilityText = profile?.availability_text || "Open to freelance and full-time data visualization roles.";
  const faqs            = profile?.faqs?.length    ? profile.faqs : [];
  const openToWork      = profile?.open_to_work    ?? true;

  function urlLabel(url: string, prefix: string): string {
    try { return new URL(url).pathname.replace(prefix, "").replace(/^\//, "") || url; }
    catch { return url; }
  }

  const contactInfo = [
    email        ? { Icon: Mail,     label: "Email",    value: email,                              href: `mailto:${email}` } : null,
    location     ? { Icon: MapPin,   label: "Location", value: location,                           href: null              } : null,
    linkedinUrl  ? { Icon: Linkedin, label: "LinkedIn", value: urlLabel(linkedinUrl, "/in/"),      href: linkedinUrl       } : null,
    githubUrl    ? { Icon: Github,   label: "GitHub",   value: urlLabel(githubUrl, ""),            href: githubUrl         } : null,
  ].filter(Boolean) as { Icon: React.ElementType; label: string; value: string; href: string | null }[];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--cyan)", fontFamily: "DM Sans, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
          >
            Let&apos;s Talk
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
            initial={{ opacity: 0, y: 36 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Get In <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p
            className="text-base max-w-xl mx-auto"
            style={{ color: "var(--text-2)", fontFamily: "DM Sans, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {contactTagline}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Contact info sidebar */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: -40 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-bright rounded-2xl p-7">
              <h2 className="font-bold text-lg mb-5" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>
                Contact Info
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={info.label}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <div
                      className="p-2.5 rounded-lg flex-shrink-0"
                      style={{ background: "var(--cyan-dim)", border: "1px solid rgba(0,217,255,0.2)" }}
                    >
                      <info.Icon size={16} style={{ color: "var(--cyan)" }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-3)" }}>{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith("mailto") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="text-sm font-medium transition-colors"
                          style={{ color: "var(--text-1)" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-1)")}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {openToWork && (
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>
                      Available now
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {availabilityText}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="glass rounded-2xl p-8" style={{ border: "1px solid var(--border-glow)" }}>
              <h2 className="font-bold text-xl mb-7" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section ref={faqRef} className="mt-20">
            <motion.h2
              className="text-3xl font-extrabold mb-10 text-center"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
            >
              FAQ
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-5">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  className="glass glass-hover rounded-xl p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "Syne, sans-serif", color: "var(--cyan)" }}>
                    {faq.q}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
