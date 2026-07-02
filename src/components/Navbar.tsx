"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home",     href: "/" },
  { name: "About",    href: "/about" },
  { name: "Work",     href: "/projects" },
  { name: "Skills",   href: "/skills" },
  { name: "Contact",  href: "/contact" },
];

export default function Navbar({ logoText }: { logoText?: string }) {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed w-full z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 8, 18, 0.85)"
          : "rgba(5, 8, 18, 0.5)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled
          ? "1px solid rgba(0,217,255,0.12)"
          : "1px solid rgba(255,255,255,0.04)",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="relative group">
            <motion.span
              className="text-xl font-bold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {logoText || "···"}
              {logoText && <span style={{ color: "var(--cyan)" }}>.</span>}
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                    style={{
                      color: active ? "var(--cyan)" : "var(--text-2)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-1)";
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                    }}
                  >
                    {link.name}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full"
                        style={{ background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
            >
              <Link
                href="/contact"
                className="ml-3 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, var(--cyan), var(--violet))",
                  color: "#050812",
                  fontFamily: "Syne, sans-serif",
                  boxShadow: "0 0 20px var(--cyan-glow)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(0,217,255,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px var(--cyan-glow)";
                }}
              >
                Hire Me
              </Link>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-2)" }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(5,8,18,0.96)",
              borderTop: "1px solid rgba(0,217,255,0.1)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        color: active ? "var(--cyan)" : "var(--text-2)",
                        background: active ? "var(--cyan-dim)" : "transparent",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
